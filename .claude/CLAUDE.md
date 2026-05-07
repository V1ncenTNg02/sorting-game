# CLAUDE.md

## Project Overview

This repository is for the Unify Services Sorting Game coding test.

The goal is to build a full-stack colour and shape sorting game with:
- a frontend in React + Vite + TypeScript
- a backend in Node.js + TypeScript
- a PostgreSQL database with migrations
- Docker and Docker Compose
- automated frontend and backend tests
- supporting project documentation and debug screenshots

The app should allow a player to start a game, drag shapes into matching colour or shape buckets, track completion time, persist progress locally, persist the best score in the database, and share completed game sessions.

## Required Deliverables

Make sure the repository ends up with:
- frontend application
- backend API
- PostgreSQL schema and migrations
- Docker setup
- automated tests
- `README.md`
- `PROMPTS.md`
- `commit.md`
- debug screenshots under `docs/`

## Stack

Use these project defaults unless the user explicitly changes direction:
- Frontend: React + Vite + TypeScript
- Backend: Node.js + TypeScript
- Database: PostgreSQL
- Infrastructure: Docker + Docker Compose
- Frontend state management: Zustand

Preferred frontend testing stack:
- Vitest
- React Testing Library

Preferred backend testing stack:
- Jest or Vitest
- Supertest

Preferred backend validation approach:
- schema-based request validation such as Zod

## Product Requirements

The game must support:
- Shapes: triangle, square, circle
- Colours: red, green, blue
- At least 10 items
- Drag-and-drop sorting
- Correct drops stay in place
- Incorrect drops return to the unsorted area
- Timer-based scoring
- Well Done modal on completion
- Local Storage persistence for game progress
- Database persistence for best score
- Shareable game sessions or score links

Expected backend endpoints:
- `GET /health`
- `GET /api/best-score`
- `POST /api/best-score`
- `GET /api/games`
- `POST /api/games`
- `GET /api/games/:id`
- `PATCH /api/games/:id`
- `DELETE /api/games/:id`

Business rule:
- A new best score can replace the stored best score only if it is lower.

## Architecture Guidance

Keep the app easy to reason about and easy to test.

Frontend guidance:
- Keep React components focused on rendering and user interaction.
- Put non-trivial game rules in TypeScript domain or service classes.
- Keep core game truth in global state:
  - game started status
  - items
  - bucket assignments
  - timer state
  - completion state
  - best score
  - current session id
  - loading and error state
- Keep short-lived visual state local to components:
  - hover styling
  - animation flags
  - purely presentational UI state

Backend guidance:
- Keep routes thin.
- Separate responsibilities into clear layers where practical:
  - route
  - controller
  - service
  - repository
- Keep validation, persistence, and business rules out of route handlers.

Database guidance:
- Create at least `scores` and `games` tables.
- `games` should support storing game sessions and shareable state/result data.
- `scores` should support storing or enforcing the best score requirement.

## Coding Style — Clean Code + OOP (Mandatory)

All code on both frontend and backend must follow Clean Code principles using Object-Oriented design in TypeScript. This is a hard requirement, not a preference.

### OOP Rules

- Classes over plain objects/functions: encapsulate state and behavior together. Use classes for services, domain models, repositories, and any stateful logic.
- Single Responsibility: each class or component has one clearly stated reason to change.
- Encapsulation: keep internal state private; expose behavior through public methods only.
- Abstraction: define interfaces or abstract classes for boundaries such as repositories, services, and domain rules. Code to the interface, not the implementation.
- Composition over inheritance: prefer injecting collaborators over deep inheritance chains.
- Dependency Injection: pass dependencies in via the constructor; do not instantiate them inside a class when avoidable.
- No raw procedural blocks: avoid loose business-logic files with detached behavior. Wrap non-trivial logic in cohesive classes or services.

### Frontend-Specific OOP Rules

- Use functional React components as thin UI shells.
- Non-trivial logic must live in service, model, or domain classes.
- Game state, move validation, scoring, and completion checks must live outside components.
- Event handlers in components should delegate quickly to service or domain classes.
- Do not place business logic directly inside hooks or inline callbacks.

### Backend-Specific OOP Rules

- Each route module should delegate to a controller class, which delegates to a service class, which delegates to a repository class.
- Domain entities such as `Game`, `Move`, and `Board` should be modeled as TypeScript classes with typed fields and behavior methods.
- No business logic in route files or middleware.

### Clean Code Rules

- Use meaningful names.
- Keep methods and components small.
- Prefer clear responsibilities over large mixed-purpose files.
- Avoid magic numbers and magic strings.
- Prefer explicit types for domain data.
- Add comments only when they explain why, not what.
- Keep code DRY by extracting shared behavior into shared methods or classes.

## Required Workflow

- Work on a feature branch, not `main`.
- Keep changes aligned with the coding test PDF requirements.
- Use TypeScript-first code on both frontend and backend.
- Keep React components focused on UI and interaction.
- Keep game rules, validation, completion detection, and persistence logic in testable domain or service files.
- Add or update tests for meaningful behavior changes.
- Run `oop-reviewer` before each commit to verify OOP compliance.
- Run relevant checks before each commit.
- Keep documentation in sync with code changes.

## Testing Expectations

Follow a TDD-friendly workflow where practical:
- write or update tests for meaningful behavior changes
- keep tests aligned with the coding test requirements
- run only the relevant test suites when possible

Frontend tests should cover:
- rendering of the game
- valid drop behavior
- invalid drop behavior
- completion flow
- share link reload behavior

Backend tests should cover:
- valid score submission
- invalid score rejection
- best score rule enforcement
- session creation
- games CRUD operations

## Documentation Workflow

### PROMPTS.md

`PROMPTS.md` is the AI usage log.

Update it after any meaningful AI-assisted task.

Use this structure:
- Task
- Prompts
- Outcome
- Code edited
- Functionality or logic before change
- Functionality or logic after change

Rules:
- Keep it truthful and concise.
- Log meaningful prompts from Claude Code, Codex, or other AI tools used on the project.
- Do not invent prompts, commands, outcomes, decisions, or code changes.

### commit.md

`commit.md` is the engineering log.

Update it before each meaningful task commit.

Each relevant section should include:
- what changed
- decisions made
- tradeoffs
- problems encountered
- terminal commands used
- verification notes where relevant

Keep it concise, factual, and specific to actual work completed.

### README.md

Update `README.md` as the project evolves, especially when these change:
- setup steps
- Docker commands
- migrations
- tests
- API endpoints
- database schema
- state management approach
- product behavior
- tradeoffs and limitations

### Debug Screenshots

- Store required debug screenshots in `docs/`.

## Git Workflow

- Do not commit directly to `main`.
- Work from a feature branch.
- Make one meaningful commit per task or logical unit of work.
- Use clear commit messages in the form:
  - `type: short clear change`

Examples:
- `feat: build sorting game UI`
- `fix: enforce lower best score rule`
- `test: add session API coverage`
- `docs: update README and commit log`

## Working Style For Claude

When helping on this project:
- align changes to the coding test requirements
- prefer small, testable, focused edits
- keep repo documentation in sync with the code
- verify behavior after changes
- surface tradeoffs clearly when there is more than one reasonable implementation path

If implementation details are still undecided, prefer:
- React patterns that keep components thin
- Zustand for shared frontend state
- class- or service-based game logic in TypeScript
- thin backend routes with testable business logic

## Debugging Requirement

The browser console must expose debug output for:
- dragged item events
- target bucket on drop
- validation result
- game state
- API responses

Store debug screenshots under `docs/`.