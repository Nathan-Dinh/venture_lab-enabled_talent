import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import * as bcrypt from 'bcryptjs';
import {
  SignupSchema,
  LoginSchema,
  AuthResponse,
  User,
  UserRole,
} from '../types/models.js';
import { withErrorHandler } from '../utils/errorHandler.js';

/**
 * Handle user signup
 * POST /api/auth/signup
 */
async function signupHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  // Validate request body
  const validationResult = SignupSchema.safeParse(req.body);
  if (!validationResult.success) {
    return reply.status(400).send({
      success: false,
      error: 'Validation failed',
      details: validationResult.error.errors,
    });
  }

  const { email, password, name, role } = validationResult.data;

  // Check if user already exists
  const existingUser = await fastify.pg.query(
    'SELECT user_id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    return reply.status(409).send({
      success: false,
      error: 'User with this email already exists',
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Determine user type ID (you may want to query this based on role)
  const userTypeId = role === UserRole.MENTOR ? '2' : '1';

  // Create user in database
  const result = await fastify.pg.query(
    `INSERT INTO users (name, email, password_hash, usertype_id, created_at)
     VALUES ($1, $2, $3, $4, NOW())
     RETURNING user_id, name, email, usertype_id, created_at`,
    [name, email, hashedPassword, userTypeId]
  );

  const user = result.rows[0];

  // Generate JWT token
  const token = fastify.jwt.sign({
    user_id: user.user_id,
    email: user.email,
    role: role || UserRole.USER,
  });

  const response: AuthResponse = {
    token,
    user: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      usertype_id: user.usertype_id,
      role: role || UserRole.USER,
      created_at: user.created_at,
    },
  };

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
  // Validate request body
  const validationResult = LoginSchema.safeParse(req.body);
  if (!validationResult.success) {
    return reply.status(400).send({
      success: false,
      error: 'Validation failed',
      details: validationResult.error.errors,
    });
  }

  const { email, password, role } = validationResult.data;

  // Find user by email
  const result = await fastify.pg.query(
    `SELECT user_id, name, email, usertype_id, password_hash, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    return reply.status(401).send({
      success: false,
      error: 'Invalid email or password',
    });
  }

  const user = result.rows[0];

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    return reply.status(401).send({
      success: false,
      error: 'Invalid email or password',
    });
  }

  // Determine user role from usertype_id
  const userRole = user.usertype_id === '2' ? UserRole.MENTOR : UserRole.USER;

  // Generate JWT token
  const token = fastify.jwt.sign({
    user_id: user.user_id,
    email: user.email,
    role: role || userRole,
  });

  const response: AuthResponse = {
    token,
    user: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      usertype_id: user.usertype_id,
      role: role || userRole,
      created_at: user.created_at,
    },
  };

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
  // User is already verified by the authenticate preValidation hook
  const user = req.user!;

  // Fetch full user details from database
  const result = await fastify.pg.query(
    `SELECT user_id, name, email, usertype_id, headline, bio, location, profile_image_url, created_at
     FROM users
     WHERE user_id = $1`,
    [user.user_id]
  );

  if (result.rows.length === 0) {
    return reply.status(404).send({
      success: false,
      error: 'User not found',
    });
  }

  const userData = result.rows[0];
  const userRole = userData.usertype_id === '2' ? UserRole.MENTOR : UserRole.USER;

  const response: User = {
    user_id: userData.user_id,
    name: userData.name,
    email: userData.email,
    usertype_id: userData.usertype_id,
    role: userRole,
    headline: userData.headline,
    bio: userData.bio,
    location: userData.location,
    profile_image_url: userData.profile_image_url,
    created_at: userData.created_at,
  };

  return reply.send({
    success: true,
    data: response,
  });
}

export const getCurrentUserHandler = withErrorHandler(getCurrentUserHandlerImpl);
