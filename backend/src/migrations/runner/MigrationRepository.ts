import { IDatabaseConnection } from '../../config/IDatabase';
import { IMigrationRepository } from './IMigrationRepository';

export class MigrationRepository implements IMigrationRepository {
  constructor(private readonly db: IDatabaseConnection) {}

  async ensureTrackerTable(): Promise<void> {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename    TEXT        PRIMARY KEY,
        applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  }

  async getApplied(): Promise<string[]> {
    const result = await this.db.query(
      'SELECT filename FROM schema_migrations ORDER BY applied_at ASC'
    );
    return result.rows.map((row: { filename: string }) => row.filename);
  }

  async record(filename: string): Promise<void> {
    await this.db.query(
      'INSERT INTO schema_migrations (filename) VALUES ($1)',
      [filename]
    );
  }
}
