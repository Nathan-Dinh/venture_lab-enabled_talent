import { FastifyReply, FastifyRequest } from 'fastify';
import * as AuthService from '@application/services/AuthService';
import type { UserSignupRequest, MentorSignupRequest } from '@domain/types/models';

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
