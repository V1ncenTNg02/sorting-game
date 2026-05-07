-- Bootstrap table for the migration runner.
-- Application tables (scores, games) are created by numbered migration files
-- in backend/migrations/ and applied by the TypeScript migration runner on startup.
CREATE TABLE IF NOT EXISTS schema_migrations (
  filename    TEXT        PRIMARY KEY,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
