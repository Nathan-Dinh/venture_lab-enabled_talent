import { FastifyInstance } from 'fastify';
import type { Mentor, MentorCard, PaginatedResponse } from '@domain/types/models.js';

export class MentorRepository {
  constructor(private fastify: FastifyInstance) {}

  async listMentors(filters: {
    location?: string;
    minRating?: number;
    skills?: string[];
    limit?: number;
    offset?: number;
  }): Promise<PaginatedResponse<MentorCard>> {
    const { location, minRating, skills, limit = 20, offset = 0 } = filters;

    let query = `
      SELECT DISTINCT
        u.user_id,
        u.name,
        u.headline,
        u.location,
        u.profile_image_url,
        COALESCE(AVG(s.rating), 0) as average_rating,
        COUNT(DISTINCT s.session_id) as total_sessions
      FROM users u
      WHERE u.usertype_id = '2'
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (location) {
      query += ` AND u.location ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    if (skills && skills.length > 0) {
      query += `
        AND EXISTS (
          SELECT 1 FROM user_skills us
          JOIN skills sk ON us.skill_id = sk.skill_id
          WHERE us.user_id = u.user_id
          AND sk.skill_name = ANY($${paramIndex})
        )
      `;
      params.push(skills);
      paramIndex++;
    }

    query += `
      LEFT JOIN sessions s ON u.user_id = s.mentor_id
      GROUP BY u.user_id, u.name, u.headline, u.location, u.profile_image_url
    `;

    if (minRating) {
      query += ` HAVING COALESCE(AVG(s.rating), 0) >= $${paramIndex}`;
      params.push(minRating);
      paramIndex++;
    }

    query += ` ORDER BY average_rating DESC, total_sessions DESC`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await this.fastify.pg.query<MentorCard>(query, params);

    const countResult = await this.fastify.pg.query<{ count: string }>(
      `SELECT COUNT(DISTINCT user_id) as count
       FROM users
       WHERE usertype_id = '2'`
    );

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0]?.count || '0'),
      page: Math.floor(offset / limit) + 1,
      limit: limit,
      hasMore: offset + result.rows.length < parseInt(countResult.rows[0]?.count || '0'),
    };
  }

  async findMentorById(mentorId: string): Promise<Mentor | null> {
    const mentor = await this.fastify.pg.query<any>(
      `SELECT
        u.user_id,
        u.name,
        u.email,
        u.headline,
        u.bio,
        u.location,
        u.profile_image_url,
        u.created_at,
        COALESCE(AVG(s.rating), 0) as average_rating,
        COUNT(DISTINCT s.session_id) as total_sessions
      FROM users u
      LEFT JOIN sessions s ON u.user_id = s.mentor_id
      WHERE u.user_id = $1 AND u.usertype_id = '2'
      GROUP BY u.user_id`,
      [mentorId]
    );

    if (mentor.rows.length === 0) return null;

    const [skills, experience, education] = await Promise.all([
      this.fastify.pg.query<{ skill_id: string; skill_name: string }>(
        `SELECT sk.skill_id, sk.skill_name
         FROM user_skills us
         JOIN skills sk ON us.skill_id = sk.skill_id
         WHERE us.user_id = $1`,
        [mentorId]
      ),
      this.fastify.pg.query(
        `SELECT experience_id, company, title, description, start_date, end_date
         FROM experience
         WHERE user_id = $1
         ORDER BY start_date DESC`,
        [mentorId]
      ),
      this.fastify.pg.query(
        `SELECT education_id, institution, degree, field_of_study, start_date, end_date
         FROM education
         WHERE user_id = $1
         ORDER BY start_date DESC`,
        [mentorId]
      ),
    ]);

    return {
      ...mentor.rows[0],
      skills: skills.rows,
      experience: experience.rows,
      education: education.rows,
    };
  }

  async isMentor(userId: string): Promise<boolean> {
    const result = await this.fastify.pg.query<{ usertype_id: string }>(
      `SELECT usertype_id FROM users WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0]?.usertype_id === '2';
  }
}
