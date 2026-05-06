# prompt-file-helper

Update `PROMPTS.md` with a new entry for the current task, following the project's required log format.

## When to use

Invoke this skill after completing a meaningful task that involved AI assistance — including planning, scaffolding, coding, debugging, or documentation work.

## Steps

1. **Read the current `PROMPTS.md`** to find the correct section to append to (or create a new section if starting a new phase of work).

2. **Determine the section heading.** Sections group related tasks (e.g., `## Planning`, `## Task 1 – Docker Setup`, `## Task 2 – Frontend Scaffold`). Use the existing section if the task belongs there; otherwise add a new `##` heading.

3. **Gather the entry fields** from the conversation context:
   - **Task**: a short name for what was done.
   - **Prompts**: the exact prompts (or a faithful copy) sent to the AI during this task. Use a fenced code block with `text` language tag.
   - **Outcome**: what the AI helped clarify, decide, create, or fix; whether the output was used fully, partially, or only for reference.
   - **Code edited**: list each file path that was created or modified. Write `None.` if no files changed.
   - **Functionality or logic before change**: what existed before the work. If no code changed, write that no functionality changed.
   - **Functionality or logic after change**: what is different after the work. If no code changed, write that only planning/documentation was updated.

4. **Append the entry** to the correct section using this exact format:

```markdown
### Task: [Short task name]

Prompts:
```text
[Exact prompt or faithful copy]
[Another prompt if relevant]
```

Outcome:

[What the AI helped clarify, decide, create, or fix]
[Whether the output was used fully, partially, or only for reference]

Code edited:

[File path]
[File path]
None.

Functionality or logic before change:

[What existed before]
[If no code changed, say that no functionality changed]

Functionality or logic after change:

[What changed after the work]
[If no code changed, say that only planning/documentation was updated]
```

5. **Do not invent** prompts, outcomes, or decisions. Only record what actually happened in this conversation.

6. **Confirm** to the user that `PROMPTS.md` has been updated and which section the entry was added to.
