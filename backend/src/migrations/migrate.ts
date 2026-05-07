import 'dotenv/config';
import { DatabaseConnection } from '../config/database';
import { MigrationRepository } from './runner/MigrationRepository';
import { MigrationRunner } from './runner/MigrationRunner';

async function main(): Promise<void> {
  const db = DatabaseConnection.getInstance();
  const repository = new MigrationRepository(db);
  const runner = new MigrationRunner(db, repository);

  try {
    await runner.runPending();
  } finally {
    await db.close();
  }
}

main().catch((error) => {
  console.error('Migration error:', error);
  process.exit(1);
});
