# Sorting Game Claude Code Instructions

This project is for the Unify Services sorting game coding test.

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + TypeScript
- Database: PostgreSQL
- Infrastructure: Docker + Docker Compose

## Coding Style — Clean Code + OOP (Mandatory)

All code on both frontend and backend **must** follow Clean Code principles using Object-Oriented design in TypeScript. This is a hard requirement, not a preference.

### OOP Rules (apply everywhere)

- **Classes over plain objects/functions** — encapsulate state and behavior together. Use classes for services, domain models, repositories, and any stateful logic.
- **Single Responsibility** — each class or component has one clearly stated reason to change.
- **Encapsulation** — keep internal state private; expose behavior through public methods only.
- **Abstraction** — define interfaces or abstract classes for every boundary (repository, service, domain rule). Code to the interface, not the implementation.
- **Composition over inheritance** — prefer injecting collaborators (constructor injection) over deep inheritance chains.
- **Dependency Injection** — pass dependencies in via the constructor; never instantiate them inside a class.
- **No raw procedural blocks** — do not write loose functions or bare logic files. Wrap all logic in a class.

### Frontend-specific OOP rules

- React components must be written as **class components** OR use a service/model class for all non-trivial logic, keeping the component itself a thin UI shell.
- Game state, move validation, scoring, and completion checks live in TypeScript classes (e.g., `GameService`, `BoardModel`), not inside component hooks or callbacks.
- Event handlers in components must delegate immediately to a service/domain class — no inline business logic.

### Backend-specific OOP rules

- Each route module delegates to a **controller class** which delegates to a **service class** which delegates to a **repository class**.
- Domain entities (e.g., `Game`, `Move`, `Board`) are TypeScript classes with typed fields and behavior methods — not plain interfaces with detached helper functions.
- No business logic in route files or middleware.

### Clean Code rules (apply everywhere)

- Meaningful names — classes, methods, and variables must say exactly what they are.
- Small methods — no method longer than ~20 lines. Extract until it reads like plain English.
- No comments that explain *what* the code does — only *why* if genuinely non-obvious.
- No magic numbers or strings — use named constants or enum values.
- DRY — never duplicate logic; extract shared behavior into a shared class or method.

## Required Workflow

- Work on a feature branch, not main.
- Keep changes aligned with the coding test PDF requirements.
- Use TypeScript-first code on both frontend and backend.
- Keep React components focused on UI and interaction.
- Keep game rules, validation, completion detection, and persistence logic in testable domain/service files (as classes — see Coding Style above).
- Add or update tests for meaningful behavior changes.
- Run `oop-reviewer` before each commit to verify OOP compliance.
- Run relevant checks before each commit.

## PROMPTS.md Rules

- Record every meaningful AI prompt from Claude Code, Codex, or other AI tools.
- Use the existing PROMPTS.md structure: Task, Prompts, Outcome, Code edited, Functionality or logic before change, Functionality or logic after change.
- Keep entries truthful and concise.
- Do not invent prompts, commands, outcomes, or decisions.

## commit.md Rules

- Update commit.md before each task commit.
- Include what changed, decisions, tradeoffs, problems encountered, terminal commands used, and verification.
- Keep one clear section per task or meaningful commit.

## Documentation Rules

- Update README.md when setup, API endpoints, database schema, state management, product behavior, tests, or tradeoffs change.
- Store required debug screenshots in docs/.
