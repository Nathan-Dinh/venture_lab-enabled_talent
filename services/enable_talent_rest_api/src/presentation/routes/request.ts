import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  listSessionRequestsHandler,
  respondToSessionRequestHandler,
} from '../controllers/requestController.js';

const mentorRequestsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get(
    '/mentors/request',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => listSessionRequestsHandler(req, reply, fastify)
  );
  fastify.patch(
    '/mentors/request/:id',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => respondToSessionRequestHandler(req, reply, fastify)
  );
};

export default mentorRequestsRoutes;
