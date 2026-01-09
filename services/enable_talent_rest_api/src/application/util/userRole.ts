import type { FastifyInstance } from 'fastify';
import { HttpError } from '@domain/types/errors';

export async function assignUserRole(fastify: FastifyInstance, userId: string): Promise<void> {
  const { error } = await fastify.supabase.rpc('assign_user_role', { p_user_id: userId });

  if (error) {
    throw HttpError.internal(`Failed to assign user role: ${error.message}`);
  }
}

export async function assignMentorRole(fastify: FastifyInstance, userId: string): Promise<void> {
  const { error } = await fastify.supabase.rpc('assign_mentor_role', { p_user_id: userId });

  if (error) {
    throw HttpError.internal(`Failed to assign mentor role: ${error.message}`);
  }
}
