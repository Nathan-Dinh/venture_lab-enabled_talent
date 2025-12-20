import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';
import { Session, SessionStatus, User } from '../../domain/types/models.js';

/**
 * List user sessions
 * GET /api/sessions
 * Requires authentication
 */
export async function listSessionsHandler(req: FastifyRequest, reply: FastifyReply, fastify: FastifyInstance) {
  try {
    const user = req.user! as User;
    const pg = fastify.pg;

    const result = await pg.query(
      `SELECT s.session_id, s.booking_id, s.start_time, s.end_time, s.session_status,
              s.mentor_id, s.customer_id, s.notes,
              m.name as mentor_name, m.profile_image_url as mentor_image,
              c.name as customer_name, c.profile_image_url as customer_image
       FROM session s
       LEFT JOIN users m ON s.mentor_id = m.user_id
       LEFT JOIN users c ON s.customer_id = c.user_id
       WHERE s.mentor_id = $1 OR s.customer_id = $1
       ORDER BY s.start_time DESC`,
      [user.user_id]
    );

    const sessions = result.rows.map((row: any) => ({
      session_id: row.session_id,
      booking_id: row.booking_id,
      start_time: row.start_time,
      end_time: row.end_time,
      session_status: row.session_status,
      notes: row.notes,
      mentor_id: row.mentor_id,
      customer_id: row.customer_id,
      mentor_name: row.mentor_name,
      mentor_image: row.mentor_image,
      customer_name: row.customer_name,
      customer_image: row.customer_image,
    }));

    return reply.send({
      success: true,
      data: sessions,
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
 * Book a session
 * POST /api/sessions
 * Requires authentication
 */
export async function bookSessionHandler(req: FastifyRequest, reply: FastifyReply, fastify: FastifyInstance) {
  try {
    const user = req.user!;
    const pg = fastify.pg;
    const { mentor_id, start_time, end_time, tier_id } = req.body as any;

    if (!mentor_id || !start_time || !end_time) {
      return reply.status(400).send({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Create booking
    const bookingResult = await pg.query(
      `INSERT INTO user_booking (customer_id, mentor_id, booking_time, status)
       VALUES ($1, $2, NOW(), $3)
       RETURNING booking_id`,
      [user.user_id, mentor_id, SessionStatus.PENDING]
    );

    const bookingId = bookingResult.rows[0].booking_id;

    // Create session
    const sessionResult = await pg.query(
      `INSERT INTO session (booking_id, start_time, end_time, session_status, mentor_id, customer_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING session_id, booking_id, start_time, end_time, session_status, mentor_id, customer_id`,
      [bookingId, start_time, end_time, SessionStatus.PENDING, mentor_id, user.user_id]
    );

    const session: Session = {
      session_id: sessionResult.rows[0].session_id,
      booking_id: sessionResult.rows[0].booking_id,
      start_time: sessionResult.rows[0].start_time,
      end_time: sessionResult.rows[0].end_time,
      session_status: sessionResult.rows[0].session_status,
      mentor_id: sessionResult.rows[0].mentor_id,
      customer_id: sessionResult.rows[0].customer_id,
    };

    return reply.status(201).send({
      success: true,
      data: session,
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
 * Update session status
 * PATCH /api/sessions/:id
 * Requires authentication
 */
export async function updateSessionHandler(req: FastifyRequest, reply: FastifyReply, fastify: FastifyInstance) {
  try {
    const user = req.user!;
    const pg = fastify.pg;
    const { id } = req.params as any;
    const { session_status, notes } = req.body as any;

    if (!session_status) {
      return reply.status(400).send({
        success: false,
        error: 'Missing session_status field',
      });
    }

    // Verify user has permission to update
    const checkResult = await pg.query(
      `SELECT session_id FROM session WHERE session_id = $1 AND (mentor_id = $2 OR customer_id = $2)`,
      [id, user.user_id]
    );

    if (checkResult.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: 'Session not found',
      });
    }

    const updateFields: string[] = [`session_status = $2`];
    const params: any[] = [id, session_status];

    if (notes) {
      updateFields.push(`notes = $3`);
      params.push(notes);
    }

    const result = await pg.query(
      `UPDATE session SET ${updateFields.join(', ')} WHERE session_id = $1 RETURNING *`,
      params
    );

    const session: Session = {
      session_id: result.rows[0].session_id,
      booking_id: result.rows[0].booking_id,
      start_time: result.rows[0].start_time,
      end_time: result.rows[0].end_time,
      session_status: result.rows[0].session_status,
      mentor_id: result.rows[0].mentor_id,
      customer_id: result.rows[0].customer_id,
      notes: result.rows[0].notes,
    };

    return reply.send({
      success: true,
      data: session,
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
 * Cancel session
 * DELETE /api/sessions/:id
 * Requires authentication
 */
export async function cancelSessionHandler(req: FastifyRequest, reply: FastifyReply, fastify: FastifyInstance) {
  try {
    const user = req.user!;
    const pg = fastify.pg;
    const { id } = req.params as any;

    // Verify user has permission
    const checkResult = await pg.query(
      `SELECT session_id FROM session WHERE session_id = $1 AND (mentor_id = $2 OR customer_id = $2)`,
      [id, user.user_id]
    );

    if (checkResult.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: 'Session not found',
      });
    }

    await pg.query(
      `UPDATE session SET session_status = $1 WHERE session_id = $2`,
      [SessionStatus.CANCELLED, id]
    );

    return reply.send({
      success: true,
      message: 'Session cancelled successfully',
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
    });
  }
}
