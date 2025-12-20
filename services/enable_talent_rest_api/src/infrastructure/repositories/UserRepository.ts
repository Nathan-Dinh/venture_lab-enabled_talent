import { FastifyInstance } from 'fastify';
import type { User, UserProfile } from '../../domain/types/models.js';

/**
 * User Repository (Functional)
 * Handles all database operations related to users
 */

/**
 * Create a new user
 */
export async function createUser(
  fastify: FastifyInstance,
  data: {
    user_id: string;
    name: string;
    email: string;
    usertype_id: string;
  }
): Promise<User> {
  const result = await fastify.pg.query<User>(
    `INSERT INTO users (user_id, name, email, usertype_id, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING user_id, name, email, usertype_id, created_at
     ON CONFLICT (user_id) DO UPDATE SET
       name = EXCLUDED.name,
       email = EXCLUDED.email,
       usertype_id = EXCLUDED.usertype_id`,
    [data.user_id, data.name, data.email, data.usertype_id]
  );
  return result.rows[0];
}

/**
 * Find user by ID
 */
export async function findUserById(
  fastify: FastifyInstance,
  userId: string
): Promise<User | null> {
  const result = await fastify.pg.query<User>(
    `SELECT user_id, name, email, usertype_id, created_at
     FROM users
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0] || null;
}

/**
 * Find user by email
 */
export async function findUserByEmail(
  fastify: FastifyInstance,
  email: string
): Promise<User | null> {
  const result = await fastify.pg.query<User>(
    `SELECT user_id, name, email, usertype_id, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

/**
 * Get user profile with additional details
 */
export async function getUserProfile(
  fastify: FastifyInstance,
  userId: string
): Promise<UserProfile | null> {
  const result = await fastify.pg.query<UserProfile>(
    `SELECT user_id, name, email, usertype_id, headline, bio, location,
            profile_image_url, created_at
     FROM users
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0] || null;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  fastify: FastifyInstance,
  userId: string,
  data: Partial<{
    name: string;
    headline: string;
    bio: string;
    location: string;
    profile_image_url: string;
  }>
): Promise<UserProfile | null> {
  const allowedFields = ['name', 'headline', 'bio', 'location', 'profile_image_url'];
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && allowedFields.includes(key)) {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  });

  if (fields.length === 0) {
    return getUserProfile(fastify, userId);
  }

  values.push(userId);

  const result = await fastify.pg.query<UserProfile>(
    `UPDATE users
     SET ${fields.join(', ')}
     WHERE user_id = $${paramIndex}
     RETURNING user_id, name, email, usertype_id, headline, bio, location,
               profile_image_url, created_at`,
    values
  );

  return result.rows[0] || null;
}

/**
 * Delete user account
 */
export async function deleteUser(
  fastify: FastifyInstance,
  userId: string
): Promise<boolean> {
  const result = await fastify.pg.query(
    `DELETE FROM users WHERE user_id = $1`,
    [userId]
  );
  return (result.rowCount || 0) > 0;
}

/**
 * Get user skills, experience, and education
 */
export async function getUserFullProfile(
  fastify: FastifyInstance,
  userId: string
): Promise<UserProfile | null> {
  const profile = await getUserProfile(fastify, userId);

  if (!profile) return null;

  // Fetch related data in parallel
  const [skillsResult, experienceResult, educationResult] = await Promise.all([
    fastify.pg.query(
      `SELECT sk.skill_id, sk.skill_name
       FROM user_skills us
       JOIN skills sk ON us.skill_id = sk.skill_id
       WHERE us.user_id = $1`,
      [userId]
    ),
    fastify.pg.query(
      `SELECT experience_id, company, title, description, start_date, end_date
       FROM experience
       WHERE user_id = $1
       ORDER BY start_date DESC`,
      [userId]
    ),
    fastify.pg.query(
      `SELECT education_id, institution, degree, field_of_study, start_date, end_date
       FROM education
       WHERE user_id = $1
       ORDER BY start_date DESC`,
      [userId]
    ),
  ]);

  return {
    ...profile,
    skills: skillsResult.rows,
    experience: experienceResult.rows,
    education: educationResult.rows,
  };
}
