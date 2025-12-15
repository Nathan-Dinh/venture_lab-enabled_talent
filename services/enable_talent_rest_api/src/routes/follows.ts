import { FastifyPluginAsync } from 'fastify';
import {
  getFollowedMentorsHandler,
  followMentorHandler,
  unfollowMentorHandler,
} from '../controllers/followController.js';

const followRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/follows', { preValidation: [fastify.authenticate] }, async (req, reply) =>
    getFollowedMentorsHandler(req, reply, fastify)
  );
  fastify.post(
    '/follows/:mentorId',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => followMentorHandler(req, reply, fastify)
  );
  fastify.delete(
    '/follows/:mentorId',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => unfollowMentorHandler(req, reply, fastify)
  );
};

export default followRoutes;
