# Epic 03 — Delete and Undo

> The destructive action and its safety net. By the end of this epic, a user can remove a task and reverse the removal within a short window. The reducer already handles `DELETE_TODO`, `UNDO_DELETE`, and `EXPIRE_DELETED` (Story 1.2) — these stories wire the UI and timing around them.

---

## 3.1 — Delete affordance on each row

As a user, I want a clear way to delete a task on whichever device I'm using, so removing finished or no-longer-relevant items is easy.

**AC:**

- Each `<TodoItem>` has a delete button (`<TodoDeleteAction>`) — a custom component composing a gov.ie icon button per `ux-spec.md` §3.
- The delete button uses an "×" or "delete" glyph (gov.ie icon if available; else a plain "×" using gov.ie typography tokens).
- The delete button has an accessible name `Delete '<description>'` so screen readers announce which row will be removed.
- **Mobile (touch primary):** the delete button is always visible at the trailing edge of the row.
- **Desktop (pointer primary):** the delete button is visible on row hover and on focus-within. It is *not* hidden entirely from non-hover states — `opacity-0` would hide it from screen readers and from keyboard focus; instead, fade it from 0 → 1 on `:hover` / `:focus-within` and keep it focusable via Tab.
- **Keyboard:** focusing a delete button and pressing `Enter` or `Space` triggers it. Additionally, focusing *anywhere within* a `<TodoItem>` (e.g. on its checkbox) and pressing `Delete` or `Backspace` also triggers the delete for that row.
- Clicking / tapping / activating the delete button dispatches `DELETE_TODO` with the row's `id`. The visible toast behaviour lands in Story 3.2.
- The button has gov.ie focus ring on `:focus-visible`.
- Touch target is ≥ 44×44px (per `05-polish.md` §5.1).

**Refs:** `architecture.md` §4.2 (`DELETE_TODO`), §5.4 (delete + undo flow); `ux-spec.md` §3 (`<TodoDeleteAction>`); `brief.md` §9 decision-log on the swipe-to-delete deferral.

**Design decisions:**

- **Swipe-to-delete deferred to v2.** Original `ux-spec.md` §3 called out a swipe gesture; we ship a tap-target delete icon instead because (a) it works identically on mobile and desktop, (b) the gov.ie design system supplies an icon-button primitive that we can use without inventing gesture handling, (c) it's discoverable without education. The swipe gesture remains a credible v2 addition.
- **Keyboard-Delete-on-focused-row is an additive shortcut**, not the primary path. It's there for keyboard power users; the visible button is the primary affordance.
- **Always visible on mobile, hover-reveal on desktop** matches the established UX pattern (Apple Mail, Things, Notion). Hiding the button on mobile would make it undiscoverable.

**Done when:** Clicking the × on a row makes the row disappear immediately (no toast yet — that's 3.2). Tab to a row's checkbox + press Delete also removes it. The button is reachable by keyboard, has a focus ring, and has an accessible name that includes the description.

---

## 3.2 — Undo toast appears after a delete

As a user, when I delete a task, I want a brief opportunity to undo it, so misclicks and accidents don't lose work.

**AC:**

- After a `DELETE_TODO` dispatch, an `<UndoToast>` appears showing the deleted task's description and an "Undo" button.
- The toast lives in an `<UndoToastContainer>` that renders one toast per entry in `state.recentlyDeleted`. Multiple deletes in quick succession produce stacked toasts (newest at the top, oldest at the bottom — or vice versa, but consistent).
- The container is positioned so it doesn't obscure the bottom input bar — sitting just above the input bar with a small gap, or as a stack at the top of the main area. Either is acceptable; pick one and stay consistent.
- iOS safe-area insets are honoured (per `05-polish.md` §5.1 — toasts above the home bar).
- The container is `role="status"` with `aria-live="polite"` per the accessibility baseline (`architecture.md` §8) so screen readers announce the deletion non-disruptively.
- The toast uses gov.ie tokens for surface, typography, and the undo button (gov.ie `Button` in `flat` / link variant per `ux-spec.md` §3).
- The toast does **not** dismiss automatically yet — that's Story 3.4. For now, it stays until the user clicks Undo (Story 3.3) or until they manually trigger an `EXPIRE_DELETED` via DevTools dispatching.

**Refs:** `architecture.md` §4.2 (`DELETE_TODO`, `EXPIRE_DELETED`), §5.4 (flow), §8 (`role="status"` / `aria-live="polite"`); `ux-spec.md` §3 (`<UndoToast>`).

**Design decisions:**

- One toast per deletion (rather than a single "X deleted" toast that batches) so each item is independently undoable. Batching would force the user to undo everything-or-nothing.
- `aria-live="polite"` rather than `assertive` because deletion is not an emergency. Polite politely waits for the screen reader to finish its current utterance.

**Done when:** Deleting a row makes a toast appear with the task's text and an Undo button. Deleting three rows in a row produces three stacked toasts.

---

## 3.3 — Undo restores the task to its original position

As a user who clicked delete by accident, I want a single tap on Undo to bring the task back exactly where it was, so I can recover from misclicks without rebuilding context.

**AC:**

- Clicking the Undo button on a toast dispatches `UNDO_DELETE` with the deleted todo's `id`.
- The reducer (already implemented in Story 1.2) restores the todo to `originalIndex` in `state.todos`. If `originalIndex` is now beyond the end of the array (other deletions happened first), it's inserted at the end — never lost.
- The corresponding `<UndoToast>` unmounts (its `recentlyDeleted` record is removed by the reducer as part of `UNDO_DELETE`).
- The restored todo retains its original `id`, `description`, `completed`, and `createdAt` — undo is a true restoration, not a re-creation.
- The list scrolls back to the restored row if it's offscreen (nice-to-have — skip if it complicates layout; document the deferral in the brief).
- Persistence (Story 1.4) automatically re-saves the restored list.

**Refs:** `architecture.md` §4.2 (`UNDO_DELETE`), §5.4 (flow); `brief.md` (no decision needed — undo is a straightforward "user intent").

**Design decisions:**

- Insert at `originalIndex` (clamped to `todos.length`) rather than at the end — preserves the user's mental model of where the row was. The clamp handles the edge case where other items have been deleted since.
- Undo only restores the *most recently relevant* toast click — there's no "undo the undo". Out of scope for v1.

**Done when:** Delete row at position 2 of 5 → click Undo → row reappears at position 2, not at the end. Delete three rows then undo the middle one → that row reappears at its original position, the other two toasts remain.

---

## 3.4 — Toast auto-dismisses after the undo window

As a user, I want the undo affordance to politely get out of the way once I've clearly moved on, so my screen isn't cluttered by toasts from five minutes ago.

**AC:**

- Each `<UndoToast>` auto-dismisses 4 seconds (4000ms) after the deletion (per `architecture.md` §5.4 — the `DeletedRecord.expiresAt` timestamp is set 4000ms in the future).
- When the timer expires, an `EXPIRE_DELETED` action fires for that record, removing it from `state.recentlyDeleted`. The toast unmounts as a result of the state change.
- The timer is **per-toast**, not global — three deletions in quick succession produce three independent 4s countdowns.
- The countdown visually communicates urgency. Minimum acceptable treatment: a thin progress bar inside the toast that depletes over the 4 seconds, using gov.ie tokens. Acceptable fallback if the bar is too fiddly: the toast fades out in the final 500ms instead.
- If the user clicks Undo before expiry, the timer is cancelled and the toast unmounts via the `UNDO_DELETE` path (Story 3.3), not the expiry path. `EXPIRE_DELETED` does not fire.
- If the component unmounts for any reason while the timer is pending (e.g. user navigates away — currently impossible in this app, but defensive), the timer is cleaned up to avoid memory leaks. Use `useEffect` cleanup or a custom `useUndoTimer` hook per `architecture.md` §2 (`src/hooks/useUndoTimer.ts`).
- The timer respects the `prefers-reduced-motion` media query — the progress bar's animation is suppressed when reduced motion is requested, but the dismissal time stays 4s (we don't want screen readers to lose the announcement faster).

**Refs:** `architecture.md` §4.2 (`EXPIRE_DELETED`), §5.4 (4000ms expiry), §2 (`hooks/useUndoTimer.ts`); `ux-spec.md` §7 (motion).

**Design decisions:**

- 4 seconds is short enough that the toast doesn't linger after the user's attention has moved on, and long enough for a "wait, no, I didn't mean that" reaction. Lifted from the architecture's spec, not a fresh number.
- A custom `useUndoTimer` hook (one timer per toast) is cleaner than a global timer manager. Each `<UndoToast>` is responsible for its own dismissal.
- Reduced-motion users still get the same 4s window — the *visual* countdown is the accommodation, not the time itself. Removing the countdown for these users matches the "respects users' attention" framing in the brief.

**Done when:** Delete a row, wait 4s, the toast disappears on its own. Delete a row, click Undo within 4s — the row comes back. Delete three rows in 1s intervals — three toasts disappear independently 4s after each deletion. `prefers-reduced-motion: reduce` set in DevTools renders no visible countdown animation but still dismisses at 4s.

---

## Epic 03 done when

A user can remove tasks, change their mind for a few seconds, and have the toast quietly retire when they don't. The destructive action has a safety net that matches the brief's "respects users' attention" stance.
