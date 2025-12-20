import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { getPricingHandler, updatePricingHandler } from '../controllers/pricingController.js';
import { authenticate } from '../middleware/authenticate.js';

const mentorPricingRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/mentors/pricing', { preHandler: [authenticate] }, async (req, reply) =>
    getPricingHandler(req, reply, fastify)
  );
  fastify.patch(
    '/mentors/pricing',
    { preHandler: [authenticate] },
    async (req, reply) => updatePricingHandler(req, reply, fastify)
  );
};

export default mentorPricingRoutes;
