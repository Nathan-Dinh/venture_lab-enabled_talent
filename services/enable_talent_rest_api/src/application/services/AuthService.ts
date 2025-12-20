import { FastifyInstance } from 'fastify';
import { createUser, findUserById, getUserProfile } from '../../infrastructure/repositories/userRepository.js';
import {
  SignupSchema,
  LoginSchema,
  AuthResponse,
  UserRole,
} from '../../domain/types/models.js';

/**
 * Authentication Service (Functional)
 * Handles all authentication-related business logic
 */

/**
 * Sign up a new user
 */
export async function signup(
  fastify: FastifyInstance,
  data: unknown
): Promise<AuthResponse> {
  // Validate request data
  const validationResult = SignupSchema.safeParse(data);
  if (!validationResult.success) {
    throw {
      status: 400,
      message: 'Validation failed',
      details: validationResult.error.errors,
    };
  }

  const { email, password, name, role } = validationResult.data;

  // Determine user type ID based on role
  const userTypeId = role === UserRole.MENTOR ? '2' : '1';

  // Create user with Supabase Auth
  const { data: authData, error: authError } = await fastify.supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        usertype_id: userTypeId,
        role: role || UserRole.USER,
      },
    },
  });

  if (authError) {
    throw {
      status: 400,
      message: authError.message,
    };
  }

  if (!authData.user || !authData.session) {
    throw {
      status: 500,
      message: 'Failed to create user session',
    };
  }

  // Create user record in database
  const user = await createUser(fastify, {
    user_id: authData.user.id,
    name,
    email,
    usertype_id: userTypeId,
  });

  return {
    token: authData.session.access_token,
    user: {
      ...user,
      role: role || UserRole.USER,
    },
  };
}

/**
 * Login user
 */
export async function login(
  fastify: FastifyInstance,
  data: unknown
): Promise<AuthResponse> {
  // Validate request data
  const validationResult = LoginSchema.safeParse(data);
  if (!validationResult.success) {
    throw {
      status: 400,
      message: 'Validation failed',
      details: validationResult.error.errors,
    };
  }

  const { email, password } = validationResult.data;

  // Authenticate with Supabase Auth
  const { data: authData, error: authError } =
    await fastify.supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (authError || !authData.user || !authData.session) {
    throw {
      status: 401,
      message: 'Invalid email or password',
    };
  }

  // Fetch user details from database
  const user = await findUserById(fastify, authData.user.id);

  if (!user) {
    throw {
      status: 404,
      message: 'User not found in database',
    };
  }

  // Determine user role from usertype_id
  const userRole = user.usertype_id === '2' ? UserRole.MENTOR : UserRole.USER;

  return {
    token: authData.session.access_token,
    user: {
      ...user,
      role: userRole,
    },
  };
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(
  fastify: FastifyInstance,
  userId: string
): Promise<any> {
  const user = await getUserProfile(fastify, userId);

  if (!user) {
    throw {
      status: 404,
      message: 'User not found',
    };
  }

  const userRole = user.usertype_id === '2' ? UserRole.MENTOR : UserRole.USER;

  return {
    ...user,
    role: userRole,
  };
}
