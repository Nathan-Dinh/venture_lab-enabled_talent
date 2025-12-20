import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  listConversationsHandler,
  createOrGetConversationHandler,
  getConversationWithMessagesHandler,
  sendMessageHandler,
  markMessageAsReadHandler,
} from '../controllers/messagingController.js';

const messagingRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Conversations
  fastify.get('/messaging/conversations', { preValidation: [fastify.authenticate] }, async (req, reply) =>
    listConversationsHandler(req, reply, fastify)
  );

  fastify.post('/messaging/conversations', { preValidation: [fastify.authenticate] }, async (req, reply) =>
    createOrGetConversationHandler(req, reply, fastify)
  );

  // Get conversation with messages
  fastify.get(
    '/messaging/conversations/:conversationId',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => getConversationWithMessagesHandler(req, reply, fastify)
  );

  // Send message
  fastify.post(
    '/messaging/conversations/:conversationId/messages',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => sendMessageHandler(req, reply, fastify)
  );

  // Mark message as read
  fastify.patch(
    '/messaging/messages/:messageId/read',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => markMessageAsReadHandler(req, reply, fastify)
  );
};

export default messagingRoutes;
