import { FastifyPluginAsync } from 'fastify';
import { getProfileHandler, updateProfileHandler } from '../controllers/profileController';
import { authenticate } from '../middleware/authenticate';

const mentorProfileRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/mentors/profile', { preHandler: [authenticate] }, getProfileHandler);
  fastify.patch('/mentors/profile', { preHandler: [authenticate] }, updateProfileHandler);
};

export default mentorProfileRoutes;
