import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  getProfileHandler,
  updateProfileHandler,
} from '../controllers/profileController.js';
import { authenticate } from '../middleware/authenticate.js';

const mentorProfileRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get(
    '/mentors/profile',
    { preHandler: [authenticate] },
    async (req, reply) => getProfileHandler(req, reply, fastify)
  );
  fastify.patch(
    '/mentors/profile',
    { preHandler: [authenticate] },
    async (req, reply) => updateProfileHandler(req, reply, fastify)
  );
};

export default mentorProfileRoutes;
