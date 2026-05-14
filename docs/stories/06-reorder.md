## Epic 06 — Reorder

> Authored after Epics 1–5 shipped, in response to a user request to reorder tasks. Reorder is **not** in the official training PRD (which excludes "Filtering or sorting"), and the original `brief.md` §5 inherited that exclusion. Adding this is a deliberate scope expansion. The rationale is logged in `brief.md` decision log; the trade-off is recorded honestly so the SDD demonstration shows scope decisions, not just scope adherence.

---

## 6.1 — Reorder tasks with up/down buttons

As a user with a list of tasks, I want to move important tasks higher and finished-but-kept tasks lower, so the visual order matches my mental priority.

**AC:**

- Each `<TodoItem>` gains two small icon buttons: **move up** (gov.ie `arrow_upward` icon) and **move down** (gov.ie `arrow_downward` icon).
- Clicking *Move up* dispatches `REORDER_TODO` with `{ id, direction: 'up' }`; the reducer swaps the todo with its predecessor in `state.todos`. Clicking *Move down* dispatches `REORDER_TODO` with `direction: 'down'` and swaps with its successor.
- *Move up* is **disabled** when the todo is already at index 0. *Move down* is **disabled** when it's the last todo. The disabled state uses the gov.ie `IconButton` `disabled` prop (visible opacity reduction, `aria-disabled`, not focusable).
- Each button has an accessible name including the description: `Move 'buy milk' up`, `Move 'buy milk' down`.
- After a reorder, **focus stays on the same button** so the user can press Enter/Space repeatedly to move a row further. Use a `ref` + `useEffect` post-dispatch, or rely on the button's natural focus retention (preferred — the button still exists after the swap because the row remounts at a new position, but `key={todo.id}` keeps the same React component instance).
- The reordered list **persists** via the Story 1.4 write effect — no new persistence work.
- The buttons sit between the description and the delete action on the row. On mobile they are always visible (consistent with the delete button); on desktop they fade in on row hover / focus-within (also consistent).
- **No drag-and-drop.** The interaction model is buttons only, per `architecture.md` §8 ("No drag-and-drop required for any action, per WCAG 2.5.7") and the scope-expansion decision in `brief.md`.
- **No animation on swap.** Visual swap is instant. Animating positional swaps in React requires either a layout-animation library (out of scope) or manual FLIP logic (overkill for a v1 addition). The colour transition + the focus indicator carry the feedback.

**Refs:** `brief.md` §5 (now lists reorder as in-scope), §9 decision log; `architecture.md` §4.2 (new `REORDER_TODO` action added to the table); `ux-spec.md` §3 (custom row composition; gov.ie `IconButton` + `Icon`).

**Design decisions:**

- **Buttons over drag.** Drag-only fails WCAG 2.5.7 (any drag must have a single-pointer alternative). Adding both is significant scope for a feature that's already a scope expansion. Buttons-only is the cheapest accessible default and matches how the rest of the app's interactions feel.
- **Adjacent-swap, not arbitrary-move.** Users who want to move a row several positions tap up/down a few times. A "move to top" or "set position" UI is more scope than this addition warrants.
- **Focus stays for chained reorders.** Pressing Enter on *Move up* twice in a row should move the same task up two slots without re-focusing. This is the affordance that makes adjacent-swap acceptable.

**Done when:** Three rows in the list, pressing *Move down* on the first row twice moves it to the bottom. The disabled state of *Move up* / *Move down* tracks list position correctly. Tabbing to a button and pressing Enter chains. The reordered list persists across reload.

---

## Epic 06 done when

Users can put their tasks in their preferred order, the change persists, and the interaction is accessible by keyboard alone — without compromising the v1 scope discipline that made the original five-epic plan defensible.
