import { FastifyPluginAsync } from 'fastify';
import { signupUserHandler, signupMentorHandler } from '../controllers/authController';
import type { UserSignupRequest, MentorSignupRequest } from '@domain/types/models';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: UserSignupRequest }>('/auth/signup/user', signupUserHandler);
  fastify.post<{ Body: MentorSignupRequest }>('/auth/signup/mentor', signupMentorHandler);
};

export default authRoutes;
