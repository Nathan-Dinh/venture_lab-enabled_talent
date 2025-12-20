import { BaseRepository } from './BaseRepository.js';
import type { User, UserProfile } from '../../domain/types/models.js';

/**
 * User Repository
 * Handles all database operations related to users
 */
export class UserRepository extends BaseRepository {
  /**
   * Create a new user
   */
  async create(data: {
    user_id: string;
    name: string;
    email: string;
    usertype_id: string;
  }): Promise<User> {
    const result = await this.query<User>(
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
  async findById(userId: string): Promise<User | null> {
    return await this.queryOne<User>(
      `SELECT user_id, name, email, usertype_id, created_at
       FROM users
       WHERE user_id = $1`,
      [userId]
    );
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.queryOne<User>(
      `SELECT user_id, name, email, usertype_id, created_at
       FROM users
       WHERE email = $1`,
      [email]
    );
  }

  /**
   * Get user profile with additional details
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    return await this.queryOne<UserProfile>(
      `SELECT user_id, name, email, usertype_id, headline, bio, location,
              profile_image_url, created_at
       FROM users
       WHERE user_id = $1`,
      [userId]
    );
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: Partial<{
      name: string;
      headline: string;
      bio: string;
      location: string;
      profile_image_url: string;
    }>
  ): Promise<UserProfile | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return this.getProfile(userId);
    }

    values.push(userId);

    return await this.queryOne<UserProfile>(
      `UPDATE users
       SET ${fields.join(', ')}
       WHERE user_id = $${paramIndex}
       RETURNING user_id, name, email, usertype_id, headline, bio, location,
                 profile_image_url, created_at`,
      values
    );
  }

  /**
   * Delete user account
   */
  async delete(userId: string): Promise<boolean> {
    const result = await this.query(
      `DELETE FROM users WHERE user_id = $1`,
      [userId]
    );
    return result.rowCount > 0;
  }
}
