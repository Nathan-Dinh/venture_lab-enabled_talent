import 'fastify';
import type { JwtPayload } from './models.js';
import { SupabaseClient } from '@supabase/supabase-js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }

  interface FastifyInstance {
    supabase: SupabaseClient;
  }

  interface FastifyInstance {
    uow: UnitOfWork;
  }

  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireAuthority: (
      authority: string | string[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
