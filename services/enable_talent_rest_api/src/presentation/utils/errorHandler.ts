import { FastifyReply, FastifyRequest, FastifyInstance, RouteGenericInterface } from 'fastify';
import type { AsyncHandler } from '@domain/types/utils.js';

/**
 * Wraps an async handler with standardized error handling
 * Catches any errors, logs them, and returns a consistent error response
 *
 * @param handler - The async handler function to wrap
 * @returns A wrapped handler with error handling
 */
export function withErrorHandler<T extends RouteGenericInterface = RouteGenericInterface>(
  handler: AsyncHandler<T>
): AsyncHandler<T> {
  return async (req: FastifyRequest<T>, reply: FastifyReply, fastify: FastifyInstance) => {
    try {
      return await handler(req, reply, fastify);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  };
}
