import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * List all mentors with optional filtering
 * GET /api/mentors?location=NYC&minRating=4&skills=TypeScript,React&page=1&pageSize=20
 */
export async function listMentorsHandler(_req: FastifyRequest, _reply: FastifyReply) {
  // TODO: Implement list mentors logic
  throw new Error('Not implemented');
}

/**
 * Get mentor details by ID
 * GET /api/mentors/:id
 */
export async function getMentorHandler(_req: FastifyRequest, _reply: FastifyReply) {
  // TODO: Implement get mentor by ID logic
  throw new Error('Not implemented');
}
