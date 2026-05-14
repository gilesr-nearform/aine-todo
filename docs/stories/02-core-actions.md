# Epic 02 — Core Actions

> Wires the three non-destructive actions from the brief: **create**, **view**, **complete**. After this epic the user can dump tasks into the app, see them, and tick them off. Delete and undo land in Epic 03.

---

## 2.1 — Create a todo

As a user, I want to add a task by typing it and pressing Enter (or tapping the button), so I can capture work without breaking my flow.

**AC:**

- `<TodoInputBar>` becomes interactive: the gov.ie `InputText` and `Button` are no longer disabled while `state.status === 'success'`. (They remain disabled while `'loading'` or `'error'`.)
- Submitting the form (Enter inside the input, or click/tap the submit button) dispatches `CREATE_TODO` with the typed description, then clears the input.
- An empty or whitespace-only description does **not** create a todo and does **not** clear the input. The submit button is also disabled while the input is empty or whitespace-only.
- The reducer's existing trim-and-validate guard (`architecture.md` §4.2) is the source of truth — the input bar does not duplicate validation logic, it just prevents the dispatch from being wasted.
- New todos are appended to the end of `state.todos` (per `architecture.md` §5.2).
- Submitting via keyboard (`Enter`) and via pointer (click or tap) both work.
- After submit, focus stays in the input so the user can keep brain-dumping without re-tabbing.
- The input has a visible `<label>` or `aria-label` of "Task description". The submit button reads "Add".
- New todos are persisted to `localStorage` (handled automatically by the Story 1.4 write effect — no new persistence code needed).

**Refs:** `architecture.md` §4.2 (`CREATE_TODO`), §5.2 (create flow); `ux-spec.md` §3 (gov.ie `InputText` + `Button`); `brief.md` §5 (create is an in-scope action).

**Design decisions:**

- The input is the source of truth for the *draft* description; the reducer is the source of truth once a todo has been created. We don't keep draft text in global state.
- We refocus the input after submit because the primary usage pattern is "brain-dump a batch of tasks at the start of the day," not "add one task then move on." Refocus respects that cadence.
- Validation lives in the reducer per `architecture.md` §4.2. The input bar disables the submit button while empty as a UX hint, but the reducer is what actually guards the state.

**Done when:** Typing "buy milk" + Enter shows nothing visible *in this story* (the list itself is still placeholder text from Story 1.3) but reloading the page brings "buy milk" back from `localStorage`. The populated placeholder ("Populated") appears once the first todo is created. Story 2.2 makes the actual rows visible.

---

## 2.2 — View todos as styled rows

As a user, I want to see each task on its own row with its description, so the list is scannable at a glance.

**AC:**

- `<TodoList>` no longer renders the "Populated" placeholder text. It renders one `<TodoItem>` per todo in `state.todos`.
- `<TodoItem>` renders:
  - The todo's description as readable body text using gov.ie typography tokens
  - A small, muted timestamp showing when the todo was created (e.g. "added 09:14" or "added 14 May, 09:14" — pick one and stay consistent within the story)
  - A gov.ie `Checkbox` (wired in Story 2.3 — in this story it can render but be inert)
- Each `<TodoItem>` is a real list item (`<li>` inside a `<ul>` in `<TodoList>`) for assistive-tech semantics.
- React keys use `todo.id`, not array index.
- Rows render without layout shift when a todo is appended (Story 2.1 create path drops the new row at the bottom).
- The list area scrolls when there are more rows than fit; the rest of the shell stays put (this was already set up in Story 1.3 — verify it still holds with real content).
- Empty list still shows the "Empty" placeholder from Story 1.3; this story does not touch `<EmptyState>`.

**Refs:** `architecture.md` §2 (component layout); `ux-spec.md` §3 (custom `<TodoItem>` + `<TodoText>` + `<TodoTimestamp>`, gov.ie `Checkbox`).

**Design decisions:**

- Timestamp format is a UX call; pick the one that reads best in plain English and document it in the decision log if non-obvious. Time-only for "today", full date for "earlier than today" is a reasonable default but not mandated by the brief.
- Description is *not* truncated. Long descriptions wrap. Truncation hides information the user just typed, which violates the "remember what you said you'd do" framing.

**Done when:** Creating three todos via Story 2.1 produces three visible rows, each with a description, a timestamp, and an (inert) checkbox. Reloading restores all three.

---

## 2.3 — Complete and un-complete a todo

As a user, I want to tick a task off when I've done it, and untick if I tapped it by accident, so the list reflects what's actually left.

**AC:**

- The gov.ie `Checkbox` inside each `<TodoItem>` is now wired. Toggling it dispatches `TOGGLE_COMPLETE` with the row's `id`.
- The checkbox is a real `<input type="checkbox">` (gov.ie `Checkbox` already is) — keyboard space-to-toggle works without custom code.
- Completed state is visually distinguishable from active state at a glance. Minimum treatment: a muted description colour drawn from gov.ie tokens. Optional: a strikethrough. Whatever lands, it must be discernible without colour alone (per accessibility baseline — a strikethrough plus colour, or a checkbox state change, satisfies this).
- Toggling a completed todo back to active reverses the visual treatment.
- Order is unchanged on toggle — completed todos **stay in place** per the Day-0 decision in `brief.md` §9. The "completion grouping" question is deferred to Story 5.4.
- Toggled state persists across reload (handled automatically by Story 1.4).
- The checkbox has an accessible name. Easiest: associate it with the description as the `<label>`, so clicking the description text also toggles. Alternative: `aria-label="Mark '<description>' as complete"` if the click-target behaviour is not desired.

**Refs:** `architecture.md` §4.2 (`TOGGLE_COMPLETE`), §5.3 (toggle flow); `ux-spec.md` §3 (gov.ie `Checkbox`); `brief.md` §9 (Day-0 decision on completion-reorder behaviour).

**Design decisions:**

- "Stays in place" is the v1 default. Story 5.4 is the evaluation point on whether to group completed items at the bottom. Building this first is the cheap default that doesn't preclude either path.
- Description-as-label means tapping anywhere on the row's text toggles the todo. This is the established mobile-todo idiom and matches the brief's "captures a task in one keystroke" framing — completing should also be one tap.

**Done when:** Toggling three rows shows three distinct visual states (active, completed, active again on un-toggle). Reloading the page restores all toggled states. Keyboard space-bar on a focused checkbox toggles. The visual treatment passes a 5-second squint test from a metre away — you can tell which are done and which aren't.

---

## Epic 02 done when

The brain-dump loop works end-to-end: open the app, type three tasks, tick one off, reload — and everything is exactly as you left it. The app is now *useful*, not just visible. Deletion is the missing destructive action; that lands in Epic 03.
