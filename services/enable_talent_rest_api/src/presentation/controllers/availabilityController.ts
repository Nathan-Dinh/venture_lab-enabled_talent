import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';
import { withErrorHandler } from '../../application/utils/errorHandler.js';

/**
 * Get mentor availability schedule
 * GET /api/mentors/availability
 * Requires authentication (mentor only)
 */
async function getAvailabilityHandlerImpl(
  _req: FastifyRequest,
  _reply: FastifyReply,
  _fastify: FastifyInstance
) {
  // TODO: Implement get availability logic
  throw new Error('Not implemented');
}

export const getAvailabilityHandler = withErrorHandler(getAvailabilityHandlerImpl);

/**
 * Update mentor availability schedule
 * PATCH /api/mentors/availability
 * Requires authentication (mentor only)
 */
async function updateAvailabilityHandlerImpl(
  _req: FastifyRequest,
  _reply: FastifyReply,
  _fastify: FastifyInstance
) {
  // TODO: Implement update availability logic
  throw new Error('Not implemented');
}

export const updateAvailabilityHandler = withErrorHandler(updateAvailabilityHandlerImpl);
