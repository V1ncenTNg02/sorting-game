# Sorting Game

Colour and shape sorting game built for the Unify Services coding test.

---

## Table of Contents

- [Stack](#stack)
- [Why This Stack](#why-this-stack)
- [Product Behaviour](#product-behaviour)
- [Running the Project](#running-the-project)
- [Migrations](#migrations)
- [Tests](#tests)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [State Management](#state-management)
- [Architecture Overview](#architecture-overview)
- [Debugging](#debugging)
- [Tradeoffs and Limitations](#tradeoffs-and-limitations)

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Drag and drop | @dnd-kit/core |
| Frontend state | Zustand v5 |
| Frontend tests | Vitest + React Testing Library |
| Backend | Node.js + Express + TypeScript |
| Validation | Zod |
| Database | PostgreSQL 16 |
| Backend tests | Jest + Supertest |
| Infrastructure | Docker + Docker Compose |

---

## Why This Stack

**React + Vite + TypeScript** gives a fast development loop, first-class TypeScript support, and a lightweight component model that is well-suited to building drag-and-drop game UI without imposing a lot of framework ceremony.

**@dnd-kit** was chosen over react-beautiful-dnd because it is actively maintained, supports keyboard accessibility out of the box, and has a composable sensor API that integrates naturally with the game's drop validation logic.

**Zustand** was chosen over Redux or React Context because it provides a minimal, hook-based API with no boilerplate. The game store fits into a single file and is easy to test in isolation by importing the store directly in test files.

**Node.js + Express + TypeScript** keeps the entire codebase in the same language, reduces context switching, and makes it straightforward to share TypeScript types between layers if needed. Express is deliberately minimal; the project does not need a framework with opinions about routing conventions.

**Zod** provides runtime schema validation at API boundaries with automatic TypeScript type inference from the schema definitions, which removes the need to maintain parallel validation and type declarations.

**PostgreSQL** was chosen because the requirements call for persistent best-score storage and shareable game sessions, both of which benefit from relational constraints and UUID primary keys. PostgreSQL's `JSONB` type is used for the `items` column in the `games` table, which avoids a many-to-many join table for item state while still allowing the column to be queried if needed.

**Jest + Supertest** are used for backend integration tests because they pair well with the Express router factory pattern used in the project; each test creates a real Express app with injected mocks and sends HTTP requests through it.

---

## Product Behaviour

The app is a colour and shape sorting game. A player starts a game, drags items into matching colour or shape buckets, and finishes when all items are correctly sorted. The fastest completion time is recorded as the best score.

### Items

- 12 items generated at the start of each game
- Shapes: `triangle`, `square`, `circle`
- Colours: `red`, `green`, `blue`

### Buckets

Six sorting buckets are displayed: one per shape and one per colour.

### Drop rules

- A drop is correct if the item's shape matches the bucket's shape, or the item's colour matches the bucket's colour.
- Correct drops are accepted and stay in the bucket.
- Incorrect drops are rejected and the item returns to the unsorted area.

### Scoring and timer

- The timer starts when the game starts and stops when all items are correctly sorted.
- The elapsed time in seconds is the score. Lower is better.
- The best score is persisted in PostgreSQL. A new score only replaces the stored best if it is strictly lower.

### Completion

- A Well Done modal appears when all items are sorted.
- The modal displays the completion time and the best score.
- A share link is generated from the session UUID (`?game=<uuid>`). Opening the link restores the completed game state.

### Persistence

- In-progress game state (items, buckets, elapsed time, session ID) is saved to Local Storage.
- On page load, the game is restored from Local Storage if a saved session exists.
- On completion or reset, Local Storage is cleared.

---

## Running the Project

### With Docker (recommended)

Requires Docker Desktop running.

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend health | http://localhost:3000/health |
| PostgreSQL | localhost:5432 |

On first start, Docker will:
1. Pull `postgres:16-alpine` and `node:20-alpine` images
2. Install npm dependencies inside the containers
3. Start PostgreSQL and wait for it to pass the health check
4. Run pending migrations via `npm run migrate` inside the backend container
5. Start the backend with `tsx watch` (hot reload)
6. Start the frontend Vite dev server (hot reload)

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
cp ../.env.example .env   # edit DATABASE_URL as needed
npm install
npm run migrate
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

The frontend Vite dev server proxies all `/api/*` requests to the backend. The target URL is controlled by the `VITE_API_TARGET` environment variable (default: `http://localhost:3000`).

### Environment variables

See `.env.example` at the project root for the full list. For Docker, environment variables are set inline in `docker-compose.yml`. For local development, create a `.env` file inside the `backend/` directory.

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/sorting_game` |
| `PORT` | Backend port | `3000` |
| `NODE_ENV` | Runtime environment | `development` |
| `VITE_API_TARGET` | Backend origin for Vite proxy | `http://localhost:3000` |

---

## Migrations

Migrations are plain SQL files stored in `backend/migrations/` and tracked in the `schema_migrations` table.

### How it works

1. On startup, the migration runner reads all `.sql` files from `backend/migrations/`, sorted by filename.
2. It checks the `schema_migrations` table to find which files have already been applied.
3. It applies only the pending files, in order, recording each filename after success.
4. The `schema_migrations` table is bootstrapped by `database/init/01_schema.sql`, which PostgreSQL executes automatically on the first container start.

### Running migrations manually

```bash
# Inside the backend directory
npm run migrate
```

In Docker, migrations run automatically on every backend container start via the entrypoint script (`docker-entrypoint.sh`) before the dev server starts.

### Adding a new migration

Create a new file in `backend/migrations/` with a zero-padded numeric prefix:

```
backend/migrations/0003_your_change.sql
```

The runner applies files in alphabetical order, so the prefix determines execution order.

---

## Tests

### Frontend

```bash
cd frontend
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

Frontend tests use **Vitest** and **React Testing Library**. The test environment is `happy-dom`.

Covered areas:

| Area | Files |
|---|---|
| Root component rendering | `App.test.tsx` |
| Game board layout | `components/GameBoard/GameBoard.test.tsx` |
| Draggable shape cards | `components/ShapeCard/ShapeCard.test.tsx` |
| Bucket drop zones | `components/Bucket/BucketZone.test.tsx` |
| Completion modal | `components/WellDoneModal/WellDoneModal.test.tsx` |
| Timer display | `components/Timer/Timer.test.tsx` |
| Unsorted area | `components/UnsortedArea/UnsortedArea.test.tsx` |
| Zustand store (shared game loading) | `store/useGameStore.test.ts` |
| Drag-drop validation logic | `services/DragDropService/DragDropService.test.ts` |
| Item and bucket generation | `services/GameService/GameService.test.ts` |
| API service calls | `services/ApiService/ApiService.test.ts` |
| Local Storage persistence | `services/LocalStorageService/LocalStorageService.test.ts` |
| Domain models | `domain/ShapeItem.test.ts`, `domain/Bucket.test.ts` |

### Backend

```bash
cd backend
npm test              # run once
npm run test:watch    # watch mode
npm run test:coverage # with coverage report
```

Backend tests use **Jest** and **Supertest**. Each test file creates an Express app with injected dependencies so there is no shared state between tests and no real database connection required.

Covered areas:

| Area | File |
|---|---|
| Health check endpoint | `src/__tests__/health.test.ts` |
| Games CRUD endpoints | `src/__tests__/games.test.ts` |
| Best score endpoints and rule enforcement | `src/__tests__/scores.test.ts` |

---

## API Endpoints

All endpoints are live. The base URL in Docker is `http://localhost:3000`.

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns plain text `"OK"` (200) or 500 if the database is unreachable |

### Best score

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/best-score` | Returns the current best score or 404 if none exists |
| `POST` | `/api/best-score` | Submits a score; accepted only if lower than the current best |

`POST /api/best-score` request body:

```json
{ "value": 42 }
```

`value` is the completion time in seconds (positive integer).

Responses:

```json
{ "accepted": true, "score": { "id": 1, "value": 42, "recordedAt": "2025-01-01T00:00:00Z" } }
{ "accepted": false, "reason": "New score is not lower than the current best." }
```

### Games

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/games` | Lists all game sessions, ordered by `created_at` descending |
| `POST` | `/api/games` | Creates a new game session; returns 201 with the created game |
| `GET` | `/api/games/:id` | Returns a single game session or 404 |
| `PATCH` | `/api/games/:id` | Partially updates a game session |
| `DELETE` | `/api/games/:id` | Deletes a game session; returns 204 |

`POST /api/games` request body:

```json
{
  "items": [
    { "id": "item-1", "shape": "circle", "colour": "red" }
  ],
  "duration_ms": 0,
  "completed": false
}
```

`PATCH /api/games/:id` request body (all fields optional):

```json
{
  "items": [...],
  "duration_ms": 42000,
  "completed": true
}
```

Game response shape:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "items": [...],
  "durationMs": 42000,
  "completed": true,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:10:00Z"
}
```

---

## Database Schema

### `schema_migrations`

Bootstrapped by `database/init/01_schema.sql`. Tracks which migration files have been applied.

```sql
CREATE TABLE schema_migrations (
  filename    TEXT        PRIMARY KEY,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `scores`

Created by `backend/migrations/0001_create_scores_table.sql`.

```sql
CREATE TABLE scores (
  id          SERIAL      PRIMARY KEY,
  value       INTEGER     NOT NULL CHECK (value > 0),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

`value` stores the completion time in seconds. The best-score business rule (only accept a lower value) is enforced at the service layer, not at the database level, so the history of all submitted scores is preserved.

### `games`

Created by `backend/migrations/0002_create_games_table.sql`.

```sql
CREATE TABLE games (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  items       JSONB       NOT NULL,
  duration_ms INTEGER     CHECK (duration_ms >= 0),
  completed   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

`items` stores the full item list as JSONB. Each element records the item's `id`, `shape`, `colour`, and optional `bucketId` (assigned when correctly dropped). Using JSONB avoids an extra join table for item state while keeping the column queryable.

---

## State Management

All core game truth lives in a single Zustand store at [frontend/src/store/useGameStore.ts](frontend/src/store/useGameStore.ts).

### Store shape

| Field | Type | Description |
|---|---|---|
| `status` | `'loading' \| 'idle' \| 'playing' \| 'complete'` | Current game phase |
| `unsortedItems` | `ShapeItem[]` | Items not yet correctly placed |
| `buckets` | `Bucket[]` | Bucket definitions (shape or colour) |
| `bucketCounts` | `Record<string, number>` | Accepted drop count per bucket |
| `elapsedSeconds` | `number` | Timer value; increments every second while `playing` |
| `sessionId` | `string \| null` | UUID of the active game session from `POST /api/games` |
| `bestScore` | `number \| null` | Best completion time in seconds; loaded from API on mount |
| `sharedGame` | `ApiGame \| null` | Populated when a `?game=<id>` query param is present |

### State transitions

```
loading → idle       (on mount: after best-score load or 600 ms timeout)
idle    → playing    (on startGame)
playing → complete   (when all items are correctly sorted)
complete → idle      (on resetGame)
```

### Store actions

| Action | Description |
|---|---|
| `loadBestScore()` | Fetches `GET /api/best-score` and sets `bestScore` |
| `startGame()` | Generates items and buckets, creates a session via `POST /api/games`, starts the timer |
| `handleDragStart(event)` | Logs the dragged item |
| `handleDragOver(event)` | Logs the current drop target |
| `handleDragCancel(event)` | Logs drag cancellation |
| `handleDragEnd(event)` | Delegates to `DragDropService` for validation; updates store and Local Storage |
| `resetGame()` | Clears state and Local Storage, transitions back to `idle` |
| `loadSharedGame(id)` | Fetches `GET /api/games/:id` and sets `sharedGame` |

### Short-lived visual state

Hover styling, drag-over highlights, and animation flags are kept as local component state and are never written to the store.

---

## Architecture Overview

### Frontend

```
components/        — thin React UI shells; render store state, delegate events
store/             — Zustand store; coordinates services and persists truth
services/          — GameService, DragDropService, ApiService, LocalStorageService
domain/            — ShapeItem and Bucket classes with typed fields
types/             — shared TypeScript interfaces
constants/         — SHAPES, COLOURS, ITEM_COUNT, BUCKET_DEFINITIONS
```

### Backend

```
routes/            — Express router factories; no business logic
controllers/       — parse and respond; delegate to services
services/          — business rules (best-score enforcement, session lifecycle)
repositories/      — SQL queries; implement IGameRepository / IScoreRepository
domain/            — Game and Score entity classes
validation/        — Zod schemas for request bodies
middleware/        — asyncHandler (error forwarding), validate (Zod middleware)
migrations/        — MigrationRunner and MigrationRepository classes
```

Each layer depends only on the interface of the layer below it, which makes the backend straightforward to test by injecting mock implementations.

---

## Debugging

The browser console exposes structured debug output for all key events. Prefix convention:

| Prefix | Covers |
|---|---|
| `[Api]` | API calls and responses (best-score load, game create, score submit) |
| `[Game]` | Game state transitions (start, completion, reset, session events) |
| `[DragDrop]` | Drag start, drag over, drop target, validation result, cancel |

Debug screenshots taken during development are stored in [docs/](docs/).

---

## Tradeoffs and Limitations

### Best-score rule is application-enforced, not database-enforced

The rule that a new score only replaces the current best if it is strictly lower is checked in `ScoreService`, not via a database constraint. This means a concurrent POST from two clients with the same score could both pass the check before either write lands. For a single-player game this is not a practical issue, but a production system would add a serialisable transaction or a unique partial index.

### Single best-score row, no user accounts

The `scores` table stores all submitted scores as rows and the service always returns the lowest. There is no concept of a user, so all players share a single global best score. Adding per-user scores would require an auth layer and a `user_id` foreign key on `scores`.

### Items stored as JSONB, not normalised

Game item state is stored as a JSONB array on the `games` row. This is simple and adequate for the current use case but means the database cannot efficiently query or filter by individual item fields (shape, colour, bucket assignment) without a full table scan. Normalising items into a separate table would enable richer queries at the cost of more joins.

### No production build or deployment configuration

All Docker services run in development mode (`tsx watch`, `vite dev`). There are no production Dockerfiles, no `nginx` reverse proxy, and no environment-specific build steps. A production deployment would need separate Dockerfiles with multi-stage builds and a static file server for the frontend bundle.

### Local Storage is per-device

In-progress game state is persisted to `localStorage`, which is scoped to the browser and device. Starting the same game on another device starts fresh. Share links encode only the session UUID, so shared completed games are always fetched from the database.

### No WebSocket or real-time updates

The timer runs entirely on the client. If the page is closed during a game, the elapsed time at the moment of the last Local Storage write is restored. Any time between the last write and the close is lost.

### Migration runner reads from the filesystem at runtime

`MigrationRunner` reads SQL files from `backend/migrations/` using `fs.readdir` and `fs.readFile` at startup. In a containerised environment this works because the source tree is bind-mounted. A compiled production build would need to copy the `migrations/` directory into the image or use an embedded migration library.
