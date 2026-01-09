import type { FastifyInstance } from 'fastify';
import {
  UserSignupSchema,
  UserSignupRequest,
  MentorSignupSchema,
  MentorSignupRequest,
} from '@domain/types/models';
import { HttpError } from '@domain/types/errors';
import { assignUserRole, assignMentorRole } from '@application/util/userRole';

export async function signupUser(fastify: FastifyInstance, data: UserSignupRequest): Promise<void> {
  const validationResult = UserSignupSchema.safeParse(data);
  if (!validationResult.success) {
    throw HttpError.badRequest('Validation failed', validationResult.error.errors);
  }

  const { email, password, firstName, lastName, journeyData } = validationResult.data;

  const { data: authData, error: authError } = await fastify.supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw HttpError.badRequest(authError.message);

  const user = authData.user;
  if (!user) throw HttpError.internal('User creation failed');

  if (!user.identities || user.identities.length === 0)
    throw HttpError.conflict('An account with this email already exists');

  const userId = user.id;

  await assignUserRole(fastify, userId);

  await fastify.uow.userRepository.createUserProfile(userId, {
    firstName,
    lastName,
    email,
  });

  if (journeyData) {
    await fastify.uow.userRepository.createUserDetails(userId, journeyData);

    if (journeyData.location || journeyData.timezone) {
      await fastify.uow.userRepository.updateProfile(userId, {
        location: journeyData.location,
        timezone: journeyData.timezone,
      });
    }
  }
}

export async function signupMentor(
  fastify: FastifyInstance,
  data: MentorSignupRequest
): Promise<void> {
  const validationResult = MentorSignupSchema.safeParse(data);

  if (!validationResult.success) {
    throw HttpError.badRequest('Validation failed', validationResult.error.errors);
  }

  const { email, password, firstName, lastName, journeyData } = validationResult.data;

  const { data: authData, error: authError } = await fastify.supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw HttpError.badRequest(authError.message);

  const user = authData.user;
  if (!user) throw HttpError.internal('User creation failed');

  if (!user.identities || user.identities.length === 0)
    throw HttpError.conflict('An account with this email already exists');

  const userId = user.id;

  await assignUserRole(fastify, userId);
  await assignMentorRole(fastify, userId);

  await fastify.uow.userRepository.createUserProfile(userId, {
    firstName,
    lastName,
    email,
  });

  if (journeyData) {
    await fastify.uow.userRepository.createMentorDetails(userId, journeyData);

    if (journeyData.headline || journeyData.bio || journeyData.location || journeyData.timezone) {
      await fastify.uow.userRepository.updateProfile(userId, {
        headline: journeyData.headline,
        bio: journeyData.bio,
        location: journeyData.location,
        timezone: journeyData.timezone,
      });
    }
  }
}
