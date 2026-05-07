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

Commit:
- Pending

What I did:
- TODO

Decisions:
- Service structure: TODO.
- Environment variables: TODO.
- Container communication: TODO.
- Database connection verification: TODO.

Tradeoffs:
- TODO

Problems encountered:
- TODO

Terminal commands used:
```powershell
TODO
```

## Task 3 - Database Migrations

Commit:
- Pending

What I did:
- TODO

Decisions:
- Schema design: TODO.
- Migration execution approach: TODO.

Tradeoffs:
- TODO

Problems encountered:
- TODO

Terminal commands used:
```powershell
TODO
```

## Task 4 - Backend API

Commit:
- Pending

What I did:
- TODO

Decisions:
- Backend framework choice: TODO.
- API structure: TODO.
- Validation approach: TODO.
- Business rule enforcement: TODO.
- Example requests used for testing: TODO.

Tradeoffs:
- TODO

Problems encountered:
- TODO

Terminal commands used:
```powershell
TODO
```

## Task 5 - Frontend API Integration

Commit:
- Pending

What I did:
- TODO

Decisions:
- API call structure: TODO.
- Frontend/backend state sync: TODO.

Tradeoffs:
- TODO

Problems encountered:
- TODO

Terminal commands used:
```powershell
TODO
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
