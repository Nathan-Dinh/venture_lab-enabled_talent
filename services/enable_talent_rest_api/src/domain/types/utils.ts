import { FastifyReply, FastifyRequest, FastifyInstance, RouteGenericInterface } from 'fastify';

export type AsyncHandler<T extends RouteGenericInterface = RouteGenericInterface> = (
  req: FastifyRequest<T>,
  reply: FastifyReply,
  fastify: FastifyInstance
) => Promise<any>;
