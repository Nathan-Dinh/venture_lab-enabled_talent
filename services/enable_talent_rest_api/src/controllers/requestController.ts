import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';

/**
 * List mentor session requests
 * GET /api/mentors/request
 * TODO: Implement this endpoint to fetch session requests for a mentor
 */
export async function listSessionRequestsHandler(
  _req: FastifyRequest,
  reply: FastifyReply,
  _fastify: FastifyInstance
) {
  return reply.status(501).send({
    success: false,
    error: 'This endpoint is not yet implemented',
  });
}

/**
 * Respond to a session request
 * PATCH /api/mentors/request/:id
 * TODO: Implement this endpoint to accept/reject session requests
 */
export async function respondToSessionRequestHandler(
  _req: FastifyRequest,
  reply: FastifyReply,
  _fastify: FastifyInstance
) {
  return reply.status(501).send({
    success: false,
    error: 'This endpoint is not yet implemented',
  });
}
