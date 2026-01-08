import { FastifyReply, FastifyRequest } from 'fastify';
import { UserRole } from '../../domain/types/models';

/**
 * Authorization Middleware (Functional)
 * Checks user roles and permissions
 */

/**
 * Require specific role(s) middleware factory
 * Returns a middleware function that checks if user has required role
 */
export function requireRole(...roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user;

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const userRole = user.role as UserRole;

    if (!userRole || !roles.includes(userRole as UserRole)) {
      return reply.status(403).send({
        success: false,
        error: 'Forbidden',
        message: `Access denied. Required role(s): ${roles.join(', ')}`,
      });
    }
  };
}

/**
 * Require mentor role middleware
 */
export const requireMentor = requireRole(UserRole.MENTOR);

/**
 * Require user role middleware
 */
export const requireUser = requireRole(UserRole.USER);

/**
 * Require mentor verification middleware
 * Checks both role AND database to ensure user is actually a mentor
 */
export async function requireVerifiedMentor(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const user = request.user;

  if (!user) {
    return reply.status(401).send({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  // Check role first (quick check)
  if (user.role !== UserRole.MENTOR) {
    return reply.status(403).send({
      success: false,
      error: 'Forbidden',
      message: 'Access denied. Mentor role required',
    });
  }

  // Verify in database (authoritative check)
  const isVerified = await request.server.uow.mentorRepository.isMentor(user.user_id);

  if (!isVerified) {
    return reply.status(403).send({
      success: false,
      error: 'Forbidden',
      message: 'Access denied. Verified mentor status required',
    });
  }
}

/**
 * Require resource ownership middleware factory
 * Checks if authenticated user owns the resource
 */
export function requireOwnership(userIdParam: string = 'id') {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = request.user;

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const params = request.params as Record<string, string>;
    const resourceUserId = params[userIdParam];

    if (resourceUserId && resourceUserId !== user.user_id) {
      return reply.status(403).send({
        success: false,
        error: 'Forbidden',
        message: 'Access denied. You can only access your own resources',
      });
    }
  };
}
