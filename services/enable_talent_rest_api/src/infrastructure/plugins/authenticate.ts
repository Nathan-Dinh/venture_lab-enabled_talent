// src/infrastructure/plugins/authenticate.ts
import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { JwtPayload } from '../../domain/types/models.js';

export default fp(async (fastify: FastifyInstance) => {
  const supabaseProjectUrl = process.env.SUPABASE_PROJECT_URL || '';

  if (!supabaseProjectUrl) throw new Error('SUPABASE_PROJECT_URL environment variable is required');

  // Extract project reference from Supabase URL (e.g., https://abcdefgh.supabase.co -> abcdefgh)
  const projectRef = supabaseProjectUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1];

  if (!projectRef) throw new Error('Invalid SUPABASE_PROJECT_URL format');

  // Create JWKS instance for JWT verification
  const JWKS = createRemoteJWKSet(new URL(`https://${projectRef}.supabase.co/auth/v1/jwks`));

  // Helper: Extract Bearer token from Authorization header
  function extractBearerToken(request: FastifyRequest): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  // Helper: Verify JWT token using JWKS
  async function verifyToken(token: string): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ['RS256'],
    });
    return payload as unknown as JwtPayload;
  }

  // Helper: Normalize payload to ensure user_id is set
  function normalizePayload(payload: JwtPayload): JwtPayload {
    return {
      ...payload,
      user_id: payload.sub || payload.user_id,
    };
  }

  // Decorator: Authenticate user from JWT token
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = extractBearerToken(request);
      if (!token) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Missing or invalid Authorization header',
        });
      }

      const payload = await verifyToken(token);
      request.user = normalizePayload(payload);
    } catch (err) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }
  });

  // Decorator: Require specific role(s) for authorization
  fastify.decorate('requireAuthority', function (authority: string | string[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token = extractBearerToken(request);
        if (!token) {
          return reply.status(401).send({
            error: 'Unauthorized',
            message: 'Missing or invalid Authorization header',
          });
        }

        const payload = await verifyToken(token);
        const user = normalizePayload(payload);
        request.user = user;

        // Check if user has the required authority/role
        const requiredAuthorities = Array.isArray(authority) ? authority : [authority];
        const userRole = user.role;

        if (!userRole || !requiredAuthorities.includes(userRole)) {
          return reply.status(403).send({
            error: 'Forbidden',
            message: `Access denied. Required role(s): ${requiredAuthorities.join(', ')}`,
          });
        }
      } catch (err) {
        return reply.status(401).send({
          error: 'Unauthorized',
          message: 'Invalid or expired token',
        });
      }
    };
  });
});
