import { FastifyReply, FastifyRequest } from 'fastify';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { JwtPayload } from '../../domain/types/models';

/**
 * Authentication Middleware (Functional)
 * Verifies JWT tokens and attaches user to request
 */

// Cache JWKS instance (created once per server start)
let jwksCache: ReturnType<typeof createRemoteJWKSet> | null = null;

/**
 * Initialize JWKS for JWT verification
 */
function getJWKS(): ReturnType<typeof createRemoteJWKSet> {
  if (jwksCache) return jwksCache;

  const supabaseProjectUrl = process.env.SUPABASE_PROJECT_URL || '';
  if (!supabaseProjectUrl) {
    throw new Error('SUPABASE_PROJECT_URL environment variable is required');
  }

  const projectRef = supabaseProjectUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (!projectRef) {
    throw new Error('Invalid SUPABASE_PROJECT_URL format');
  }

  jwksCache = createRemoteJWKSet(new URL(`https://${projectRef}.supabase.co/auth/v1/jwks`));
  return jwksCache;
}

/**
 * Extract Bearer token from Authorization header
 */
function extractBearerToken(request: FastifyRequest): string | null {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Verify JWT token using JWKS
 */
async function verifyToken(token: string): Promise<JwtPayload> {
  const JWKS = getJWKS();
  const { payload } = await jwtVerify(token, JWKS, {
    algorithms: ['RS256'],
  });
  return payload as unknown as JwtPayload;
}

/**
 * Normalize payload to ensure user_id is set
 */
function normalizePayload(payload: JwtPayload): JwtPayload {
  return {
    ...payload,
    user_id: payload.sub || payload.user_id,
  };
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const token = extractBearerToken(request);

    if (!token) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header',
      });
    }

    const payload = await verifyToken(token);
    request.user = normalizePayload(payload);
  } catch (err) {
    return reply.status(401).send({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
}

/**
 * Optional authentication middleware
 * Tries to authenticate but doesn't fail if no token
 */
export async function optionalAuthenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const token = extractBearerToken(request);

    if (token) {
      const payload = await verifyToken(token);
      request.user = normalizePayload(payload);
    }
  } catch (err) {
    // Silently ignore authentication errors for optional auth
    request.user = undefined;
  }
}
