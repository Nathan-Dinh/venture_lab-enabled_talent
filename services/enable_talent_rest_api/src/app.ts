import 'dotenv/config';
import fastify, { FastifyInstance } from 'fastify';
import fastifyAutoload from '@fastify/autoload';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Builds and configures the Fastify application.
 *
 * @return {Promise<FastifyInstance>} The configured Fastify application.
 */
async function buildApp(): Promise<FastifyInstance> {
  const app = fastify({ logger: true });

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

/**
 * Main function to start the server.
 * @return {Promise<void>}
 */
async function main(): Promise<void> {
  const app = await buildApp();

  try {
    const client = await app.pg.connect(); // get a client from the pool
    app.log.info('PostgreSQL connection successful');
    client.release(); // release back to pool

    const address = await app.listen({ port: parseInt(process.env.PORT || '8005') });
    app.log.info(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
