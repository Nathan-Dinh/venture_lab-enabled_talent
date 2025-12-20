import { FastifyPluginAsync } from 'fastify';
import {
  getAvailabilityHandler,
  updateAvailabilityHandler,
} from '../controllers/availabilityController.js';
import { authenticate } from '../middleware/authenticate.js';

const mentorAvailabilityRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/mentors/availability',
    { preHandler: [authenticate] },
    async (req, reply) => getAvailabilityHandler(req, reply, fastify)
  );
  fastify.patch(
    '/mentors/availability',
    { preHandler: [authenticate] },
    async (req, reply) => updateAvailabilityHandler(req, reply, fastify)
  );
};

export default mentorAvailabilityRoutes;
