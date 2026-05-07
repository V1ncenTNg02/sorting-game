# PROMPTS.md

This file is a running log of AI-assisted work during development. Entries are grouped by project phase and summarize meaningful prompts, outcomes, files changed, and any functionality/logic changes.

## Planning

### Task: Understand the coding test requirements

Prompts:
```text
This is PDF of a coding test I am working on. Now I want to understand the requirements in this test. Read this file and I will ask you some questions
```

Outcome:
- Read and summarized the Unify Services sorting game coding test PDF.
- Identified the required frontend, backend, database, Docker, test, documentation, screenshot, and Git deliverables.
- Clarified that the project should be completed through a sequence of task-based commits.

Code edited:
- None.

Functionality or logic before change:
- No project functionality existed yet.

Functionality or logic after change:
- No code changed. Requirements were clarified for planning.

### Task: Clarify what should be recorded in PROMPTS.md

Prompts:
```text
For the prompt file, what exactly do I need to put into it if I work with AI including Claude code and Codex
```

```text
what about the Prompt file?
```

Outcome:
- Clarified that meaningful AI prompts from both Codex and Claude Code should be recorded.
- Decided that PROMPTS.md should include the tool used, task, prompt, outcome, and whether output was used.
- Clarified that AI can help maintain PROMPTS.md as long as the entries remain truthful.

Code edited:
- None.

Functionality or logic before change:
- No project functionality existed yet.

Functionality or logic after change:
- No code changed. Documentation expectations were clarified.

### Task: Clarify what should be recorded in commit.md

Prompts:
```text
for the commit file, do I need to record all my thinkings and my decisions or just one for each step?
```

```text
has the file mentioned whether I can use AI to maintain the commit file?
```

Outcome:
- Clarified that commit.md should be a running engineering log organized around each required task/commit.
- Decided that it does not need every internal thought, but should include important decisions, tradeoffs, problems, and terminal commands.
- Clarified that AI can help maintain commit.md as long as the content reflects real work.

Code edited:
- None.

Functionality or logic before change:
- No project functionality existed yet.

Functionality or logic after change:
- No code changed. Engineering log expectations were clarified.

### Task: Understand how to write effective AI prompts

Prompts:
```text
what is a good structure for a prompt to AI?
```

Outcome:
- Defined a reusable prompt structure: context, goal, constraints, output format, and acceptance criteria.
- Identified prompt patterns for coding, debugging, tests, README, PROMPTS.md, and commit.md work.
- Decided that prompts should be specific and should not allow AI to invent work or decisions.

Code edited:
- None.

Functionality or logic before change:
- No project functionality existed yet.

Functionality or logic after change:
- No code changed. AI workflow guidance was clarified.

### Task: Identify files that must be maintained throughout development

Prompts:
```text
in this project, can you tell me what files do I need to maintain throughout the development of this game?
```

Outcome:
- Identified the main ongoing tracking files: PROMPTS.md, commit.md, and README.md.
- Identified other required deliverables: frontend code, backend code, migrations, Docker files, tests, and debug screenshots under docs/.

Code edited:
- None.

Functionality or logic before change:
- No project functionality existed yet.

Functionality or logic after change:
- No code changed. Required project files were clarified.

### Task: Choose the frontend stack

Prompts:
```text
Now I need to understand the available tech stacks and make decisions on the tech for this project. First question: for this project which framework I should use? React or Vue? Remember we need to use Typescript for OOP and Vue. And tell me the pros and cons for each choice
```

```text
Is React a good choice with TypeScript and Vite? What exactly is Vite?
```

```text
Considering all components in the frontend which are required in the document, like the state management, which set of framework choice is better? tell me pros and cons in short words
```

Outcome:
- Compared React and Vue for this coding test.
- Decided that React + Vite + TypeScript is the better practical frontend choice.
- Clarified that Vite is the frontend development server/build tool, while React is the UI library.
- Recommended Zustand as the likely state management choice because it is simple, TypeScript-friendly, and appropriate for this game.

Code edited:
- None during the planning discussion.

Functionality or logic before change:
- No frontend stack had been finalized.

Functionality or logic after change:
- No app code changed. The planned frontend stack became React + Vite + TypeScript, likely with Zustand.

### Task: Understand React, Vue, Vite, and frontend app servers

Prompts:
```text
without Vite, what is the app server to run React Project?
```

```text
if I code in react, I can still run the code, what is the server to be more specfic
```

```text
what if I don't use Vite and just use React and no other framework?
```

```text
No I am just trying to figure out what exactly is react. If I build an app only using react, how to run it?
```

```text
what about create react app, what does it do?
```

```text
so react is just a framework for developers to code HTML JS and CSS in the React way faster, and then covert the code into these three files, and we need a server to run it is that correct?
```

```text
so Vue is similar as React right? Just like a UI framework for the web code, not the server itself?
```

```text
so I can code TypeScript with both React and Vue?
```

Outcome:
- Clarified that React and Vue are frontend UI technologies, not backend servers.
- Clarified that Vite provides the development server and build pipeline for the frontend.
- Clarified that Create React App is older React tooling and is not appropriate for this test because Vite is required.
- Confirmed that both React and Vue can be used with TypeScript.

Code edited:
- None.

Functionality or logic before change:
- No project functionality existed yet.

Functionality or logic after change:
- No code changed. Frontend architecture concepts were clarified.

### Task: Plan frontend state management

Prompts:
```text
Tell me in this game, what kind of State management do I need and how to implement that
```

```text
Global state

game started or not
all items
bucket assignments
timer state
completion state
best score
current session id
loading/error flags
Local component state

temporary drag hover styling
modal open animation details
purely visual UI flags

what are the reasons to make them global or local? Why do we need them to be global? How many frontend pages do we need? What do we need to store in the DB?
```

Outcome:
- Planned the split between global state and local component state.
- Decided that core game truth should be global: items, bucket assignments, timer, completion, best score, current session id, and loading/error state.
- Decided that short-lived visual state should remain local: hover styling, animation state, and purely presentational flags.
- Identified likely frontend routes: main game page and a shareable game/session route or query parameter.
- Planned database storage around scores and games.

Code edited:
- None.

Functionality or logic before change:
- No frontend state model existed.

Functionality or logic after change:
- No code changed. The intended state model and persistence boundaries were clarified.

### Task: Choose the backend stack

Prompts:
```text
which backend is the better choice if I need to choose from either JS or Python? Doesn't need to be the one metioned in the document
```

```text
what are the functionalities for this game backend? Anything else except CRUD?
```

```text
so thinking from a higher architectural perspective, there is actually nothing very serious stopping us from using node.js or fastApi right?
```

Outcome:
- Compared Node.js/TypeScript and Python/FastAPI for the backend.
- Decided that Node.js + TypeScript is the better practical choice for this project because it matches the frontend language family.
- Clarified that the backend responsibilities include CRUD, health checks, validation, best-score business rules, persistence, and shareable game sessions.
- Confirmed that both Node.js and FastAPI are architecturally valid, but Node.js + TypeScript gives a more consistent full-stack story.

Code edited:
- None during the planning discussion.

Functionality or logic before change:
- No backend stack had been finalized.

Functionality or logic after change:
- No backend code changed. The planned backend stack became Node.js + TypeScript.

### Task: Create initial documentation and tracking files

Prompts:
```text
I will use React + Vite + TypeScript for the frontend, Node.js + TypeScript for the backend. Help me generate the files we need to keep track with like prompts.md, commits.md, etc.
```

Outcome:
- Created initial project tracking files.
- Added the selected frontend and backend stack to README.md and commit.md.
- Added a docs/ folder placeholder for required debug screenshots.
- Noted a Git safe directory warning encountered while checking repository status.

Code edited:
- PROMPTS.md
- commit.md
- README.md
- docs/.gitkeep

Functionality or logic before change:
- The repository only had an empty CLAUDE.md and no tracking documentation.

Functionality or logic after change:
- The repository had starter documentation files for prompt logging, engineering logs, README documentation, and debug screenshot storage.
- No application runtime functionality was added yet.

### Task: Plan Claude Code usage for future development

Prompts:
```text
also based on all requirements in the coding test document, if there is any claude code plugin I should use to better align my code with the requirement? Like the TDD, OOP, etc?
```

```text
I want to use Claude code for the further development, please give me a todo list from the developer perspective saying that what I need to do step by step in bullet points
```

Outcome:
- Decided that no specific Claude Code plugin is strictly required.
- Recommended using a clear CLAUDE.md instruction file and disciplined prompts rather than relying on plugins.
- Produced a developer-oriented step-by-step todo list aligned with the coding test tasks.
- Identified future development focus areas: TDD, OOP-style domain logic, Docker, migrations, API, frontend integration, localStorage, tests, debug screenshots, README, and Git hosting.

Code edited:
- None.

Functionality or logic before change:
- No implementation plan existed beyond the PDF requirements.

Functionality or logic after change:
- No code changed. A task-by-task development plan was clarified for future Claude Code work.

### Task: Reorganize PROMPTS.md into planning summary format

Prompts:
```text
help me update the prompts read me file with summarization of the chats we had, group them under ##Planning instead of date and time, with the structure of Task, prompts, outcome, code edited (if any), functionality or logic before and after change (if code updated)
```

Outcome:
- Reorganized PROMPTS.md from date-based entries into a Planning section.
- Summarized the meaningful planning prompts and outcomes from the conversation.
- Added code edited and before/after functionality notes for each task.

Code edited:
- PROMPTS.md

Functionality or logic before change:
- PROMPTS.md was organized by date and contained only a few early prompt entries.

Functionality or logic after change:
- PROMPTS.md is organized under ## Planning and captures the broader planning conversation in the requested structure.
- No application runtime functionality changed.

### Task: Create prompt-file-helper and commit-file-helper skills

Prompts:
```text
Let me draft the prompt file helper and commit file helper skills. The template for the prompt file helper: [provided PROMPTS.md template structure]. There are two templates for the commit.md file, for general ones: [general fields]. For some tasks: [scaffold/setup fields].
```

Outcome:
- Created SKILL.md for prompt-file-helper with step-by-step instructions for appending entries to PROMPTS.md using the required template format.
- Created SKILL.md for commit-file-helper with two inline formats: general log and scaffold/setup log.
- Both skills enforce the "no invented content" rule from CLAUDE.md.
- Output was used fully.

Code edited:
- .claude/skills/prompt-file-helper/SKILL.md
- .claude/skills/commit-file-helper/SKILL.md

Functionality or logic before change:
- Both skill files existed but were empty.

Functionality or logic after change:
- prompt-file-helper instructs Claude to read PROMPTS.md, determine the correct section, gather task/prompts/outcome/files/before-after fields, and append a correctly formatted entry.
- commit-file-helper instructs Claude to choose between general and scaffold/setup formats and append to commit.md.

### Task: Split commit-file-helper into separate template files

Prompts:
```text
split two formats of commit.md into two templates files and use them by their name in the skill file.
```

Outcome:
- Extracted the two commit.md formats from SKILL.md into standalone template files.
- Updated SKILL.md to reference templates by filename instead of inlining them.
- Output was used fully.

Code edited:
- .claude/skills/commit-file-helper/SKILL.md
- .claude/skills/commit-file-helper/template-general.md
- .claude/skills/commit-file-helper/template-scaffold.md

Functionality or logic before change:
- Both commit.md formats were defined inline inside SKILL.md.

Functionality or logic after change:
- template-general.md holds the general log format; template-scaffold.md holds the scaffold/setup format.
- SKILL.md references both template files by name and instructs Claude to read the correct one.

### Task: Add asyncRewake Stop hook to auto-invoke skills

Prompts:
```text
add them to the setting.json and add hooks to execute those skills after response to the prompt is finished.
```

```text
I want them to be strictly used by Claude Code at the end of every conversation, not manually, what are the approaches to do that?
```

```text
implement the second option
```

Outcome:
- Clarified that hooks run shell commands and cannot directly invoke Claude skills; skills require an active Claude turn with conversation context.
- Identified three approaches: CLAUDE.md rule, asyncRewake Stop hook, agent-type Stop hook.
- Implemented a Stop hook with asyncRewake: true that checks whether PROMPTS.md and commit.md were updated in the last 3 minutes; exits 2 (re-wake) if not, exits 0 (stop) if yes, breaking the infinite loop.
- Output was used fully.

Code edited:
- .claude/settings.json

Functionality or logic before change:
- settings.json was empty. The skills existed but had to be invoked manually.

Functionality or logic after change:
- A Stop hook fires after every Claude turn. If PROMPTS.md and commit.md have not been updated in the last 3 minutes, Claude is automatically re-woken and instructed to invoke both skills. Once the files are updated, the hook exits 0 and the loop ends.

### Task: Create TDD skill and automated test runner hook

Prompts:
```text
Implement the TDD skill to write test code before implementing the functionalities, and write a testing script for the frontend and backend. when every conversation ends, run the corresponding scripts to test whether the implementation has no bug (only run frontend testing if only frontend code is changed, vice versa.). I will use React + Vite + TypeScript for the frontend and TypeScript + Node.js for the backend.
```

Outcome:
- Created a TDD skill (SKILL.md) covering the red-green-refactor cycle, testing stacks for both frontend (Vitest + React Testing Library) and backend (Jest + ts-jest + Supertest), one-time setup instructions, and rules.
- Created a PowerShell test dispatcher script that uses git diff to detect whether frontend or backend files changed, runs only the relevant suite, outputs results as a systemMessage, and uses a 5-minute sentinel file to avoid re-running on the asyncRewake docs turn.
- Updated settings.json to add the test runner as a first Stop hook group (synchronous) before the existing asyncRewake skill-logging hook group.
- Output was used fully.

Code edited:
- .claude/skills/tdd/SKILL.md
- .claude/scripts/run-tests.ps1
- .claude/settings.json

Functionality or logic before change:
- No TDD skill existed. Tests were not run automatically at the end of conversations. settings.json had one Stop hook group for skill logging.

Functionality or logic after change:
- Invoking /tdd before a feature task gives Claude step-by-step TDD instructions and framework setup guidance.
- After every conversation turn that touches frontend/ or backend/ files, the test dispatcher runs the appropriate suite and shows results to the user via systemMessage.
- settings.json now has two Stop hook groups: test runner (synchronous, runs first) then skill logger (asyncRewake, runs in background).

### Task: Set up Claude Code hooks for documentation workflow reminders

Prompts:
```text
i want to automate the skills execution with Claude Code hooks after every prompt sent and after code editing, how to set it up?
```

Outcome:
- Checked current Claude Code hook documentation for `UserPromptSubmit` and `PostToolUse`.
- Added project-level Claude Code hooks that inject workflow reminders after each user prompt and after file edits.
- Added project-level Claude instructions for maintaining PROMPTS.md, commit.md, README.md, and coding-test workflow discipline.
- Validated the hook settings JSON and tested both PowerShell hook scripts with sample hook input.

Code edited:
- .claude/settings.json
- .claude/hooks/prompt-log-reminder.ps1
- .claude/hooks/code-change-reminder.ps1
- .claude/CLAUDE.md
- PROMPTS.md
- commit.md

Functionality or logic before change:
- Claude Code had no project-level hooks or workflow instructions.
- PROMPTS.md and commit.md maintenance depended on manual memory.

Functionality or logic after change:
- Claude Code receives an automatic reminder after every submitted prompt to update PROMPTS.md when the prompt meaningfully affects the project.
- Claude Code receives an automatic reminder after file edits to update PROMPTS.md, commit.md, and README.md when appropriate.
- No application runtime functionality changed.

### Task: Add Clean Code + OOP coding style requirement and create OOP-reviewer skill

Prompts:
```text
There is a requirement for the coding style: Clean Code which uses Object Orientation (Typescript). For both frontend and backend, component should be written in the OOP way. Write this rule in the Claude.md file and update the OOP reviewer skill file to review changes see if they align with the requirements.
```

Outcome:
- Added a mandatory "Coding Style — Clean Code + OOP" section to CLAUDE.md covering OOP rules (classes, SRP, encapsulation, abstraction, DI, no procedural blobs), frontend-specific rules (thin components, game logic in classes, delegating event handlers), backend-specific rules (route → controller → service → repository layering, domain entities as classes), and Clean Code rules (naming, method length, comments, magic values, DRY).
- Created SKILL.md for the OOP-reviewer skill with a full checklist, structured PASS/FAIL report format, and a rule that commits are blocked until zero violations remain.
- Output was used fully.

Code edited:
- .claude/CLAUDE.md
- .claude/skills/OOP-reviewer/SKILL.md

Functionality or logic before change:
- CLAUDE.md had a single soft line: "Prefer OOP-style classes or services when they make the game rules clearer."
- The OOP-reviewer skill directory existed but was empty — the skill could not be invoked.

Functionality or logic after change:
- CLAUDE.md mandates Clean Code + OOP across all TypeScript code on both frontend and backend, with specific rules for each layer.
- The workflow now requires running /oop-reviewer before each commit to verify compliance.
- The OOP-reviewer skill reads changed files, applies a structured checklist, produces a PASS/FAIL report with file paths and line numbers, and blocks the commit until all violations are resolved.

## Task 1 — UI Only (No API)

### Task: Plan and clarify Task 1 — UI only frontend

Prompts:
```text
UNIFY SERVICES DEV TEST... here is the full text of the requirement, plan for the task one and ask me any clarifying questions one by one
```

```text
Give me top five options and the pros and cons of them, And also how well they work with the react Vite and typeScript
```

```text
include the dnd-kit and react beautiful dnd, compare them with the options you provided
```

Outcome:
- Compared DnD library options including @dnd-kit/core, react-beautiful-dnd, react-dnd, dnd-kit full, and others with pros/cons for React + Vite + TypeScript.
- Decided on @dnd-kit/core as the DnD library — modern, accessible, no HTML5 quirks, composable with service classes.
- Decided on Tailwind CSS v4 (via @tailwindcss/vite) for styling — no config file needed.
- Entered plan mode; produced a full implementation plan with folder structure, domain/service class interfaces, Zustand store schema, UI layout, and TDD implementation steps.
- Plan approved by user.

Code edited:
- None.

Functionality or logic before change:
- No frontend code existed.

Functionality or logic after change:
- No code changed. The full Task 1 plan was finalised and approved.

### Task: Scaffold frontend and implement domain + service layer with TDD

Prompts:
```text
[Plan approved — implementation began automatically from the approved plan]
```

Outcome:
- Scaffolded the Vite 6 + React + TypeScript frontend (downgraded from Vite 8 + Vitest 4 because Node 21.7.3 is incompatible with rolldown native bindings required by Vite 8/Vitest 4).
- Switched test environment from jsdom to happy-dom due to a CJS/ESM conflict in jsdom@29 on Node 21.
- Implemented constants, types, domain classes (ShapeItem, Bucket), and service classes (GameService, DragDropService) following strict TDD (red-green-refactor) and OOP rules.
- 22/22 tests passing across 4 test files after service layer was complete.
- Output was used fully.

Code edited:
- frontend/package.json
- frontend/vite.config.ts
- frontend/vitest.setup.ts
- frontend/src/index.css
- frontend/src/types/game.types.ts
- frontend/src/constants/game.constants.ts
- frontend/src/domain/ShapeItem.ts
- frontend/src/domain/ShapeItem.test.ts
- frontend/src/domain/Bucket.ts
- frontend/src/domain/Bucket.test.ts
- frontend/src/services/GameService.ts
- frontend/src/services/GameService.test.ts
- frontend/src/services/DragDropService.ts
- frontend/src/services/DragDropService.test.ts

Functionality or logic before change:
- No frontend application code existed.

Functionality or logic after change:
- Domain and service layers fully implemented and tested.
- ShapeItem entity: holds id, shape, colour; has matchesColourBucket and matchesShapeBucket methods.
- Bucket entity: holds id, kind, label; has accepts(item) method delegating to ShapeItem matchers.
- GameService: generates 12 items (all 9 combos + 3 extras) and 6 buckets (3 colour + 3 shape); checks completion by empty unsorted list.
- DragDropService: handleDragEnd extracts active/over ids, removes dropped item from unsorted list, returns DropResult or null.

### Task: Build Zustand store and all UI components with TDD

Prompts:
```text
[Continued from previous session — implementation resumed from in_progress Zustand store task]
```

Outcome:
- Created the Zustand store (useGameStore) with status, unsortedItems, buckets, elapsedSeconds; actions delegate to GameService and DragDropService, no logic inside the store.
- Built all 8 components: ShapeIcon (SVG renderer), LoadingScreen (spinner), Timer (MM:SS formatter), ShapeCard (useDraggable wrapper), BucketZone (useDroppable wrapper), UnsortedArea (grid + empty state), WellDoneModal (overlay with time + Play Again), GameBoard (DndContext root with sidebar buckets and unsorted area).
- Wrote TDD tests for ShapeCard, BucketZone, UnsortedArea, WellDoneModal, and GameBoard; fixed mock pattern from vi.mocked(require(...)) to vi.spyOn for @dnd-kit/core hooks.
- Excluded test files from tsconfig.app.json to fix tsc -b build errors from test-only types.
- Built App component as a status-driven screen router: loading → idle → playing/complete.
- 34/34 tests passing; clean production build; dev server live at localhost:5173.
- Output was used fully.

Code edited:
- frontend/src/store/useGameStore.ts
- frontend/src/components/ShapeIcon/ShapeIcon.tsx
- frontend/src/components/LoadingScreen/LoadingScreen.tsx
- frontend/src/components/Timer/Timer.tsx
- frontend/src/components/ShapeCard/ShapeCard.tsx
- frontend/src/components/ShapeCard/ShapeCard.test.tsx
- frontend/src/components/Bucket/BucketZone.tsx
- frontend/src/components/Bucket/Bucket.test.tsx
- frontend/src/components/UnsortedArea/UnsortedArea.tsx
- frontend/src/components/UnsortedArea/UnsortedArea.test.tsx
- frontend/src/components/WellDoneModal/WellDoneModal.tsx
- frontend/src/components/WellDoneModal/WellDoneModal.test.tsx
- frontend/src/components/GameBoard/GameBoard.tsx
- frontend/src/components/GameBoard/GameBoard.test.tsx
- frontend/src/App.tsx
- frontend/tsconfig.app.json

Functionality or logic before change:
- Domain and service layer complete with 22 tests passing. No UI components existed. App.tsx was the Vite scaffold default.

Functionality or logic after change:
- Full UI-only game is functional: loading screen → idle start screen → game board with 12 draggable shapes and 6 droppable buckets → well-done modal when all items sorted.
- Drag and drop wired end-to-end (no validation in Task 1 — any item accepted by any bucket).
- Timer shows static 00:00. Well-done modal shows elapsed time and a Play Again button that resets to idle.
- 34/34 tests passing; production build clean.

### Task: Redesign frontend layout, logic, and visuals to match reference image

Prompts:
```text
Refer to the image and the instructions below, to revise the layout and logic of the frontend: Build a colour-and-shape sorting game based on the attached reference image.

Overall layout: Full-page game screen with a very light grey or white background. Minimal top bar across the full width. Narrow left sidebar for drop targets. Large main play area for unsorted draggable items. Thin footer/status bar at the bottom.

Top bar: Left side shows Time and Items Left. Right side shows Reset action.

Left sidebar: Title DROP TARGETS. Vertical list of target buckets. Each row: small outlined shape icon in correct color, label text, small circular badge showing count for that target.

Main play area: Title Unsorted Items. Subtitle instruction text. Large open canvas area. Scatter draggable outlined shapes around the canvas with lots of whitespace. In the lower-right area, include a faint ghosted bucket/grid hint.

Footer: 6 BUCKETS ACTIVE on left. Small green status indicator, System Ready, v1.2.0 on right.

Game logic: Buckets defined by shape + color combinations. Correct drop removes item from unsorted, increments bucket count, decrements items-left. Wrong drop returns item to original position. Timer starts when game starts and stops on completion. Reset restores all items, resets timer. Visual-only states remain separate from core game state. Use outlined shapes not filled shapes.
```

Outcome:
- Completely redesigned the frontend layout, logic, and visual style to match the reference image.
- Buckets changed from separate colour/shape categories to 7 specific shape+colour combination targets (Red Triangle, Red Square, Blue Triangle, Blue Circle, Green Triangle, Green Square, Blue Square).
- Drop validation now requires both shape and colour to match the target bucket; wrong drops snap back automatically.
- Timer is now functional — starts on game start, ticks every second, stops on completion.
- All shapes changed from filled SVGs to outlined SVGs (stroke-only, no fill).
- Items changed from grid layout to scattered absolute positioning with percentage-based coordinates.
- New components created: TopBar, SidebarTarget, GhostGrid, Footer.
- 54/54 tests passing after updates; clean production build.
- Output was used fully.

Code edited:
- frontend/src/types/game.types.ts
- frontend/src/constants/game.constants.ts
- frontend/src/domain/ShapeItem.ts
- frontend/src/domain/ShapeItem.test.ts
- frontend/src/domain/Bucket.ts
- frontend/src/domain/Bucket.test.ts
- frontend/src/services/GameService.ts
- frontend/src/services/GameService.test.ts
- frontend/src/services/DragDropService.ts
- frontend/src/services/DragDropService.test.ts
- frontend/src/store/useGameStore.ts
- frontend/src/components/ShapeIcon/ShapeIcon.tsx
- frontend/src/components/ShapeCard/ShapeCard.tsx
- frontend/src/components/ShapeCard/ShapeCard.test.tsx
- frontend/src/components/Bucket/Bucket.test.tsx
- frontend/src/components/UnsortedArea/UnsortedArea.tsx
- frontend/src/components/UnsortedArea/UnsortedArea.test.tsx
- frontend/src/components/GameBoard/GameBoard.tsx
- frontend/src/components/GameBoard/GameBoard.test.tsx
- frontend/src/components/TopBar/TopBar.tsx (new)
- frontend/src/components/TopBar/TopBar.test.tsx (new)
- frontend/src/components/SidebarTarget/SidebarTarget.tsx (new)
- frontend/src/components/SidebarTarget/SidebarTarget.test.tsx (new)
- frontend/src/components/GhostGrid/GhostGrid.tsx (new)
- frontend/src/components/Footer/Footer.tsx (new)
- frontend/src/App.tsx

Functionality or logic before change:
- Buckets were separate colour-only and shape-only categories (6 buckets total). Any item was accepted by any bucket (no validation). Timer showed static 00:00. Shapes were filled SVGs. Items were arranged in a 4-column grid. Layout had a two-column board with colour and shape sections in the sidebar.

Functionality or logic after change:
- Buckets are 7 shape+colour combinations listed in a narrow sidebar as droppable target rows. Drop validation requires exact shape and colour match; wrong drops return item to board. Timer ticks every second from game start and stops on completion. Shapes are outlined SVGs (stroke only). Items are scattered at fixed percentage positions across the canvas. Layout matches the reference image: top bar (time/items-left/reset), sidebar (drop targets with count badges), main board (heading, instruction, canvas with scattered items and ghost grid), footer (bucket count, system status). 54/54 tests passing.

## Task 2 - Docker Setup

### Task: Plan and implement Docker Compose setup for frontend, backend, and PostgreSQL

Prompts:
```text
2) Docker Setup (Frontend + Backend + Database)
Create a Docker Compose setup with:
• Frontend service
• Backend service
• PostgreSQL database
Ensure services can communicate.
...
This is the requirements for task 2. Draft a plan for task 2, wait for me to review it, and implement it once I confirm.
```

```text
update the plan to only include /health endpoint in it to test the connection between frontend, backend and DB. Don't build other endpoints at this point yet.
```

Outcome:
- Created `backend/` scaffold: `DatabaseConnection` class (pg.Pool singleton), `HealthController`, `GET /health` route, Express entry point (`index.ts`).
- Created `database/init/01_schema.sql` with `scores` and `games` tables; PostgreSQL auto-executes on first start via `/docker-entrypoint-initdb.d/`.
- Created `backend/Dockerfile` and `frontend/Dockerfile` (both `node:20-alpine`, dev-mode, hot reload via volume mounts).
- Created `docker-compose.yml` with three services (`db`, `backend`, `frontend`) on a shared network, `depends_on` with `service_healthy` ordering, named `postgres_data` volume.
- Updated `frontend/vite.config.ts` with `server.host: '0.0.0.0'`, `server.hmr.clientPort: 5173`, and `/api` proxy to `VITE_API_TARGET`.
- Fixed `frontend/package.json` by removing `@rolldown/binding-win32-x64-msvc` (Windows-only native binary that hard-fails `npm install` on Linux in Docker; Vite manages platform bindings internally).
- Created `.env.example` and root `.gitignore`.
- All three containers verified healthy; `GET /health` → `{"status":"ok","db":"connected"}`; frontend serves HTTP 200; DB tables confirmed with `\dt`.
- Output was used fully.

Code edited:
- backend/package.json (new)
- backend/tsconfig.json (new)
- backend/src/index.ts (new)
- backend/src/config/database.ts (new)
- backend/src/controllers/HealthController.ts (new)
- backend/src/routes/health.ts (new)
- backend/Dockerfile (new)
- backend/.dockerignore (new)
- frontend/Dockerfile (new)
- frontend/.dockerignore (new)
- frontend/package.json (removed Windows-only rolldown binding)
- frontend/vite.config.ts (added server config: host, hmr, proxy)
- database/init/01_schema.sql (new)
- docker-compose.yml (new)
- .env.example (new)
- .gitignore (new)

Functionality or logic before change:
- No backend existed. No Docker infrastructure. Vite dev server only accessible on localhost, no API proxy configured.

Functionality or logic after change:
- All three services run in containers via `docker compose up --build`. Backend connects to PostgreSQL and reports `{"status":"ok","db":"connected"}` on `GET /health`. Frontend Vite dev server proxies `/api/*` calls server-side to the backend container using Docker's internal DNS. Database schema (`scores`, `games` tables) auto-initialised on first start.

### Task: Fix stop hook blocking error caused by missing backend test script

Prompts:
```text
[Stop hook blocking error — investigated and fixed autonomously]
```

Outcome:
- Identified that `backend/package.json` had no `test` script. The project's stop hook runs `npm test` in any directory with detected file changes; npm exits 1 when the script is missing, which the hook treats as a blocking error.
- Added `"test": "echo \"No backend tests yet\" && exit 0"` as a placeholder so the hook exits cleanly until real backend tests are added in Task 7.

Code edited:
- backend/package.json

Functionality or logic before change:
- Stop hook blocked every time backend files were changed, because `npm test` in `backend/` exited 1.

Functionality or logic after change:
- Stop hook passes cleanly. Placeholder test script exits 0 until Task 7 adds real backend tests.

## Task 3 – Database Migrations

### Task: Plan and implement database migrations for scores and games tables

Prompts:
```text
write a plan for the third task, wait for me to review, and implement it once I confirm. Requirements are as below: 3) Migration: Create Database + Initial Tables
Create database migrations for:
• scores table (best score storage)
• games table (game sessions and sharing mechanism)
Commit required.
In commit.md include:
• Schema design decisions
• Why you structured tables that way
• How migrations are executed
• Terminal commands used
```

Outcome:
- Researched the existing backend and Docker structure; found schema already existed as a raw Docker init SQL file with no migration tracking.
- Designed and planned a custom TypeScript migration runner (no new npm packages) with OOP-compliant class architecture matching the project's route → controller → service → repository layering.
- User reviewed and approved the plan; implementation proceeded.
- Built `IMigrationRunner`, `IMigrationRepository`, `MigrationRepository`, `MigrationRunner`, and `migrate.ts` entrypoint.
- Created `backend/migrations/0001_create_scores_table.sql` and `0002_create_games_table.sql` as the canonical schema source.
- OOP reviewer flagged two violations (missing `IMigrationRepository` interface; `MigrationRunner` depending on concrete class). Both fixed before commit.
- Verified on a fresh Docker volume: both migrations applied on first start, idempotent on restart.

Code edited:
- database/init/01_schema.sql (replaced scores/games DDL with schema_migrations bootstrap only)
- backend/migrations/0001_create_scores_table.sql (new)
- backend/migrations/0002_create_games_table.sql (new)
- backend/src/migrations/runner/IMigrationRunner.ts (new)
- backend/src/migrations/runner/IMigrationRepository.ts (new)
- backend/src/migrations/runner/MigrationRepository.ts (new)
- backend/src/migrations/runner/MigrationRunner.ts (new)
- backend/src/migrations/migrate.ts (new)
- backend/docker-entrypoint.sh (new)
- backend/Dockerfile (updated CMD)
- backend/package.json (added migrate and migrate:build scripts)
- commit.md (Task 3 section filled in)
- PROMPTS.md (this entry)

Functionality or logic before change:
- Schema existed only as a raw SQL file run once by Docker on a fresh volume (`database/init/01_schema.sql`). No migration tracking. No ability to apply incremental schema changes. Backend container started directly with `npm run dev`.

Functionality or logic after change:
- Backend container runs `npm run migrate` before starting the server on every start. The TypeScript migration runner reads `backend/migrations/*.sql` in order, skips already-applied files via the `schema_migrations` tracking table, and applies pending ones. `scores` and `games` tables are now defined in versioned migration files. The system is idempotent: subsequent starts log "No pending migrations." and start normally.

## Task 4 — Backend CRUD Endpoints

### Task: Plan backend CRUD endpoints for scores and games

Prompts:
```text
write a plan for the fourth task, wait for me to review, and implement it once I confirm. Requirements are as below:
4) API: Create Backend + CRUD Endpoints
Create backend endpoints:
• GET /health
• GET /api/best-score
• POST /api/best-score
• GET /api/games
• POST /api/games
• GET /api/games/:id
• PATCH /api/games/:id
• DELETE /api/games/:id
Add validation and error handling.
Business rule:
• A new best score can only replace the existing one if it is lower.
The /health endpoint should just return "OK" if the database is healthy, otherwise throw a 500 Http error if something has gone wrong.
Commit required. In commit.md include: Backend framework choice and why, API structure decisions, Validation approach, How business rules are enforced, Example requests used for testing, Terminal commands used
```

Outcome:
- Explored the full backend directory: Express + TypeScript scaffold with health endpoint, database singleton, migration system, and `scores`/`games` tables already in place.
- Produced a full implementation plan covering file structure (domain, repositories, services, controllers, routes, validation), endpoint behaviour table, Zod validation strategy, `ScoreService.submitScore` business rule logic, test coverage plan, and packages to add (`zod`, `jest`, `ts-jest`, `supertest`).
- Plan presented for user review; implementation not yet started.

Code edited:
- None.

Functionality or logic before change:
- No functionality changed. Planning only.

Functionality or logic after change:
- No code changed. The Task 4 implementation plan was drafted and is awaiting user approval.

### Task: Implement backend CRUD endpoints, validation, and tests

Prompts:
```text
the plan for the fourth task is looking good, follow the plan, write code and give me clear outcome summary of execution
```

Outcome:
- Installed `zod` (v4), `jest@29`, `ts-jest@29`, `supertest`, and `@types/*` packages. Downgraded from Jest 30 to Jest 29 because Node 21.7.3 is not in Jest 30's engine list (`^18.14.0 || ^20.0.0 || ^22.0.0`), same pattern as the Vite downgrade on the frontend.
- Created domain classes `Score` and `Game` with `public readonly` constructor fields.
- Created `IScoreRepository` / `ScoreRepository` and `IGameRepository` / `GameRepository` with full CRUD SQL; `GameRepository.update` builds dynamic SET clause via extracted private method `buildUpdateSets`.
- Created `IScoreService` / `ScoreService` (enforces lower-score business rule in `submitScore`) and `IGameService` / `GameService` (pure delegation to repository).
- Created `ScoreController` and `GameController`; `GameController` casts `req.params['id'] as string` to satisfy `@types/express@5` which types params as `string | string[]`.
- Created `validate` middleware (Zod `safeParse`, returns 400 with `result.error.issues` — Zod v4 renamed `.errors` to `.issues`), `asyncHandler` wrapper, and Zod schemas in `scoreSchemas.ts` / `gameSchemas.ts`.
- Refactored route files to use factory functions (`createHealthRouter`, `createScoresRouter`, `createGamesRouter`) accepting injected services/DB — enables clean test setup with mock dependencies.
- Updated `HealthController` to return plain text `"OK"` (200) or `"Service unavailable"` (500); simplified field declaration to `constructor(private readonly db: ...)`.
- Updated `index.ts` `Application` class to wire up all routes and add a global error handler.
- Wrote 27 tests across 3 files (`health.test.ts`, `scores.test.ts`, `games.test.ts`): health up/down, 404 on missing score, score validation, all four business-rule cases (no best, lower, equal, higher), full games CRUD, 404s, and validation rejections.
- OOP reviewer flagged 2 violations: `HealthController` non-readonly field (fixed), `GameRepository.update` over 20 lines (fixed by extracting `buildUpdateSets`). Final state: 0 violations.
- 27/27 tests passing.
- Output was used fully.

Code edited:
- backend/package.json
- backend/jest.config.js (new)
- backend/src/domain/Score.ts (new)
- backend/src/domain/Game.ts (new)
- backend/src/repositories/IScoreRepository.ts (new)
- backend/src/repositories/ScoreRepository.ts (new)
- backend/src/repositories/IGameRepository.ts (new)
- backend/src/repositories/GameRepository.ts (new)
- backend/src/services/IScoreService.ts (new)
- backend/src/services/ScoreService.ts (new)
- backend/src/services/IGameService.ts (new)
- backend/src/services/GameService.ts (new)
- backend/src/controllers/HealthController.ts
- backend/src/controllers/ScoreController.ts (new)
- backend/src/controllers/GameController.ts (new)
- backend/src/middleware/validate.ts (new)
- backend/src/middleware/asyncHandler.ts (new)
- backend/src/validation/scoreSchemas.ts (new)
- backend/src/validation/gameSchemas.ts (new)
- backend/src/routes/health.ts
- backend/src/routes/scores.ts (new)
- backend/src/routes/games.ts (new)
- backend/src/index.ts
- backend/src/__tests__/health.test.ts (new)
- backend/src/__tests__/scores.test.ts (new)
- backend/src/__tests__/games.test.ts (new)

Functionality or logic before change:
- Backend only had `GET /health` returning `{"status":"ok","db":"connected"}` JSON. No score or game endpoints. No validation. No tests. Placeholder test script exiting 0.

Functionality or logic after change:
- All 8 required endpoints implemented across the full route → controller → service → repository stack.
- `GET /health` returns plain text `"OK"` (200) or 500 on DB failure.
- `GET /api/best-score` returns the lowest recorded score or 404 if none.
- `POST /api/best-score` validates body with Zod, enforces lower-score rule in `ScoreService`, returns `{ accepted: true, score }` or `{ accepted: false, reason }`.
- `GET /api/games` returns all game sessions ordered by `created_at DESC`.
- `POST /api/games` validates items array (shape/colour enums), creates and returns 201 with the new game.
- `GET /api/games/:id` returns game or 404.
- `PATCH /api/games/:id` applies partial update; maps `duration_ms` → `durationMs` in the patch; returns updated game or 404.
- `DELETE /api/games/:id` deletes game, returns 204 or 404.
- Global error handler catches async exceptions and returns 500 JSON.
- 27 Jest tests passing covering all required backend scenarios.
