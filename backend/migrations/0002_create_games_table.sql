CREATE TABLE IF NOT EXISTS games (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  items       JSONB       NOT NULL,
  duration_ms INTEGER     CHECK (duration_ms >= 0),
  completed   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
