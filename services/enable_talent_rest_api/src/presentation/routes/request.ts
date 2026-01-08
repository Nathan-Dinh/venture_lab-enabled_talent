import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  listSessionRequestsHandler,
  respondToSessionRequestHandler,
} from '../controllers/requestController';
import { authenticate } from '../middleware/authenticate';

const mentorRequestsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get(
    '/mentors/request',
    { preHandler: [authenticate] },
    async (req, reply) => listSessionRequestsHandler(req, reply, fastify)
  );
  fastify.patch(
    '/mentors/request/:id',
    { preHandler: [authenticate] },
    async (req, reply) => respondToSessionRequestHandler(req, reply, fastify)
  );
};

export default mentorRequestsRoutes;
