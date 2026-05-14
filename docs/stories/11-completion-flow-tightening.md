## Epic 11 — Tighten the completion flow; drop flags

> Driven by real usage. After living with Epics 07–08, the builder found that flags were noise (single-user app, every task is implicitly "mine") and that completed tasks lingering inline was clutter rather than memory aid. This epic flips the defaults and trims the surface area.

### What ships

- **Completing a task auto-hides it.** `filters.showCompleted` defaults to `false`. The "Show completed" toggle in the list summary remains as the override; checking the box hides it from the main list, ticking "Show completed" reveals it again.
- **The active view state persists.** `showCompleted` and the active smart-view selection now write to localStorage alongside `lists` / `todos` / `activeListId`, so the user's preference survives a reload.
- **New smart view: "Completed".** A second sibling under "All tasks" in the sidebar, with a check-circle icon. Selecting it shows every completed task across every list, sorted however they currently sort. Re-completing or un-completing from this view works as on any other list.
- **Flags removed entirely.** `flagged` property on `Todo`, `TOGGLE_FLAG` / `SET_FLAGGED_ONLY` reducer cases, `Filters.flaggedOnly`, the per-row flag button, the amber left-border styling, the "Flagged only" filter button, the custom `FlagIcon` SVG, and the en/ga flag translation keys are all gone. Persisted v2 data containing `flagged` reads silently and the field is ignored.
- **Rename is on the list title, not in the sidebar.** The pencil that used to sit beside each user list in the `SideNav` now lives at the right of the list-title heading in the main content area. The sidebar row only shows a hover-revealed delete now. Smart views ("All tasks", "Completed") have no rename affordance (they aren't user data).

### Cuts inside this epic

- **No data migration to surface previously-hidden completed tasks.** Existing tasks that were created with `flagged: true` simply lose the flag silently on next load. We don't pop a "your flags are gone" toast — the feature is removed cleanly.
- **No "Completed" count badge** in the sidebar for now. We already show per-list counts of total tasks; adding a separate count of completed across the app duplicates information the user can see in the view itself.
- **No keyboard shortcut for renaming.** Click the pencil; the inline editor opens. Future iteration could bind `F2` or `Enter` while a list title is focused.

### Done when

1. Ticking a task makes it disappear from the visible list (unless "Show completed" is on, or the Completed smart view is active).
2. Hard-refreshing the page restores the previous Show/Hide state and the previously active smart view or user list.
3. The sidebar shows `Smart → All tasks → Completed → My lists` from top to bottom. Selecting `Completed` shows only completed tasks across all lists.
4. No flag UI is reachable anywhere; the FlagIcon module is deleted; the `flagged` property is no longer on `Todo`.
5. Each user list row in the sidebar has at most one revealed action (delete) on hover. The rename pencil is on the right of the list title heading instead, and only appears when a user list is active (not a smart view).
