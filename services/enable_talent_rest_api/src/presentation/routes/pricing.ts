import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { getPricingHandler, updatePricingHandler } from '../controllers/pricingController.js';

const mentorPricingRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/mentors/pricing', { preValidation: [fastify.authenticate] }, async (req, reply) =>
    getPricingHandler(req, reply, fastify)
  );
  fastify.patch(
    '/mentors/pricing',
    { preValidation: [fastify.authenticate] },
    async (req, reply) => updatePricingHandler(req, reply, fastify)
  );
};

export default mentorPricingRoutes;
