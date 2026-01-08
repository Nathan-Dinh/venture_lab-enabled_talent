import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import {
  signupUserHandler,
  signupMentorHandler,
  loginHandler,
  getCurrentUserHandler,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import type { UserSignupRequest, MentorSignupRequest, LoginRequest } from '@domain/types/models.js';

const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: UserSignupRequest }>('/auth/signup/user', async (req, reply) =>
    signupUserHandler(req, reply)
  );
  fastify.post<{ Body: MentorSignupRequest }>('/auth/signup/mentor', async (req, reply) =>
    signupMentorHandler(req, reply)
  );

  fastify.post<{ Body: LoginRequest }>('/auth/login', async (req, reply) =>
    loginHandler(req, reply)
  );

  fastify.get('/auth/me', { preHandler: [authenticate] }, async (req, reply) =>
    getCurrentUserHandler(req, reply)
  );
};

export default authRoutes;
