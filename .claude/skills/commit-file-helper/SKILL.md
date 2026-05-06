# commit-file-helper

Update `commit.md` with an engineering log entry for the current task, before committing.

## When to use

Invoke this skill before each meaningful commit. The entry must reflect real work — do not invent commands, decisions, or outcomes.

## Two entry formats

Use **`template-scaffold.md`** when the task involved choosing a framework, state management approach, drag-and-drop library, or folder structure (e.g., initial frontend or backend scaffolding).

Use **`template-general.md`** for everything else.

## Steps

1. Read the current `commit.md` to find the right place to append (entries are in chronological order).
2. Choose the correct template:
   - Scaffolding / setup task → read `template-scaffold.md`
   - All other tasks → read `template-general.md`
3. Fill in every field honestly from the conversation and tool-call history. Write `None.` or `N/A` for fields that genuinely do not apply — never omit a field entirely.
4. Append the completed entry to `commit.md`.
5. Confirm to the user that `commit.md` has been updated and which template was used.
