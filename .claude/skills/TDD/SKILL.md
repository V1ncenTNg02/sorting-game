# tdd

Write tests before writing any implementation code. Follow the red-green-refactor cycle on every feature, component, endpoint, or game logic unit.

## When to use

Invoke this skill at the start of any task that adds or changes behavior. Do not write implementation code until the test for that behavior exists and is confirmed failing.

## Testing stacks

### Frontend — React + Vite + TypeScript
| Concern | Tool |
|---------|------|
| Test runner | Vitest |
| Component rendering | @testing-library/react |
| User interaction | @testing-library/user-event |
| DOM matchers | @testing-library/jest-dom |
| API mocking | msw (Mock Service Worker) |
| Test environment | jsdom |

Test files: co-located with source as `ComponentName.test.tsx` or `util.test.ts`.
Run command: `npm test` (mapped to `vitest run` — single pass, no watch).

### Backend — Node.js + TypeScript
| Concern | Tool |
|---------|------|
| Test runner | Jest + ts-jest |
| HTTP endpoint testing | Supertest |
| Test environment | node |

Test files: `src/__tests__/routeName.test.ts` or co-located as `service.test.ts`.
Run command: `npm test` (mapped to `jest`).

## TDD cycle

1. **Understand** — identify the exact input, expected output, and edge cases for the behavior.
2. **Write the test** — describe the behavior in a test. It must reference real types and interfaces.
3. **Confirm red** — run the test and verify it fails for the right reason (not a setup or import error).
4. **Write minimal implementation** — only the code needed to make the failing test pass. No extras.
5. **Confirm green** — run the test and verify it passes.
6. **Refactor** — clean up without breaking the test. Re-run after every change.
7. **Repeat** for the next behavior.

## Setup — frontend (run once when scaffolding)

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Add to `frontend/vite.config.ts` inside `defineConfig`:
```ts
/// <reference types="vitest" />
// inside defineConfig({ ... })
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './vitest.setup.ts',
},
```

Create `frontend/vitest.setup.ts`:
```ts
import '@testing-library/jest-dom';
```

Add to `frontend/package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

## Setup — backend (run once when scaffolding)

```bash
cd backend
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest
```

Create `backend/jest.config.ts`:
```ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
};
```

Add to `backend/package.json` scripts:
```json
"test": "jest"
```

## Rules

- Never skip or delete a test to make the suite pass.
- Each test covers exactly one behavior or edge case.
- Tests must be independent — no shared mutable state between tests.
- Test file names mirror source file names: `gameService.ts` → `gameService.test.ts`.
- Mock only what crosses a process boundary (HTTP, database, filesystem). Do not mock internal modules.
- After writing tests, confirm they fail before writing implementation.
