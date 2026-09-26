-- UNISAVE PostgreSQL schema (optional persistence layer)

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_jobs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  platform TEXT NOT NULL,
  source_url_hash TEXT NOT NULL,
  media_type TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS download_jobs (
  id UUID PRIMARY KEY,
  media_job_id UUID REFERENCES media_jobs(id),
  format_id TEXT NOT NULL,
  status TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  key_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  endpoint TEXT NOT NULL,
  platform TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
