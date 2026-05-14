# Architecture

> **Owner:** Architect persona · **Status:** Locked for week 1 · **Last updated:** Week 1, Day 0
>
> **Companion doc:** `docs/component-inventory.md` — the components themselves. This document covers stack, state, data flow, and file structure.

---

## 1. Stack

| Concern | Choice | Why |
|---|---|---|
| Build tool | **Vite** | Leaner than Next.js for a frontend-only SPA with mock data. The gov.ie design system has a working Vite example (`pnpm examples:vite` in their repo) so integration is well-trodden. |
| UI library | **React 18+** | Required by `@ogcio/design-system-react` |
| Language | **TypeScript** (strict mode) | PRD requires production-feel polish; strict types catch the bugs that "vibe coding" misses |
| Styling | **Tailwind CSS** + **`@ogcio/design-system-tailwind`** + **`@ogcio/theme-govie`** | Tailwind preset bound to gov.ie tokens; theme package applies the govie skin |
| Component library | **`@ogcio/design-system-react`** | Pre-built, accessible components from the gov.ie design system. Custom components only where the library has gaps (swipe-to-delete, undo toast). |
| Tokens | **`@ogcio/design-system-tokens`** | Source of truth for colours, spacing, type, etc. Consumed via the Tailwind preset; no token values are duplicated in our code. |
| Icons | Whatever the gov.ie design system uses internally; fall back to **Lucide React** for icons it doesn't include (`Trash2`, `Camera`, etc.) | Stay close to the design system; bridge only where needed |
| State | **React Context + useReducer** | Single source of truth; explicit action types make state transitions testable and spec-able. No external state library. |
| Routing | **None** | Single-screen app per PRD |
| Persistence | **`localStorage`** for surviving page reloads. Versioned key (`listlens:v1:todos`), graceful degradation on parse failure. See section 7. |
| Animation | **CSS transitions + `prefers-reduced-motion`** | No animation library; gov.ie tokens supply duration / easing values where defined |
| Testing | **Manual smoke testing** of every UI state. Optional: one Vitest smoke test if time allows. Not a required deliverable. |
| Linting | **ESLint** (Vite default + gov.ie's lint config if available) + **Prettier** |
| Package manager | **pnpm** preferred (matches the gov.ie design system's own tooling) |

## 2. File and folder structure

```
listlens/
├── docs/                       # BMAD artifacts (this folder)
│   ├── brief.md
│   ├── prd.md
│   ├── architecture.md         # this file
│   ├── component-inventory.md
│   ├── ux-spec.md
│   ├── stories/                # individual UI-focused stories
│   └── decisions/              # ADRs for non-trivial choices
├── public/                     # static assets
├── src/
│   ├── components/             # custom components only (i.e. those NOT in @ogcio/design-system-react)
│   │   ├── AppShell/
│   │   ├── TodoList/
│   │   ├── TodoItem/           # custom because gov.ie probably doesn't have a "todo row" component
│   │   ├── TodoInputBar/
│   │   ├── UndoToast/          # custom — gov.ie design system unlikely to have an undo pattern
│   │   ├── LoadingState/
│   │   ├── ErrorState/
│   │   └── EmptyState/
│   ├── state/
│   │   ├── todosReducer.ts     # the reducer
│   │   ├── TodosContext.tsx    # context provider + hook
│   │   └── types.ts            # Todo, AppState, Action types
│   ├── mocks/
│   │   ├── initialLoad.ts      # simulated initial-fetch with delay + 10% failure
│   │   └── devTriggers.ts      # force-error and instant-load flags, documented in README
│   ├── hooks/                  # custom hooks (e.g. useUndoTimer)
│   ├── utils/                  # formatters, id generation, etc.
│   ├── styles/                 # global CSS (Tailwind base + gov.ie theme imports)
│   │   └── globals.css
│   ├── App.tsx                 # composes the AppShell, wires the provider, applies gov.ie theme
│   ├── main.tsx                # Vite entrypoint
│   └── vite-env.d.ts
├── .cursor/
│   └── rules/
│       └── project.mdc         # Cursor agent rules
├── CLAUDE.md                   # Claude Code agent rules
├── README.md                   # how-to-run + AI integration notes (graded deliverable)
├── package.json
├── tsconfig.json
├── tailwind.config.ts          # extends @ogcio/design-system-tailwind preset
├── postcss.config.js
└── vite.config.ts
```

**Rationale for the layout:**
- `components/` houses *custom* components only. Gov.ie components are imported directly from `@ogcio/design-system-react` — we don't wrap them unless adding meaningful local behaviour. This keeps it obvious which components are ours vs. provided.
- `state/` is its own folder so the reducer logic is easy to find and read independently.
- `mocks/` is isolated from the rest of the code so it's obvious where the "fakeness" lives.

## 3. Installing the gov.ie design system

> **Updated Day 1** to match the packages as actually shipped on npm. The decision log in `brief.md` §9 captures the three deviations from the original draft (`createTheme` vs default preset, theme-package CSS path vs non-existent tokens CSS, Tailwind pinned to v3).

### 3.1 Install

```bash
pnpm add @ogcio/design-system-react @ogcio/design-system-tokens @ogcio/design-system-tailwind @ogcio/theme-govie
pnpm add -D tailwindcss@^3.4 postcss autoprefixer
```

Tailwind is pinned to `^3.4`. The gov.ie preset declares `tailwindcss >=3.4.0` as its peer dep and is typed against `tailwindcss/types/config.js` — a Tailwind 3 module. Tailwind 4's CSS-first config model would not consume the gov.ie preset as designed.

### 3.2 Tailwind config

`@ogcio/design-system-tailwind` exports `{ createTheme }`, **not** a default preset. Wire it via the `theme` field:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { createTheme } from '@ogcio/design-system-tailwind';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: createTheme(),
} satisfies Config;
```

To extend or override, pass options to `createTheme({ overrides: { extend: { ... } } })`. Don't override gov.ie token values; only extend with custom utilities the design system genuinely lacks.

### 3.3 Global CSS

The `@ogcio/design-system-tokens` package only ships JS exports — there is no `tokens.css` to import. CSS variables come from `@ogcio/theme-govie`; component CSS comes from `@ogcio/design-system-react`. This matches the gov.ie React README and the official Vite reference example.

```css
/* src/styles/globals.css */
@import '@ogcio/theme-govie/theme.css';
@import '@ogcio/design-system-react/styles.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Import this file once from `src/main.tsx`.

### 3.4 PostCSS config

Standard Tailwind 3 setup:

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 3.5 Day-1 verification step

Before any UI stories, run a smoke test that imports a `Button` from `@ogcio/design-system-react`, renders it, and confirms it appears with gov.ie styling (Lato font, gov.ie green primary, design-system focus ring on tab). If that fails, the rest of the build can't proceed — flag immediately.

## 4. State management

Single source of truth: a `TodosContext` that wraps the app and exposes the current state plus a `dispatch` function.

### 4.1 State shape

```ts
type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

interface AppState {
  status: LoadStatus;            // controls which UI state renders on mount
  todos: Todo[];                 // the current visible list
  recentlyDeleted: DeletedRecord[]; // powers undo
}

interface DeletedRecord {
  todo: Todo;
  originalIndex: number;         // restores to its prior position on undo
  expiresAt: number;             // epoch ms; toast disappears after this
}
```

### 4.2 Actions

The reducer handles exactly these actions. Adding a new one is a decision-log entry.

| Action | Payload | Effect |
|---|---|---|
| `INIT_LOAD_START` | — | Sets `status` to `loading` |
| `INIT_LOAD_SUCCESS` | `Todo[]` | Sets `status` to `success`, replaces `todos` |
| `INIT_LOAD_FAILURE` | — | Sets `status` to `error` |
| `INIT_LOAD_RETRY` | — | Equivalent to `INIT_LOAD_START`; triggers the loader again |
| `CREATE_TODO` | `{ description: string }` | Validates, generates id + timestamp, **appends** to `todos` |
| `TOGGLE_COMPLETE` | `{ id: TodoId }` | Flips `completed` on the matching todo |
| `DELETE_TODO` | `{ id: TodoId }` | Removes the todo from `todos`, pushes a `DeletedRecord` onto `recentlyDeleted` |
| `UNDO_DELETE` | `{ id: TodoId }` | Restores the todo from `recentlyDeleted` to its `originalIndex` in `todos` |
| `EXPIRE_DELETED` | `{ id: TodoId }` | Removes a `DeletedRecord` from `recentlyDeleted` (after the toast's undo window closes) |
| `REORDER_TODO` | `{ id: TodoId, direction: 'up' \| 'down' }` | Swaps the todo with its neighbour in `todos`. No-op if already at the boundary. Added in Epic 06 — see `brief.md` §9. |

### 4.3 Why a reducer (vs. plain useState)

Three reasons, in order of importance:

1. **Specs map cleanly to actions.** A story's acceptance criteria translate directly to "given state X, dispatching action Y produces state Z." That's the SDD value prop in action.
2. **State transitions are auditable.** Every change to the todos goes through one function; you can read it top-to-bottom and know everything that can happen.
3. **Undo is non-trivial.** Restoring a deleted item to its original position alongside other state changes is the kind of thing useState-with-callbacks makes messy. A reducer keeps it clean.

### 4.4 Why Context (vs. prop drilling or a state library)

Prop drilling through 4–5 levels of components would be tedious and visually noisy. Context handles it. We do not need Redux / Zustand / Jotai — they would add dependency and indirection without solving a problem we have.

## 5. Data flow

### 5.1 Initial load
1. App mounts; `App.tsx` triggers `INIT_LOAD_START` via an effect
2. The mock loader (`mocks/initialLoad.ts`) runs:
   - Waits 600–900ms (randomised within range)
   - 10% chance: rejects, triggering `INIT_LOAD_FAILURE`
   - 90% chance: resolves with an empty array (per PRD: "should be able to perform all actions immediately upon opening" — no fake-seeded todos)
3. The UI renders `LoadingState`, `EmptyState`, or `ErrorState` based on `status`

### 5.2 Create
1. User input dispatches `CREATE_TODO` on Enter / submit
2. Reducer validates, generates id + createdAt, appends to `todos`
3. UI re-renders; `TodoItem` for the new todo mounts at the bottom of `TodoList`

### 5.3 Complete / un-complete
1. User taps `Checkbox` (gov.ie component), dispatches `TOGGLE_COMPLETE`
2. Reducer flips `completed`
3. UI re-renders the item with the completion visual treatment

### 5.4 Delete + undo
1. User triggers delete (swipe-and-tap on mobile, hover-and-click on desktop, focus-and-Delete-key on keyboard)
2. `DELETE_TODO` dispatched; item removed, `DeletedRecord` pushed with 4000ms expiry
3. `UndoToastContainer` reads `recentlyDeleted`, renders an `UndoToast` for each entry
4. After expiry, `EXPIRE_DELETED` removes the record; toast unmounts
5. If user clicks Undo before expiry, `UNDO_DELETE` restores to original index

## 6. Mock data system

All mocks live in `src/mocks/`. The README documents how to:
- Force the initial-load error state on demand (a `window.__forceError` flag the loader checks)
- Skip the loading delay (a `window.__instant` flag for impatient demos)

These dev triggers are documented in the README's "Demoing this" section so the assessor can reproduce any UI state deterministically.

### 6.1 Initial-load loader

```ts
// pseudo-spec, full impl in src/mocks/initialLoad.ts
function loadInitialTodos(): Promise<Todo[]> {
  if (window.__instant) return Promise.resolve([]);
  return new Promise((resolve, reject) => {
    const delay = 600 + Math.random() * 300;
    setTimeout(() => {
      const shouldFail = window.__forceError || Math.random() < 0.1;
      shouldFail ? reject(new Error('Simulated load failure')) : resolve([]);
    }, delay);
  });
}
```

## 7. Persistence via `localStorage`

Required for v1. Implemented in Story 1.4. Three rules:

1. **Versioned key.** Store under `listlens:v1:todos` so a future schema change doesn't break things. Future versions get new keys; nothing migrates implicitly.
2. **Graceful degradation.** Wrap every read and write in `try`/`catch`. Parse failures, quota-exceeded errors, and missing entries all log a console warning and fall through to "empty array." The user sees the empty state, never an error caused by storage.
3. **Don't persist what shouldn't survive a session.** `recentlyDeleted` is in-memory only — there's no sensible interpretation of "undo a task you deleted yesterday." Same for `status` (which is reset on every mount anyway).

### 7.1 Read path

```ts
// pseudo-spec, full impl in src/mocks/initialLoad.ts
function loadInitialTodos(): Promise<Todo[]> {
  if (window.__instant) return Promise.resolve(readFromStorage());
  return new Promise((resolve, reject) => {
    const delay = 600 + Math.random() * 300;
    setTimeout(() => {
      const shouldFail = window.__forceError || Math.random() < 0.1;
      shouldFail ? reject(new Error('Simulated load failure')) : resolve(readFromStorage());
    }, delay);
  });
}

function readFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem('listlens:v1:todos');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Revive Date objects from ISO strings
    return parsed.map(t => ({ ...t, createdAt: new Date(t.createdAt) }));
  } catch (err) {
    console.warn('Failed to read todos from localStorage:', err);
    return [];
  }
}
```

The simulated load delay is **preserved even when localStorage is populated**. The loading state is a graded deliverable per the PRD; bypassing it on cache hits would break the demo. The delay is a feature, not a performance limitation.

### 7.2 Write path

The provider's `useReducer` is wrapped with a `useEffect` that writes `state.todos` to localStorage whenever it changes. JSON.stringify handles Date objects via their default ISO serialisation; the read path revives them.

```ts
useEffect(() => {
  try {
    localStorage.setItem('listlens:v1:todos', JSON.stringify(state.todos));
  } catch (err) {
    console.warn('Failed to write todos to localStorage:', err);
  }
}, [state.todos]);
```

## 8. Accessibility baseline

Using `@ogcio/design-system-react` gives us a strong starting position because the design system is built to public-sector accessibility standards. We must additionally ensure:

- Every interactive element is a real `<button>` or `<input>`, not a clickable `<div>` (gov.ie handles this for its components; mirror for custom ones)
- Visible focus indicators on every interactive element (gov.ie tokens supply the focus-ring values)
- Form input has an associated `<label>` (gov.ie `Input` provides this; custom code must too)
- Completion toggle is a real checkbox semantically — use gov.ie `Checkbox` if available
- The undo toast announces itself via `role="status"` or `aria-live="polite"`
- The error state is announced via `role="alert"`
- Keyboard navigation: tab order matches visual order; focused row + Delete/Backspace deletes
- No drag-and-drop required for any action (per WCAG 2.5.7)

## 9. Performance constraints

Per PRD: "UI updates should be reflected instantly when a user performs an action."

Concrete:
- No artificial debouncing on user input
- No artificial loading states except the deliberately simulated ones (initial load)
- All state changes render synchronously in React's commit phase
- Animations limited to CSS transitions, kept under 200ms for hover/focus and under 400ms for entry/exit

## 10. What's NOT in this architecture

To match the brief's scope discipline, the architecture deliberately excludes:

- Backend / API client code (no `src/api/`)
- Authentication, session, user model
- Database, ORM, persistence layer
- Routing, navigation, deep-linking
- Service workers, offline support, PWA manifest
- Analytics, telemetry, error reporting
- i18n / localisation
- Theme switching (light/dark) — gov.ie theme light only for v1
- Real AI / vision / OCR
- Photo-scanning (moved to v2 per brief §10)

## 11. Build / dev / lint commands

To be confirmed once scaffolded on day 1.

```bash
pnpm install
pnpm dev      # vite dev server with HMR
pnpm build    # production build (we won't deploy, but the build must succeed)
pnpm preview  # preview the production build locally
pnpm lint
pnpm format   # prettier --write
```

## 12. Decision log additions (architecture-specific)

| Date | Decision | Rationale |
|---|---|---|
| Day 0 | Vite over Next.js | No SSR / routing / server-action needs; gov.ie design system has a Vite example, so integration is proven |
| Day 0 | Adopt gov.ie design system (`@ogcio/*` packages) over shadcn/ui | Aligns with the OGCIO context; demonstrates design-system literacy; removes a class of from-scratch token decisions; accessibility built in |
| Day 0 | Custom components only for gaps in the design system (swipe-to-delete, undo toast) | Honest re-use of the design system; custom work only where the system has no equivalent |
| Day 0 | React Context + useReducer over a state library | Single state slice; no need for Redux / Zustand; Context handles cross-component access without a dependency |
| Day 0 | Mock data lives in dedicated `src/mocks/` directory | Honest visual boundary between real code and simulated behaviour |
| Day 0 | Dev triggers (`window.__forceError`, `window.__instant`) documented in the README | Lets the assessor reproduce any UI state deterministically |
| Day 0 | No animation library for v1 | CSS transitions are sufficient for the interactions in scope; gov.ie tokens supply duration/easing values where defined |
| Day 0 | `localStorage` persistence required (Story 1.4), not optional polish | Brain-dump-once-a-day usage means losing the tab loses your work; persistence is core to the use case |
| Day 0 | Versioned localStorage key (`listlens:v1:todos`); no implicit migration | Forces explicit thought when schema changes; no surprise behaviour |
