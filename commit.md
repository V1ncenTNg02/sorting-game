# commit.md

This file is the running engineering log for the sorting game coding test. Each section should be updated before the related commit.

## Project Setup - Documentation Tracking

Commit:
- Pending

What I did:
- Created the initial documentation and tracking files required by the coding test.
- Recorded the selected frontend stack: React + Vite + TypeScript.
- Recorded the selected backend stack: Node.js + TypeScript.
- Added Claude Code project instructions in `.claude/CLAUDE.md`.
- Added Claude Code hooks that remind the agent to maintain PROMPTS.md after prompts and PROMPTS.md/commit.md/README.md after file edits.

Decisions:
- Use React because it is a strong fit for component-based UI, drag-and-drop interactions, TypeScript, and frontend testing.
- Use Vite because it is required by the test and provides fast development/build tooling for React.
- Use TypeScript across frontend and backend to keep data models and API payloads consistent.
- Use Node.js for the backend because it keeps the project in one language family and works well for a small REST API.
- Use reminder hooks instead of hooks that directly write PROMPTS.md because prompt-submit hooks do not know the final outcome yet.
- Use project-level `.claude/settings.json` so the hook workflow follows this repository when Claude Code is used here.

Tradeoffs:
- React gives flexibility, but the project needs a clear folder structure so state and game logic do not become tangled.
- Node.js provides stack consistency, but backend validation and database access still need to be structured carefully.
- Hook reminders reduce missed documentation updates, but the final PROMPTS.md and commit.md entries still need human/agent judgment to stay accurate.

Problems encountered:
- `git status` reported a safe directory ownership warning. This can be fixed with `git config --global --add safe.directory E:/GitProject/sorting-game` if needed.
- The first version of the edit hook had a PowerShell string interpolation issue with `$toolName:`. It was fixed by using `${toolName}`.

Terminal commands used:
```powershell
Get-ChildItem -Force
Get-ChildItem -Force -Filter *.md
git status --short --branch
Get-Content .claude\settings.json | ConvertFrom-Json | Out-Null
'{"hook_event_name":"UserPromptSubmit","prompt":"Implement Task 1 frontend UI and update docs"}' | powershell -ExecutionPolicy Bypass -File .claude\hooks\prompt-log-reminder.ps1
'{"hook_event_name":"PostToolUse","tool_name":"Write","tool_input":{"file_path":"frontend/src/App.tsx"},"tool_response":{"filePath":"frontend/src/App.tsx"}}' | powershell -ExecutionPolicy Bypass -File .claude\hooks\code-change-reminder.ps1
```

## Project Setup - Claude Code Skills and Auto-logging Hook

**What was done:**
- Created prompt-file-helper skill (`.claude/skills/prompt-file-helper/SKILL.md`) instructing Claude to append entries to PROMPTS.md using the project's required template format.
- Created commit-file-helper skill (`.claude/skills/commit-file-helper/SKILL.md`) with instructions to select between two entry formats and append to commit.md.
- Split commit-file-helper's two formats into separate files: `template-general.md` (general log) and `template-scaffold.md` (framework/setup log). Updated SKILL.md to reference them by name.
- Added a Stop hook in `.claude/settings.json` with `asyncRewake: true` that re-wakes Claude after every turn if PROMPTS.md and commit.md have not both been updated in the last 3 minutes.

**Decisions made:**
- Used `asyncRewake` Stop hook rather than a CLAUDE.md rule alone because CLAUDE.md rules rely on Claude remembering them; the harness enforces hooks regardless.
- Used a 3-minute recency check on both PROMPTS.md and commit.md as the loop-breaker: if both files are fresh the hook exits 0, otherwise exits 2 to re-wake.
- Extracted templates into separate files to keep SKILL.md clean and make each format independently readable.
- Used `shell: powershell` for the hook command because the project runs on Windows.

**Tradeoffs:**
- `asyncRewake` fires after every turn including trivial Q&A, spending extra tokens. The recency check reduces re-wakes once the files are updated, but does not skip the hook entirely for simple turns.
- Separate template files keep the skill directory tidy but add two extra files to maintain.

**Problems encountered:**
- Hooks cannot directly invoke Claude skills — hooks run shell commands with no conversation context, while skills require an active Claude turn. Resolved by using `asyncRewake` to give Claude a new turn instead.
- Without a loop-breaker, the Stop hook would re-fire indefinitely after the skills ran. Resolved with the 3-minute file-recency check.

**Terminal commands used:**
- None. All changes were file writes via Claude Code tools.

**Verification:**
- The Stop hook fired after the first conversation turn, re-woke Claude with the `rewakeMessage`, and Claude invoked both skills. PROMPTS.md and commit.md were updated, the recency check passed, and the hook exited 0.

## Project Setup - TDD Skill and Automated Test Runner

**What was done:**
- Created `.claude/skills/tdd/SKILL.md` — a TDD skill covering the red-green-refactor cycle, frontend testing stack (Vitest + React Testing Library + jsdom), backend testing stack (Jest + ts-jest + Supertest), one-time setup commands for both, and rules (no skipping tests, no mocking internals, test file names mirror source file names).
- Created `.claude/scripts/run-tests.ps1` — a PowerShell dispatcher that reads `git diff --name-only HEAD` and untracked files to detect whether `frontend/` or `backend/` changed, runs only the relevant `npm test` suite, outputs pass/fail results as a JSON `systemMessage`, and uses a `.claude/.last-test-run` sentinel file to prevent re-running within 5 minutes.
- Updated `.claude/settings.json` to add the test runner as a new synchronous Stop hook group placed before the existing asyncRewake skill-logging hook group.

**Decisions made:**
- Used Vitest for the frontend because it is Vite-native, has a Jest-compatible API, and requires no extra bundler configuration.
- Used Jest + ts-jest for the backend because it is the most established Node.js testing setup and has broad ecosystem support.
- Used `git diff --name-only HEAD` plus `git ls-files --others` to detect changes rather than a time-based check, so the hook is accurate even when turns are slow.
- Used a 5-minute sentinel file (`.claude/.last-test-run`) as the loop-breaker so the test hook skips re-running on the asyncRewake turn when only PROMPTS.md and commit.md are written.
- Placed the test runner hook group before the asyncRewake group so test results are visible to the user before Claude is re-woken for docs.

**Tradeoffs:**
- `git diff HEAD` detects all uncommitted changes, not just changes from the current turn. If older uncommitted code exists, tests may run even when the current turn only touched docs. Acceptable given the sentinel prevents back-to-back runs.
- Limiting test output to the last 40 lines keeps the systemMessage readable but may truncate verbose failure output.
- Using two separate test frameworks (Vitest/Jest) adds setup overhead, but keeps each side idiomatic to its ecosystem.

**Problems encountered:**
- None. All files were created cleanly via Claude Code Write tool.

**Terminal commands used:**
- None. All changes were file writes via Claude Code tools.

**Verification:**
- settings.json validated as correct JSON via `python -m json.tool`.
- The Stop hook fired after the conversation turn, the test runner ran (no frontend/backend package.json yet, so skipped gracefully), and the asyncRewake hook re-woke Claude for docs logging.

## Project Setup - Clean Code + OOP Coding Style Requirement

**What was done:**
- Added a mandatory "Coding Style — Clean Code + OOP" section to `.claude/CLAUDE.md` covering: OOP rules (classes everywhere, SRP, encapsulation, abstraction via interfaces, composition over inheritance, constructor DI, no procedural blobs), frontend-specific rules (thin React components, game logic in service/model classes, event handlers must delegate immediately), backend-specific rules (route → controller → service → repository layering, domain entities as classes with behavior), and Clean Code rules (meaningful names, methods ≤ ~20 lines, no explanatory comments, no magic values, DRY).
- Created `.claude/skills/OOP-reviewer/SKILL.md` — a reviewer skill that reads changed `.ts`/`.tsx` files via `git diff`, works through a structured checklist (OOP structure, frontend checks, backend checks, Clean Code checks), produces a PASS/FAIL report with file paths and line numbers, and blocks commits until zero violations remain.
- Updated the Required Workflow in CLAUDE.md to mandate running `/oop-reviewer` before each commit.

**Decisions made:**
- Made OOP a hard requirement ("must"), not a soft preference, because the coding test explicitly specifies Clean Code with Object Orientation as a grading criterion.
- Separated frontend and backend rules within the same section so each layer has unambiguous guidance.
- The OOP-reviewer skill produces a structured report (PASS/FAIL per file with line numbers) rather than a free-form comment so violations are always actionable and traceable.
- Chose to block commits on any FAIL rather than warn-only to prevent OOP violations from accumulating.
- Pre-existing violations in untouched files are flagged as warnings rather than blockers to avoid scope creep.

**Tradeoffs:**
- Requiring class components or service-class delegation for all React components means hooks-only patterns are not permitted; this adds more boilerplate but keeps the OOP requirement consistent.
- A strict 20-line method limit will require more method extractions, which is the desired outcome but adds effort during feature development.
- Blocking commits on OOP violations means the OOP-reviewer must be run before every commit — slightly slower workflow, but enforces quality consistently.

**Problems encountered:**
- The OOP-reviewer skill directory already existed but was completely empty (no SKILL.md). The file was created fresh.
- The Stop hook fired a "blocking error" after the previous turn because PROMPTS.md and commit.md had not been updated. Resolved by invoking prompt-file-helper and commit-file-helper (this entry).

**Terminal commands used:**
- None. All changes were file edits and writes via Claude Code tools.

**Verification:**
- Read back both `.claude/CLAUDE.md` and `.claude/skills/OOP-reviewer/SKILL.md` after writing to confirm content is correct and complete.
- The OOP-reviewer skill appeared immediately in the available skills list in the Claude Code session.

## Task 1 - UI Only

**Framework choice:**
React + Vite + TypeScript (Vite 6 / Vitest 3). Vite 8 / Vitest 4 were initially scaffolded but are incompatible with Node 21.7.3 because rolldown (the new bundler) requires Node 22+ native bindings. Downgraded to Vite 6 + Vitest 3, which uses esbuild instead and works cleanly on Node 21.

**State management choice:**
Zustand — minimal boilerplate, TypeScript-friendly, store holds `status`, `unsortedItems`, `buckets`, and `elapsedSeconds`. All actions delegate to `GameService` and `DragDropService` classes; no game logic lives inside the store itself.

**Drag-and-drop approach considered:**
Evaluated @dnd-kit/core, react-beautiful-dnd, react-dnd, vanilla HTML5 drag events, and Framer Motion drag. Selected @dnd-kit/core because it is actively maintained, accessible by default, composable with service classes via `useDraggable`/`useDroppable` hooks, and has no HTML5 drag-event quirks.

**Folder structure decisions:**
```
frontend/src/
  constants/      — SHAPES, COLOURS, BUCKET_DEFINITIONS, ITEM_COUNT (no magic values)
  types/          — shared TypeScript literal types
  domain/         — ShapeItem and Bucket entity classes (OOP, testable)
  services/       — GameService and DragDropService (OOP, testable)
  store/          — Zustand store (thin glue only)
  components/     — one folder per component; test file co-located
```
Domain and service layers are kept separate from the React component tree so game logic can be tested without a DOM.

**Terminal commands used:**
```powershell
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install zustand @dnd-kit/core @dnd-kit/utilities
npm install tailwindcss @tailwindcss/vite
npm install -D vitest@^3 @vitejs/plugin-react@^4 vite@^6
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom happy-dom
npm uninstall jsdom
npm test
npm run build
npm run dev
```

**Verification:**
- `npm test` → 34/34 tests passing across 9 test files (domain, services, and component layers).
- `npm run build` → clean production build, no TypeScript errors.
- `npm run dev` → dev server live at localhost:5173; loading screen → idle start → game board with 12 draggable shapes + 6 droppable buckets → well-done modal on completion.
- Drag and drop confirmed end-to-end (no validation in Task 1 — any item accepted by any bucket).
- Timer shows static 00:00; well-done modal shows elapsed time and Play Again resets to idle state.

**Problems encountered:**
- Vite 8 + Vitest 4 crash on Node 21.7.3 with `ERR_MODULE_NOT_FOUND` for `@rolldown/binding-win32-x64-msvc` — rolldown requires Node 22+. Fixed by downgrading to Vite 6 + Vitest 3.
- After the rolldown fix, rolldown's use of `util.styleText` with array arguments (Node 22+ only) caused another startup crash. Confirmed Vite 8/Vitest 4 are fundamentally incompatible with Node 21 — the Vite 6 downgrade resolved both.
- jsdom@29 CJS/ESM conflict: `html-encoding-sniffer` (a jsdom dependency) requires `@exodus/bytes` which is now ESM-only, causing `ERR_REQUIRE_ESM` in the test environment. Fixed by removing jsdom and installing happy-dom, changing `environment: 'happy-dom'` in vite.config.ts.
- `vi.mocked(require('@dnd-kit/core').useDraggable).mockReturnValueOnce` fails because the mock factory returns plain objects, not `vi.fn()` instances. Fixed by using `vi.spyOn(dndCore, 'useDraggable')` and calling `.mockReturnValueOnce` on the spy directly.
- `tsc -b` failed on test files because tsconfig.app.json included all of `src/` but lacked vitest global types and @testing-library/jest-dom matcher types. Fixed by adding `"exclude": ["src/**/*.test.ts", "src/**/*.test.tsx"]` to tsconfig.app.json so the production build skips test files entirely.

## Task 1 - UI Redesign (Reference Image Alignment)

**What was done:**
- Replaced the placeholder bucket model (separate colour-only and shape-only buckets) with 7 specific shape+colour combination buckets matching the reference image: Red Triangle, Red Square, Blue Triangle, Blue Circle, Green Triangle, Green Square, Blue Square.
- Rewrote `Bucket` domain class: removed `kind` field, added `shape: ShapeType` and `colour: ColourType`; `accepts()` now delegates to `item.matchesBucket(shape, colour)` which requires both to match.
- Added `matchesBucket(shape, colour)` to `ShapeItem` and an optional `position: ItemPosition` field (defaults to `{ x:0, y:0 }`).
- Updated `DragDropService.handleDragEnd()` to validate drops: returns `DropResult` with `accepted: boolean`; rejected drops leave `updatedUnsorted` unchanged so the item snaps back automatically.
- Made the timer functional in the Zustand store using `setInterval` at module level; timer starts on `startGame()`, increments `elapsedSeconds` every second while status is `'playing'`, stops (via `clearInterval`) on completion or reset. `resetGame()` now restarts immediately in `'playing'` state with fresh items and a fresh timer.
- Added `bucketCounts: Record<string, number>` to the store; incremented on each accepted drop; reset on `resetGame()`.
- Replaced all filled SVG shapes with outlined SVG shapes (`fill="none"`, coloured `stroke`).
- Changed item layout from a 4-column grid to absolute percentage-based positioning (`left: X%`, `top: Y%`). Drag transform from `@dnd-kit` layered on top; drag release snaps items back to their original canvas position if the drop is rejected.
- New components: `TopBar` (elapsed time, items left, reset button), `SidebarTarget` (droppable bucket row with outlined icon, label, and count badge), `GhostGrid` (faint 4×2 decorative grid in canvas bottom-right), `Footer` (bucket count, system status).
- `GameBoard` completely rewritten: full-page flex layout with `TopBar` → sidebar + canvas → `Footer`, with `DndContext` wrapping everything.
- Removed `BucketZone` as the active drop-target component; replaced by `SidebarTarget`. Old `Bucket.test.tsx` updated to test `SidebarTarget` instead.
- Added `console.debug` logging for drag events, drop validation result, and game state changes (satisfies the debugging requirement).

**Decisions made:**
- Buckets as shape+colour combos rather than separate categories is both closer to the coding test requirement and matches the reference image exactly.
- `accepted: boolean` returned inside `DropResult` rather than returning `null` for rejection, so the store always gets a full result and can distinguish "no target found" (null) from "wrong target" (accepted: false).
- `resetGame()` restarts directly into `'playing'` state rather than going back to `'idle'`, matching the reference image's inline Reset button behaviour.
- `bucketCounts` stored as `Record<string, number>` in the Zustand store rather than mutable state on the `Bucket` class, keeping `Bucket` immutable and avoiding stale-closure bugs.
- Percentage-based absolute positions defined in `ITEM_POSITIONS` constant rather than computed at runtime, so positions are deterministic and reproducible across resets.

**Tradeoffs:**
- Defining 15 fixed item positions in constants means the layout is not random between resets; items always start at the same positions. This is acceptable for a coding test and avoids layout shift.
- `setInterval` is stored at module level outside the Zustand store creator to avoid Zustand's shallow-diff triggering spurious re-renders; the tradeoff is that the timer is a singleton and not directly testable from unit tests. The store's tick logic (`elapsedSeconds + 1` only when status is `'playing'`) is still safe.
- SidebarTarget rows are the drop zones, so the droppable area is small (the row height). If the user drops a shape close to a row but not precisely over it, the drop is missed. Acceptable given the test requirements don't specify precision targets.

**Problems encountered:**
- Old `Bucket.test.tsx` still instantiated `Bucket` with the old three-argument constructor `(id, kind, label)`. With the new four-argument constructor `(id, shape, colour, label)`, the label defaulted to `undefined` and the span was empty, causing two test failures. Fixed by updating the test to construct valid `Bucket` objects and test `SidebarTarget` instead of the now-removed `BucketZone`.
- `GameBoard.test.tsx` used `screen.getByLabelText('red circle')` but both the `SidebarTarget` icon (18px) and the `ShapeCard` icon (46px) render an SVG with `aria-label="red circle"`, causing "Found multiple elements" error. Fixed by switching to `screen.getAllByLabelText('red circle').length > 0`.

**Terminal commands used:**
```powershell
npm test   # frontend — run after each batch of changes
npm run build
```

**Verification:**
- `npm test` → 54/54 tests passing across 11 test files.
- `npm run build` → clean production build, no TypeScript errors.
- Dev server live at localhost:5173; layout matches reference image: top bar with live timer and items-left counter, narrow sidebar with 7 droppable target rows, scattered outlined shapes on the canvas, ghost grid in bottom-right, footer with bucket count and system status.
- Correct drops remove item from board and increment the bucket count badge; wrong drops snap item back to original position.
- Timer counts up from 00:00 once Start Game is clicked; stops when all 15 items are sorted.
- Reset button restarts the game immediately with a fresh set of 15 items and a reset timer.

## Task 2 - Docker Setup

**What was done:**
- Created `backend/` with a minimal Express + TypeScript scaffold: `DatabaseConnection` singleton (wraps `pg.Pool`), `HealthController` (calls `DatabaseConnection.healthCheck()`), a `GET /health` route, and `src/index.ts` bootstrapping the Express app.
- Created `database/init/01_schema.sql` with `scores` and `games` tables; PostgreSQL auto-runs all `.sql` files placed in `/docker-entrypoint-initdb.d/` on first start.
- Created `backend/Dockerfile` and `frontend/Dockerfile` — both use `node:20-alpine` with development-mode startup (`tsx watch` for backend, `vite` dev server for frontend). No production build step; hot reload works in both containers via bind-mounted volume.
- Created `.dockerignore` for both services (`node_modules`, `dist`, `.env`, logs).
- Created `docker-compose.yml` at project root defining three services: `db` (postgres:16-alpine), `backend` (depends on `db` via `service_healthy`), `frontend` (depends on `backend`).
- Named volume `postgres_data` keeps database state between `docker compose down` / `up` cycles.
- Updated `frontend/vite.config.ts` to add `server.host: '0.0.0.0'` (container accessible), `server.hmr.clientPort: 5173` (HMR through Docker port mapping), and `server.proxy: { '/api': VITE_API_TARGET }` so the Vite dev server proxies API calls server-side to the backend container.
- Created `.env.example` and root `.gitignore` (covers `.env`, `node_modules`, `dist`, logs).

**Service structure:**
Three Docker Compose services on a shared auto-created network:
- `db` — PostgreSQL 16 with healthcheck (`pg_isready`); volume-mounts `database/init/` to `/docker-entrypoint-initdb.d/` for automatic schema creation.
- `backend` — Express + TypeScript, `tsx watch` for hot reload; volume-mounts `./backend:/app` with an anonymous `/app/node_modules` volume so Linux node_modules are not overridden by the Windows host's `node_modules`.
- `frontend` — Vite dev server; same volume pattern.

**Environment variables:**
- Docker Compose sets all env vars inline in `docker-compose.yml` — no `.env` file required to run.
- `DATABASE_URL` in backend container uses Docker's internal DNS (`db:5432`); locally it maps to `localhost:5432`.
- `VITE_API_TARGET` in frontend container is `http://backend:3000` — consumed by Vite's server-side proxy; the browser only ever sees relative `/api/*` paths. Locally it falls back to `http://localhost:3000` via `?? 'http://localhost:3000'` in `vite.config.ts`.
- `.env.example` documents the local (non-Docker) values.

**Container communication:**
- Browser → `localhost:5173` → Vite dev server (frontend container)
- Vite proxy intercepts `/api/*` → `http://backend:3000` (Docker internal DNS, server-side, not browser-side)
- Backend → `postgresql://postgres:postgres@db:5432/sorting_game` (Docker internal DNS)
- `depends_on` with `condition: service_healthy` ensures `db` is accepting connections before `backend` starts, and `backend` is up before `frontend` starts.

**Problems encountered:**
- `@rolldown/binding-win32-x64-msvc` was listed as a direct dependency in `frontend/package.json` (auto-added by npm when Vite was installed on Windows). npm hard-fails with `EBADPLATFORM` when building the Linux Docker image because the package declares `os: ["win32"]`. Fixed by removing it from `package.json`; Vite manages platform-specific Rolldown bindings internally and works correctly on both platforms without the explicit entry.

**Terminal commands used:**
```powershell
docker compose build
docker compose up -d
docker compose ps
curl http://localhost:3000/health
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
docker compose exec db psql -U postgres -d sorting_game -c "\dt"
docker compose logs backend
```

**Verification:**
- `docker compose ps` — all three containers up, `db` shows `(healthy)`.
- `GET /health` → `{"status":"ok","db":"connected"}` — backend confirmed connected to PostgreSQL.
- `GET http://localhost:5173` → HTTP 200 — Vite dev server running in container.
- `\dt` in PostgreSQL → `games` and `scores` tables present.
- Backend logs → `Backend running on port 3000`, no errors.

**Follow-up fix (same branch):**
Added `"test": "echo \"No backend tests yet\" && exit 0"` to `backend/package.json`. The project's stop hook runs `npm test` in any directory with changed files; without a `test` script, npm exits 1 and the hook reports a blocking error. Placeholder exits 0 until real backend tests are added in Task 7.

## Task 3 - Database Migrations

**What was done:**
- Replaced `database/init/01_schema.sql` content with only the `schema_migrations` tracking table DDL. Application tables (`scores`, `games`) moved to numbered migration files so schema changes are tracked and applied incrementally.
- Created `backend/migrations/0001_create_scores_table.sql` and `backend/migrations/0002_create_games_table.sql` — the canonical source of truth for the database schema.
- Built a custom TypeScript migration runner under `backend/src/migrations/runner/` with four files:
  - `IMigrationRunner.ts` — interface defining `runPending(): Promise<void>`
  - `IMigrationRepository.ts` — interface defining `ensureTrackerTable()`, `getApplied()`, `record(filename)`
  - `MigrationRepository.ts` — implements `IMigrationRepository`; reads/writes the `schema_migrations` tracking table; self-bootstraps the table via `ensureTrackerTable()` so the runner works on both fresh and existing volumes
  - `MigrationRunner.ts` — implements `IMigrationRunner`; reads `.sql` files from `backend/migrations/` in lexicographic order, filters to pending files, applies each and records it
- Created `backend/src/migrations/migrate.ts` — thin entrypoint script (no business logic) that wires up `DatabaseConnection`, `MigrationRepository`, and `MigrationRunner` and calls `runner.runPending()`
- Added `migrate` and `migrate:build` scripts to `backend/package.json`
- Created `backend/docker-entrypoint.sh` — runs `npm run migrate` then `exec npm run dev`; called by the backend container on every start
- Updated `backend/Dockerfile` CMD to `["sh", "/app/docker-entrypoint.sh"]`

**Schema design decisions:**

`scores` table:
- `SERIAL PRIMARY KEY`: scores are an append-log, not shared by link — integer is sufficient and efficient.
- `value INTEGER NOT NULL CHECK (value > 0)`: stores completion time in milliseconds; the check constraint enforces non-zero positive values at the database layer, independent of application validation.
- `TIMESTAMPTZ NOT NULL DEFAULT NOW()`: timezone-aware timestamp set automatically by the database; always populated even if the application omits it.
- No foreign key to `games`: the best-score business rule (`GET /api/best-score`, `POST /api/best-score`) treats score as a standalone record. Loose coupling keeps the two endpoints independently testable.

`games` table:
- `UUID PRIMARY KEY DEFAULT gen_random_uuid()`: games are shared by link (`GET /api/games/:id`). UUID makes IDs non-enumerable — a sequential integer would let users enumerate game sessions. `gen_random_uuid()` is built into PostgreSQL 13+ (project uses postgres:16-alpine).
- `items JSONB NOT NULL`: stores the complete game session state (shapes, colours, positions, bucket assignments) as one column. Avoids a `game_items` join table and multiple round-trips per game read/write; still queryable with PostgreSQL's JSONB operators if needed.
- `duration_ms INTEGER CHECK (duration_ms >= 0)`: nullable because an in-progress game has no completion time yet. The check constraint prevents negative values on `PATCH`.
- `completed BOOLEAN NOT NULL DEFAULT FALSE`: explicit flag; not derived from `duration_ms` because a game may be abandoned without ever recording a duration.
- `updated_at TIMESTAMPTZ`: application sets this on each `PATCH /api/games/:id`; no trigger needed for this scope.

`schema_migrations` table:
- `filename TEXT PRIMARY KEY`: enforces each migration file is recorded exactly once.
- Created by `MigrationRepository.ensureTrackerTable()` (`CREATE TABLE IF NOT EXISTS`) so the runner is self-bootstrapping on volumes that pre-date this migration system.
- Also present in the Docker init file as a bootstrap safety net for fresh volumes.

**Migration execution approach:**
- Custom TypeScript runner — no new npm packages. Uses `pg` (already installed) and Node built-ins (`fs/promises`, `path`).
- `process.cwd()/migrations` resolves the SQL directory portably in both `tsx` dev mode and compiled `node dist/` mode.
- Each migration is applied sequentially in lexicographic (numeric) file order. On success, the filename is recorded in `schema_migrations`; subsequent runs skip recorded files.
- DDL statements (`CREATE TABLE IF NOT EXISTS`) are implicitly transactional in PostgreSQL — a failed statement auto-rolls back without requiring explicit `BEGIN`/`COMMIT`, keeping the `IDatabaseConnection` interface minimal.

**Tradeoffs:**
- Custom runner over `node-pg-migrate`: zero new packages, OOP-compliant class design, fully testable. Tradeoff: no built-in rollback support (down migrations). Acceptable for this coding test; a production system would include them.
- Migrations run on every backend container start: guarantees schema is always current without manual steps; adds ~100 ms startup overhead when there are no pending migrations.
- `JSONB` for `games.items` over a normalised `game_items` table: simpler reads/writes for this app's access pattern; tradeoff is that querying individual item fields requires JSONB operators rather than SQL columns.

**Problems encountered:**
- OOP reviewer flagged `MigrationRepository` for not implementing a named interface, and `MigrationRunner` for depending on the concrete class rather than an interface. Fixed by adding `IMigrationRepository.ts` and updating both files.
- The `./backend:/app` volume bind-mount in Docker Compose overlays the image layer at runtime, stripping Linux execute bits set by `chmod` in the Dockerfile (Windows hosts do not preserve execute permissions). Fixed by using `CMD ["sh", "/app/docker-entrypoint.sh"]` which does not require the execute bit.

**Terminal commands used:**
```powershell
docker compose down -v
docker compose up --build -d
docker compose ps
docker compose logs backend --tail=30
docker compose exec db psql -U postgres -d sorting_game -c "SELECT * FROM schema_migrations;"
docker compose exec db psql -U postgres -d sorting_game -c "\dt"
docker compose exec db psql -U postgres -d sorting_game -c "\d scores"
docker compose exec db psql -U postgres -d sorting_game -c "\d games"
curl http://localhost:3000/health
docker compose restart backend
docker compose logs backend --tail=15
```

**Verification:**
- Fresh volume: both migrations applied on first start; `schema_migrations` records both filenames with timestamps.
- Subsequent restart: `No pending migrations.` logged; backend starts normally.
- `GET /health` → `{"status":"ok","db":"connected"}` — database connection unaffected.
- `\d scores` confirms `CHECK (value > 0)` constraint; `\d games` confirms UUID PK, JSONB column, nullable `duration_ms`, and `CHECK (duration_ms >= 0)` constraint.

## Task 4 - Backend API

Commit:
- feat: add backend CRUD endpoints, validation, and tests

**What was done:**
- Added `zod` (v4), `jest@29`, `ts-jest@29`, `supertest`, and related `@types/*` packages. Downgraded from Jest 30 to Jest 29 because Node 21.7.3 is not listed in Jest 30's engine field (`^18.14.0 || ^20.0.0 || ^22.0.0`); same pattern as the Vite downgrade on the frontend.
- Created domain classes `Score` and `Game` with immutable `public readonly` constructor fields.
- Created `IScoreRepository` / `ScoreRepository` and `IGameRepository` / `GameRepository`. `ScoreRepository` queries `MIN(value)` ordering; `GameRepository` builds dynamic SET clauses for partial updates via an extracted private `buildUpdateSets` method (OOP method-length rule).
- Created `IScoreService` / `ScoreService` (enforces lower-score business rule in `submitScore`) and `IGameService` / `GameService` (pure delegation to the repository layer).
- Created `ScoreController` and `GameController`; controllers delegate entirely to services and map HTTP params/body to service calls.
- Created `validate` middleware using Zod `safeParse`, returning 400 with `result.error.issues` (Zod v4 renamed `.errors` to `.issues`). Created `asyncHandler` wrapper to catch async exceptions and forward to Express error middleware.
- Created Zod schemas in `scoreSchemas.ts` (positive integer for `value`) and `gameSchemas.ts` (`shape` and `colour` enums, `items` array min 1; `PatchGameSchema = PostGameSchema.partial()`).
- Refactored route files to factory functions (`createHealthRouter`, `createScoresRouter`, `createGamesRouter`) that accept injected services or DB — enables Supertest integration tests with mock dependencies and no real database.
- Updated `HealthController` to return plain text `"OK"` (200) or `"Service unavailable"` (500) as required by the spec; simplified field declaration to `constructor(private readonly db: ...)`.
- Updated `index.ts` `Application` class to wire all routes and register a global error handler returning 500 JSON on unhandled async exceptions.
- Wrote 27 Jest tests across 3 files: health (up/down/throw), scores (404 when none, 200 with data, 400 validation, business rule: first/lower/equal/higher), games (list, create, get, patch, delete — including 404 and 400 cases).

**Backend framework choice:**
- Express — already in place from Task 2. Minimal overhead, wide TypeScript support, well-suited for a small REST API. No compelling reason to replace it mid-project.

**API structure decisions:**
- Route factory functions inject a pre-built service; routes contain zero logic. Each controller method maps one HTTP action to one service call. Services hold all business rules. Repositories hold all SQL.
- `GET /health` is at `/health` (not `/api/health`) — matches the spec exactly.
- All game/score endpoints are under `/api/` per the spec.

**Validation approach:**
- Zod v4 schema-first. `validate(schema)` middleware in `src/middleware/validate.ts` wraps `safeParse` and returns `400 { error, details }` on failure. `asyncHandler` in `src/middleware/asyncHandler.ts` forwards uncaught async rejections to Express's error chain. A global error handler in `Application.configureErrorHandling()` returns `500 { error }` for anything that reaches it.

**How business rules are enforced:**
- `ScoreService.submitScore(value)`: fetches the current best score from the repository. If none exists, or `value < current.value`, inserts the new score and returns `{ accepted: true, score }`. Otherwise returns `{ accepted: false, reason }`. No insert occurs. Logic lives in the service class so it is fully unit-testable without HTTP or a real database.

**Tradeoffs:**
- Zod v4 over manual validation: composable, self-documenting, zero-repetition error output. Tradeoff: `PostGameSchema.partial()` for PATCH means a completely empty PATCH body passes validation (all fields optional). Acceptable because the repository handles the no-fields case by calling `findById` rather than running a no-op UPDATE.
- Scores table as append-log: `POST /api/best-score` only inserts; it never updates. The best score is always `SELECT ... ORDER BY value ASC LIMIT 1`. Simpler and fully auditable. Tradeoff: the table grows unbounded — acceptable for this project scope.
- Route factory functions over module-level singletons: makes routes fully testable without mocking the database module. Tradeoff: services are instantiated once per `Application` boot rather than lazily; negligible cost.

**Problems encountered:**
- `jest@30` / `@types/jest@30` — EBADENGINE warnings on Node 21.7.3 (odd-numbered non-LTS release not in Jest 30's engine list). Downgraded to `jest@29` and `ts-jest@29`; resolved immediately.
- `ts-jest@29` + `jest@30` version mismatch: `ts-jest@29` only supports `jest@29`. Fixed by the downgrade above.
- Zod v4 renamed `.errors` to `.issues` on `ZodError`. TypeScript caught the mismatch; fixed in `validate.ts`.
- `@types/express@5` types `req.params` values as `string | string[]` rather than plain `string`. Fixed with `req.params['id'] as string` in `GameController`.
- OOP reviewer flagged two violations: `HealthController.db` not `readonly` (fixed by using `constructor(private readonly db: ...)`) and `GameRepository.update` at ~30 lines (fixed by extracting `buildUpdateSets` private method). Both resolved before commit.

**Example requests used for testing (curl):**
```bash
curl http://localhost:3000/health

curl http://localhost:3000/api/best-score

curl -X POST http://localhost:3000/api/best-score \
  -H "Content-Type: application/json" \
  -d '{"value": 12000}'

curl http://localhost:3000/api/games

curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -d '{"items":[{"id":"1","shape":"triangle","colour":"red"}]}'

curl http://localhost:3000/api/games/<id>

curl -X PATCH http://localhost:3000/api/games/<id> \
  -H "Content-Type: application/json" \
  -d '{"completed":true,"duration_ms":8000}'

curl -X DELETE http://localhost:3000/api/games/<id>
```

**Terminal commands used:**
```bash
npm install zod
npm install --save-dev jest ts-jest supertest @types/jest @types/supertest
npm install --save-dev jest@^29 ts-jest@^29 @types/jest@^29 --legacy-peer-deps
npm test
```

**Verification:**
- `npm test` → 27/27 tests passing across 3 test files (health, scores, games).
- OOP reviewer: 0 violations after fixes.
- TypeScript compilation clean (verified via ts-jest during test run).

## Task 5 - Frontend API Integration

Commit:
- feat: connect frontend to backend API with session management and score sync

**What was done:**
- Created `frontend/src/services/ApiService.ts` — an OOP class implementing `IApiService` that wraps all HTTP calls using relative paths (`/api/...`). The Vite proxy in `vite.config.ts` already routes `/api` to the backend container, so no new env var was needed.
- Added `IApiService` interface in `ApiService.ts` so the store depends on the abstraction, not the concrete class.
- Extended `frontend/src/types/game.types.ts` with `ApiScore`, `ApiGame`, `ApiGameItem`, `SubmitScoreResponse` types to match the backend contract precisely.
- Extended `useGameStore` with two new state fields (`sessionId: string | null`, `bestScore: number | null`) and three new async actions (`loadBestScore`, `startGame` now async, `resetGame` fires API call).
- Extracted `handleGameCompletion(elapsedSeconds)` as a non-exported module-level async function (not in the store's public interface) — called via `void handleGameCompletion(...)` inside `handleDragEnd`'s synchronous `set(fn)` callback; this is the required pattern because Zustand's `set(fn)` is synchronous and cannot `await` inside the callback.
- Updated `App.tsx` to call `loadBestScore()` once on mount via `useEffect`, during the existing 600ms loading window.
- Updated `WellDoneModal.tsx` to accept `bestScore: number | null` and display a Best Score row with a "New best!" label when the current run is faster.
- Wrote 15 unit tests for `ApiService` using `vi.stubGlobal('fetch', ...)` with no MSW; all pass.
- Updated `WellDoneModal.test.tsx` with 5 new test cases covering best score display and the "New best!" label logic.
- OOP reviewer flagged 2 violations before commit, both fixed: `ApiService` missing `IApiService` interface; `_completeGame` in the public `GameStore` interface.

**How API calls are structured:**
- `ApiService` is a class with four public methods: `getBestScore`, `createGame`, `completeGame`, `submitScore`. Each delegates to a private HTTP helper (`get`, `post`, `patch`) that uses the native `fetch` API with relative paths.
- All successful responses call `console.debug('[Api] ...')` to satisfy the CLAUDE.md debug output requirement.
- `getBestScore` returns `null` on any failure (404, network error, 5xx) — graceful degradation.
- `createGame`, `completeGame`, `submitScore` throw on non-2xx; callers catch and log without blocking gameplay.

**How state syncs with backend:**
1. App mount → `loadBestScore()` → `GET /api/best-score` → store `bestScore` in seconds (converted from ms at the API boundary: `Math.round(score.value / 1000)`).
2. `startGame()` → initialises game state synchronously (UI transitions immediately to `'playing'`) → `POST /api/games` → stores returned UUID as `sessionId`.
3. `handleDragEnd` detects completion → `void handleGameCompletion(elapsedSeconds)` fires async:
   - `PATCH /api/games/:sessionId` with `{ duration_ms, completed: true, items }`
   - `POST /api/best-score` with `{ value: durationMs }`; if accepted, updates `bestScore` in store.
4. `resetGame()` → resets `sessionId: null` → fires `POST /api/games` to create a new session.

**Any issues with data flow:**
- Zustand's `set(fn)` callback is synchronous; async side effects on completion cannot be `await`-ed inside it. Resolved by extracting `handleGameCompletion` as a non-exported module-level async function and calling it with `void` after the synchronous state update.
- Race condition: if `createGame` is still pending when the user finishes the game, `sessionId` is `null` — the PATCH step is skipped but the score is still submitted. This is intentional graceful degradation; the session is simply not patched, which is acceptable for a coding test.
- `bestScore` is stored in seconds (matching `elapsedSeconds`) to keep the WellDoneModal comparison simple. Conversion from ms to seconds happens at the store boundary.

**Tradeoffs:**
- Relative API paths + Vite proxy: works transparently in Docker (proxy to `http://backend:3000`) and locally (proxy to `http://localhost:3000`). Tradeoff: the frontend cannot call the API directly without the Vite dev server (e.g., in a pure static CDN deployment). Acceptable for this project.
- `bestScore` updated after score submission resolves: the WellDoneModal renders first with the old best score, then optionally updates once the API responds. Avoids delaying the modal render on an API round-trip.
- `handleGameCompletion` as a module-level function rather than a store action: keeps the `GameStore` interface clean (no internal methods exposed). Tradeoff: the function is technically a non-class function containing domain-level API orchestration. Acceptable because it is not exported and is encapsulated to the store module.

**Problems encountered:**
- `_completeGame` was initially added to the `GameStore` interface, exposing an internal method to any component. Fixed before commit: extracted as non-exported `handleGameCompletion` function.
- `ApiService` was initially missing the `IApiService` interface. Fixed before commit: interface added in the same file, store uses `IApiService` type.

**Terminal commands used:**
```powershell
cd frontend
npx vitest run src/services/ApiService.test.ts   # verify 15 ApiService tests pass
npx vitest run                                   # verify all 74 tests pass (12 test files)
```

## Task 6 - Game Logic and Local Storage

Commit:
- Pending

What I did:
- TODO

Decisions:
- Game state model: TODO.
- Drop validation: TODO.
- Completion detection: TODO.
- Sharing mechanism: TODO.
- Local Storage structure: TODO.

Tradeoffs:
- TODO

Problems encountered:
- TODO

Terminal commands used:
```powershell
TODO
```

## Task 7 - Automated Tests

Commit:
- Pending

What I did:
- TODO

Decisions:
- Backend test approach: TODO.
- Frontend test approach: TODO.
- Coverage approach: TODO.

Tradeoffs:
- TODO

Problems encountered:
- TODO

Terminal commands used:
```powershell
TODO
```

## Task 8 - Debug Output and Screenshots

Commit:
- Pending

What I did:
- TODO

Decisions:
- Debug logging locations: TODO.
- Browser console testing approach: TODO.
- Screenshot files created: TODO.

Tradeoffs:
- TODO

Problems encountered:
- TODO

Terminal commands used:
```powershell
TODO
```

## Task 9 - README

Commit:
- Pending

What I did:
- TODO

Decisions:
- Documentation structure: TODO.
- Tradeoffs and limitations included: TODO.

Tradeoffs:
- TODO

Problems encountered:
- TODO

Terminal commands used:
```powershell
TODO
```

## Task 10 - Git Hosting

Commit:
- Pending

What I did:
- TODO

Decisions:
- Remote hosting choice: TODO.
- Feature branch name: TODO.

Tradeoffs:
- TODO

Problems encountered:
- TODO

Terminal commands used:
```powershell
TODO
```
