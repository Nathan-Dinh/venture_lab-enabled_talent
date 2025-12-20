import { FastifyInstance } from 'fastify';
import { MentorRepository } from '../../infrastructure/repositories/MentorRepository.js';
import type { Mentor, MentorCard, PaginatedResponse } from '../../domain/types/models.js';

/**
 * Mentor Service
 * Handles all mentor-related business logic
 */
export class MentorService {
  private mentorRepository: MentorRepository;

  constructor(private fastify: FastifyInstance) {
    this.mentorRepository = new MentorRepository(fastify);
  }

  /**
   * List mentors with optional filtering
   */
  async listMentors(filters: {
    location?: string;
    minRating?: number;
    skills?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<MentorCard>> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const offset = (page - 1) * pageSize;

    // Parse skills from comma-separated string
    const skills = filters.skills ? filters.skills.split(',').map((s) => s.trim()) : undefined;

    return await this.mentorRepository.list({
      location: filters.location,
      minRating: filters.minRating,
      skills,
      limit: pageSize,
      offset,
    });
  }

  /**
   * Get mentor details by ID
   */
  async getMentorById(mentorId: string): Promise<Mentor> {
    const mentor = await this.mentorRepository.findById(mentorId);

    if (!mentor) {
      throw {
        status: 404,
        message: 'Mentor not found',
      };
    }

    return mentor;
  }
}
