import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  addSkillHandler,
  getUserSkillsHandler,
  deleteSkillHandler,
  endorseSkillHandler,
} from '../controllers/skillController.js';

const skillRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/skills', { preValidation: [fastify.authenticate] }, async (req, reply) =>
    getUserSkillsHandler(req, reply, fastify)
  );
  fastify.post('/skills', { preValidation: [fastify.authenticate] }, async (req, reply) =>
    addSkillHandler(req, reply, fastify)
  );
  fastify.delete('/skills/:skillId', { preValidation: [fastify.authenticate] }, async (req, reply) =>
    deleteSkillHandler(req, reply, fastify)
  );
  fastify.post(
    '/skills/:skillId/endorse',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => endorseSkillHandler(req, reply, fastify)
  );
};

export default skillRoutes;
