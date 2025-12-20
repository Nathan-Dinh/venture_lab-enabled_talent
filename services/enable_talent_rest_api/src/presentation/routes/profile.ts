import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  getProfileHandler,
  updateProfileHandler,
  deleteAccountHandler,
} from '../controllers/profileController.js';

const profileRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/profile', { preValidation: [fastify.authenticate] }, async (req, reply) =>
    getProfileHandler(req, reply, fastify)
  );
  fastify.patch('/profile', { preValidation: [fastify.authenticate] }, async (req, reply) =>
    updateProfileHandler(req, reply, fastify)
  );
  fastify.delete('/profile', { preValidation: [fastify.authenticate] }, async (req, reply) =>
    deleteAccountHandler(req, reply, fastify)
  );
};

export default fp(profileRoutes);
