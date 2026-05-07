# Sorting Game

Colour and shape sorting game built for the Unify Services coding test.

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + TypeScript
- Database: PostgreSQL
- Infrastructure: Docker + Docker Compose
- Frontend state management: Zustand
- Testing: Vitest + React Testing Library (frontend), Jest + Supertest (backend, planned)

## Why This Stack

React + Vite + TypeScript was chosen for the frontend because it provides a fast development workflow, strong TypeScript support, and a straightforward component model for building the drag-and-drop game UI.

Node.js + TypeScript was chosen for the backend because it keeps the frontend and backend in the same language family, reduces context switching, and works well for the required REST API, validation, PostgreSQL integration, and automated tests.

## Product Behaviour

The app is a colour and shape sorting game. A player starts a game, drags items into matching colour or shape buckets, and finishes when all items are correctly sorted. The fastest completion time is the best score.

Required behaviour:
- Minimum 10 sortable items
- Shapes: triangle, square, circle
- Colours: red, green, blue
- Correct drops stay in the bucket
- Incorrect drops return to the unsorted area
- Timer starts when the game starts
- Well Done modal appears on completion
- Progress persists in Local Storage
- Best score persists in PostgreSQL
- Game sessions/scores are shareable

## Running the Project

### With Docker (recommended)

Requires Docker Desktop running.

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend health: http://localhost:3000/health
- PostgreSQL: localhost:5432

Stop all services:
```bash
docker compose down
```

Stop and remove the database volume (fresh start):
```bash
docker compose down -v
```

### Local development (without Docker)

Run PostgreSQL separately, then:

```bash
# Backend
cd backend
npm install
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sorting_game npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Docker

Three services defined in `docker-compose.yml`:

| Service | Image | Port | Notes |
|---------|-------|------|-------|
| `db` | postgres:16-alpine | 5432 | Named volume `postgres_data`; schema auto-loaded from `database/init/` |
| `backend` | node:20-alpine | 3000 | Express + TypeScript, `tsx watch` for hot reload |
| `frontend` | node:20-alpine | 5173 | Vite dev server, proxies `/api/*` to backend |

**Communication:** Browser → Vite dev server (`:5173`) → proxy `/api/*` → backend (`:3000`) → PostgreSQL (`:5432`). All inter-container traffic uses Docker's internal DNS (`db`, `backend`).

**Environment variables:** Set inline in `docker-compose.yml`. See `.env.example` for local (non-Docker) values.

**Hot reload:** Both frontend and backend bind-mount source directories into the container with anonymous `node_modules` volumes, so local edits are reflected immediately without rebuilding the image.

## Migrations

TODO

## Tests

TODO

## API Endpoints

`GET /health` is live. Remaining endpoints are planned for Task 4.

Expected endpoints:
- `GET /health`
- `GET /api/best-score`
- `POST /api/best-score`
- `GET /api/games`
- `POST /api/games`
- `GET /api/games/:id`
- `PATCH /api/games/:id`
- `DELETE /api/games/:id`

## Database Schema

Managed by `database/init/01_schema.sql`, auto-executed by PostgreSQL on first container start.

```sql
scores (id SERIAL PK, value INTEGER, recorded_at TIMESTAMPTZ)
games  (id UUID PK, items JSONB, duration_ms INTEGER, completed BOOLEAN, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)
```

## State Management

Zustand store (`frontend/src/store/useGameStore.ts`) holds all core game truth:
- `status` — idle / playing / complete
- `unsortedItems` — items not yet sorted
- `buckets` — bucket definitions and assignments
- `elapsedSeconds` — timer
- `bestScore` — fetched from backend
- `sessionId` — current game session

Short-lived visual state (hover, animation flags) is kept local to components.

## Debugging

TODO

Debug screenshots should be stored in `docs/`.

## Tradeoffs and Limitations

TODO

