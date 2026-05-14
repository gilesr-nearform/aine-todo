# Epic 05 — Polish

> The integration sweep. By the time this epic starts, every feature works; what's left is making sure it works *well* across devices, every interaction state is present, and the accessibility baseline holds. These stories cut across all prior epics — running them earlier is pointless.

---

## 5.1 — Responsive pass

As a user on either desktop or mobile, I want the app to feel like it was designed for my device, not retrofitted from the other one.

**AC:**
- Mobile breakpoint behaviour verified on a real device, not just Chrome DevTools:
  - Touch targets are all ≥ 44×44px (gov.ie design system components meet this by default; verify any custom components also do)
  - The input bar is reachable with one thumb (positioned at the bottom)
  - The on-screen keyboard does not hide the input — when focused, the input remains visible above the keyboard
  - Safe-area padding accommodates iOS notches and home-bars (`env(safe-area-inset-bottom)` applied to the input bar)
  - The swipe-to-delete gesture feels natural; horizontal swipes do not block vertical scroll
  - Undo toasts sit above the home-bar, not under it
- Desktop breakpoint behaviour verified:
  - List is centred (using gov.ie container max-width tokens if available)
  - Hover states on rows, checkboxes, buttons, and delete icons all feel responsive (no lag, no flicker)
  - Keyboard navigation works end-to-end: Tab through input → submit → rows → repeat
  - Mouse-only deletion (the hover icon path) works without keyboard or touch
- The transition between breakpoints (resize the browser window across the gov.ie mobile/desktop threshold) does not break layout:
  - List re-centres without content jumping
  - Hover affordances activate / deactivate correctly
  - No CSS errors in the console
- Safari quirks checked:
  - `position: sticky` works on Safari (or is replaced with `position: fixed` if not)
  - `100vh` is not used directly for full-viewport layouts (use `100dvh` or `100svh` to handle iOS toolbar)
  - `-webkit-tap-highlight-color: transparent` set on `<TodoItem>` to suppress the default blue tap highlight

**Refs:** `architecture.md` §8 (accessibility), `component-inventory.md` §4, `ux-spec.md` §8 (responsive)

**Design decisions:**
- Real-device verification is required, not optional — emulators miss real keyboard, real touch, and real safe-area issues.
- Breakpoint values come from gov.ie tokens; don't introduce custom breakpoint values.
- Use `dvh` / `svh` for viewport heights to handle iOS Safari's collapsing toolbar.

**Done when:** The app has been used end-to-end on a real iPhone in Safari and on desktop Chrome at three window widths (full-width, ~720px, ~400px). All four UI states verified in each environment.

---

## 5.2 — Interaction states sweep

As an assessor evaluating production-feel, I want every interactive component to show all of its applicable interaction states, so the app behaves like a real product.

**AC:**
- Working through the matrix in `component-inventory.md` §5, every ✓ has been implemented and verified visually
- **Gov.ie components:** for each gov.ie component we use (`Input`, `Button`, `Checkbox`, possibly `Alert`/`ErrorMessage`/`Skeleton`), verify that the design system's built-in states render correctly in our composition context (i.e. nothing in our CSS overrides them)
- **Custom components:** for each custom component (`<TodoItem>`, `<TodoDeleteAction>`, `<UndoToast>`, etc.), implement and verify all applicable states:
  - **Default:** at-rest visual using gov.ie tokens
  - **Hover** (where applicable): subtle change — background tint or opacity bump using gov.ie tokens. Never animation alone.
  - **Focus** (where applicable): visible focus ring using gov.ie focus-ring token. Use `:focus-visible` (not `:focus`) so the ring appears only on keyboard navigation.
  - **Active** (where applicable): the pressed-state visual.
  - **Disabled** (where applicable): opacity reduced, cursor `not-allowed`, `aria-disabled="true"` or the native `disabled` attribute. Disabled elements must not be focusable via keyboard.
- The Submit button's `disabled` state is visually distinct enough that the user understands why pressing Enter does nothing
- The Retry button (in the error state) has its `disabled` state used during retry-in-flight; the user can see the button has acknowledged their click

**Refs:** `component-inventory.md` §3 (every component), §5 (the matrix); `ux-spec.md` §3 (component mapping)

**Design decisions:**
- `:focus-visible` not `:focus` so the focus ring shows only on keyboard navigation. This is the modern accessibility-friendly default — and gov.ie components likely follow it.
- All custom-component state values come from gov.ie tokens, not from one-off CSS values.
- We trust the gov.ie components to provide their own state treatments; we just don't override them.

**Done when:** A friend or colleague can use the app keyboard-only and confirm they always know which element is focused; the matrix in `component-inventory.md` §5 has every ✓ verified.

---

## 5.3 — Accessibility baseline

As a user relying on assistive technology, I want the app to be operable without sighted use, even though a full WCAG audit is out of scope for v1.

**AC:**
- Run axe DevTools on the populated state — fix any "Critical" or "Serious" issues; "Moderate" issues are documented but may be deferred
- Every interactive element has a discernible name (via visible text, `aria-label`, or `aria-labelledby`):
  - The input field has a label (gov.ie `Input` provides this; verify it's set)
  - The submit button reads "Add" with appropriate `aria-label` if icon-only
  - Each delete button reads "Delete '<description>'"
  - Each checkbox reads "Mark '<description>' as complete" (or "as not complete")
  - Retry button reads "Try again"
  - Undo button reads "Undo"
- Heading hierarchy: a single `<h1>` for the app title; no skipped heading levels
- Colour contrast: gov.ie design system tokens meet WCAG AA; verify with axe that we haven't broken anything via custom CSS
- The completed-todo visual treatment is not communicated by colour alone — the strikethrough plus the checked state of the checkbox carry the meaning redundantly
- Focus is never trapped; `Tab` and `Shift+Tab` cycle freely
- `aria-live` regions:
  - The undo toast container is `role="status"` + `aria-live="polite"`
  - The error state is `role="alert"` (assertive by default)
- The page has a sensible `<title>` and the document language is set: `<html lang="en">`
- No drag-and-drop required for any action (per WCAG 2.5.7)

**Refs:** `architecture.md` §8; `ux-spec.md` §1

**Design decisions:**
- Baseline pass, not a full WCAG 2.1 AA certification. Documented as such in the README — full audit is a v2 commitment.
- The gov.ie design system carries most of the accessibility load; we just don't undermine it.
- axe DevTools is the right tool for a baseline check — it catches the common issues without requiring expert review.

**Done when:** axe DevTools reports zero Critical or Serious issues on every UI state; the app is operable with keyboard alone from start (mount) to finish (delete a todo); VoiceOver / NVDA can announce a delete and an undo confirmation.

---

## 5.4 — Completion-grouping evaluation (day-5 decision point)

As the designer, I want to live with the "stays in place" completion behaviour for a few days before deciding whether to add a visually-grouped Completed section, so the decision is informed by use, not speculation.

**This is not an implementation story — it's a deliberate decision-point.** Time-boxed to 30 minutes on day 5.

**AC:**
- By day 5, the app has been used for at least 2 days with real tasks (not just dev testing)
- Spend 30 minutes evaluating the current "completed stays in place" behaviour with realistic content (10–20 mixed active/completed tasks)
- Document the decision (keep "stays in place" OR add a grouped Completed section) in `docs/brief.md` decision log
- If the decision is to *add* grouping:
  - Build the simplest version: completed items animate to the bottom of the list under a "Completed" heading (no collapse, no filter, no separate page)
  - The heading uses gov.ie typography tokens; the section is visually but not semantically separated
  - This still works within the PRD's "no filtering" rule because everything remains visible on the same screen
  - Add a new story (5.5) inline to capture the implementation AC and tick off when done
- If the decision is to *keep* "stays in place":
  - No code changes needed
  - Document the reasoning in the README under "What I learned" — this is the kind of "I chose to do less" moment SDD is meant to surface

**Refs:** `prd.md` §5.3 (deferred reorder behaviour); `ux-spec.md` §9 (open questions); `brief.md` decision log

**Design decisions:**
- Decision *by living with the interaction* rather than designing it up front. This is a service-design move and worth calling out in the README as a deliberate SDD-with-judgement choice.
- Time-boxed to 30 minutes because indecision is its own cost. Decide, document, move on.
- The grouped-section option, if chosen, stays within PRD scope by not introducing filtering or routing — it's the visual organisation of an existing list, not a new view.

**Done when:** The decision is made, documented in `brief.md` decision log, and (if grouping is chosen) implemented and shipping.
