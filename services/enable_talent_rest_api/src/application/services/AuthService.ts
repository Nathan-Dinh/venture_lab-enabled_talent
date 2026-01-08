import { FastifyInstance } from 'fastify';
import {
  LoginSchema,
  LoginRequest,
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

export async function signupMentor(fastify: FastifyInstance, data: MentorSignupRequest): Promise<void> {
  const validationResult = MentorSignupSchema.safeParse(data);
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

    // Update user_profile with profile data if provided
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

interface LoginResponse {
  token: string;
  user: {
    user_id: string;
    name: string;
    email: string;
    headline?: string;
    bio?: string;
    location?: string;
    timezone?: string;
    profile_image_url?: string;
    roles: string[];
  };
}

/**
 * Login user
 */
export async function login(fastify: FastifyInstance, data: LoginRequest): Promise<LoginResponse> {
  // Validate request data
  const validationResult = LoginSchema.safeParse(data);
  if (!validationResult.success) {
    throw HttpError.badRequest('Validation failed', validationResult.error.errors);
  }

  const { email, password } = validationResult.data;

  // Authenticate with Supabase Auth
  const { data: authData, error: authError } = await fastify.supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user || !authData.session) {
    throw HttpError.unauthorized('Invalid email or password');
  }

  // Fetch user profile from database
  const userProfile = await fastify.uow.userRepository.findById(authData.user.id);

  if (!userProfile) {
    throw HttpError.notFound('User profile not found');
  }

  // Get user roles
  const roles = await fastify.uow.userRepository.getUserRoles(authData.user.id);

  return {
    token: authData.session.access_token,
    user: {
      user_id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      headline: userProfile.headline,
      bio: userProfile.bio,
      location: userProfile.location,
      timezone: userProfile.timezone,
      profile_image_url: userProfile.profile_image_url,
      roles,
    },
  };
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(fastify: FastifyInstance, userId: string): Promise<any> {
  const userProfile = await fastify.uow.userRepository.findById(userId);

  if (!userProfile) {
    throw HttpError.notFound('User not found');
  }

  // Get user roles
  const roles = await fastify.uow.userRepository.getUserRoles(userId);

  return {
    ...userProfile,
    roles,
  };
}
