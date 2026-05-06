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

## Tech Choices

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

## Coding Style

This project should follow Clean Code principles with an object-oriented TypeScript style where it improves clarity.

General rules:
- Use meaningful names.
- Keep methods and components small.
- Prefer clear responsibilities over large mixed-purpose files.
- Avoid magic numbers and magic strings.
- Prefer explicit types for domain data.
- Add comments only when they explain why, not what.

OOP guidance:
- Use classes or well-bounded services for domain logic such as:
  - game setup
  - drop validation
  - completion detection
  - score handling
  - persistence coordination
- Prefer composition over inheritance.
- Inject dependencies where it helps testing and separation of concerns.
- Keep UI components from becoming the place where all game logic lives.

React guidance:
- Use functional React components.
- Let components delegate non-trivial logic to domain or service classes.
- Keep event handlers light and readable.

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
- Keep it truthful.
- Log meaningful prompts from Claude Code, Codex, or other AI tools used on the project.
- Do not invent prompts, outcomes, or code changes.

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
- keep the repo documentation in sync with the code
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

