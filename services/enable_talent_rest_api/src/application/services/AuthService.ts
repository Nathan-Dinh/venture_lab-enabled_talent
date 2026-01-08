import { FastifyInstance } from 'fastify';
import {
  UserRole,
  UserSignupSchema,
  UserSignupRequest,
  MentorSignupSchema,
  MentorSignupRequest,
} from '@domain/types/models';
import { HttpError } from '@domain/types/errors';

export async function signupUser(fastify: FastifyInstance, data: UserSignupRequest): Promise<void> {
  const validationResult = UserSignupSchema.safeParse(data);
  if (!validationResult.success) {
    throw HttpError.badRequest('Validation failed', validationResult.error.errors);
  }

  const { email, password, name, journeyData } = validationResult.data;

  // Check if user already exists
  const existingUser = await fastify.uow.userRepository.findByEmail(email);
  if (existingUser) {
    throw HttpError.conflict('An account with this email already exists');
  }

  // Create user with Supabase Auth (admin API for auto-confirm)
  const { data: authData, error: authError } = await fastify.supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      role: UserRole.USER,
    },
  });

  if (authError) {
    throw HttpError.badRequest(authError.message);
  }

  if (!authData.user) {
    throw HttpError.internal('Failed to create user');
  }

  // Insert journey data into user_details if provided
  if (journeyData) {
    await fastify.uow.userRepository.createUserDetails(authData.user.id, journeyData);

    // Update user_profile with location and timezone if provided
    if (journeyData.location || journeyData.timezone) {
      await fastify.uow.userRepository.updateProfile(authData.user.id, {
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

  if (!validationResult.success)
    throw HttpError.badRequest('Validation failed', validationResult.error.errors);

  const { email, password, name, journeyData } = validationResult.data;

  const existingUser = await fastify.uow.userRepository.findByEmail(email);

  if (existingUser) throw HttpError.conflict('An account with this email already exists');

  // Create user with Supabase Auth (admin API for auto-confirm)
  const { data: authData, error: authError } = await fastify.supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      role: UserRole.MENTOR,
    },
  });

  if (authError) {
    throw HttpError.badRequest(authError.message);
  }

  if (!authData.user) {
    throw HttpError.internal('Failed to create user');
  }

  // Mentors also get the User role (they can act as both)
  await fastify.uow.userRepository.addRole(authData.user.id, UserRole.USER);

  // Insert journey data into mentor_details if provided
  if (journeyData) {
    await fastify.uow.userRepository.createMentorDetails(authData.user.id, journeyData);
    if (journeyData.headline || journeyData.bio || journeyData.location || journeyData.timezone) {
      await fastify.uow.userRepository.updateProfile(authData.user.id, {
        headline: journeyData.headline,
        bio: journeyData.bio,
        location: journeyData.location,
        timezone: journeyData.timezone,
      });
    }
  }
}
