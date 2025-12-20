import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  listMentorsHandler,
  getMentorHandler,
} from '../controllers/mentorController.js';

const mentorRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/mentors', async (req, reply) => listMentorsHandler(req, reply, fastify));
  fastify.get('/mentors/:id', async (req, reply) => getMentorHandler(req, reply, fastify));
};

export default fp(mentorRoutes);
