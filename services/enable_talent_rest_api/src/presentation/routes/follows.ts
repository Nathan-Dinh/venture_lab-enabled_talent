import { FastifyPluginAsync } from 'fastify';
import {
  getFollowedMentorsHandler,
  followMentorHandler,
  unfollowMentorHandler,
} from '../controllers/followController';
import { authenticate } from '../middleware/authenticate';

const followRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/follows', { preHandler: [authenticate] }, async (req, reply) =>
    getFollowedMentorsHandler(req, reply, fastify)
  );
  fastify.post(
    '/follows/:mentorId',
    { preHandler: [authenticate] },
    async (req, reply) => followMentorHandler(req, reply, fastify)
  );
  fastify.delete(
    '/follows/:mentorId',
    { preHandler: [authenticate] },
    async (req, reply) => unfollowMentorHandler(req, reply, fastify)
  );
};

export default followRoutes;
