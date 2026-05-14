## Epic 07 — Apple Reminders–style depth

> Authored after Epic 06 in response to the user request "copy Apple Reminders as best as possible but cut things that take too long." A scope expansion past the official training PRD, same posture as Epic 06: logged transparently in `brief.md` §9. Each cut item is named so the decision is visible, not silent.
>
> **Shipped in this epic:** Notes (per todo), Flag (per todo), Show/hide completed toggle, Search filter, edit-in-place for description + notes.
>
> **Cut from this epic** (each named so the decision is auditable):
>
> - **Due dates / date sections.** Needs a date input, relative-date formatting, grouping into Today / Overdue / Upcoming / No date sections, and a storage migration. Larger than the four shipped features combined. Candidate for a future Epic 08 if the workday use case actually needs it.
> - **Multiple lists / sidebar.** Would require routing, a navigation surface, and a per-list state shape. Major restructure. Out of v1.
> - **Subtasks.** Tree data model instead of a flat list. Significant UI and reducer rework. Out of v1.
> - **Time alerts / location alerts / push notifications.** Requires Notifications and Geolocation APIs, permission prompts, and breaks the offline-prototype shape laid out in `architecture.md`. Out of v1.
> - **Recurring reminders.** Recurrence rules (RRULE-style) are a rabbit hole. Out of v1.
> - **Priority levels (None / Low / Medium / High).** Overlaps with Flag, which is the simpler binary subset. Ship Flag instead.
> - **Tags (#tag parsing).** Cheap to parse but useless without a filter UX, which is most of the cost. Out of v1.

---

## 7.1 — Edit row in place (description + notes)

As a user, I want to add a second line of detail to a task and to edit the title after creation, so the row can hold more than the original single sentence.

**AC:**

- The `Todo` type gains an optional `notes?: string` field. Existing todos in localStorage (without `notes`) load successfully and treat `notes` as undefined — the persistence migration is permissive.
- A new reducer action `UPDATE_TODO` accepts `{ id, description, notes }` and updates both fields, trimming both. If the trimmed description is empty, the action is a no-op (we don't let the user save an empty title).
- Each `<TodoItem>` gains a small **edit** `IconButton` (gov.ie `edit` icon) in the row's action cluster. Click → row expands into an inline editor:
  - Description: gov.ie `InputText`, prefilled with current description.
  - Notes: gov.ie `InputText` (multi-line variant) or `<textarea>` with gov.ie styling if no multi-line component exists. Prefilled with current `notes ?? ''`.
  - Two buttons: **Save** (gov.ie primary `Button`) and **Cancel** (gov.ie secondary `Button`).
- Save dispatches `UPDATE_TODO` and collapses the editor. Cancel discards changes and collapses. Escape key cancels. `Cmd/Ctrl+Enter` saves.
- Only **one** row can be in edit mode at a time. Opening the editor on row B while row A is editing discards row A's pending changes (after a `confirm()` if changes are dirty — or simply discards if we want zero-friction; pick the latter for v1).
- When `todo.notes` is non-empty and the row is collapsed, render the notes as a second line of muted text below the description, truncated to two lines with `line-clamp-2`.
- Notes persist via the existing Story 1.4 write effect.

**Refs:** `brief.md` §9 (scope decision); `architecture.md` §4.2 (new `UPDATE_TODO` action added to the table).

**Design decisions:**

- **One global edit slot, no nested editing.** Multiple simultaneous editors would invite ambiguity about what gets saved. One open editor is simpler and matches Apple Reminders' modal "details" pane.
- **No "edit on click of the title."** Apple does this; it's nice on mobile but trips up screen-reader users and creates accidental edits. Stick to an explicit edit button — same affordance as delete and reorder.
- **No confirm dialog on cancel.** v1 prioritises speed of iteration. If users complain about lost edits, add a `confirm()`.

**Done when:** A row's edit button opens an inline panel; saving updates both description and notes; cancel/Escape discard; opening another row's editor closes the first; notes appear as a muted second line when present and persist across reload.

---

## 7.2 — Flag a task

As a user, I want to mark some tasks as important without going as far as priority levels, so I can scan for "the ones that matter today."

**AC:**

- The `Todo` type gains a required `flagged: boolean` field, defaulting to `false` on creation. Persistence migration treats missing `flagged` as `false`.
- A new reducer action `TOGGLE_FLAG` accepts `{ id }` and inverts the flag.
- Each `<TodoItem>` gains a **flag** `IconButton` in the action cluster (gov.ie `flag` or equivalent). When flagged, the icon is filled and amber/orange (a gov.ie token, not a custom hex). When not flagged, the icon is outlined and neutral.
- `ariaLabel` reflects the action: `Flag 'description'` when unflagged, `Unflag 'description'` when flagged. `aria-pressed` reflects the current state.
- Flagged status is visually reflected on the collapsed row: e.g. a small filled flag glyph next to the description, or a coloured left border. Pick whichever reads better at a glance — left border preferred because it survives long descriptions.

**Refs:** `architecture.md` §4.2 (new `TOGGLE_FLAG` action).

**Design decisions:**

- **Binary, not priority.** A flag is a soft "this matters" signal that doesn't force users to choose between levels they don't actually distinguish. Priority levels were considered and cut.
- **Token-based amber.** No bespoke hex — use a gov.ie warning/attention token if available, otherwise the closest semantic Tailwind class scoped behind `--ds-` variables.

**Done when:** Clicking the flag toggles the row's flagged state; flagged rows are visually distinguishable on the collapsed view; the state persists; screen readers announce the action correctly.

---

## 7.3 — List controls bar (search, show completed, flagged only)

As a user with a growing list, I want to narrow what I'm looking at, so the screen reflects what I'm currently working on rather than everything I've ever added.

**AC:**

- A new `<ListControls>` component sits above the `<TodoList>` in `<MainContent>`. It contains:
  - **Search** input (gov.ie `InputText`) with placeholder "Search tasks". Updates the filter as the user types — no submit, no debounce (lists are small).
  - **Flagged only** toggle button — gov.ie `Button` with `aria-pressed`. When active, only flagged todos appear.
  - **Show completed** toggle button — gov.ie `Button` with `aria-pressed`, default `true`. When off, completed todos are hidden.
- A new section `filters` is added to `AppState`: `{ search: string; flaggedOnly: boolean; showCompleted: boolean }`. Filters are **not persisted** — they reset on reload (Apple does persist filters, but for this prototype a fresh page = a fresh view is fine, and it dodges another storage migration).
- New actions: `SET_SEARCH { value }`, `SET_FLAGGED_ONLY { value }`, `SET_SHOW_COMPLETED { value }`.
- `<TodoList>` applies the filters in a derived `visibleTodos` value (computed in the component, no separate state). Filter logic:
  - `showCompleted === false` removes todos where `completed === true`.
  - `flaggedOnly === true` keeps only todos where `flagged === true`.
  - `search` (case-insensitive) keeps todos whose description **or notes** match.
- `<ListControls>` only renders when `state.status === 'success'` and `state.todos.length > 0`. If all tasks would be filtered out, the list area shows a polished "no tasks match your filters" message with a Reset button that dispatches the three setter actions with their defaults.
- Reordering with the up/down buttons from Epic 06 operates on the **full** list, not the filtered list. The reorder buttons are disabled (with `aria-disabled` and a tooltip if cheap) when any filter is active, because moving a row "up" within a filtered view is ambiguous. Simpler than reasoning about cross-filter positions.

**Refs:** `architecture.md` §4.2 (new filter actions); `component-inventory.md` (new `<ListControls>` component).

**Design decisions:**

- **No persistence of filter state.** Avoids a storage migration. Reload = clean slate.
- **Search across description and notes**, not just description. Otherwise notes are second-class content.
- **Reorder disabled while filtering** instead of trying to be clever. Apple just disables drag-reorder while a smart-list is active for the same reason.
- **No combinable saved smart lists.** That's a feature; we don't have time.

**Done when:** Typing in search filters the list live; toggling Show completed hides/shows completed rows; toggling Flagged only narrows to flagged rows; an empty filter result shows the "no matches" state with Reset; reorder buttons disable while filters are non-default.

---

## Epic 07 done when

The app feels meaningfully closer to Apple Reminders' core workday loop — title + notes + flag + filter — without taking on the surface area (dates, multiple lists, subtasks, alerts, recurrence) that would have stretched it into a different project.
