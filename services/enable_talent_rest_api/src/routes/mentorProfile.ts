import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  getProfileHandler,
  updateProfileHandler,
} from '../controllers/profileController.js';

const mentorProfileRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get(
    '/mentors/profile',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => getProfileHandler(req, reply, fastify)
  );
  fastify.patch(
    '/mentors/profile',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => updateProfileHandler(req, reply, fastify)
  );
};

export default mentorProfileRoutes;
