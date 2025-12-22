import { FastifyInstance } from 'fastify';
import type { User, UserProfile } from '../../domain/types/models.js';

export class UserRepository {
  constructor(private fastify: FastifyInstance) {}

  async createUser(data: {
    user_id: string;
    name: string;
    email: string;
    usertype_id: string;
  }): Promise<User> {
    const result = await this.fastify.pg.query<User>(
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

  async findUserById(userId: string): Promise<User | null> {
    const result = await this.fastify.pg.query<User>(
      `SELECT user_id, name, email, usertype_id, created_at
       FROM users
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await this.fastify.pg.query<User>(
      `SELECT user_id, name, email, usertype_id, created_at
       FROM users
       WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const result = await this.fastify.pg.query<UserProfile>(
      `SELECT user_id, name, email, usertype_id, headline, bio, location,
              profile_image_url, created_at
       FROM users
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  async updateUserProfile(
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
      return this.getUserProfile(userId);
    }

    values.push(userId);

    const result = await this.fastify.pg.query<UserProfile>(
      `UPDATE users
       SET ${fields.join(', ')}
       WHERE user_id = $${paramIndex}
       RETURNING user_id, name, email, usertype_id, headline, bio, location,
                 profile_image_url, created_at`,
      values
    );

    return result.rows[0] || null;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await this.fastify.pg.query(`DELETE FROM users WHERE user_id = $1`, [userId]);
    return (result.rowCount || 0) > 0;
  }

  async getUserFullProfile(userId: string): Promise<UserProfile | null> {
    const profile = await this.getUserProfile(userId);

    if (!profile) return null;

    const [skillsResult, experienceResult, educationResult] = await Promise.all([
      this.fastify.pg.query(
        `SELECT sk.skill_id, sk.skill_name
         FROM user_skills us
         JOIN skills sk ON us.skill_id = sk.skill_id
         WHERE us.user_id = $1`,
        [userId]
      ),
      this.fastify.pg.query(
        `SELECT experience_id, company, title, description, start_date, end_date
         FROM experience
         WHERE user_id = $1
         ORDER BY start_date DESC`,
        [userId]
      ),
      this.fastify.pg.query(
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
}
