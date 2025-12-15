import 'dotenv/config';
import fastify, { FastifyInstance } from 'fastify';
import fastifyAutoload from '@fastify/autoload';
import fastifyCors from '@fastify/cors';
import fastifySession from '@fastify/session';
import fastifyCookie from '@fastify/cookie';
import fastifyPostgres from '@fastify/postgres';
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
  const requiredEnvVars = ['DATABASE_URL', 'COOKIE_SECRET', 'SESSION_SECRET', 'JWT_SECRET'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  const corsOrigin = (process.env.CORS_ORIGIN || 'http://localhost:7005').split(',');
  const isProduction = process.env.NODE_ENV === 'production';
  const sessionSecret = process.env.SESSION_SECRET!;
  const cookieSecret = process.env.COOKIE_SECRET!;

  // Configure CORS
  app.register(fastifyCors, {
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow sending cookies
  });

  // Configure cookie parser
  app.register(fastifyCookie, {
    secret: cookieSecret,
    parseOptions: {}, // cookie.parse options
  });

  // Configure session management
  app.register(fastifySession, {
    secret: sessionSecret,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 86400000,
    },
  });

  // Configure PostgreSQL connection
  app.register(fastifyPostgres, {
    connectionString: process.env.DATABASE_URL,
  });

  // Load all plugins from the plugins directory
  await app.register(fastifyAutoload, {
    dir: join(__dirname, 'plugins'),
    options: {},
  });

  // Load all routes from the routes directory
  await app.register(fastifyAutoload, {
    dir: join(__dirname, 'routes'),
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
