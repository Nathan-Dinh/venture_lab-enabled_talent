import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';
import { withErrorHandler } from '../../application/utils/errorHandler.js';
import { getMentors, getMentorById } from '../../application/services/mentorService.js';

/**
 * List all mentors with optional filtering
 * GET /api/mentors?location=NYC&minRating=4&skills=TypeScript,React&page=1&pageSize=20
 */
async function listMentorsHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const { page, pageSize, location, minRating, skills } = req.query as any;

  const response = await getMentors(fastify, {
    location,
    minRating: minRating ? parseFloat(minRating) : undefined,
    skills,
    page: page ? parseInt(page) : undefined,
    pageSize: pageSize ? parseInt(pageSize) : undefined,
  });

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
  const { id } = req.params as any;

  const mentor = await getMentorById(fastify, id);

  return reply.send({
    success: true,
    data: mentor,
  });
}

export const getMentorHandler = withErrorHandler(getMentorHandlerImpl);
