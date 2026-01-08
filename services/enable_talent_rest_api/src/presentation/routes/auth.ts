import { FastifyPluginAsync } from 'fastify';
import {
  signupUserHandler,
  signupMentorHandler,
  loginHandler,
  getCurrentUserHandler,
} from '../controllers/authController';
import { authenticate } from '../middleware/authenticate';
import type { UserSignupRequest, MentorSignupRequest, LoginRequest } from '@domain/types/models';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: UserSignupRequest }>('/auth/signup/user', signupUserHandler);
  fastify.post<{ Body: MentorSignupRequest }>('/auth/signup/mentor', signupMentorHandler);
  fastify.post<{ Body: LoginRequest }>('/auth/login', loginHandler);
  fastify.get('/auth/me', { preHandler: [authenticate] }, getCurrentUserHandler);
};

export default authRoutes;
