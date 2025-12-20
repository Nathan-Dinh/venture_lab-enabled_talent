import { FastifyInstance } from 'fastify';
import { UserRepository } from '../../infrastructure/repositories/UserRepository.js';
import { UpdateProfileSchema, UserProfile, UserRole } from '../../domain/types/models.js';

/**
 * Profile Service
 * Handles all profile-related business logic
 */
export class ProfileService {
  private userRepository: UserRepository;

  constructor(private fastify: FastifyInstance) {
    this.userRepository = new UserRepository(fastify);
  }

  /**
   * Get user profile with experience, education, and skills
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const profile = await this.userRepository.getProfile(userId);

    if (!profile) {
      throw {
        status: 404,
        message: 'Profile not found',
      };
    }

    // Get skills
    const skills = await this.fastify.pg.query(
      `SELECT sk.skill_id, sk.skill_name
       FROM user_skills us
       JOIN skills sk ON us.skill_id = sk.skill_id
       WHERE us.user_id = $1`,
      [userId]
    );

    // Get experience
    const experience = await this.fastify.pg.query(
      `SELECT experience_id, company, title, description, start_date, end_date
       FROM experience
       WHERE user_id = $1
       ORDER BY start_date DESC`,
      [userId]
    );

    // Get education
    const education = await this.fastify.pg.query(
      `SELECT education_id, institution, degree, field_of_study, start_date, end_date
       FROM education
       WHERE user_id = $1
       ORDER BY start_date DESC`,
      [userId]
    );

    const userRole = profile.usertype_id === '2' ? UserRole.MENTOR : UserRole.USER;

    return {
      ...profile,
      role: userRole,
      skills: skills.rows,
      experience: experience.rows,
      education: education.rows,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: unknown): Promise<UserProfile> {
    // Validate request data
    const validationResult = UpdateProfileSchema.safeParse(data);
    if (!validationResult.success) {
      throw {
        status: 400,
        message: 'Validation failed',
        details: validationResult.error.errors,
      };
    }

    const updatedProfile = await this.userRepository.updateProfile(
      userId,
      validationResult.data
    );

    if (!updatedProfile) {
      throw {
        status: 404,
        message: 'Profile not found',
      };
    }

    // Return full profile with related data
    return await this.getProfile(userId);
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<void> {
    const deleted = await this.userRepository.delete(userId);

    if (!deleted) {
      throw {
        status: 404,
        message: 'User not found',
      };
    }
  }
}
