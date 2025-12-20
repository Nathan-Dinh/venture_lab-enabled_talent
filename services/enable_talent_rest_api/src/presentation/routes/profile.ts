import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  getProfileHandler,
  updateProfileHandler,
  deleteAccountHandler,
} from '../controllers/profileController.js';
import { authenticate } from '../middleware/authenticate.js';

const profileRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // All profile routes require authentication
  fastify.get(
    '/profile',
    { preHandler: [authenticate] },
    async (req, reply) => getProfileHandler(req, reply, fastify)
  );

  fastify.patch(
    '/profile',
    { preHandler: [authenticate] },
    async (req, reply) => updateProfileHandler(req, reply, fastify)
  );

  fastify.delete(
    '/profile',
    { preHandler: [authenticate] },
    async (req, reply) => deleteAccountHandler(req, reply, fastify)
  );
};

export default fp(profileRoutes);
