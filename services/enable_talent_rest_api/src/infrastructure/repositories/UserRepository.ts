import { FastifyInstance } from 'fastify';
import type { UserJourneyData, MentorJourneyData } from '@domain/types/models';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_image_url?: string;
  headline?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  created_at: string;
  updated_at?: string;
}

interface UserRole {
  role_id: string;
  role_name: string;
  is_active: boolean;
}

interface UserDetails {
  id: string;
  user_id: string;
  current_user_role?: string;
  experience_level?: string;
  goals?: string;
  interests: string[];
  skills: string[];
  learning_style?: string;
  budget?: string;
  session_frequency?: string;
}

interface MentorDetails {
  id: string;
  user_id: string;
  expertise: string[];
  hourly_rate?: number;
  years_experience?: number;
}

export class UserRepository {
  constructor(private fastify: FastifyInstance) {}

  /**
   * Find user profile by ID
   */
  async findById(userId: string): Promise<UserProfile | null> {
    const result = await this.fastify.pg.query<UserProfile>(
      `SELECT id, first_name, last_name, email, profile_image_url, headline, bio,
              location, timezone, created_at, updated_at
       FROM user_profile
       WHERE id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  /**
   * Find user profile by email
   */
  async findByEmail(email: string): Promise<UserProfile | null> {
    const result = await this.fastify.pg.query<UserProfile>(
      `SELECT id, first_name, last_name, email, profile_image_url, headline, bio,
              location, timezone, created_at, updated_at
       FROM user_profile
       WHERE email = $1`,
      [email]
    );
    return result.rows[0] || null;
  }

  /**
   * Create or update user profile with basic info
   */
  async createUserProfile(
    userId: string,
    data: { firstName: string; lastName: string; email: string }
  ): Promise<UserProfile> {
    const { data: profile, error } = await this.fastify.supabase
      .from('user_profile')
      .upsert({
        id: userId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      })
      .select()
      .single();

    if (error) throw error;
    return profile as UserProfile;
  }

  /**
   * Get user roles from user_roles table
   */
  async getUserRoles(userId: string): Promise<string[]> {
    const result = await this.fastify.pg.query<{ name: string }>(
      `SELECT r.name
       FROM user_roles ur
       JOIN roles r ON ur.role_id = r.id
       WHERE ur.user_id = $1 AND ur.is_active = true`,
      [userId]
    );
    return result.rows.map((row: { name: string }) => row.name);
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: Partial<{
      first_name: string;
      last_name: string;
      headline: string;
      bio: string;
      location: string;
      timezone: string;
      profile_image_url: string;
    }>
  ): Promise<UserProfile | null> {
    const allowedFields = [
      'first_name',
      'last_name',
      'headline',
      'bio',
      'location',
      'timezone',
      'profile_image_url',
    ];
    const fields: string[] = ['updated_at = NOW()'];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && allowedFields.includes(key)) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    values.push(userId);

    const result = await this.fastify.pg.query<UserProfile>(
      `UPDATE user_profile
       SET ${fields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, first_name, last_name, email, profile_image_url, headline, bio,
                 location, timezone, created_at, updated_at`,
      values
    );

    return result.rows[0] || null;
  }

  /**
   * Delete user profile
   */
  async delete(userId: string): Promise<boolean> {
    const result = await this.fastify.pg.query(`DELETE FROM user_profile WHERE id = $1`, [userId]);
    return (result.rowCount || 0) > 0;
  }

  /**
   * Add role to user
   */
  async addRole(userId: string, roleName: string): Promise<boolean> {
    const result = await this.fastify.pg.query(
      `INSERT INTO user_roles (user_id, role_id, is_active)
       SELECT $1, r.id, true
       FROM roles r
       WHERE r.name = $2
       ON CONFLICT (user_id, role_id) DO UPDATE SET is_active = true`,
      [userId, roleName]
    );
    return (result.rowCount || 0) > 0;
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: string, roleName: string): Promise<boolean> {
    const result = await this.fastify.pg.query(
      `UPDATE user_roles ur
       SET is_active = false
       FROM roles r
       WHERE ur.role_id = r.id AND ur.user_id = $1 AND r.name = $2`,
      [userId, roleName]
    );
    return (result.rowCount || 0) > 0;
  }

  /**
   * Create user details (journey data for users)
   */
  async createUserDetails(userId: string, data: UserJourneyData): Promise<UserDetails> {
    const result = await this.fastify.pg.query<UserDetails>(
      `INSERT INTO user_details (
        user_id, current_user_role, experience_level, goals,
        interests, skills, learning_style, budget, session_frequency
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        userId,
        data.currentRole || null,
        data.experience || null,
        data.goals || null,
        data.interests || [],
        data.skills || [],
        data.learningStyle || null,
        data.budget || null,
        data.frequency || null,
      ]
    );
    return result.rows[0];
  }

  /**
   * Create mentor details (journey data for mentors)
   */
  async createMentorDetails(userId: string, data: MentorJourneyData): Promise<MentorDetails> {
    // Parse years of experience from the experience string if provided
    let yearsExperience: number | null = null;
    if (data.experience) {
      const match = data.experience.match(/(\d+)/);
      if (match) {
        yearsExperience = parseInt(match[1], 10);
      }
    }

    const result = await this.fastify.pg.query<MentorDetails>(
      `INSERT INTO mentor_details (
        user_id, expertise, hourly_rate, years_experience
      ) VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [userId, data.expertise || [], data.hourlyRate || null, yearsExperience]
    );
    return result.rows[0];
  }
}
