import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import {
  signupHandler,
  loginHandler,
  getCurrentUserHandler,
} from '../controllers/authController.js';

const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.post('/auth/signup', async (req, reply) => signupHandler(req, reply, fastify));
  fastify.post('/auth/login', async (req, reply) => loginHandler(req, reply, fastify));
  fastify.get('/auth/me', { preValidation: [fastify.authenticate] }, async (req, reply) =>
    getCurrentUserHandler(req, reply, fastify)
  );
};

export default authRoutes;
