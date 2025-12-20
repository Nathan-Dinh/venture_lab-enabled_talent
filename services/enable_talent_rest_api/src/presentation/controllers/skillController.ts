import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';
import { AddSkillSchema, Skill, User } from '../../domain/types/models.js';
import { withErrorHandler } from '../../application/utils/errorHandler.js';

/**
 * Add skill for user
 * POST /api/skills
 * Requires authentication
 */
async function addSkillHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user! as User;
  const pg = fastify.pg;

  const validationResult = AddSkillSchema.safeParse(req.body);
  if (!validationResult.success) {
    return reply.status(400).send({
      success: false,
      error: 'Validation failed',
      details: validationResult.error.errors,
    });
  }

  const { skill_name, category, level } = validationResult.data;

  const result = await pg.query(
    `INSERT INTO user_skills (user_id, skill_name, category, level, endorsement_count)
     VALUES ($1, $2, $3, $4, 0)
     RETURNING user_skill_id, skill_name, category, level, endorsement_count`,
    [user.user_id, skill_name, category, level || 5]
  );

  const skill: Skill = {
    user_skill_id: result.rows[0].user_skill_id,
    user_id: user.user_id,
    skill_name: result.rows[0].skill_name,
    category: result.rows[0].category,
    level: result.rows[0].level,
    endorsement_count: result.rows[0].endorsement_count,
  };

  return reply.status(201).send({
    success: true,
    data: skill,
  });
}

export const addSkillHandler = withErrorHandler(addSkillHandlerImpl);

/**
 * Get user skills
 * GET /api/skills
 * Requires authentication
 */
async function getUserSkillsHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user! as User;
  const pg = fastify.pg;

  const result = await pg.query(
    `SELECT user_skill_id, skill_name, category, level, endorsement_count
     FROM user_skills
     WHERE user_id = $1
     ORDER BY endorsement_count DESC`,
    [user.user_id]
  );

  const skills: Skill[] = result.rows.map((row: any) => ({
    user_skill_id: row.user_skill_id,
    user_id: user.user_id,
    skill_name: row.skill_name,
    category: row.category,
    level: row.level,
    endorsement_count: row.endorsement_count,
  }));

  return reply.send({
    success: true,
    data: skills,
  });
}

export const getUserSkillsHandler = withErrorHandler(getUserSkillsHandlerImpl);

/**
 * Delete skill
 * DELETE /api/skills/:skillId
 * Requires authentication
 */
async function deleteSkillHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user! as User;
  const pg = fastify.pg;
  const { skillId } = req.params as any;

  // Verify skill belongs to user
  const checkResult = await pg.query(
    `SELECT user_skill_id FROM user_skills WHERE user_skill_id = $1 AND user_id = $2`,
    [skillId, user.user_id]
  );

  if (checkResult.rows.length === 0) {
    return reply.status(404).send({
      success: false,
      error: 'Skill not found',
    });
  }

  await pg.query(`DELETE FROM user_skills WHERE user_skill_id = $1`, [skillId]);

  return reply.send({
    success: true,
    message: 'Skill deleted successfully',
  });
}

export const deleteSkillHandler = withErrorHandler(deleteSkillHandlerImpl);

/**
 * Endorse skill
 * POST /api/skills/:skillId/endorse
 * Requires authentication
 */
async function endorseSkillHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user!;
  const pg = fastify.pg;
  const { skillId } = req.params as any;

  // Get skill info
  const skillResult = await pg.query(`SELECT user_id FROM user_skills WHERE user_skill_id = $1`, [skillId]);

  if (skillResult.rows.length === 0) {
    return reply.status(404).send({
      success: false,
      error: 'Skill not found',
    });
  }

  const skillOwnerId = skillResult.rows[0].user_id;

  // Check if already endorsed
  const checkEndorsement = await pg.query(
    `SELECT endorsement_id FROM skill_endorsements WHERE endorser_id = $1 AND user_skill_id = $2`,
    [user.user_id, skillId]
  );

  if (checkEndorsement.rows.length > 0) {
    return reply.status(400).send({
      success: false,
      error: 'You have already endorsed this skill',
    });
  }

  // Add endorsement
  await pg.query(
    `INSERT INTO skill_endorsements (endorser_id, user_skill_id) VALUES ($1, $2)`,
    [user.user_id, skillId]
  );

  // Update endorsement count
  await pg.query(
    `UPDATE user_skills SET endorsement_count = endorsement_count + 1 WHERE user_skill_id = $1`,
    [skillId]
  );

  return reply.status(201).send({
    success: true,
    message: 'Skill endorsed successfully',
  });
}

export const endorseSkillHandler = withErrorHandler(endorseSkillHandlerImpl);
