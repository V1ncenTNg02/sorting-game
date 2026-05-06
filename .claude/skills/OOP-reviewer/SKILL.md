# OOP-reviewer

Review all changed files and verify they comply with the Clean Code + OOP requirements defined in CLAUDE.md. Report violations and, where code needs fixing, apply the fixes.

## When to use

Invoke this skill before each commit, after generating or modifying any TypeScript source file (frontend or backend). Do not skip this step even for small changes.

## Review checklist

Work through every changed `.ts` / `.tsx` file and check each item below. Mark each as PASS or FAIL with the offending file path and line number when it fails.

### OOP structure

- [ ] **Classes used** — all stateful logic, services, domain models, and repositories are written as TypeScript `class` declarations, not as plain objects, standalone functions, or bare modules that export loose functions.
- [ ] **Single Responsibility** — each class has one clearly stated reason to change. If a class mixes two different concerns (e.g., both HTTP handling and database access), flag it.
- [ ] **Encapsulation** — state fields are `private` or `protected`. Public surface is behavior methods only. Raw `public` fields that expose internal state are a violation.
- [ ] **Interface / abstraction boundaries** — every service, repository, and domain rule class implements a named TypeScript `interface` or `abstract class`. Dependencies are typed to the interface, not the concrete class.
- [ ] **Dependency Injection** — collaborators are passed via the constructor. Classes must not call `new ConcreteService()` inside their own methods.
- [ ] **No procedural blobs** — there are no exported standalone functions that contain business logic outside of a class. Utility functions are allowed only if they are pure transformations with no domain knowledge (e.g., `formatDate`).

### Frontend-specific checks

- [ ] **Components are thin UI shells** — React components contain no business logic beyond calling a service/model method and rendering the result.
- [ ] **Game logic in classes** — move validation, scoring, board state, and completion detection live in a dedicated class (e.g., `GameService`, `BoardModel`), not in `useState` callbacks or JSX event handlers.
- [ ] **Event handlers delegate immediately** — component event handlers call a single service method and nothing else. Inline conditional logic inside an `onClick` / `onDrop` handler is a violation.

### Backend-specific checks

- [ ] **Layered architecture respected** — route file → controller class → service class → repository class. No business logic in route files or middleware.
- [ ] **Domain entities are classes** — `Game`, `Move`, `Board`, and similar domain concepts are TypeScript `class` declarations with typed fields and behavior methods. Plain `interface`-only definitions with detached helper functions are a violation.
- [ ] **No logic in route files** — route files only instantiate controllers (or call a controller method). No `if`, `switch`, or data-transformation logic lives there.

### Clean Code checks

- [ ] **Meaningful names** — class names, method names, and variable names clearly describe what they represent. Single-letter names (except loop indices) and abbreviations are violations.
- [ ] **Method length** — no method body exceeds ~20 lines. Flag methods that should be extracted.
- [ ] **No explanatory comments** — comments must not restate what the code already says. Remove them. Comments explaining *why* a non-obvious decision was made are allowed.
- [ ] **No magic values** — raw string literals and numeric literals used as logic values must be extracted to a named `const` or `enum`. String literals used only for display text (UI labels) are exempt.
- [ ] **DRY** — the same logic does not appear in more than one place. Flag duplicate blocks.

## Review steps

1. Run `git diff --name-only HEAD` to list changed files. Focus on `.ts` and `.tsx` files.
2. Read each changed file in full.
3. Work through the checklist above for each file.
4. Produce a report in this format:

```
## OOP Review Report

### PASS
- path/to/file.ts — all checks passed

### FAIL
- path/to/file.ts
  - [Encapsulation] Line 34: field `items` is public — make it private and expose via a getter or method.
  - [Single Responsibility] Lines 10–80: `GameController` handles both HTTP parsing and move validation — extract validation to `GameService`.

### Summary
X files passed. Y files failed. Z violations total.
```

5. For each FAIL item, offer to apply the fix immediately. If the user agrees, make the edit and re-run the affected checklist items to confirm the fix resolves the violation.
6. Do not commit until the report shows zero FAIL items.

## Rules

- Never mark a violation as a PASS to move forward faster.
- Every FAIL must include file path, approximate line number, the violated rule, and a concrete description of what needs to change.
- If a violation is in a file the user did not intend to change (e.g., a pre-existing file pulled in by import), flag it as a warning rather than a blocker, and open a separate task to address it later.
