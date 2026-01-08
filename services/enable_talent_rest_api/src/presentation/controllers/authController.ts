import { FastifyReply, FastifyRequest } from 'fastify';
import * as AuthService from '@application/services/AuthService';
import { HttpError } from '@domain/types/errors';
import type { UserSignupRequest, MentorSignupRequest, LoginRequest } from '@domain/types/models';

/**
 * Handle user signup (User role)
 * POST /api/auth/signup/user
 */
export async function signupUserHandler(
  req: FastifyRequest<{ Body: UserSignupRequest }>,
  reply: FastifyReply
) {
  await AuthService.signupUser(req.server, req.body);
  return reply.status(201).send({
    success: true,
    message: 'Account created successfully. Please login.',
  });
}

/**
 * Handle mentor signup (Mentor role)
 * POST /api/auth/signup/mentor
 */
export async function signupMentorHandler(
  req: FastifyRequest<{ Body: MentorSignupRequest }>,
  reply: FastifyReply
) {
  await AuthService.signupMentor(req.server, req.body);
  return reply.status(201).send({
    success: true,
    message: 'Mentor account created successfully. Please login.',
  });
}

/**
 * Handle user login
 * POST /api/auth/login
 */
export async function loginHandler(
  req: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
) {
  const result = await AuthService.login(req.server, req.body);
  return reply.status(200).send({
    success: true,
    ...result,
  });
}

/**
 * Get current authenticated user
 * GET /api/auth/me
 * Requires authentication
 */
export async function getCurrentUserHandler(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.user?.user_id;
  if (!userId) {
    throw HttpError.unauthorized();
  }

  const user = await AuthService.getCurrentUser(req.server, userId);
  return reply.status(200).send({
    success: true,
    user,
  });
}
