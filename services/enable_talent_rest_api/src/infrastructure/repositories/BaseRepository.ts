import { FastifyInstance } from 'fastify';

/**
 * Base Repository class providing common database operations
 * All repositories should extend this class
 */
export abstract class BaseRepository {
  constructor(protected fastify: FastifyInstance) {}

  /**
   * Get a database client from the pool
   */
  protected async getClient(): Promise<any> {
    return await this.fastify.pg.connect();
  }

  /**
   * Execute a query and release the client
   */
  protected async query<T = any>(
    text: string,
    params?: any[]
  ): Promise<{ rows: T[]; rowCount: number }> {
    const client = await this.getClient();
    try {
      const result = await client.query(text, params);
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0,
      };
    } finally {
      client.release();
    }
  }

  /**
   * Execute a query and return the first row
   */
  protected async queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
    const result = await this.query<T>(text, params);
    return result.rows[0] || null;
  }

  /**
   * Execute multiple queries in a transaction
   */
  protected async transaction<T>(
    callback: (client: any) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
