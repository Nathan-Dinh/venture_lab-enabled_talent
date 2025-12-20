import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';
import { withErrorHandler } from '../../application/utils/errorHandler.js';

/**
 * List all mentors with optional filtering
 * GET /api/mentors?location=NYC&minRating=4&skills=TypeScript,React&page=1&pageSize=20
 */
async function listMentorsHandlerImpl(
  _req: FastifyRequest,
  _reply: FastifyReply,
  _fastify: FastifyInstance
) {
  // TODO: Implement list mentors logic
  throw new Error('Not implemented');
}

export const listMentorsHandler = withErrorHandler(listMentorsHandlerImpl);

/**
 * Get mentor details by ID
 * GET /api/mentors/:id
 */
async function getMentorHandlerImpl(
  _req: FastifyRequest,
  _reply: FastifyReply,
  _fastify: FastifyInstance
) {
  // TODO: Implement get mentor by ID logic
  throw new Error('Not implemented');
}

export const getMentorHandler = withErrorHandler(getMentorHandlerImpl);
