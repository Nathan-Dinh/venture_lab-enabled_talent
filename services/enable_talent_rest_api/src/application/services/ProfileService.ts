import { FastifyInstance } from 'fastify';
import { UpdateProfileSchema, UserProfile, UserRole } from '../../domain/types/models.js';

/**
 * Profile Service (Functional)
 * Handles all profile-related business logic
 */

/**
 * Get user profile with experience, education, and skills
 */
export async function getProfile(
  fastify: FastifyInstance,
  userId: string
): Promise<UserProfile> {
  const profile = await fastify.uow.userRepository.getUserFullProfile(userId);

  if (!profile) {
    throw {
      status: 404,
      message: 'Profile not found',
    };
  }

  const userRole = profile.usertype_id === '2' ? UserRole.MENTOR : UserRole.USER;

  return {
    ...profile,
    role: userRole,
  };
}

/**
 * Update user profile
 */
export async function updateProfile(
  fastify: FastifyInstance,
  userId: string,
  data: unknown
): Promise<UserProfile> {
  // Validate request data
  const validationResult = UpdateProfileSchema.safeParse(data);
  if (!validationResult.success) {
    throw {
      status: 400,
      message: 'Validation failed',
      details: validationResult.error.errors,
    };
  }

  const updatedProfile = await fastify.uow.userRepository.updateUserProfile(userId, validationResult.data);

  if (!updatedProfile) {
    throw {
      status: 404,
      message: 'Profile not found',
    };
  }

  // Return full profile with related data
  return await getProfile(fastify, userId);
}

/**
 * Delete user account
 */
export async function deleteAccount(
  fastify: FastifyInstance,
  userId: string
): Promise<void> {
  const deleted = await fastify.uow.userRepository.deleteUser(userId);

  if (!deleted) {
    throw {
      status: 404,
      message: 'User not found',
    };
  }
}
