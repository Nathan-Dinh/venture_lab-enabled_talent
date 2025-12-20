import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import {
  signupHandler,
  loginHandler,
  getCurrentUserHandler,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';

const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Public routes
  fastify.post('/auth/signup', async (req, reply) => signupHandler(req, reply, fastify));
  fastify.post('/auth/login', async (req, reply) => loginHandler(req, reply, fastify));

  // Protected routes - requires authentication
  fastify.get(
    '/auth/me',
    { preHandler: [authenticate] },
    async (req, reply) => getCurrentUserHandler(req, reply, fastify)
  );
};

export default authRoutes;
