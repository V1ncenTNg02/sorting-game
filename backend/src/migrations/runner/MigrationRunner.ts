import fs from 'fs/promises';
import path from 'path';
import { IDatabaseConnection } from '../../config/IDatabase';
import { IMigrationRepository } from './IMigrationRepository';
import { IMigrationRunner } from './IMigrationRunner';

const MIGRATIONS_DIR = path.join(process.cwd(), 'migrations');

export class MigrationRunner implements IMigrationRunner {
  constructor(
    private readonly db: IDatabaseConnection,
    private readonly repository: IMigrationRepository
  ) {}

  async runPending(): Promise<void> {
    await this.repository.ensureTrackerTable();

    const applied = await this.repository.getApplied();
    const files = await this.loadMigrationFiles();
    const pending = files.filter((f) => !applied.includes(f));

    if (pending.length === 0) {
      console.log('No pending migrations.');
      return;
    }

    for (const filename of pending) {
      await this.applyMigration(filename);
      console.log(`Migration applied: ${filename}`);
    }
  }

  private async loadMigrationFiles(): Promise<string[]> {
    const entries = await fs.readdir(MIGRATIONS_DIR);
    return entries.filter((f) => f.endsWith('.sql')).sort();
  }

  private async applyMigration(filename: string): Promise<void> {
    const sql = await fs.readFile(path.join(MIGRATIONS_DIR, filename), 'utf-8');
    await this.db.query(sql);
    await this.repository.record(filename);
  }
}
