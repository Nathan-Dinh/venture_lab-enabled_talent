import 'dotenv/config';
import fastify, { FastifyInstance } from 'fastify';
import fastifyAutoload from '@fastify/autoload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { HttpError } from '@domain/types/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({ logger: true });

  // Global error handler
  app.setErrorHandler((error, _request, reply) => {
    app.log.error(error);

    if (error instanceof HttpError) {
      const response: { success: false; error: string; details?: unknown } = {
        success: false,
        error: error.message,
      };
      if (error.details) {
        response.details = error.details;
      }
      return reply.status(error.statusCode).send(response);
    }

    // Handle Fastify validation errors
    const fastifyError = error as { validation?: unknown };
    if (fastifyError.validation) {
      return reply.status(400).send({
        success: false,
        error: 'Validation failed',
        details: fastifyError.validation,
      });
    }

    // Default to 500 for unknown errors
    return reply.status(500).send({
      success: false,
      error: 'Internal server error',
    });
  });

  // Validate required environment variables
  const requiredEnvVars = [
    'SUPABASE_DATABASE_URL',
    'SUPABASE_PROJECT_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  // Load all plugins from the infrastructure/plugins directory
  await app.register(fastifyAutoload, {
    dir: join(__dirname, 'infrastructure', 'plugins'),
    options: {},
  });

  // Load all routes from the presentation/routes directory
  await app.register(fastifyAutoload, {
    dir: join(__dirname, 'presentation', 'routes'),
    options: { prefix: '/api' },
  });

  return app;
}

async function main(): Promise<void> {
  const app = await buildApp();

  try {
    const client = await app.pg.connect(); // get a client from the pool
    app.log.info('PostgreSQL connection successful');
    client.release();

    const address = await app.listen({ port: parseInt(process.env.PORT || '8005') });
    app.log.info(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
