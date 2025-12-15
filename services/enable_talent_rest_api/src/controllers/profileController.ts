import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';
import { UpdateProfileSchema, UserProfile, User, UserRole } from '../types/models.js';
import { withErrorHandler } from '../utils/errorHandler.js';

/**
 * Get user profile with experience, education, and skills
 * GET /api/profile
 * Requires authentication
 */
async function getProfileHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user! as User;
  const pg = fastify.pg;

  // Fetch user details
  const userResult = await pg.query(
    `SELECT user_id, name, email, usertype_id, headline, bio, location, profile_image_url, created_at
     FROM users
     WHERE user_id = $1`,
    [user.user_id]
  );

  if (userResult.rows.length === 0) {
    return reply.status(404).send({
      success: false,
      error: 'User not found',
    });
  }

  const userData = userResult.rows[0];
  const userRole = userData.usertype_id === '2' ? UserRole.MENTOR : UserRole.USER;

  // Fetch experience
  const experienceResult = await pg.query(
    `SELECT experience_id, company, title, description, start_date, end_date, is_current
     FROM user_experience
     WHERE user_id = $1
     ORDER BY start_date DESC`,
    [user.user_id]
  );

  // Fetch education
  const educationResult = await pg.query(
    `SELECT education_id, institution, degree, field_of_study, start_date, end_date
     FROM user_education
     WHERE user_id = $1
     ORDER BY start_date DESC`,
    [user.user_id]
  );

  // Fetch skills with endorsements
  const skillsResult = await pg.query(
    `SELECT user_skill_id, skill_name, category, level, endorsement_count
     FROM user_skills
     WHERE user_id = $1
     ORDER BY endorsement_count DESC`,
    [user.user_id]
  );

  const response: UserProfile = {
    user_id: userData.user_id,
    name: userData.name,
    email: userData.email,
    usertype_id: userData.usertype_id,
    role: userRole,
    headline: userData.headline,
    bio: userData.bio,
    location: userData.location,
    profile_image_url: userData.profile_image_url,
    created_at: userData.created_at,
    experience: experienceResult.rows.map((row: any) => ({
      experience_id: row.experience_id,
      company: row.company,
      title: row.title,
      description: row.description,
      start_date: row.start_date,
      end_date: row.end_date,
      is_current: row.is_current,
    })),
    education: educationResult.rows.map((row: any) => ({
      education_id: row.education_id,
      institution: row.institution,
      degree: row.degree,
      field_of_study: row.field_of_study,
      start_date: row.start_date,
      end_date: row.end_date,
    })),
    skills: skillsResult.rows.map((row: any) => ({
      user_skill_id: row.user_skill_id,
      skill_name: row.skill_name,
      category: row.category,
      level: row.level,
      endorsement_count: row.endorsement_count,
    })),
    certifications: [],
  };

  return reply.send({
    success: true,
    data: response,
  });
}

export const getProfileHandler = withErrorHandler(getProfileHandlerImpl);

/**
 * Update user profile
 * PATCH /api/profile
 * Requires authentication
 */
async function updateProfileHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user! as User;
  const pg = fastify.pg;

  // Validate request body
  const validationResult = UpdateProfileSchema.safeParse(req.body);
  if (!validationResult.success) {
    return reply.status(400).send({
      success: false,
      error: 'Validation failed',
      details: validationResult.error.errors,
    });
  }

  const { name, headline, bio, location, profile_image_url } = validationResult.data;

  // Build dynamic UPDATE query
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramCount++}`);
    values.push(name);
  }
  if (headline !== undefined) {
    updates.push(`headline = $${paramCount++}`);
    values.push(headline);
  }
  if (bio !== undefined) {
    updates.push(`bio = $${paramCount++}`);
    values.push(bio);
  }
  if (location !== undefined) {
    updates.push(`location = $${paramCount++}`);
    values.push(location);
  }
  if (profile_image_url !== undefined) {
    updates.push(`profile_image_url = $${paramCount++}`);
    values.push(profile_image_url);
  }

  if (updates.length === 0) {
    return reply.status(400).send({
      success: false,
      error: 'No fields to update',
    });
  }

  updates.push(`updated_at = NOW()`);
  values.push(user.user_id);

  const query = `UPDATE users SET ${updates.join(', ')} WHERE user_id = $${paramCount} RETURNING *`;

  const result = await pg.query(query, values);

  if (result.rows.length === 0) {
    return reply.status(404).send({
      success: false,
      error: 'User not found',
    });
  }

  const userData = result.rows[0];
  const userRole = userData.usertype_id === '2' ? UserRole.MENTOR : UserRole.USER;

  const response: User = {
    user_id: userData.user_id,
    name: userData.name,
    email: userData.email,
    usertype_id: userData.usertype_id,
    role: userRole,
    headline: userData.headline,
    bio: userData.bio,
    location: userData.location,
    profile_image_url: userData.profile_image_url,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
  };

  return reply.send({
    success: true,
    data: response,
  });
}

export const updateProfileHandler = withErrorHandler(updateProfileHandlerImpl);

/**
 * Delete user account
 * DELETE /api/profile
 * Requires authentication
 */
async function deleteAccountHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user! as User;
  const pg = fastify.pg;

  // Delete user and cascade related data
  await pg.query('DELETE FROM users WHERE user_id = $1', [user.user_id]);

  return reply.send({
    success: true,
    message: 'Account deleted successfully',
  });
}

export const deleteAccountHandler = withErrorHandler(deleteAccountHandlerImpl);

