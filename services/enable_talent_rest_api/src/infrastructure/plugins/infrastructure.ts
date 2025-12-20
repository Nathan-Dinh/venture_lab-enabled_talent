// src/plugins/infrastructure.ts
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyPostgres from '@fastify/postgres';

export default fp(async (fastify: FastifyInstance) => {
  const corsOrigin = (process.env.CORS_ORIGIN || 'http://localhost:7005').split(',');

  // Configure CORS
  fastify.register(fastifyCors, {
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  // Configure PostgreSQL connection
  fastify.register(fastifyPostgres, {
    connectionString: process.env.SUPABASE_DATABASE_URL,
  });
});
