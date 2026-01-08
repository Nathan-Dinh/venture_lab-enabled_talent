import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import {
  getProfileHandler,
  updateProfileHandler,
  deleteAccountHandler,
  saveJourneyDataHandler,
} from '../controllers/profileController';
import { authenticate } from '../middleware/authenticate';

const profileRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/profile', { preHandler: [authenticate] }, getProfileHandler);
  fastify.patch('/profile', { preHandler: [authenticate] }, updateProfileHandler);
  fastify.delete('/profile', { preHandler: [authenticate] }, deleteAccountHandler);
  fastify.post('/profile/journey', { preHandler: [authenticate] }, saveJourneyDataHandler);
};

export default fp(profileRoutes);
