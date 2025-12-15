import { FastifyReply, FastifyInstance } from 'fastify';
import { FastifyRequest } from 'fastify/types/request.js';
import { UserPricing, PricingTier, UpdatePricingRequest, User } from '../types/models.js';

/**
 * Get mentor pricing information
 * GET /api/mentors/pricing
 * Requires authentication (mentor only)
 */
export async function getPricingHandler(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  try {
    const user = req.user! as User;
    const pg = fastify.pg;

    // Get base pricing
    const pricingResult = await pg.query(
      `SELECT user_id, hourly_rate, currency
       FROM user_pricing
       WHERE user_id = $1`,
      [user.user_id]
    );

    if (pricingResult.rows.length === 0) {
      return reply.status(404).send({
        success: false,
        error: 'Pricing not found',
      });
    }

    const pricingData = pricingResult.rows[0];

    // Get pricing tiers
    const tiersResult = await pg.query(
      `SELECT pricing_id, tier_name, duration_minutes, rate, description
       FROM user_pricing_tiers
       WHERE user_id = $1
       ORDER BY duration_minutes ASC`,
      [user.user_id]
    );

    const response: UserPricing = {
      user_id: pricingData.user_id,
      hourly_rate: pricingData.hourly_rate,
      currency: pricingData.currency || 'USD',
      tiers: tiersResult.rows.map((row: any) => ({
        pricing_id: row.pricing_id,
        user_id: user.user_id,
        tier_name: row.tier_name,
        duration_minutes: row.duration_minutes,
        rate: row.rate,
        description: row.description,
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
 * Update mentor pricing information
 * PATCH /api/mentors/pricing
 * Requires authentication (mentor only)
 */
export async function updatePricingHandler(
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  try {
    const user = req.user! as User;
    const pg = fastify.pg;
    const { hourly_rate, tiers, currency } = req.body as UpdatePricingRequest;

    // Update base hourly rate
    if (hourly_rate !== undefined) {
      await pg.query(
        `UPDATE user_pricing SET hourly_rate = $1, currency = $2 WHERE user_id = $3`,
        [hourly_rate, currency || 'USD', user.user_id]
      );
    }

    // Update pricing tiers if provided
    if (tiers && Array.isArray(tiers)) {
      // Delete existing tiers
      await pg.query(`DELETE FROM user_pricing_tiers WHERE user_id = $1`, [user.user_id]);

      // Insert new tiers
      const insertPromises = tiers.map((tier: any) => {
        return pg.query(
          `INSERT INTO user_pricing_tiers (user_id, tier_name, duration_minutes, rate, description)
           VALUES ($1, $2, $3, $4, $5)`,
          [user.user_id, tier.tier_name, tier.duration_minutes, tier.rate, tier.description]
        );
      });

      await Promise.all(insertPromises);
    }

    // Fetch updated pricing
    const pricingResult = await pg.query(
      `SELECT user_id, hourly_rate, currency
       FROM user_pricing
       WHERE user_id = $1`,
      [user.user_id]
    );

    const pricingData = pricingResult.rows[0];

    const tiersResult = await pg.query(
      `SELECT pricing_id, tier_name, duration_minutes, rate, description
       FROM user_pricing_tiers
       WHERE user_id = $1
       ORDER BY duration_minutes ASC`,
      [user.user_id]
    );

    const response: UserPricing = {
      user_id: pricingData.user_id,
      hourly_rate: pricingData.hourly_rate,
      currency: pricingData.currency || 'USD',
      tiers: tiersResult.rows.map((row: any) => ({
        pricing_id: row.pricing_id,
        user_id: user.user_id,
        tier_name: row.tier_name,
        duration_minutes: row.duration_minutes,
        rate: row.rate,
        description: row.description,
      })),
    };

    return reply.send({
      success: true,
      data: response,
      message: 'Pricing updated successfully',
    });
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
    });
  }
}
