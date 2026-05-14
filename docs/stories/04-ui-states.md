# Epic 04 — UI states polish

> The four required UI states — empty, loading, error, populated — were placeholders from Epic 1 so the four-way routing in `<MainContent>` could be verified end-to-end. This epic replaces each placeholder with something that feels considered. Per `brief.md` §4 these states are a *graded deliverable* of the training-programme PRD; treating them as throwaways would lose the marks the brief points at.

---

## 4.1 — Empty state

As a user opening the app for the first time (or after clearing my list), I want the empty screen to suggest what to do, so I'm not staring at a blank page.

**AC:**

- `<EmptyState>` no longer renders the "Empty" placeholder text. It renders a centred message using gov.ie typography tokens, with:
  - A primary line, e.g. "No tasks yet" — `<Heading>` size sm or md.
  - A secondary line, e.g. "Add your first task using the box below." — body text using gov.ie tokens.
  - Optional: a gov.ie `Icon` (e.g. `add` or a list/clipboard glyph) above the text, at a size that's visible but not loud. Use gov.ie's existing icon set; do not import a third-party icon.
- The empty-state content is vertically centred in the main scroll area and horizontally centred within the layout's max-width.
- The message reads in plain English per `ux-spec.md` §6 — no exclamations, no emoji, no "Whoops!"-style copy.
- The empty state does **not** include a "Add a task" call-to-action button. The input bar at the bottom is the create affordance; adding a second one in the empty state would create two truths.
- Mobile and desktop both render the empty state without horizontal scrolling, regardless of viewport width down to ~320px.
- The empty state appears for two distinct journeys (`status === 'success'` AND `todos.length === 0`):
  1. First-time use — no entry in `localStorage`.
  2. Cleared-list — user has deleted everything (and any pending undo toasts have expired).
- The state has no implicit retry / refresh action — it's a non-error situation. The user creates a task to leave the empty state.

**Refs:** `architecture.md` §4.1 (`LoadStatus`); `ux-spec.md` §6 (voice and tone), §3 (`<EmptyState>` is custom); `component-inventory.md` §3.5 (state routing).

**Design decisions:**

- **No CTA button in the empty state.** The input bar is always visible (`AppShell` keeps it pinned), so the create affordance is already there. Adding a second one would dilute the primary path.
- **Plain copy, not encouragement.** "No tasks yet" is honest. "Looks like you're all caught up!" is the kind of voice the gov.ie tone guide explicitly avoids.

**Done when:** A new-install run (no `localStorage`) and a delete-everything run both end on the empty state with the polished message centred on screen, on both desktop and mobile (320px and up). axe DevTools reports no issues introduced.

---

## 4.2 — Loading state

As a user on the brief 600–900ms initial-load window, I want the screen to feel like it's working, not frozen.

**AC:**

- `<LoadingState>` no longer renders the "Loading…" placeholder text. It renders a clearly-loading visual using gov.ie tokens. Acceptable treatments, in order of preference:
  1. **Skeleton rows** — three or four placeholder rows that match the rough shape of a `<TodoItem>` (a checkbox-shaped circle on the left, a wider rectangle for the description, a thin rectangle for the timestamp). Animate a gentle pulse using gov.ie token values; under `prefers-reduced-motion: reduce`, the pulse is suppressed but the skeleton remains visible.
  2. If a gov.ie `Spinner` / `Skeleton` exists in `@ogcio/design-system-react`, use it instead of a custom build.
  3. Last resort: a custom spinner using gov.ie tokens.
- Layout matches the populated state's layout so that when loading completes there is no perceived jump — same horizontal padding, same row gaps, same vertical centring rules.
- The state is announced via the existing `aria-live="polite"` on the wrapper from Story 1.3 (verify it still announces).
- The simulated 600–900ms delay from Story 1.4 remains in place. Skipping the loading state on cache hits is explicitly out of scope (`prd.md` §6.2 documents the rationale).
- The skeleton's "looks like a real list" effect is not so strong that users mistake it for a populated list (so: clearly a placeholder shape, not lorem-ipsum-quality text).

**Refs:** `architecture.md` §4.1 (`LoadStatus`); `ux-spec.md` §3, §7 (motion); `prd.md` §6.2 (delay is preserved on cache hits).

**Design decisions:**

- **Skeleton over spinner.** A skeleton communicates "content is coming, here's roughly where" — a spinner only says "wait." For a list app the skeleton matches the brief's "production-ready feel" framing better.
- **Pulse suppressed under reduced-motion.** Static skeleton still works as a "loading" cue; the animation is the accommodation, not the meaning.
- **Same layout as populated.** Hard requirement, not nice-to-have. Layout shift on load is one of the cheapest mistakes to make and one of the easiest to call out in a review.

**Done when:** A fresh reload shows the skeleton for the duration of the simulated delay, then transitions to the empty or populated state with no horizontal layout shift. `prefers-reduced-motion: reduce` set in DevTools shows the skeleton without animation.

---

## 4.3 — Error state with retry

As a user whose initial load failed, I want to understand what happened and try again, so I'm not stuck on a dead screen.

**AC:**

- `<ErrorState>` no longer renders the "Error" placeholder text. It renders:
  - A gov.ie `Alert` (variant: danger / error if available) with a short headline like "We couldn't load your tasks" and a body line "Please check your connection and try again." Plain English; no error codes.
  - A gov.ie `Button` labelled "Try again" (secondary variant per `ux-spec.md` §3) directly below the alert.
  - Optional: a smaller "Refresh the page" hint if the retry repeatedly fails. Out of scope for v1.
- Clicking "Try again" dispatches `INIT_LOAD_RETRY` (which the Story 1.2 reducer already handles by setting status to `loading`). The provider re-runs the initial-load effect; the loading state appears, then either success or error.
- The retry button is disabled while a retry is in flight (i.e. while `status === 'loading'`), so the user understands their click was accepted. Per `05-polish.md` §5.2.
- The error state's wrapper is `role="alert"` per `architecture.md` §8, so assistive tech announces the failure.
- The error state and the loading state share no flicker on the loading → error transition (the alert appears cleanly, not on top of leftover loading visuals).
- The provider's initial-load effect must be retriggerable on `INIT_LOAD_RETRY`. The Story 1.2 effect runs once via `hasLoadedRef`; this story relaxes that guard so retries work. The `hasLoadedRef` is *not* deleted — it still prevents React 18 Strict Mode's double-invoke from firing two loads on mount. The retry path explicitly resets it.

**Refs:** `architecture.md` §4.2 (`INIT_LOAD_RETRY`), §5.1 (initial load), §8 (`role="alert"`); `ux-spec.md` §3 (gov.ie `Alert`, `Button`).

**Design decisions:**

- **Retry, not refresh-the-page.** The mock loader is in-process; refreshing the page produces the same outcome with worse UX. A retry button is also the standard production pattern for transient failures.
- **Plain copy, no codes.** "We couldn't load your tasks" beats "Error 500: NetworkError." We don't have a backend to attribute failures to anyway.
- **Disabled retry while loading.** Stops users from chaining retry clicks and confusing themselves about which one "won."

**Done when:** Setting `window.__forceError = true` and reloading shows the error state with the alert and retry button. Clicking "Try again" returns to the loading state (briefly, since the simulated delay is preserved) and either succeeds or fails again. The button is disabled mid-retry. axe reports no issues.

---

## 4.4 — Populated state polish

As a user with tasks in the list, I want appearances and changes to feel smooth, so the app reads as a real product rather than a wireframe.

**AC:**

- New todo rows fade in (opacity + small Y translate) over the gov.ie motion duration when `CREATE_TODO` adds them. Under `prefers-reduced-motion: reduce`, the fade is suppressed; rows still appear.
- Toggling completion has a brief colour-transition on the description text (the strikethrough does not animate — strikethrough animation is fiddly and the colour change carries the meaning).
- Deleting a row immediately removes it (no exit animation needed — the undo toast does the "softening" work).
- A horizontal divider between rows (already present from Story 2.2) uses gov.ie border tokens, not a custom hex.
- The populated list is centred on desktop within a sensible max-width (a `<Container>`-equivalent if gov.ie supplies one; else a Tailwind `max-w-2xl` is acceptable, documented in the decision log).
- Long descriptions wrap to multiple lines without breaking the row layout. The checkbox and delete action stay vertically aligned to the first line of the description.
- The list scrolls when there are more rows than fit; the rest of the shell (header, input bar, toasts) stays put (already verified in Story 1.3; verify it still holds with real content).
- Touch targets across the row (checkbox, delete button) remain ≥ 44×44px (deferred verification to Story 5.1's responsive pass; this story just doesn't undermine it).

**Refs:** `architecture.md` §9 (performance — animations under 200/400ms); `ux-spec.md` §3, §7 (motion); `component-inventory.md` §3.4.

**Design decisions:**

- **Animate entry, not exit.** The undo toast is the "exit feedback." Adding a delete-fade on top would compete with the toast for the user's attention.
- **Don't animate the strikethrough.** Strikethrough animation requires JS to inset a pseudo-element with width transitions, and it's a lot of code for a small effect that adds nothing.
- **Reduced-motion suppresses the fade.** Same principle as elsewhere — motion is the accommodation, not the meaning.

**Done when:** Creating three todos in quick succession shows three smooth-fade-in rows. Toggling completes those rows with a quiet colour change. Deleting one removes it instantly with the toast acknowledging. `prefers-reduced-motion: reduce` set in DevTools renders the same outcomes without the entry fade.

---

## Epic 04 done when

Each of the four UI states reads as considered. There is no "this is obviously a developer placeholder" surface left in the app. The brief's graded deliverable on loading/error/empty/populated states is hit cleanly.
