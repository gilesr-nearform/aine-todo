# UX Spec — Visual Language and Voice

> **Owner:** UX persona · **Status:** Locked for week 1 · **Last updated:** Week 1, Day 0
>
> **Source of truth:** The Government of Ireland Design System. This document does *not* invent tokens or override them — it defers to `@ogcio/design-system-tokens` and `@ogcio/theme-govie`. Where the design system has a token, use it. This document only documents (a) the design principles we operate under, (b) our component-mapping decisions (gov.ie vs custom), (c) the few places we extend the design system because it doesn't cover our case, and (d) voice and tone for the copy we write.
>
> **Always check:** the [React Storybook](https://ds.services.gov.ie/storybook-react/) and [Components catalogue](https://ds.services.gov.ie/components/) for the up-to-date list of available components, props, and tokens before implementing.

---

## 1. Principles

We operate under the Government Design Principles that the gov.ie design system encodes. The most relevant five for this app:

| Principle | What it means here |
|---|---|
| Start with user needs | The user need is "remember what I said I'd do today" — not "manage projects" |
| Do less | The PRD is uncompromising about minimal scope; every cut is a feature |
| Design with data | We'll learn the photo-scan and reorder questions from real use, not pre-decide them in v1 |
| Make things simple | One screen, four actions, no settings |
| Build accessible services | Using gov.ie components by default makes this nearly free; we maintain the standard for our custom components |

---

## 2. Visual language — gov.ie tokens

All colours, type, spacing, radius, motion and breakpoints come from `@ogcio/design-system-tokens`, consumed via `@ogcio/design-system-tailwind`. **We do not redefine any of these.** When implementing, use the design system's utility classes or CSS variables; do not put hex codes or pixel values in the codebase.

### 2.1 What we don't override

- Brand colour palette
- Semantic colours (success / warning / error / info)
- Type scale and font family (gov.ie supplies its own — usually a workhorse sans-serif tuned for readability)
- Spacing scale
- Border radii
- Focus ring style
- Breakpoint definitions
- Component default sizes and paddings

### 2.2 What we extend (and only where necessary)

Two areas where we'll add to the design system, not override it:

- **Skeleton rows for the loading state.** If the design system has a skeleton/placeholder component, we use it. If not, we'll compose one using gov.ie tokens (neutral surface colour, the system's border radius, a subtle shimmer respecting `prefers-reduced-motion`). Decision-log entry to be added on day 1 once verified.
- **Undo toast.** Highly unlikely to be in a government design system (toasts are a contested pattern). We'll build a custom component using gov.ie tokens for surface colour, text colour, shadow, and border radius. The "Undo" button inside the toast uses the gov.ie `Button` component directly.

Anything else that feels like it needs a custom token is a code smell — re-read this document and the gov.ie docs first.

---

## 3. Component mapping — gov.ie vs custom

For each component in `component-inventory.md`, we identify whether to use a gov.ie component, compose from gov.ie primitives, or build custom.

| Component | Source | Notes |
|---|---|---|
| `<App>`, `<AppShell>` | Custom (composition) | App-specific layout; uses gov.ie spacing / typography tokens |
| `<Header>` | **Gov.ie `HeaderNext` + `HeaderTitle`** | The gov.ie default (green) service header with the app title. See `brief.md` decision log on the branding consideration (prototype, not a real gov.ie service). |
| `<TodoInput>` | **Gov.ie `Input`** | Form input — design system covers this |
| `<TodoSubmitButton>` | **Gov.ie `Button`** (primary variant) | |
| `Checkbox` (for todo completion) | **Gov.ie `Checkbox`** if available; else compose `<input type="checkbox">` with gov.ie token styling | Verify in Storybook day 1 |
| `<TodoText>` | Custom (composition) | Just styled text; uses gov.ie typography utility classes |
| `<TodoTimestamp>` | Custom (composition) | Same — small muted text using gov.ie token |
| `<TodoDeleteAction>` | Custom | Combines a gov.ie icon button with our swipe behaviour |
| `<TodoItem>` | Custom | Composes the above |
| `<TodoList>` | Custom | Layout container; no design system equivalent |
| `<TodoInputBar>` | Custom (composition) | |
| `<EmptyState>` | Custom (composition) | Uses gov.ie heading + body text tokens |
| `<LoadingState>` | **Gov.ie skeleton if available**, else custom | See §2.2 |
| `<ErrorState>` | **Gov.ie `Alert` / `ErrorMessage` if available**, else custom | Verify in Storybook day 1 |
| Retry button (in `<ErrorState>`) | **Gov.ie `Button`** (secondary variant) | |
| `<UndoToast>` and container | Custom | See §2.2; uses gov.ie tokens throughout |
| "Undo" button (in `<UndoToast>`) | **Gov.ie `Button`** (text/link variant) | |

**Day-1 verification:** open the React Storybook and confirm presence/absence for Input, Button, Checkbox, Alert/ErrorMessage, and Skeleton. Update this table accordingly. If any component is missing that we'd rather not build custom, escalate before starting Epic 2.

---

## 4. Iconography

The gov.ie design system likely includes its own icon set. Day-1 task: check `@ogcio/design-system-react` exports for icons and the Storybook for the catalogue. Where gov.ie supplies an icon (e.g. for delete, add, close, alert), use it.

For icons gov.ie doesn't supply, fall back to **Lucide React** at stroke-width `1.5`. Specific likely needs:

- Trash / delete icon — gov.ie may or may not have one; if not, Lucide `Trash2`
- Add / plus icon for submit button — gov.ie likely has one

Always inherit colour via `currentColor` so icons follow their parent's text colour and we don't hardcode anything.

---

## 5. Specific design decisions deferred to gov.ie

The following decisions, which we'd otherwise have to make ourselves, are settled by the design system:

- Primary button colour and treatment
- Destructive button colour and treatment (used for the swipe-reveal delete and possibly the focused-row destructive cue)
- Focus ring style (colour, width, offset)
- Disabled state opacity
- Heading hierarchy and font sizes
- Body text size and line-height
- Input border, focus border, error border
- Checkbox checked and unchecked visual treatment

If any of these *don't* feel right for our app once seen in context, the answer is *not* to override them — the answer is to question whether we're using the right component for the job.

---

## 6. Voice and tone

Gov.ie has a strong plain-English standard. We follow it.

| Trait | What it sounds like |
|---|---|
| Plain | "Add a task" — not "Compose a new entry" |
| Direct | "Couldn't load your tasks." — not "Oh no, something went wrong!" |
| Sentence case | "Nothing to do." — not "Nothing To Do." |
| Functional | Buttons describe the action: "Try again", "Undo", "Add" |
| Unapologetic | The app doesn't apologise for its limits; it states what is |
| Emoji-free | None. Anywhere. |
| Exclamation-free | None. Anywhere. |

### 6.1 Specific copy

Use these strings as-is unless changed via a decision-log entry. Where the gov.ie design system provides default copy for a component (e.g. "Cancel" button), prefer that over our own.

| Where | Copy |
|---|---|
| App title | `ListLens` *(placeholder — finalised by day 6)* |
| Input placeholder | `Add a task` |
| Empty state heading | `Nothing to do.` |
| Empty state helper *(optional)* | `Add one below.` |
| Loading state | *(no text — skeleton only)* |
| Error state heading | `Couldn't load your tasks.` |
| Error state body | `Something went wrong on our side.` |
| Error retry button | `Try again` |
| Submit button label | `Add` |
| Undo toast | `Deleted: "{description}"` + button `Undo` |

Note: we use "task" not "todo" in user-facing copy because it's the more natural government-context word; "todo" stays in code and docs.

---

## 7. Motion

The gov.ie design system likely defines motion tokens (durations, easing). Use those. For anything not covered:

- Hover / focus transitions: ~150ms
- Entry / exit animations (new todo appearing, deleted row collapsing): ~250ms
- Modal / overlay transitions: ~300ms
- Undo toast lifetime: 4000ms

All animation respects `prefers-reduced-motion: reduce` via a global override:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Responsive behaviour

Use gov.ie design system's breakpoint tokens. They are likely standard (mobile / tablet / desktop boundaries) but verify in the docs day 1.

For our purposes:
- The list is full-width on mobile, max-width-constrained on desktop (gov.ie likely supplies a container width token to follow)
- The input bar is pinned to the bottom on mobile; can be more flexible on desktop
- Swipe-to-delete only activates where `@media (hover: none) and (pointer: coarse)` — touch devices

---

## 9. Open questions deferred to implementation

- **Skeleton component presence:** confirm in Storybook day 1. If missing, agree the custom skeleton approach in a decision-log entry.
- **Toast pattern presence:** confirm. Likely absent — proceed with custom using gov.ie tokens.
- **Reorder on completion:** v1 default is "stays in place." A grouped Completed section is a candidate addition, but the decision is deferred to **Story 5.4** — a 30-minute day-5 evaluation after living with the interaction for a few days. Don't pre-build the grouping; build the simplest version and let real use inform the call.
- **Multi-toast stacking visual:** likely no gov.ie precedent. Cap at 3 visible stacked toasts; below that, behaviour is straightforward.

---

## 10. Decision log additions (UX-specific)

| Date | Decision | Rationale |
|---|---|---|
| Day 0 | Defer all visual tokens to the gov.ie design system | Honest re-use; no inventing what already exists in the canonical source |
| Day 0 | Custom components only for gaps (swipe wrapper, undo toast, possibly skeleton) | Don't replicate work the design system already does |
| Day 0 | Voice and tone follow gov.ie plain-English guidance | Matches the design system's existing standard; consistent with the OGCIO context |
| Day 0 | User-facing copy uses "task" not "todo" | "Task" reads more naturally in a public-sector / workday context; "todo" stays in code and docs |
| Day 0 | Day-1 verification step: open the React Storybook to confirm component availability before implementation | Avoids building custom code for components that already exist; flags gaps early |
