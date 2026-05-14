# UX To-do list

Personal todo app prototype built using the Government of Ireland Design System. Deliverable for an AI training programme on Spec-Driven Development with the BMAD framework.

> The working name during early specs was *ListLens*. It was retired Day 1 in favour of *UX To-do list* once the prototype found its voice — see `docs/brief.md` §9. The internal `listlens:` `localStorage` prefix is preserved as a stable storage identifier and intentionally not renamed.

The BMAD planning artifacts in [docs/](docs/) are the source of truth. See [CLAUDE.md](CLAUDE.md) for the AI-agent context and [docs/stories/](docs/stories/) for the build-order user stories.

## View it live

The `main` branch auto-deploys to GitHub Pages on every push: **https://gilesr-nearform.github.io/aine-todo/**

This is a deliberate exception to the Day-0 "no deployment" decision in `docs/brief.md` §9, scoped to making the prototype reviewable via a single link rather than a clone-and-run handoff. The deploy workflow lives at `.github/workflows/deploy.yml`.

## Setup

> Placeholder. To be expanded across the week as stories land.

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
- Fonts: `@fontsource/lato` (gov.ie body font) + `material-symbols` (self-hosted Material Symbols Outlined — gov.ie's `Icon` API renders these via font ligatures but the design system doesn't ship the font itself)
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
    AppShell/     header (incl. bilingual gov.ie strip), main layout, theme toggle
    Sidebar/      desktop sidebar + mobile drawer (MobileNav)
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
  hooks/          custom hooks (useMediaQuery, useUndoTimer)
  mocks/          simulated initial-load + dev triggers
  utils/          formatters, todo-counts, etc.
  styles/         global CSS (gov.ie theme + Tailwind + Material Symbols + dark overrides)
docs/             BMAD artifacts (architecture, brief, prd, ux-spec, component-inventory, stories)
.github/workflows GitHub Pages auto-deploy
.cursor/rules/    Cursor agent rules
CLAUDE.md         Claude Code agent rules
```
