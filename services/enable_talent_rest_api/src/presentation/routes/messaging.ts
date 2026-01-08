import { FastifyPluginAsync } from 'fastify';
import {
  listConversationsHandler,
  createOrGetConversationHandler,
  getConversationWithMessagesHandler,
  sendMessageHandler,
  markMessageAsReadHandler,
} from '../controllers/messagingController';
import { authenticate } from '../middleware/authenticate';

const messagingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/messaging/conversations', { preHandler: [authenticate] }, listConversationsHandler);
  fastify.post(
    '/messaging/conversations',
    { preHandler: [authenticate] },
    createOrGetConversationHandler
  );
  fastify.get(
    '/messaging/conversations/:conversationId',
    { preHandler: [authenticate] },
    getConversationWithMessagesHandler
  );
  fastify.post(
    '/messaging/conversations/:conversationId/messages',
    { preHandler: [authenticate] },
    sendMessageHandler
  );
  fastify.patch(
    '/messaging/messages/:messageId/read',
    { preHandler: [authenticate] },
    markMessageAsReadHandler
  );
};

export default messagingRoutes;
