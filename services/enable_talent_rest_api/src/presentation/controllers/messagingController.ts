import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';
import { Message, Conversation, ConversationWithMessages, User } from '../../domain/types/models.js';
import { withErrorHandler } from '../../application/utils/errorHandler.js';

/**
 * List user conversations
 * GET /api/messaging/conversations
 * Requires authentication
 */
async function listConversationsHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user! as User;
  const pg = fastify.pg;

  const result = await pg.query(
    `SELECT DISTINCT c.conversation_id, c.created_at, c.updated_at,
            u.user_id as other_user_id, u.name as other_user_name,
            u.profile_image_url as other_user_image,
            (SELECT message_text FROM messages WHERE conversation_id = c.conversation_id
             ORDER BY sent_at DESC LIMIT 1) as last_message,
            (SELECT sent_at FROM messages WHERE conversation_id = c.conversation_id
             ORDER BY sent_at DESC LIMIT 1) as last_message_at
     FROM conversation c
     INNER JOIN conversation_member cm ON c.conversation_id = cm.conversation_id
     INNER JOIN users u ON (
       (SELECT user_id FROM conversation_member WHERE conversation_id = c.conversation_id
        AND user_id != $1 LIMIT 1) = u.user_id
     )
     WHERE cm.user_id = $1
     ORDER BY c.updated_at DESC`,
    [user.user_id]
  );

  return reply.send({
    success: true,
    data: result.rows,
  });
}

export const listConversationsHandler = withErrorHandler(listConversationsHandlerImpl);

/**
 * Get or create conversation with another user
 * POST /api/messaging/conversations
 * Requires authentication
 */
export async function createOrGetConversationHandler(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  try {
    const user = req.user! as User;
    const pg = fastify.pg;
    const { other_user_id } = req.body as any;

    if (!other_user_id) {
      return reply.status(400).send({
        success: false,
        error: 'other_user_id is required',
      });
    }

    // Check if conversation already exists
    const existingResult = await pg.query(
      `SELECT c.conversation_id FROM conversation c
       INNER JOIN conversation_member cm1 ON c.conversation_id = cm1.conversation_id
       INNER JOIN conversation_member cm2 ON c.conversation_id = cm2.conversation_id
       WHERE cm1.user_id = $1 AND cm2.user_id = $2`,
      [user.user_id, other_user_id]
    );

    let conversationId: string;

    if (existingResult.rows.length > 0) {
      conversationId = existingResult.rows[0].conversation_id;
    } else {
      // Create new conversation
      const createResult = await pg.query(
        `INSERT INTO conversation (created_at, updated_at) VALUES (NOW(), NOW())
         RETURNING conversation_id`,
        []
      );

      conversationId = createResult.rows[0].conversation_id;

      // Add both users as members
      await Promise.all([
        pg.query(
          `INSERT INTO conversation_member (conversation_id, user_id, role, joined_at)
           VALUES ($1, $2, $3, NOW())`,
          [conversationId, user.user_id, 'member']
        ),
        pg.query(
          `INSERT INTO conversation_member (conversation_id, user_id, role, joined_at)
           VALUES ($1, $2, $3, NOW())`,
          [conversationId, other_user_id, 'member']
        ),
      ]);
    }

    return reply.send({
      success: true,
      data: { conversation_id: conversationId },
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Get conversation with messages
 * GET /api/messaging/conversations/:conversationId
 * Requires authentication
 */
export async function getConversationWithMessagesHandler(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  try {
    const user = req.user! as User;
    const pg = fastify.pg;
    const { conversationId } = req.params as any;
    const { limit = 50, offset = 0 } = req.query as any;

    // Check if user is member of conversation
    const memberCheck = await pg.query(
      `SELECT member_id FROM conversation_member WHERE conversation_id = $1 AND user_id = $2`,
      [conversationId, user.user_id]
    );

    if (memberCheck.rows.length === 0) {
      return reply.status(403).send({
        success: false,
        error: 'Not a member of this conversation',
      });
    }

    // Get messages
    const messagesResult = await pg.query(
      `SELECT message_id, conversation_id, sender_id, message_text, sent_at, is_read,
              u.name as sender_name, u.profile_image_url as sender_image
       FROM messages m
       INNER JOIN users u ON m.sender_id = u.user_id
       WHERE m.conversation_id = $1
       ORDER BY m.sent_at DESC
       LIMIT $2 OFFSET $3`,
      [conversationId, limit, offset]
    );

    // Get conversation members
    const membersResult = await pg.query(
      `SELECT cm.member_id, cm.user_id, cm.role, cm.joined_at,
              u.name, u.profile_image_url
       FROM conversation_member cm
       INNER JOIN users u ON cm.user_id = u.user_id
       WHERE cm.conversation_id = $1`,
      [conversationId]
    );

    const response: ConversationWithMessages = {
      conversation_id: conversationId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      members: membersResult.rows.map((row: any) => ({
        member_id: row.member_id,
        conversation_id: conversationId,
        user_id: row.user_id,
        role: row.role,
        joined_at: row.joined_at,
      })),
      messages: messagesResult.rows.map((row: any) => ({
        message_id: row.message_id,
        conversation_id: row.conversation_id,
        sender_id: row.sender_id,
        message_text: row.message_text,
        sent_at: row.sent_at,
        is_read: row.is_read,
      })),
    };

    return reply.send({
      success: true,
      data: response,
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Send message
 * POST /api/messaging/conversations/:conversationId/messages
 * Requires authentication
 */
export async function sendMessageHandler(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  try {
    const user = req.user! as User;
    const pg = fastify.pg;
    const { conversationId } = req.params as any;
    const { message_text } = req.body as any;

    if (!message_text || message_text.trim() === '') {
      return reply.status(400).send({
        success: false,
        error: 'message_text is required',
      });
    }

    // Verify user is member of conversation
    const memberCheck = await pg.query(
      `SELECT member_id FROM conversation_member WHERE conversation_id = $1 AND user_id = $2`,
      [conversationId, user.user_id]
    );

    if (memberCheck.rows.length === 0) {
      return reply.status(403).send({
        success: false,
        error: 'Not a member of this conversation',
      });
    }

    // Insert message
    const result = await pg.query(
      `INSERT INTO messages (conversation_id, sender_id, message_text, sent_at, is_read)
       VALUES ($1, $2, $3, NOW(), false)
       RETURNING message_id, conversation_id, sender_id, message_text, sent_at, is_read`,
      [conversationId, user.user_id, message_text.trim()]
    );

    // Update conversation updated_at
    await pg.query(
      `UPDATE conversation SET updated_at = NOW() WHERE conversation_id = $1`,
      [conversationId]
    );

    const message: Message = {
      message_id: result.rows[0].message_id,
      conversation_id: result.rows[0].conversation_id,
      sender_id: result.rows[0].sender_id,
      message_text: result.rows[0].message_text,
      sent_at: result.rows[0].sent_at,
      is_read: result.rows[0].is_read,
    };

    return reply.status(201).send({
      success: true,
      data: message,
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
    });
  }
}

/**
 * Mark message as read
 * PATCH /api/messaging/messages/:messageId/read
 * Requires authentication
 */
export async function markMessageAsReadHandler(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  try {
    const user = req.user! as User;
    const pg = fastify.pg;
    const { messageId } = req.params as any;

    // Verify message exists and user can access it
    const messageCheck = await pg.query(
      `SELECT m.message_id FROM messages m
       INNER JOIN conversation_member cm ON m.conversation_id = cm.conversation_id
       WHERE m.message_id = $1 AND cm.user_id = $2`,
      [messageId, user.user_id]
    );

    if (messageCheck.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: 'Message not found',
      });
    }

    // Mark as read
    await pg.query(`UPDATE messages SET is_read = true WHERE message_id = $1`, [messageId]);

    return reply.send({
      success: true,
      message: 'Message marked as read',
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
    });
  }
}
