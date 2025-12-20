import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  listConversationsHandler,
  createOrGetConversationHandler,
  getConversationWithMessagesHandler,
  sendMessageHandler,
  markMessageAsReadHandler,
} from '../controllers/messagingController.js';
import { authenticate } from '../middleware/authenticate.js';

const messagingRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Conversations
  fastify.get('/messaging/conversations', { preHandler: [authenticate] }, async (req, reply) =>
    listConversationsHandler(req, reply, fastify)
  );

  fastify.post('/messaging/conversations', { preHandler: [authenticate] }, async (req, reply) =>
    createOrGetConversationHandler(req, reply, fastify)
  );

  // Get conversation with messages
  fastify.get(
    '/messaging/conversations/:conversationId',
    { preHandler: [authenticate] },
    async (req, reply) => getConversationWithMessagesHandler(req, reply, fastify)
  );

  // Send message
  fastify.post(
    '/messaging/conversations/:conversationId/messages',
    { preHandler: [authenticate] },
    async (req, reply) => sendMessageHandler(req, reply, fastify)
  );

  // Mark message as read
  fastify.patch(
    '/messaging/messages/:messageId/read',
    { preHandler: [authenticate] },
    async (req, reply) => markMessageAsReadHandler(req, reply, fastify)
  );
};

export default messagingRoutes;
