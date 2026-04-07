# Health Metrics Tracker

A full-stack practice project for tracking personal health metrics (heart rate, steps, sleep, calories, weight, blood pressure, glucose).

## Project structure

- `backend/` — Express + TypeScript + Prisma + PostgreSQL
- `frontend/` — (planned)

## Backend quick start

### 1) Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional, for local Postgres via `docker-compose`)

### 2) Environment variables

Create `backend/.env` (or copy from `.env.example`) with at least:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/health_metrics"
JWT_SECRET="replace-with-a-strong-secret"
JWT_EXPIRES_IN="7d"
PORT=5000
```

### 3) Install dependencies

```bash
cd backend
npm install
```

### 4) Start Postgres

Option A (Docker):

```bash
docker compose up -d
```

Option B: Use your local PostgreSQL instance and update `DATABASE_URL` accordingly.

### 5) Prisma setup

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 6) Run backend

Development:

```bash
npm run dev
```

Production-style run:

```bash
npm run build
npm run start
```

### 7) Test backend

```bash
npm test
```

This runs a smoke test for `GET /api/healthcheck`.


## Troubleshooting Prisma CLI permission errors

If you see `sh: 1: prisma: Permission denied`, you likely have one of these local issues:

1. `node_modules/.bin/prisma` lost executable bit (common after cross-OS dependency copies).
2. `prisma` and `@prisma/client` versions are out of sync.

Recommended fix:

```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run prisma:generate
```

If your environment requires elevated filesystem permissions to restore executable bits, authorize the reinstall step in your shell/CI runner and re-run the commands above.

## API endpoints (backend)

- `GET /api/healthcheck`
- `POST /api/register`
- `POST /api/login`
- `GET /api/metrics` (auth required)
- `POST /api/metrics` (auth required)
- `DELETE /api/metrics/:id` (auth required)

## Example cURL

Health check:

```bash
curl http://localhost:5000/api/healthcheck
```

Register:

```bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex","email":"alex@example.com","password":"secret123"}'
```

Login:

```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"secret123"}'
```
