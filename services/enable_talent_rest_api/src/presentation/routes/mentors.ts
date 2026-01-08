import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { listMentorsHandler, getMentorHandler } from '../controllers/mentorController';

const mentorRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/mentors', listMentorsHandler);
  fastify.get('/mentors/:id', getMentorHandler);
};

export default fp(mentorRoutes);
