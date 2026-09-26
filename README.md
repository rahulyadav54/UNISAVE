# UNISAVE

**One Link. One Place. Save What Matters.**

UNISAVE is a premium universal media toolkit for analyzing and downloading **publicly accessible** media from supported platforms.

No database is required. Optional **Redis + worker** scale download processing in production.

## Features

- Premium dark SaaS UI with full analyze → download flow
- Modular platform adapters backed by **yt-dlp** (real formats only)
- **Phase 2 queue**: Redis job state + BullMQ worker (memory/inline fallback for local dev)
- Temporary file storage with signed one-time download URLs
- Thumbnail Fetcher tool, admin metrics, health check
- SSRF protection, rate limiting (Redis-backed when configured)

## Requirements

- Node.js 20+
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) on `PATH` or `YT_DLP_PATH`
- [ffmpeg](https://ffmpeg.org/) on `PATH` (required to merge video+audio for many platforms, e.g. YouTube)
- **Optional:** Redis + `npm run worker` for background downloads (recommended in production)

## Quick start (local, no Redis)

```bash
cp .env.example .env.local
npm install
npm run dev
```

Downloads run **inline** in the web process when `REDIS_URL` is unset.

## Production queue (no database)

```bash
# Terminal 1
REDIS_URL=redis://localhost:6379 npm run dev

# Terminal 2
REDIS_URL=redis://localhost:6379 npm run worker
```

Or:

```bash
docker compose up --build
```

This starts **web**, **worker**, and **Redis** only.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `YT_DLP_PATH` | yt-dlp binary |
| `REDIS_URL` | Enables Redis job store + BullMQ queue |
| `WORKER_CONCURRENCY` | Parallel download jobs (default `2`) |
| `STORAGE_PATH` | Temp downloads (default `.storage`) |
| `ADMIN_API_KEY` | Protects `/api/admin/stats` |
| `NEXT_PUBLIC_APP_URL` | Canonical URL for SEO |

## API

- `GET /api/health` — service + queue mode
- `POST /api/media/analyze`
- `POST /api/media/download` — enqueues when Redis is configured
- `GET /api/media/status/:jobId`
- `GET /api/media/serve/:token`

## Testing

```bash
npm test
npm run build
```

## Responsible use

UNISAVE does not bypass DRM, authentication, private content, paywalls, or technical restrictions.
