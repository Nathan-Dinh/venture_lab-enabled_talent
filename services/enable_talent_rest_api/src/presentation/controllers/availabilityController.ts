import { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Get mentor availability schedule
 * GET /api/mentors/availability
 * Requires authentication (mentor only)
 */
export async function getAvailabilityHandler(_req: FastifyRequest, _reply: FastifyReply) {
  // TODO: Implement get availability logic
  throw new Error('Not implemented');
}

/**
 * Update mentor availability schedule
 * PATCH /api/mentors/availability
 * Requires authentication (mentor only)
 */
export async function updateAvailabilityHandler(_req: FastifyRequest, _reply: FastifyReply) {
  // TODO: Implement update availability logic
  throw new Error('Not implemented');
}
