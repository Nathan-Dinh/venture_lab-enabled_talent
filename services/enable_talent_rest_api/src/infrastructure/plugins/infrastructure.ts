// src/plugins/infrastructure.ts
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifyPostgres from '@fastify/postgres';

export default fp(async (fastify: FastifyInstance) => {
  const allowedIPs = process.env.ALLOWED_IPS?.split(',') || [
    '127.0.0.1',
    '::1',
    '::ffff:127.0.0.1',
  ];

  fastify.addHook('onRequest', async (request, reply) => {
    const clientIP = request.ip;
    if (!allowedIPs.includes(clientIP)) {
      fastify.log.warn(`Blocked request from unauthorized IP: ${clientIP}`);
      reply.code(403).send({ error: 'Forbidden' });
    }
  });

  fastify.register(fastifyPostgres, {
    connectionString: process.env.SUPABASE_DATABASE_URL,
  });
});
