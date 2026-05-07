CREATE TABLE IF NOT EXISTS scores (
  id          SERIAL      PRIMARY KEY,
  value       INTEGER     NOT NULL CHECK (value > 0),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
