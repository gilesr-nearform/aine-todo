# Architecture

> **Owner:** Architect persona · **Status:** Locked + iterated through Day 1 · **Last updated:** Week 1, Day 1 (post-Epic-12)
>
> **Companion doc:** `docs/component-inventory.md` — the components themselves. This document covers stack, state, data flow, and file structure.
>
> **Day-1 amendments:** §1 stack now lists `material-symbols` and `@fontsource/lato`; §2 file layout reflects Epics 06–12 (sidebar, i18n, theme, more); §3 globals.css example reflects the actual import set; §4 state shape now covers lists + filters + smart views; §10 "what's not in" notes the deployment exception; §11 commands updated; §12 decision log forwards to `brief.md` §9.

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
| Fonts | **`@fontsource/lato`** (gov.ie body font, self-hosted) + **`material-symbols`** (Material Symbols Outlined, self-hosted) | Gov.ie's `Icon` component renders icons via `<span class="material-symbols-outlined">` font ligatures, but the design system doesn't ship the font itself. We self-host the Material Symbols Outlined woff2 alongside Lato. See `brief.md` §9. |
| Icons | **Gov.ie `Icon` component** (curated set in `@ogcio/design-system-react`) with **the full Material Symbols Outlined catalogue available at runtime** via the font fallback. We narrow casts in one place per use site (e.g. `ALL_TASKS_ICON` in `Sidebar.tsx`) so each escape outside the curated set is auditable. No Lucide. |
| State | **React Context + useReducer** | Single source of truth; explicit action types make state transitions testable and spec-able. No external state library. |
| i18n | **Custom Context + dictionary** (English + Irish/Gaeilge); language preference persisted under `listlens:v1:lang`. No `i18next` dependency — ~80 strings doesn't justify it. See Epic 10 and `brief.md` §9. |
| Theme | **Gov.ie's `data-theme` selector** (`govie-light` / `govie-dark`), with a scoped exception that overrides gov.ie's neutral/gray primitives in dark mode (gov.ie's `dark.css` ships byte-identical to `light.css` as of build). Theme preference persisted under `listlens:v1:theme`. See Epic 12 and `brief.md` §9. |
| Routing | **None** | Single-screen app per PRD; sidebar / drawer navigation is client-state only |
| Persistence | **`localStorage`** for surviving page reloads. Three versioned keys: `listlens:v2:state` (lists + todos + view-state), `listlens:v1:lang`, `listlens:v1:theme`. Graceful degradation on parse failure. See section 7. |
| Animation | **CSS transitions + `prefers-reduced-motion`** | No animation library; gov.ie tokens supply duration / easing values where defined |
| Deployment | **GitHub Pages via Actions** (`.github/workflows/deploy.yml`), auto-publishes `main` on push. Scoped exception to the Day-0 "no deployment" rule — see `brief.md` §9. |
| Testing | **Manual smoke testing** of every UI state + Playwright-style live verification via the in-IDE browser MCP. No Vitest harness in v1. |
| Linting | **ESLint** + **Prettier** |
| Package manager | **pnpm** (matches the gov.ie design system's own tooling) |

## 2. File and folder structure

Reflects the codebase as it stands after Epic 12.

```
aine-todo/
├── docs/                       # BMAD artifacts
│   ├── brief.md                # Analyst output + decision log (§9 is the canonical decision log)
│   ├── prd.md                  # PRD forwarding stub (real PRD is the training one, outside repo)
│   ├── architecture.md         # this file
│   ├── component-inventory.md
│   ├── ux-spec.md
│   └── stories/                # epic specs: 01-foundation … 12-theme-switcher
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages auto-deploy on push to main
├── src/
│   ├── components/             # custom components only (gov.ie components imported directly)
│   │   ├── AppShell/           # AppShell, Header (incl. bilingual gov.ie strip), GovieBranding, MainContent, ThemeToggle
│   │   ├── Sidebar/            # desktop Sidebar + MobileNav drawer
│   │   ├── TodoList/           # list pane: header, summary, filter controls, items
│   │   ├── TodoItem/
│   │   ├── TodoEditor/         # inline edit (description + notes)
│   │   ├── TodoInputBar/
│   │   ├── TodoReorderActions/ # up/down icon buttons per row
│   │   ├── TodoDeleteAction/   # delete icon button per row
│   │   ├── ListSummary/        # x of y completed + clear-completed + hide/show
│   │   ├── ListControls/       # search + filter affordances
│   │   ├── ConfirmModal/       # shared confirm dialog (clear-completed, delete-list)
│   │   ├── UndoToast/          # destructive-action undo with countdown
│   │   ├── EmptyState/
│   │   ├── LoadingState/
│   │   └── ErrorState/
│   ├── state/
│   │   ├── todosReducer.ts     # the reducer (all actions land here)
│   │   ├── TodosContext.tsx    # context provider + hook + persistence effect
│   │   ├── storage.ts          # localStorage read/write + v1→v2 migration
│   │   └── types.ts            # Todo, List, AppState, Action types
│   ├── i18n/
│   │   ├── I18nContext.tsx     # language Context + useT() hook + ICU-ish interp
│   │   └── translations.ts     # en + ga dictionaries
│   ├── theme/
│   │   └── ThemeContext.tsx    # light/dark theme Context + useTheme() hook
│   ├── mocks/
│   │   ├── initialLoad.ts      # simulated initial-fetch with delay + 10% failure
│   │   └── devTriggers.ts      # window.__forceError + window.__instant
│   ├── hooks/                  # useMediaQuery, useUndoTimer
│   ├── utils/                  # formatters, todoCounts, etc.
│   ├── styles/
│   │   └── globals.css         # gov.ie theme imports + Tailwind + Material Symbols + dark overrides
│   ├── App.tsx                 # composes ThemeProvider > I18nProvider > TodosProvider > AppShell
│   ├── main.tsx                # Vite entrypoint
│   └── vite-env.d.ts
├── .cursor/
│   └── rules/
│       └── project.mdc         # Cursor agent rules (mirrors CLAUDE.md)
├── CLAUDE.md                   # Claude Code agent rules
├── README.md                   # how-to-run + live URL + AI integration notes (graded deliverable)
├── index.html                  # Vite entry HTML; document <title>
├── package.json
├── tsconfig.json
├── tailwind.config.ts          # extends @ogcio/design-system-tailwind preset; darkMode selector
├── postcss.config.js
└── vite.config.ts
```

**Rationale for the layout:**
- `components/` houses *custom* components only. Gov.ie components are imported directly from `@ogcio/design-system-react` — we don't wrap them unless adding meaningful local behaviour. This keeps it obvious which components are ours vs provided.
- `state/`, `i18n/`, `theme/` are each their own folder so the cross-cutting plumbing (reducer, dictionary, theme attribute writer) is easy to find and read independently.
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

The `@ogcio/design-system-tokens` package only ships JS exports — there is no `tokens.css` to import. CSS variables come from `@ogcio/theme-govie`; component CSS comes from `@ogcio/design-system-react`. The `material-symbols` package ships the Material Symbols Outlined font CSS gov.ie's `Icon` API depends on (gov.ie doesn't ship it itself).

```css
/* src/styles/globals.css */
@import '@ogcio/theme-govie/light.css';
@import '@ogcio/theme-govie/dark.css';
@import '@ogcio/design-system-react/styles.css';
@import 'material-symbols/outlined.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Dark-mode token overrides under [data-theme='govie-dark'] — */
/* scoped exception to "never override gov.ie tokens", see brief.md §9. */
/* Applies only to neutral/gray primitives; brand + intent tokens untouched. */
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

Reflects the codebase after Epics 07, 08, and 11. The Day-0 single-list shape was migrated to a multi-list envelope under `listlens:v2:state` (see §7 and Epic 08).

```ts
type LoadStatus = 'idle' | 'loading' | 'success' | 'error';
type SmartView = 'all' | 'completed';

interface AppState {
  status: LoadStatus;                   // controls which UI state renders on mount
  lists: List[];                        // user lists, ordered
  todos: Todo[];                        // every todo across every list (todo.listId is the link)
  activeListId: ListId | null;          // null + activeSmartView select a smart view
  activeSmartView: SmartView;           // 'all' or 'completed' when activeListId === null
  filters: {
    search: string;                     // free-text search, not persisted
    showCompleted: boolean;             // persisted; defaults to false post-Epic-11
  };
  recentlyDeleted: DeletedRecord[];     // in-memory only; powers undo
  editingTodoId: TodoId | null;         // inline editor target
}

interface DeletedRecord {
  todo: Todo;
  originalIndex: number;                // restores to its prior position on undo
  expiresAt: number;                    // epoch ms; toast disappears after this
}
```

Language and theme live in their own Contexts and `localStorage` keys (`listlens:v1:lang`, `listlens:v1:theme`) — presentation rather than domain. See `src/i18n/I18nContext.tsx` and `src/theme/ThemeContext.tsx`.

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
| `REORDER_TODO` | `{ id: TodoId, direction: 'up' \| 'down' }` | Swaps the todo with its nearest **visible** same-list neighbour in `todos`. Skips both other-list rows and hidden-completed rows (when `showCompleted` is false). No-op at the visible boundary. Added in Epic 06; refined in Epic 11 — see `brief.md` §9. |
| `UPDATE_TODO` | `{ id: TodoId, description: string, notes?: string }` | Updates description and notes for a single todo. Trims both. No-op if trimmed description is empty. Added in Epic 07. |
| `START_EDIT` / `STOP_EDIT` | `{ id: TodoId }` / — | Opens / closes the inline editor for a todo. Added in Epic 07. |
| `SET_SEARCH` | `{ value: string }` | Updates `filters.search`. Not persisted. Added in Epic 07. |
| `SET_SHOW_COMPLETED` | `{ value: boolean }` | Updates `filters.showCompleted`. Persisted post-Epic-11; defaults to `false`. |
| `SET_SMART_VIEW` | `{ view: SmartView }` | Switches between the "All tasks" and "Completed" smart views. Implies `activeListId = null`. Added in Epic 11. |
| `CREATE_LIST` | `{ name: string }` | Creates a new `List` with the trimmed name and a fresh UUID, appends to `lists`, sets `activeListId` to the new list. No-op if name is empty. Added in Epic 08. |
| `RENAME_LIST` | `{ id: ListId, name: string }` | Trims and updates the list's name. No-op if name is empty. Added in Epic 08. |
| `DELETE_LIST` | `{ id: ListId }` | Removes the list and every todo belonging to it. If the deleted list was active, falls back to `activeListId: null`. Added in Epic 08. |
| `SET_ACTIVE_LIST` | `{ id: ListId \| null }` | Sets the active list. `null` selects a smart view (per `activeSmartView`). Added in Epic 08. |
| `CLEAR_COMPLETED` | `{ listId: ListId \| null }` | Removes every completed todo in the given list. `null` clears completed across all lists. Surfaced behind a `ConfirmModal`, no undo. Added in Epic 09 (rolled into Epic 08's spec). |

**Removed actions:** `TOGGLE_FLAG` and `SET_FLAGGED_ONLY` (Epic 07) were deleted in Epic 11 along with the entire flag feature surface (Todo.flagged field, FlagIcon component, amber border, flagged-only filter button, related translation keys). See `docs/stories/11-completion-flow-tightening.md` and `brief.md` §9.

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

Required for v1. Originally implemented in Story 1.4 against a single `listlens:v1:todos` array; migrated in Epic 08 to a multi-list envelope under `listlens:v2:state`. Three rules still hold:

1. **Versioned keys.** Three independent keys, each carrying its own version:
   - `listlens:v2:state` — `{ lists, todos, activeListId, activeSmartView, filters.showCompleted }`. The v1→v2 read path silently migrates any legacy `listlens:v1:todos` array onto a default "Tasks" list and deletes the v1 key. See `src/state/storage.ts`.
   - `listlens:v1:lang` — `'en' | 'ga'`.
   - `listlens:v1:theme` — `'light' | 'dark'`.
2. **Graceful degradation.** Every read and write is wrapped in `try`/`catch`. Parse failures, quota-exceeded errors, and missing entries log a console warning and fall through to the empty / default state. The user sees the empty state, never an error caused by storage.
3. **Don't persist what shouldn't survive a session.** `recentlyDeleted`, `status`, `editingTodoId`, and `filters.search` are in-memory only. Undoing a delete from yesterday, restoring a load-error state, or keeping yesterday's search query open have no sensible meaning.

### 7.1 Read path

Full implementation in `src/state/storage.ts`. Shape (post-Epic-08):

```ts
function readFromStorage(): PersistedState | null {
  try {
    const raw = localStorage.getItem('listlens:v2:state');
    if (raw) return parseAndReviveDates(raw);
    // Fallback: migrate the legacy single-list v1 array into a v2 envelope.
    const legacy = localStorage.getItem('listlens:v1:todos');
    if (legacy) {
      const migrated = migrateV1ToV2(legacy);
      localStorage.setItem('listlens:v2:state', JSON.stringify(migrated));
      localStorage.removeItem('listlens:v1:todos');
      return migrated;
    }
    return null;
  } catch (err) {
    console.warn('Failed to read state from localStorage:', err);
    return null;
  }
}
```

The simulated load delay is **preserved even when localStorage is populated**. The loading state is a graded deliverable per the PRD; bypassing it on cache hits would break the demo. The delay is a feature, not a performance limitation.

### 7.2 Write path

The provider's `useReducer` is wrapped with a `useEffect` that writes the persisted slice of state to localStorage whenever it changes. JSON.stringify handles Date objects via their default ISO serialisation; the read path revives them. Only the fields that should survive a reload are written (see Rule 3 above).

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
- Database, ORM, server-side persistence
- Client routing, deep-linking, URL state
- Service workers, offline support, PWA manifest
- Analytics, telemetry, error reporting
- Real AI / vision / OCR
- Photo-scanning (moved to v2 per brief §10)

**Originally excluded but added Day 1** (each as a scoped exception with decision-log entries in `brief.md` §9):

- **i18n** (Epic 10) — English + Irish, custom Context + dictionary, no `i18next` dep.
- **Theme switching (light + dark)** (Epic 12) — via gov.ie's `data-theme` attribute, with a scoped dark-mode override of gov.ie's neutral/gray primitives.
- **Deployment** — GitHub Pages auto-deploy of `main` via Actions. Static build artifact only; no backend introduced.

## 11. Build / dev / lint / deploy commands

```bash
pnpm install        # install deps (Node 20+)
pnpm dev            # vite dev server with HMR at localhost:5173
pnpm build          # tsc -b && vite build  →  dist/
pnpm preview        # serve the production build locally
pnpm lint           # eslint over src/
pnpm format         # prettier --write
pnpm format:check   # prettier --check (CI-style)
```

Deployment is automatic: every push to `main` triggers `.github/workflows/deploy.yml`, which runs the build with `--base=/<repo-name>/` and publishes `dist/` to GitHub Pages. The live URL is `https://gilesr-nearform.github.io/aine-todo/`.

## 12. Decision log

Architecture-side decisions live alongside product and UX decisions in **`brief.md` §9**. Maintaining a single canonical decision log avoids three out-of-sync copies. The architecture-relevant Day-1 amendments (Tailwind v3 pin, `createTheme` usage, theme-package CSS paths, storage v1→v2 migration, Material Symbols self-hosting, theme override scope, deployment exception) are all there.
