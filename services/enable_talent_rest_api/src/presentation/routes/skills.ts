import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  addSkillHandler,
  getUserSkillsHandler,
  deleteSkillHandler,
  endorseSkillHandler,
} from '../controllers/skillController.js';
import { authenticate } from '../middleware/authenticate.js';

const skillRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/skills', { preHandler: [authenticate] }, async (req, reply) =>
    getUserSkillsHandler(req, reply, fastify)
  );
  fastify.post('/skills', { preHandler: [authenticate] }, async (req, reply) =>
    addSkillHandler(req, reply, fastify)
  );
  fastify.delete('/skills/:skillId', { preHandler: [authenticate] }, async (req, reply) =>
    deleteSkillHandler(req, reply, fastify)
  );
  fastify.post(
    '/skills/:skillId/endorse',
    { preHandler: [authenticate] },
    async (req, reply) => endorseSkillHandler(req, reply, fastify)
  );
};

export default skillRoutes;
