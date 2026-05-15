# UX To-do list

Personal todo app prototype built using the Government of Ireland Design System. Deliverable for an AI training programme on Spec-Driven Development with the BMAD framework.

> The working name during early specs was *ListLens*. It was retired Day 1 in favour of *UX To-do list* once the prototype found its voice — see `docs/brief.md` §9. The internal `listlens:` `localStorage` prefix is preserved as a stable storage identifier and intentionally not renamed.

The BMAD planning artifacts in [docs/](docs/) are the source of truth. See [CLAUDE.md](CLAUDE.md) for the AI-agent context and [docs/stories/](docs/stories/) for the build-order user stories.

## View it live

The `main` branch auto-deploys to GitHub Pages on every push: **https://gilesr-nearform.github.io/aine-todo/**

This is a deliberate exception to the Day-0 "no deployment" decision in `docs/brief.md` §9, scoped to making the prototype reviewable via a single link rather than a clone-and-run handoff. The deploy workflow lives at `.github/workflows/deploy.yml`.

## Scope vs the linked PRD

The official training PRD describes a tightly minimal app: create, view, complete, delete a task; mock data; runs locally. This prototype goes further. That deserves an explanation.

The training brief's Step 1 instructs the builder to *refine* the PRD before implementation, and Step 2 explicitly mentions navigation and routing — so refinement isn't only allowed, it's invited. The discipline that mattered to me was: every refinement gets specced before it's built, and every refinement gets a row in the decision log explaining why.

Features added beyond the PRD's minimal four:

- **Reorder** (Epic 06) — without it a workday tracker reads as static; up/down buttons (no drag) keep WCAG 2.5.7 satisfied.
- **Notes and search** (Epic 07) — a one-line task often isn't enough; the second line carries the context.
- **Multiple lists** (Epic 08) — a designer's day spans more than one workstream; one list forces context-switching elsewhere.
- **Bilingual gov.ie header + Gaeilge / English UI** (Epic 10) — the design system the app is built on is bilingual by default. Not shipping a language toggle would read as a partial implementation of the very system on display.
- **Completion-flow tightening** (Epic 11) — Epic 07's flag-then-filter pattern was clutter once lived with for a day; Epic 11 inverts it (auto-hide completed by default) and removes the flag surface entirely.
- **Light + dark theme** (Epic 12) — gov.ie publishes a `data-theme` selector; adopting it shows fluency with the design system more honestly than hard-coding light only.
- **GitHub Pages deploy** — a scoped exception to the Day-0 "no deployment" decision, so the assessor reviews the prototype via a single link instead of a clone-and-run.

Each addition is logged with rationale in [`docs/brief.md`](docs/brief.md) §9. Each has a story file or epic spec in [`docs/stories/`](docs/stories/). Each is reflected in the relevant doc. The SDD argument is simply: the discipline held under expanded scope. The same spec-before-build, log-the-decision rhythm worked for the four PRD actions and for the eleven-epic build.

## Setup

Requires Node 20+ and pnpm. If pnpm is not installed:

```bash
corepack enable && corepack prepare pnpm@latest --activate
```

Install dependencies:

```bash
pnpm install
```

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Start the Vite dev server with HMR |
| `pnpm build` | Type-check then produce a production build in `dist/` |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run ESLint over `src/` |
| `pnpm format` | Format the project with Prettier |
| `pnpm format:check` | Check formatting without writing |

## Stack

- Vite + React 19 + TypeScript (strict, with `noUncheckedIndexedAccess`)
- Government of Ireland Design System: `@ogcio/design-system-react`, `@ogcio/design-system-tokens`, `@ogcio/design-system-tailwind`, `@ogcio/theme-govie`
- Tailwind CSS (gov.ie preset via `createTheme()`); `darkMode: ['selector', '[data-theme="govie-dark"]']`
- Fonts: `material-symbols` (self-hosted Material Symbols Outlined — gov.ie's `Icon` API renders these via font ligatures but the design system doesn't ship the font itself). Lato (gov.ie's body font) is supplied transitively via `@ogcio/theme-govie`, which bundles `@fontsource/lato` and serves the woff2 from the bundle; we don't pin it directly.
- React Context + `useReducer` for state, persisted to `localStorage`:
  - `listlens:v2:state` — lists, todos, active list, smart view, show-completed (Story 1.4 + 8.x + 11.x)
  - `listlens:v1:lang` — language preference (`en` | `ga`, Epic 10)
  - `listlens:v1:theme` — theme preference (`light` | `dark`, Epic 12)
- Lightweight i18n via Context + dictionary (English + Irish/Gaeilge) — no `i18next` dependency. See Epic 10.

## Demoing this

The app simulates a 600–900ms initial load with a 10% chance of failure, so the loading and error states are reproducible. Two `window` flags in the browser console make each UI state deterministic — set the flag, then reload.

| Flag | Effect |
|---|---|
| `window.__instant = true` | Skip the simulated load delay. Still reads any persisted state from `localStorage`. |
| `window.__forceError = true` | Force the initial load to fail, regardless of what is in `localStorage`. |

State persists to `localStorage` under three versioned keys. To reset to the empty state during testing:

```js
localStorage.removeItem('listlens:v2:state'); // lists + todos + view-state envelope
localStorage.removeItem('listlens:v1:lang');  // 'en' | 'ga'
localStorage.removeItem('listlens:v1:theme'); // 'light' | 'dark'
```

Then reload the page. (The `listlens:` prefix is a stable storage identifier — see the note at the top of this README.)

## Accessibility and polish status

The implementation hits the baseline obligations from `docs/stories/05-polish.md`:

- `<html lang="en">`, single `<h1>`, semantic landmarks (`<header>`, `<main>`, `<ul>`/`<li>`).
- Every interactive element has a discernible name: the input is labelled, the submit button reads "Add", the delete button reads "Delete '<description>'", the retry button reads "Try again", the undo button reads "Undo", the checkbox is labelled by the description.
- `role="alert"` on the error state and `role="status" aria-live="polite"` on the undo toast container.
- `prefers-reduced-motion: reduce` suppresses the row-enter fade, the toggle colour transition, the skeleton pulse, and the undo-toast countdown bar.
- `100dvh` for the app shell, safe-area padding for the input bar, `-webkit-tap-highlight-color: transparent` for iOS.
- The completed-row visual is not colour-alone (strikethrough plus the checkbox's checked state).

Outstanding manual verification (cannot be done from inside the agent loop):

- Real-device QA on iPhone Safari and desktop Chrome at full, ~720px, and ~400px widths.
- axe DevTools run on each of the four UI states.
- VoiceOver / NVDA pass on delete + undo flow.

## Structure

```
src/
  components/     custom components (gov.ie components imported directly)
    AppShell/     gov.ie identity strip, header (HeaderNext), main layout
    Sidebar/      desktop sidebar; on mobile rendered inside the gov.ie Drawer composed in Header.tsx (no separate MobileNav)
    TodoList/     list pane: header, summary, filter, items
    TodoItem/     single row, reorder + delete + edit actions
    TodoEditor/   inline editor (description + notes)
    TodoInputBar/ pinned task creation bar
    UndoToast/    destructive-action undo with countdown bar
    ConfirmModal/ shared confirm dialog (used by clear-completed and delete-list)
    EmptyState, LoadingState, ErrorState
  state/          reducer, context, types, storage (v1→v2 migration)
  i18n/           Context-based i18n (en + ga); translation dictionary
  theme/          ThemeContext (light + dark) — see Epic 12
  hooks/          custom hooks (useMediaQuery)
  mocks/          simulated initial-load + dev triggers
  utils/          formatters, todo-counts, etc.
  styles/         global CSS (gov.ie theme + Tailwind + Material Symbols + dark overrides)
docs/             BMAD artifacts (architecture, brief, prd, ux-spec, component-inventory, stories)
.github/workflows GitHub Pages auto-deploy
.cursor/rules/    Cursor agent rules
CLAUDE.md         Claude Code agent rules
```

## How I used BMAD and Cursor together

The planning phase ran for about a day before the first implementation commit. The four BMAD personas wrote sequentially against `docs/`:

- **Analyst** ([`brief.md`](docs/brief.md), ~1.5 hours) — surfaced the persona ("the in-house OGCIO service designer is the builder, plainly") and the value proposition (a workday-task tracker, not a project-management tool). The risk table was the most useful output: "component inventory done after-the-fact rather than driving the build" became a real risk to plan against.
- **PM** ([`prd.md`](docs/prd.md), ~30 minutes) — became a forwarding stub very quickly, because the official training PRD was the source of truth and duplicating it into this repo would have invited drift. The in-scope-vs-out-of-scope pass against the PRD was where the photo-scan feature got cut and the workday-tracker framing was sharpened.
- **Architect** ([`architecture.md`](docs/architecture.md), ~2 hours) — the slowest persona to write but the highest-leverage. State shape, the four-way routing rule, the persistence contract (versioned keys, try/catch, what survives a reload) all landed here and changed almost nothing through the build. This document drove the build.
- **UX** ([`ux-spec.md`](docs/ux-spec.md), ~1 hour) — short by design, because the gov.ie design system absorbs most of what would otherwise live here. The "what we don't override" list was the spine.
- **Stories** ([`stories/`](docs/stories/), ~2 hours) — written one epic at a time, before the first commit of each epic. Acceptance criteria as plain bullets; "design decisions per story" as inline notes per the training brief.

The typical Cursor session during the build week looked like this: open the story file in one pane, ask Cursor to implement against the AC bullets in the other, run the dev server in a third. The story file functioned as a structured prompt — *"implement Story 3.2 against the acceptance criteria in this file, show me the diff before applying"* — and Cursor verified its own output against the AC checklist as a final pass. When this worked, it was fast. Story 1.4 (persistence) shipped in under 30 minutes because `architecture.md` §7 already specified the versioned keys, the try/catch wrapping, and what should and shouldn't survive a reload. The implementation was a transcription of the spec.

Where specs slowed me down was Epic 12 (dark mode). The spec said *"use gov.ie's `[data-theme="govie-dark"]` selector"* and assumed gov.ie's `dark.css` carried meaningful dark token values. It didn't — `dark.css` ships byte-identical to `light.css` as of build. Several commits in the log (`Try gray-200`, `Try emerald-400`, `Try emerald-50`, `Use !important on dark utilities to override gov.ie's gi-text-color-* classes`) show me discovering this in real time and improvising a scoped neutral-token override, then writing the decision-log entry afterward to explain why a project rule ("never override gov.ie tokens") had to bend. The spec needed updating mid-build, and that was uncomfortable but honest.

Adopting the gov.ie design system changed the rhythm in two ways. First, every UI question that would otherwise be "design and then build" became "find the gov.ie component and then compose" — the design-decision surface area shrank dramatically. Second, when gov.ie didn't have something (skeleton rows, a swipe gesture, an alert primitive, the Material Symbols font that the gov.ie `Icon` API depends on), the gap was loud and you had to decide whether to build custom (skeleton, alert) or work around (swipe → tap-target, Material Symbols → self-host the font ourselves). Each of those gaps got a decision-log row.

Things I'd do differently next time: I'd write Epic 11 and Epic 12 as numbered stories rather than narrative epics. The numbered-AC structure of Epics 02–08 was easier to drive Cursor against; the prose-shaped epics required more re-reading and produced messier commits.

## What I learned

The SDD discipline is real. With a story file open in one pane and Cursor in the other, the acceptance-criteria bullets function as a checklist that Cursor can self-verify against at the end of an implementation. *"Story 5.4 — completed stays in place — confirm against the ACs in this file"* is a much tighter prompt than *"make the polish look good."* This pattern compresses the spec-to-code distance to almost zero when the spec is well-written, and it surfaces gaps in the spec quickly when it isn't.

Day-1 scope expansions worked because the brief invited refinement and the decision-log discipline kept it from devolving into scope creep. Every addition has a row in [`docs/brief.md`](docs/brief.md) §9 explaining why. Reading the log end-to-end is a reasonable summary of what the build week actually was.

Living with the prototype for a day produced better product judgment than the specs alone could. Two of the most decisive product moves — Epic 11 (auto-hide completed, drop flags) and the undo-removal decision — both came from real use, not from specs. The flag feature looked sensible on paper and felt like clutter after a day of using it. The double-confirmation of "modal then 4-second undo toast" looked sensible on paper and felt fussy in the chair. Both are documented as supersession decisions rather than rewrites, so the original specs survive as historical record.

Cursor and Claude Code together was useful in a specific way: Cursor for IDE-attached code work, Claude Code for the longer doc passes (this audit, for example). Both tools read from the same `docs/` and from thin pointer files ([`CLAUDE.md`](CLAUDE.md), [`.cursor/rules/project.mdc`](.cursor/rules/project.mdc)) that contain no duplicated content. The handoff between tools was seamless because there was nothing to keep in sync — both were reading the same source of truth.

The gov.ie design system is genuinely productive once installed correctly. The friction at the start (Tailwind v3 vs v4, `createTheme` vs the original `presets: [preset]` doc snippet, the non-existent `tokens.css` import path) was mostly gov.ie's own published docs being out of date with their npm packages. Logging each gotcha as I hit it — in [`docs/brief.md`](docs/brief.md) §9 Day-1 entries — was useful at the time, and will be more useful for anyone else trying.
