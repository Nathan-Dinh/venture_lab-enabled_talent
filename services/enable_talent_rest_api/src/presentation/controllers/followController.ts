import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';
import { Follow, UserRole, User } from '../../domain/types/models.js';

/**
 * Get followed mentors
 * GET /api/follows
 * Requires authentication
 */
export async function getFollowedMentorsHandler(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  try {
    const user = req.user! as User;
    const pg = fastify.pg;

    const result = await pg.query(
      `SELECT u.user_id, u.name, u.headline, u.profile_image_url, u.usertype_id
       FROM users u
       INNER JOIN user_following uf ON u.user_id = uf.followed_id
       WHERE uf.follower_id = $1
       ORDER BY uf.followed_at DESC`,
      [user.user_id]
    );

    const mentors: Follow[] = result.rows.map((row: any) => ({
      user_id: row.user_id,
      name: row.name,
      headline: row.headline,
      profile_image_url: row.profile_image_url,
      role: row.usertype_id === '2' ? UserRole.MENTOR : UserRole.USER,
    }));

    return reply.send({
      success: true,
      data: mentors,
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Follow mentor
 * POST /api/follows/:mentorId
 * Requires authentication
 */
export async function followMentorHandler(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  try {
    const user = req.user! as User;
    const pg = fastify.pg;
    const { mentorId } = req.params as any;

    // Check if already following
    const checkResult = await pg.query(
      `SELECT following_id FROM user_following WHERE follower_id = $1 AND followed_id = $2`,
      [user.user_id, mentorId]
    );

    if (checkResult.rows.length > 0) {
      return reply.status(400).send({
        success: false,
        error: 'Already following this mentor',
      });
    }

    // Create follow relationship
    const result = await pg.query(
      `INSERT INTO user_following (follower_id, followed_id, followed_at)
       VALUES ($1, $2, NOW())
       RETURNING following_id`,
      [user.user_id, mentorId]
    );

    return reply.status(201).send({
      success: true,
      message: 'Mentor followed successfully',
      data: { following_id: result.rows[0].following_id },
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Unfollow mentor
 * DELETE /api/follows/:mentorId
 * Requires authentication
 */
export async function unfollowMentorHandler(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  try {
    const user = req.user! as User;
    const pg = fastify.pg;
    const { mentorId } = req.params as any;

    const result = await pg.query(
      `DELETE FROM user_following WHERE follower_id = $1 AND followed_id = $2`,
      [user.user_id, mentorId]
    );

    if (result.rowCount === 0) {
      return reply.status(404).send({
        success: false,
        error: 'Not following this mentor',
      });
    }

    return reply.send({
      success: true,
      message: 'Mentor unfollowed successfully',
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
    });
  }
}
