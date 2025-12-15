import { FastifyPluginAsync } from 'fastify';
import {
  getAvailabilityHandler,
  updateAvailabilityHandler,
} from '../controllers/availabilityController.js';

const mentorAvailabilityRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/mentors/availability',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => getAvailabilityHandler(req, reply, fastify)
  );
  fastify.patch(
    '/mentors/availability',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => updateAvailabilityHandler(req, reply, fastify)
  );
};

export default mentorAvailabilityRoutes;
