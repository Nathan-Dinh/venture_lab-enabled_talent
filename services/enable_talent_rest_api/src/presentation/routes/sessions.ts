import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  listSessionsHandler,
  bookSessionHandler,
  updateSessionHandler,
  cancelSessionHandler,
} from '../controllers/sessionController.js';
import { authenticate } from '../middleware/authenticate.js';

const sessionRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/sessions', { preHandler: [authenticate] }, async (req, reply) =>
    listSessionsHandler(req, reply, fastify)
  );
  fastify.post('/sessions', { preHandler: [authenticate] }, async (req, reply) =>
    bookSessionHandler(req, reply, fastify)
  );
  fastify.patch('/sessions/:id', { preHandler: [authenticate] }, async (req, reply) =>
    updateSessionHandler(req, reply, fastify)
  );
  fastify.delete('/sessions/:id', { preHandler: [authenticate] }, async (req, reply) =>
    cancelSessionHandler(req, reply, fastify)
  );
};

export default sessionRoutes;
