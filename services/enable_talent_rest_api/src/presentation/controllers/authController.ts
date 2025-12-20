import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { withErrorHandler } from '../../application/utils/errorHandler.js';
import { AuthService } from '../../application/services/AuthService.js';

/**
 * Handle user signup
 * POST /api/auth/signup
 */
async function signupHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const authService = new AuthService(fastify);
  const response = await authService.signup(req.body);

  return reply.status(201).send({
    success: true,
    data: response,
  });
}

export const signupHandler = withErrorHandler(signupHandlerImpl);

/**
 * Handle user login
 * POST /api/auth/login
 */
async function loginHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const authService = new AuthService(fastify);
  const response = await authService.login(req.body);

  return reply.send({
    success: true,
    data: response,
  });
}

export const loginHandler = withErrorHandler(loginHandlerImpl);

/**
 * Get current authenticated user
 * GET /api/auth/me
 * Requires authentication
 */
async function getCurrentUserHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user!;
  const authService = new AuthService(fastify);
  const response = await authService.getCurrentUser(user.user_id);

  return reply.send({
    success: true,
    data: response,
  });
}

export const getCurrentUserHandler = withErrorHandler(getCurrentUserHandlerImpl);
