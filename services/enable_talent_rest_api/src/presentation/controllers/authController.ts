import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { withErrorHandler } from '@presentation/utils/errorHandler.js';

/**
 * Handle user signup
 * POST /api/auth/signup
 */
async function signupHandlerImpl(
  _req: FastifyRequest,
  _reply: FastifyReply,
  _fastify: FastifyInstance
) {
  // TODO: Implement signup logic
  throw new Error('Not implemented');
}

export const signupHandler = withErrorHandler(signupHandlerImpl);

/**
 * Handle user login
 * POST /api/auth/login
 */
async function loginHandlerImpl(
  _req: FastifyRequest,
  _reply: FastifyReply,
  _fastify: FastifyInstance
) {
  // TODO: Implement login logic
  throw new Error('Not implemented');
}

export const loginHandler = withErrorHandler(loginHandlerImpl);

/**
 * Get current authenticated user
 * GET /api/auth/me
 * Requires authentication
 */
async function getCurrentUserHandlerImpl(
  _req: FastifyRequest,
  _reply: FastifyReply,
  _fastify: FastifyInstance
) {
  // TODO: Implement get current user logic
  throw new Error('Not implemented');
}

export const getCurrentUserHandler = withErrorHandler(getCurrentUserHandlerImpl);
