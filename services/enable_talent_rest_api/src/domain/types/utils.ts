import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';

export type AsyncHandler = (
  req: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) => Promise<any>;
