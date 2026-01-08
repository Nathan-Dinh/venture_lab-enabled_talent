import { FastifyPluginAsync } from 'fastify';
import {
  addSkillHandler,
  getUserSkillsHandler,
  deleteSkillHandler,
  endorseSkillHandler,
} from '../controllers/skillController';
import { authenticate } from '../middleware/authenticate';

const skillRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/skills', { preHandler: [authenticate] }, getUserSkillsHandler);
  fastify.post('/skills', { preHandler: [authenticate] }, addSkillHandler);
  fastify.delete('/skills/:skillId', { preHandler: [authenticate] }, deleteSkillHandler);
  fastify.post('/skills/:skillId/endorse', { preHandler: [authenticate] }, endorseSkillHandler);
};

export default skillRoutes;
