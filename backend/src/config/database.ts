import { Pool, QueryResult } from 'pg';
import { IDatabaseConnection } from './IDatabase';

export class DatabaseConnection implements IDatabaseConnection {
  private static instance: DatabaseConnection;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async query(text: string, params?: unknown[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
