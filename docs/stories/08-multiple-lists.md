## Epic 08 — Multiple lists

> Third scope expansion past the official training PRD, after Epic 06 (reorder) and Epic 07 (notes/flags/filters). Logged in `brief.md` §9. The original v1 was deliberately single-list to mirror the training brief; this epic adds the navigation surface that pushes the app meaningfully closer to Apple Reminders' shape.
>
> **Shipped in this epic:** lists data model, create/rename/delete lists, switch active list, desktop sidebar, mobile drawer, "All tasks" smart list, storage migration from v1 to v2.
>
> **Cut from this epic** (each named so the decision is auditable):
>
> - **Move-to-list per row.** Would need a popover/menu component and an additional keyboard-accessible affordance per row. The simplest accessible version (a select inside the edit panel) is the next thing to add if needed, but not in v1.
> - **List colors / icons.** Visual differentiation only. Defer; Apple's colours are nice-to-have, not load-bearing.
> - **Reorder lists.** Same pattern as Epic 06 but applied to lists. Defer until users ask.
> - **URL routing per list (`/lists/:id`).** Would require a router setup and deep-linking behaviour. Active list lives in state only; reload restores the last active list via persistence.
> - **"Flagged" and "Completed" smart lists.** Epic 07's filters (flagged-only toggle, hide-completed toggle) cover the same need without a duplicate surface. "All tasks" is the only smart entry we add.
> - **Folders / list groups.** Out.

---

## 8.1 — Lists data model and storage migration

As the app's owner, I want the data layer to express lists as first-class entities, so the rest of Epic 08 can stand on it without further migrations.

**AC:**

- New type `List`:
  ```ts
  interface List { id: ListId; name: string; createdAt: Date; }
  ```
  where `ListId` is a branded string (UUID).
- `Todo` gains a required `listId: ListId` field. The default list is created on first run if none exist (name: `"Tasks"`).
- `AppState` gains:
  - `lists: List[]`
  - `activeListId: ListId | null` — `null` means "All tasks" (the virtual smart list).
- Storage migrates from `listlens:v1:todos` (a flat `Todo[]`) to `listlens:v2:state` (an object containing `lists`, `todos`, `activeListId`). The v1 key is read once on first boot, converted, and then left in place (not deleted) for safety in case users want to roll back during the training programme.
- v1 → v2 conversion: create a single list `"Tasks"` with a new UUID. Assign every v1 todo to that list. `activeListId` defaults to the new list's id.
- Reading v2 is permissive: missing `flagged` or `notes` on a todo still defaults correctly (carried over from Epic 07's storage logic). Missing `listId` is recovered by assigning the first list's id and logging a warning.

**Refs:** `architecture.md` §4 (state shape updated); `brief.md` §9.

**Done when:** Existing users with v1 data load successfully into a single "Tasks" list. Fresh users get a "Tasks" list created on first save. The storage round-trip is lossless across reloads.

---

## 8.2 — Sidebar with create / rename / delete

As a user, I want to see my lists in a sidebar and add new ones, so I can group tasks by context (e.g. "Work", "Home", "Shopping").

**AC:**

- A `<Sidebar>` component renders a gov.ie `<SideNav>` with two sections:
  - **Smart**: a single "All tasks" entry. Selected when `activeListId === null`. Clicking sets `activeListId` to `null`.
  - **My lists**: one `<SideNavItem>` per `state.lists` entry. The active one is visually selected. Clicking sets `activeListId` to that list's id.
- Below the SideNav: a compact `<form>` with a gov.ie `<InputText>` and an "Add list" `<Button>`. Submitting creates a new list (action `CREATE_LIST` with `{ name }`) and switches to it. Empty/whitespace names are no-ops.
- Each user list entry has hover/focus-revealed icon buttons for **Rename** (`edit` icon) and **Delete** (`delete` icon).
  - Rename: opens an inline `InputText` replacing the label; Save on blur or Enter, Cancel on Escape.
  - Delete: requires confirmation. v1 uses `window.confirm()` ("Delete '<name>' and its tasks? Tasks in this list will be permanently removed."). Deleting the active list sets `activeListId` to `null` (All tasks) so the view doesn't break.
- Layout: `<Sidebar>` is rendered to the left of `<MainContent>` on screens ≥ `md` (Tailwind), occupying ~`260px`. On screens `< md` it is hidden and exposed via the mobile drawer (Story 8.3).
- Keyboard order: SideNav before MainContent before TodoInputBar (logical reading order).

**Refs:** `architecture.md` §4.2 (new list actions); `component-inventory.md`.

**Design decisions:**

- **`window.confirm()` for delete.** No gov.ie confirm dialog exists in the components we've used so far. The native confirm is keyboard- and AT-accessible by default; adopting the gov.ie `Modal` for this is more work than the v1 budget allows. Logged as a known compromise.
- **No "delete with task migration"** (move tasks to another list before delete). Add later if requested; for v1, delete means delete.
- **Active-list state, not URL.** Persists across reload via Story 8.1.

**Done when:** Multiple lists can be created and switched. Rename and delete work. Deleting the active list cleanly falls back to "All tasks". Hover/focus reveals the row-level affordances; mobile alternative ships in 8.3.

---

## 8.3 — Mobile drawer with menu button

As a mobile user, I want to access the sidebar without sacrificing the small screen, so list switching works on the device I actually use during a commute.

**AC:**

- A **menu** `<IconButton>` (gov.ie `menu` icon) appears in the header on screens `< md`. Clicking opens a gov.ie `<Drawer>` (position `left`) containing the same `<Sidebar>` content.
- Selecting any list item in the drawer closes the drawer (so the user lands on the new list, not the menu).
- The drawer's close button is gov.ie's built-in close affordance from the Drawer component.
- The menu button is hidden on screens `≥ md` because the sidebar is always visible there.
- Focus is trapped inside the drawer while open (gov.ie's Drawer handles this; verify in the snapshot).

**Refs:** `architecture.md` §4 (no new actions); gov.ie `Drawer` component.

**Done when:** On a mobile viewport, the menu button opens the drawer, list switching works inside it, and the drawer closes on selection.

---

## 8.4 — Filter and route todos by active list

As a user, I want the main view to show only the active list's tasks, so the sidebar selection actually means something.

**AC:**

- `<TodoList>`'s filter pipeline gains a list-membership filter at the top:
  - If `state.activeListId === null` ("All tasks"), no list filter is applied.
  - Otherwise, only todos with `todo.listId === state.activeListId` are visible.
- Existing Epic 07 filters (search, flagged-only, hide-completed) apply on top of the list filter.
- `<TodoInputBar>` dispatches `CREATE_TODO` with the resolved target list id:
  - If `activeListId` is a real list, use that id.
  - If `activeListId` is `null` ("All tasks") and at least one user list exists, use `state.lists[0].id` (no UI confusion: the new task always lands somewhere visible because "All tasks" already shows it).
- `<EmptyState>` and the existing "no tasks match your filters" state both reflect the active list's name where appropriate ("No tasks in **Work** yet" / "No tasks match your filters").
- The active list name appears above the TodoList in a small header (`<h2>`) so users always know which list they're looking at; "All tasks" shows that label too.

**Refs:** `architecture.md` §4.2; Epic 07 filter logic.

**Done when:** Switching lists changes the visible todos. New todos land in the right list. The list name is visible above the list. Empty states reflect the active list.

---

## Epic 08 done when

The app feels meaningfully closer to Apple Reminders' shape: a sidebar with lists, a switchable active list, mobile drawer parity, and clean storage migration for existing users. All without taking on routing, colours, list reorder, or per-row list moves — each of which is named in this spec as a deliberate cut.
