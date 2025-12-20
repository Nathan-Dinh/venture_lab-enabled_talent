import { FastifyInstance } from 'fastify';
import { listMentors, findMentorById } from '../../infrastructure/repositories/mentorRepository.js';
import type { Mentor, MentorCard, PaginatedResponse } from '../../domain/types/models.js';

/**
 * Mentor Service (Functional)
 * Handles all mentor-related business logic
 */

/**
 * List mentors with optional filtering
 */
export async function getMentors(
  fastify: FastifyInstance,
  filters: {
    location?: string;
    minRating?: number;
    skills?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<PaginatedResponse<MentorCard>> {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 20;
  const offset = (page - 1) * pageSize;

  // Parse skills from comma-separated string
  const skills = filters.skills
    ? filters.skills.split(',').map((s) => s.trim())
    : undefined;

  return await listMentors(fastify, {
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
export async function getMentorById(
  fastify: FastifyInstance,
  mentorId: string
): Promise<Mentor> {
  const mentor = await findMentorById(fastify, mentorId);

  if (!mentor) {
    throw {
      status: 404,
      message: 'Mentor not found',
    };
  }

  return mentor;
}
