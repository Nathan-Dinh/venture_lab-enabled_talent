import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { UnitOfWork } from '@infrastructure/unitOfWork/unitOfWork';

declare module 'fastify' {
  interface FastifyInstance {
    uow: UnitOfWork;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const uow = new UnitOfWork(fastify);
  fastify.decorate('uow', uow);
});
