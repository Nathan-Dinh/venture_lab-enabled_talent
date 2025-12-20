import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';
import { Availability, AvailabilityStatus, User } from '../../domain/types/models.js';
import { withErrorHandler } from '../../application/utils/errorHandler.js';

/**
 * Get mentor availability schedule
 * GET /api/mentors/availability
 * Requires authentication (mentor only)
 */
async function getAvailabilityHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user! as User;
  const pg = fastify.pg;

  const result = await pg.query(
    `SELECT availability_id, day_of_week, start_time, end_time, timezone, status
     FROM user_availability
     WHERE user_id = $1
     ORDER BY day_of_week ASC`,
    [user.user_id]
  );

  const availability: Availability[] = result.rows.map((row: any) => ({
    availability_id: row.availability_id,
    user_id: user.user_id,
    day_of_week: row.day_of_week,
    start_time: row.start_time,
    end_time: row.end_time,
    timezone: row.timezone,
    status: row.status,
  }));

  return reply.send({
    success: true,
    data: availability,
  });
}

export const getAvailabilityHandler = withErrorHandler(getAvailabilityHandlerImpl);

/**
 * Update mentor availability schedule
 * PATCH /api/mentors/availability
 * Requires authentication (mentor only)
 */
async function updateAvailabilityHandlerImpl(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  const user = req.user! as User;
  const pg = fastify.pg;
  const { availability, timezone } = req.body as any;

  if (!Array.isArray(availability)) {
    return reply.status(400).send({
      success: false,
      error: 'availability must be an array',
    });
  }

  // Delete existing availability for this user
  await pg.query(`DELETE FROM user_availability WHERE user_id = $1`, [user.user_id]);

  // Insert new availability slots
  const insertPromises = availability.map((slot: any) => {
    return pg.query(
      `INSERT INTO user_availability (user_id, day_of_week, start_time, end_time, timezone, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [user.user_id, slot.day_of_week, slot.start_time, slot.end_time, timezone || slot.timezone, slot.status]
    );
  });

  await Promise.all(insertPromises);

  // Fetch updated availability
  const result = await pg.query(
    `SELECT availability_id, day_of_week, start_time, end_time, timezone, status
     FROM user_availability
     WHERE user_id = $1
     ORDER BY day_of_week ASC`,
    [user.user_id]
  );

  const updatedAvailability: Availability[] = result.rows.map((row: any) => ({
    availability_id: row.availability_id,
    user_id: user.user_id,
    day_of_week: row.day_of_week,
    start_time: row.start_time,
    end_time: row.end_time,
    timezone: row.timezone,
    status: row.status,
  }));

  return reply.send({
    success: true,
    data: updatedAvailability,
    message: 'Availability updated successfully',
  });
}

export const updateAvailabilityHandler = withErrorHandler(updateAvailabilityHandlerImpl);
