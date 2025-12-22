// src/plugins/supabase.ts
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { createClient } from '@supabase/supabase-js';

export default fp(async (fastify: FastifyInstance) => {
  const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey)
    throw new Error('SUPABASE_PROJECT_URL and SUPABASE_SERVICE_ROLE_KEY must be set');

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  fastify.decorate('supabase', supabase);
  fastify.log.info('Supabase client initialized');
});
