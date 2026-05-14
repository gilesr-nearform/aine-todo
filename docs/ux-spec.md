# UX Spec — Visual Language and Voice

> **Owner:** UX persona · **Status:** Locked + iterated through Day 1 · **Last updated:** Week 1, Day 1 (post-Epic-12)
>
> **Source of truth:** The Government of Ireland Design System. This document does *not* invent tokens or override them — it defers to `@ogcio/design-system-tokens` and `@ogcio/theme-govie`. Where the design system has a token, use it. This document only documents (a) the design principles we operate under, (b) our component-mapping decisions (gov.ie vs custom), (c) the few places we extend the design system because it doesn't cover our case, and (d) voice and tone for the copy we write.
>
> **Scoped exceptions to "never override gov.ie tokens"** are tracked in `[brief.md](brief.md)` §9. As of Day 1 there are two: (1) dark-mode neutral/gray primitives are overridden because `@ogcio/theme-govie/dark.css` ships byte-identical to `light.css`; (2) a bespoke `.list-action-btn` class hooks the text colour of list-pane buttons in dark mode where gov.ie's `gi-text-color-*` classes collide with Tailwind utilities. Brand and intent tokens are untouched.
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
| `<Header>` (bilingual gov.ie strip) | **Gov.ie `HeaderNext`** + custom `GovieBranding` | Two-bar header: top utility strip carries "Rialtas na hÉireann / Government of Ireland" with the harp + Gaeilge / English toggle; lower green bar is gov.ie `HeaderNext` with app title + theme toggle in the primary menu. Builder is an OGCIO service designer; using gov.ie's real service header is an explicit choice — see `brief.md` §9 (Day-1 entries). |
| Language toggle (Gaeilge / English) | **Gov.ie `HeaderToolItemButton`** | Bound to `useI18n()` (Epic 10). |
| Theme toggle (light / dark) | **Gov.ie `HeaderPrimaryMenu` + `HeaderMenuItemButton`** | Sun / moon glyphs are inline SVGs; gov.ie's curated `IconId` set doesn't ship them and that was the minimum-footprint path (Epic 12). |
| Sidebar / mobile drawer | Custom (composes gov.ie `SideNav`, `SideNavItem`, `SideNavHeading`, `IconButton`) | Sidebar on `md+`, drawer below `md` via `useMediaQuery`. The original "Smart" heading was removed Day 1 to lift "All tasks" to the top of the rail (Epic 11). |
| `<TodoInputBar>`, `<TodoInput>` | Custom (composition) over **gov.ie `Input` + `Button`** | |
| `<TodoSubmitButton>` | **Gov.ie `Button`** (primary variant) | |
| Checkbox (for todo completion) | **Gov.ie `Checkbox`** | Real `<input type="checkbox">` under the hood |
| `<TodoText>`, `<TodoTimestamp>` | Custom (composition) | Gov.ie typography utility classes |
| `<TodoItem>` | Custom | Composes the row: checkbox + text + action cluster |
| Edit / Reorder up / Reorder down / Delete | Custom buttons over **gov.ie `IconButton`** | Each carries the bespoke `.list-action-btn` class to fix dark-mode text colour (see exception note above) |
| `<TodoEditor>` | Custom (composition) over **gov.ie `Input`** | Inline editor for description + notes (Epic 07) |
| `<ListSummary>` | Custom over **gov.ie `Button`** + outline button | "x of y completed" + Clear completed (flat) + Show / Hide (outline, `aria-pressed`) (Epic 11) |
| `<ListControls>` | Custom over **gov.ie `Input`** | Free-text search across description + notes (Epic 07; flagged-only filter removed in Epic 11) |
| `<TodoList>` | Custom | Layout container; no design system equivalent |
| `<ConfirmModal>` | Custom over **gov.ie `ModalWrapper`** | Shared confirm dialog used by Clear completed and Delete list. We trust gov.ie's modal to supply the dialog ARIA semantics. (Epic 09 / 08) |
| `<EmptyState>` | Custom (composition) | Uses gov.ie heading + body text tokens |
| `<LoadingState>` | Custom | Skeleton rows composed from gov.ie tokens. Gov.ie has no skeleton primitive as of build. |
| `<ErrorState>` | Custom | Uses gov.ie token styling; `role="alert"` on the wrapper. Gov.ie has no `Alert` primitive that fits this surface. |
| Retry button (in `<ErrorState>`) | **Gov.ie `Button`** (secondary variant) | |
| `<UndoToast>` and container | Custom | Gov.ie tokens throughout; countdown bar is a CSS animation respecting `prefers-reduced-motion` |
| "Undo" button (in `<UndoToast>`) | **Gov.ie `Button`** (flat variant) | |

**Day-1 verification:** completed. Gov.ie shipped Input, Button, Checkbox, Icon, IconButton, ModalWrapper, HeaderNext, SideNav, and Tooltip used in v1. Skeleton and Toast / Alert were absent and live as custom components above.

---

## 4. Iconography

**Day-1 finding:** Gov.ie's `Icon` component renders via Material Symbols Outlined font ligatures (`<span class="material-symbols-outlined">{name}</span>`). The design system exports a curated `IconId` TypeScript type listing a few dozen names, but **doesn't ship the font itself** — without the font, every icon renders as its literal text name. We therefore self-host **`material-symbols`** (the canonical community-maintained npm package), imported once from `src/styles/globals.css`. See `brief.md` §9.

Side effect: at runtime, gov.ie's `Icon` will render *any* valid Material Symbols Outlined name, not just the curated set in `IconId`. We use this only where the curated set has a clear gap — e.g. the "All tasks" sidebar entry was switched from the curated `apps` to the off-list `list` to better signal a list view. Each such escape is narrowed to a single named constant per use site (e.g. `ALL_TASKS_ICON` in `Sidebar.tsx`) so the deviation is auditable.

**No Lucide.** The Day-0 plan to fall back to Lucide React was retired Day 1 — Material Symbols Outlined covers everything we need, including delete (`delete`), add (`add_circle`), close (`close`), and the row-action cluster (`edit`, `arrow_upward`, `arrow_downward`, `more_horiz`, `visibility`, `visibility_off`).

The theme toggle's sun / moon are inline SVGs (Epic 12) — the smallest possible custom-icon footprint, since the gov.ie `IconId` set doesn't include them and dragging in a second font solely for two glyphs would be overkill.

All icons inherit colour via `currentColor` so they follow their parent's text colour and we don't hardcode anything.

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
| App title | `UX To-do list` *(finalised Day 1, replacing the working placeholder "ListLens")* |
| Submit button label | `Add` |
| Empty state heading | `Nothing to do.` |
| Empty state helper *(optional)* | `Add one below.` |
| Loading state | *(no text — skeleton only)* |
| Error state heading | `Couldn't load your tasks.` |
| Error state body | `Something went wrong on our side.` |
| Error retry button | `Try again` |
| Undo toast | `Deleted: "{description}"` + button `Undo` |

All user-facing copy is sourced from the translation dictionary in `src/i18n/translations.ts` rather than hardcoded — both English and Irish (Gaeilge) strings live there. The strings above are the English originals; the Gaeilge versions follow the same plain-English tone in Irish.

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

## 9. Resolved questions (formerly open)

- ~~**Skeleton component presence:** confirm in Storybook day 1.~~ **Resolved Day 1:** absent. Built custom skeleton rows using gov.ie tokens; entry above in §3.
- ~~**Toast pattern presence:** confirm.~~ **Resolved Day 1:** absent. Built custom `UndoToast` with countdown bar using gov.ie tokens; entry above in §3.
- ~~**Reorder on completion:**~~ **Resolved Day 1 (Story 5.4 + Epic 11):** the Day-5 evaluation kept "stays in place" as the default for v1. Epic 11 then superseded the question entirely by auto-hiding completed tasks by default with a Show / Hide toggle and a separate "Completed" smart view.
- ~~**Multi-toast stacking visual:**~~ **Resolved Day 1:** capped at 3 visible stacked toasts via `UndoToastContainer`; queued toasts dismiss in FIFO order. No gov.ie precedent contradicted by this.

---

## 10. Decision log

UX-side decisions are folded into the single canonical decision log in **`brief.md` §9** — keeping three log files in sync invites drift. The Day-0 UX entries (defer to gov.ie tokens, custom only for gaps, plain-English tone, "task" over "todo", verify Storybook first) and the Day-1 amendments (header swap to `HeaderNext`, completion-grouping decision, app rename, bilingual gov.ie strip, Material Symbols self-hosting, dark-mode override scope) all live there.
