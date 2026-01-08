import { FastifyPluginAsync } from 'fastify';
import {
  getAvailabilityHandler,
  updateAvailabilityHandler,
} from '../controllers/availabilityController';
import { authenticate } from '../middleware/authenticate';

const mentorAvailabilityRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/mentors/availability', { preHandler: [authenticate] }, getAvailabilityHandler);
  fastify.patch('/mentors/availability', { preHandler: [authenticate] }, updateAvailabilityHandler);
};

export default mentorAvailabilityRoutes;
