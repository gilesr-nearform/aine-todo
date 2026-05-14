# ListLens

Personal todo app prototype built using the Government of Ireland Design System. Deliverable for an AI training programme on Spec-Driven Development with the BMAD framework.

The BMAD planning artifacts in [docs/](docs/) are the source of truth. See [CLAUDE.md](CLAUDE.md) for the AI-agent context and [docs/stories/](docs/stories/) for the build-order user stories.

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

- Vite + React 18+ + TypeScript (strict, with `noUncheckedIndexedAccess`)
- Government of Ireland Design System: `@ogcio/design-system-react`, `@ogcio/design-system-tokens`, `@ogcio/design-system-tailwind`, `@ogcio/theme-govie`
- Tailwind CSS (gov.ie preset via `createTheme()`)
- React Context + `useReducer` for state, persisted to `localStorage` under `listlens:v1:todos` (Story 1.4)

## Demoing this

The app simulates a 600–900ms initial load with a 10% chance of failure, so the loading and error states are reproducible. Two `window` flags in the browser console make each UI state deterministic — set the flag, then reload.

| Flag | Effect |
|---|---|
| `window.__instant = true` | Skip the simulated load delay. Still reads any persisted todos from `localStorage`. |
| `window.__forceError = true` | Force the initial load to fail, regardless of what is in `localStorage`. |

Tasks persist to `localStorage` under the versioned key `listlens:v1:todos`. To reset to the empty state during testing:

```js
localStorage.removeItem('listlens:v1:todos');
```

Then reload the page.

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
  components/   custom components (gov.ie components are imported directly)
  state/        reducer, context, types
  mocks/        simulated initial-load + dev triggers
  styles/       global CSS (gov.ie theme + Tailwind)
docs/           BMAD artifacts (architecture, brief, ux-spec, stories)
.cursor/rules/  Cursor agent rules
CLAUDE.md       Claude Code agent rules
```
