import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';
import { User } from '../../domain/types/models.js';
import { withErrorHandler } from '../../application/utils/errorHandler.js';
import { ProfileService } from '../../application/services/ProfileService.js';

/**
 * Get user profile with experience, education, and skills
 * GET /api/profile
 * Requires authentication
 */
async function getProfileHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user! as User;
  const profileService = new ProfileService(fastify);
  const response = await profileService.getProfile(user.user_id);

  return reply.send({
    success: true,
    data: response,
  });
}

export const getProfileHandler = withErrorHandler(getProfileHandlerImpl);

/**
 * Update user profile
 * PATCH /api/profile
 * Requires authentication
 */
async function updateProfileHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user! as User;
  const profileService = new ProfileService(fastify);
  const response = await profileService.updateProfile(user.user_id, req.body);

  return reply.send({
    success: true,
    data: response,
  });
}

export const updateProfileHandler = withErrorHandler(updateProfileHandlerImpl);

/**
 * Delete user account
 * DELETE /api/profile
 * Requires authentication
 */
async function deleteAccountHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user! as User;
  const profileService = new ProfileService(fastify);
  await profileService.deleteAccount(user.user_id);

  return reply.send({
    success: true,
    message: 'Account deleted successfully',
  });
}

export const deleteAccountHandler = withErrorHandler(deleteAccountHandlerImpl);
