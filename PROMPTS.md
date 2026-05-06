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
