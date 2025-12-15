import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';
import { Mentor, MentorCard, UserRole, PaginatedResponse } from '../types/models.js';
import { withErrorHandler } from '../utils/errorHandler.js';

/**
 * List all mentors with optional filtering
 * GET /api/mentors?role=Mentor&location=NYC&minRating=4&skills=TypeScript,React
 */
async function listMentorsHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const pg = fastify.pg;
  const { page = 1, limit = 10, location, minRating = 0 } = req.query as any;

  let query = `SELECT u.user_id, u.name, u.headline, u.location, u.profile_image_url,
                      u.usertype_id, COALESCE(AVG(r.rating), 0) as rating,
                      COUNT(DISTINCT b.booking_id) as session_count,
                      p.hourly_rate
               FROM users u
               LEFT JOIN user_ratings r ON u.user_id = r.mentor_id
               LEFT JOIN user_booking b ON u.user_id = b.mentor_id
               LEFT JOIN user_pricing p ON u.user_id = p.user_id
               WHERE u.usertype_id = '2'`;

  const params: any[] = [];
  let paramCount = 1;

  if (location) {
    query += ` AND u.location ILIKE $${paramCount++}`;
    params.push(`%${location}%`);
  }

  query += ` GROUP BY u.user_id, u.name, u.headline, u.location, u.profile_image_url,
                     u.usertype_id, p.hourly_rate`;

  if (minRating && minRating > 0) {
    query += ` HAVING AVG(r.rating) >= $${paramCount++}`;
    params.push(minRating);
  }

  query += ` ORDER BY rating DESC, session_count DESC`;

  // Add pagination
  const offset = ((page || 1) - 1) * (limit || 10);
  query += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
  params.push(limit || 10);
  params.push(offset);

  const result = await pg.query(query, params);

  // Get total count
  const countResult = await pg.query(
    `SELECT COUNT(*) as total FROM users WHERE usertype_id = '2'`
  );

  const mentors: MentorCard[] = result.rows.map((row: any) => ({
    user_id: row.user_id,
    name: row.name,
    headline: row.headline,
    location: row.location,
    profile_image_url: row.profile_image_url,
    rating: parseFloat(row.rating),
    session_count: parseInt(row.session_count),
    hourly_rate: row.hourly_rate,
  }));

  const response: PaginatedResponse<MentorCard> = {
    data: mentors,
    total: parseInt(countResult.rows[0].total),
    page: page || 1,
    limit: limit || 10,
    hasMore: offset + mentors.length < parseInt(countResult.rows[0].total),
  };

  return reply.send({
    success: true,
    data: response,
  });
}

export const listMentorsHandler = withErrorHandler(listMentorsHandlerImpl);

/**
 * Get mentor details by ID
 * GET /api/mentors/:id
 */
async function getMentorHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const pg = fastify.pg;
  const { id } = req.params as any;

  const result = await pg.query(
    `SELECT u.user_id, u.name, u.email, u.headline, u.bio, u.location,
            u.profile_image_url, u.created_at, u.usertype_id,
            COALESCE(AVG(r.rating), 0) as rating,
            COUNT(DISTINCT b.booking_id) as session_count,
            COALESCE(SUM(CASE WHEN es.endorsement_id IS NOT NULL THEN 1 ELSE 0 END), 0) as endorsement_count
     FROM users u
     LEFT JOIN user_ratings r ON u.user_id = r.mentor_id
     LEFT JOIN user_booking b ON u.user_id = b.mentor_id AND b.status != 'cancelled'
     LEFT JOIN user_skills us ON u.user_id = us.user_id
     LEFT JOIN skill_endorsements es ON us.user_skill_id = es.user_skill_id
     WHERE u.user_id = $1 AND u.usertype_id = '2'
     GROUP BY u.user_id`,
    [id]
  );

  if (result.rows.length === 0) {
    return reply.status(404).send({
      success: false,
      error: 'Mentor not found',
    });
  }

  const user = result.rows[0];

  // Fetch experience, education, skills, and pricing
  const [experienceResult, educationResult, skillsResult, pricingResult, pricingTiersResult] = await Promise.all([
    pg.query(
      `SELECT * FROM user_experience WHERE user_id = $1 ORDER BY start_date DESC`,
      [id]
    ),
    pg.query(
      `SELECT * FROM user_education WHERE user_id = $1 ORDER BY start_date DESC`,
      [id]
    ),
    pg.query(
      `SELECT user_skill_id, skill_name, category, level, endorsement_count
       FROM user_skills WHERE user_id = $1 ORDER BY endorsement_count DESC`,
      [id]
    ),
    pg.query(`SELECT hourly_rate, currency FROM user_pricing WHERE user_id = $1`, [id]),
    pg.query(
      `SELECT pricing_id, tier_name, duration_minutes, rate, description
       FROM user_pricing_tiers WHERE user_id = $1 ORDER BY duration_minutes ASC`,
      [id]
    ),
  ]);

  const mentor: Mentor = {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    usertype_id: user.usertype_id,
    role: UserRole.MENTOR,
    headline: user.headline,
    bio: user.bio,
    location: user.location,
    profile_image_url: user.profile_image_url,
    created_at: user.created_at,
    rating: parseFloat(user.rating),
    session_count: parseInt(user.session_count),
    endorsement_count: parseInt(user.endorsement_count),
    hourly_rate: pricingResult.rows[0]?.hourly_rate,
  };

  return reply.send({
    success: true,
    data: {
      ...mentor,
      experience: experienceResult.rows,
      education: educationResult.rows,
      skills: skillsResult.rows,
      pricing: {
        hourly_rate: pricingResult.rows[0]?.hourly_rate,
        currency: pricingResult.rows[0]?.currency || 'USD',
        tiers: pricingTiersResult.rows.map((row: any) => ({
          pricing_id: row.pricing_id,
          tier_name: row.tier_name,
          duration_minutes: row.duration_minutes,
          rate: row.rate,
          description: row.description,
        })),
      },
    },
  });
}

export const getMentorHandler = withErrorHandler(getMentorHandlerImpl);
