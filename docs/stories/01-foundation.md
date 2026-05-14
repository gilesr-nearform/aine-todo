# Epic 01 — Foundation

> Scaffolding, state plumbing, and the app shell. The skeleton of the application before any behaviour is wired in. By the end of this epic, the app should launch, route between the four UI states, and have an inert input bar and list area visible.

---

## 1.1 — Scaffold the project

As a developer, I need a working Vite + React + TypeScript project with Tailwind and the Government of Ireland Design System configured, so subsequent stories have a productive build environment.

**AC:**
- Project initialised with Vite + React + TypeScript template
- TypeScript strict mode enabled in `tsconfig.json` (`"strict": true`, `"noUncheckedIndexedAccess": true`)
- Tailwind CSS installed and configured against the `src/` content paths, **extending the `@ogcio/design-system-tailwind` preset**
- Gov.ie design system packages installed: `@ogcio/design-system-react`, `@ogcio/design-system-tokens`, `@ogcio/design-system-tailwind`, `@ogcio/theme-govie` (per `architecture.md` §3)
- Gov.ie theme and tokens imported in `src/styles/globals.css` (per `architecture.md` §3)
- **Smoke test:** import a `Button` from `@ogcio/design-system-react`, render it on the page, confirm it appears with gov.ie styling. Remove the smoke test once verified.
- ESLint + Prettier configured; `pnpm lint` and `pnpm format` work
- `pnpm dev` launches the dev server with HMR; `pnpm build` succeeds; `pnpm preview` serves the build
- `.cursor/rules/project.mdc` and `CLAUDE.md` are at the repo root (already exist — verify present and committed)
- `README.md` exists with a placeholder section for setup instructions (to be filled across the week)
- `docs/` folder copied into the repo and committed (all BMAD artifacts present)

**Refs:** `architecture.md` §1, §2

**Design decisions:**
- Vite chosen over Next.js because there is no SSR, no routing, and no server-action requirement. See `architecture.md` decision log.
- Gov.ie design system installed as the visual foundation from day 1, not retrofitted later. Smoke-testing a `Button` confirms the integration works before any UI story depends on it.

**Done when:** A blank Vite/React app runs locally with no console errors, Tailwind classes apply, and all linting passes.

---

## 1.2 — State management plumbing

As a developer, I need the reducer, types, and Context provider in place so subsequent stories can dispatch actions without rebuilding state infrastructure.

**AC:**
- `src/state/types.ts` defines `Todo`, `LoadStatus`, `DeletedRecord`, `AppState`, and the discriminated union of all action types per `architecture.md` §3
- `src/state/todosReducer.ts` implements the reducer; every action is handled (even if the matching UI doesn't exist yet — early stub returns are fine)
- `src/state/TodosContext.tsx` exports a `TodosProvider` component and a `useTodos()` hook
- `useTodos()` returns `{ state, dispatch }` and throws clearly if called outside a provider
- Initial state matches the spec: `{ status: 'idle', todos: [], recentlyDeleted: [] }`
- `src/mocks/initialLoad.ts` implements the simulated loader from `architecture.md` §5.1 (with the `window.__instant` and `window.__forceError` flags wired in)
- The provider runs the initial-load effect on mount: dispatches `INIT_LOAD_START`, awaits the loader, dispatches success or failure
- No UI implications yet — this story is invisible from the user's perspective

**Refs:** `architecture.md` §3, §5; `component-inventory.md` §3.2

**Design decisions:**
- Reducer pattern chosen over plain useState because the undo behaviour and the four-state initial-load flow require coordinated state changes that a single reducer makes auditable.
- The provider — not `App.tsx` — owns the initial-load effect, so that mounting the provider in tests (future) automatically exercises the load flow.

**Done when:** A trivial test consumer (a `<DebugPanel>` rendered in `App.tsx`) can read `state.status` and observe it transition from `'idle'` → `'loading'` → `'success'` or `'error'` on mount. Remove the debug panel before this story is marked done.

---

## 1.3 — App shell and state-router

As a user, when I open the app I see a stable layout regardless of which UI state I'm in, so the screen doesn't shift around as data loads.

**AC:**
- `<AppShell>` renders a full-viewport column layout: header at top, main content fills middle, input bar pinned at bottom
- iOS safe-area insets honoured via `env(safe-area-inset-*)` in the bottom padding
- `<Header>` renders the app name (placeholder text is acceptable; final copy in story 5.x)
- `<MainContent>` implements the four-way state routing logic from `component-inventory.md` §3.5
- `<TodoInputBar>` is rendered but inert (input is not yet wired; submit button is disabled regardless of input)
- `<TodoList>` is rendered but reads no data yet (renders nothing if `state.todos.length === 0`)
- Layout does not shift when transitioning between loading / error / empty / populated states (verify by manually triggering each)
- Each of the four states renders *something* visible — for now, plain text placeholders are fine ("Loading…", "Error", "Empty", "Populated"). Polish happens in Epic 4.
- The page is scroll-locked on mobile (no rubber-banding); the list area is the only scrollable region

**Refs:** `component-inventory.md` §3.3, §3.4, §3.5; `architecture.md` §4

**Design decisions:**
- The shell is laid out *before* the state-routing renders anything, so the four UI states never cause layout shift. This is the foundation of "considered and polished" loading/error states.
- The bottom input bar is rendered even in loading/error states (with the input disabled where appropriate, addressed in later stories). The create affordance is always discoverable, hinting at what the app does.
- A single scrollable region (the list) avoids the iOS "double scroll" trap.

**Done when:** Forcing each of the four `state.status` / `todos.length` combinations renders the corresponding placeholder, layout is rock-stable through transitions, and there are no console warnings (especially about keys or hydration).

---

## 1.4 — Persist tasks across page reloads

As a user opening the app each morning, I want yesterday's tasks to still be there, so I don't lose my brain-dump between sessions.

**AC:**
- Tasks persist via `localStorage` under the versioned key `listlens:v1:todos`
- On app mount, the initial loader reads from `localStorage`:
  - If parseable tasks exist → returns them (still after the simulated 600–900ms delay, which is preserved for loading-state demonstration per PRD)
  - If empty or no entry → returns empty array (renders empty state)
  - If parse fails or entry is corrupted → logs a console warning and returns empty array (graceful degradation; user sees empty state, not an error)
- After every state change that modifies `state.todos` (`CREATE_TODO`, `TOGGLE_COMPLETE`, `DELETE_TODO`, `UNDO_DELETE`), the new todos array is serialised to `localStorage`
- The `recentlyDeleted` state is NOT persisted — the undo window is session-only
- Every `localStorage` read and write is wrapped in `try`/`catch` so quota-exceeded or corruption errors don't crash the app
- `Date` objects are correctly serialised (via `JSON.stringify`) and revived on read (parsed back into `Date` instances)
- The `window.__instant` dev trigger still works (skips the loading delay but still hydrates from `localStorage`)
- The `window.__forceError` dev trigger still works (rejects the load regardless of `localStorage` contents)
- The README documents the storage key and how to manually clear it for testing: `localStorage.removeItem('listlens:v1:todos')`

**Refs:** `architecture.md` §7 (full read/write spec); `prd.md` §6.2 (performance — note the simulated delay is preserved)

**Design decisions:**
- **Versioned key** (`listlens:v1:todos`) so future schema changes don't require automatic migration logic — a `v2` key gets created cleanly, `v1` is ignored.
- **`recentlyDeleted` is not persisted** because the 4-second undo window doesn't span sessions meaningfully; persisting it would cause confusing "Undo: task from yesterday" toasts on reload.
- **Simulated load delay is preserved on cache hits** because the loading state is a graded PRD deliverable — skipping it when storage is populated would break the demo on the most common path (returning user).
- **Graceful degradation on parse failure:** log a warning, return empty array. The user sees the empty state, not an error. Better to lose data once than to bring up an error every time on a corrupted entry.

**Done when:** Creating five tasks, closing the tab, reopening at the URL — all five tasks are still there with their completed/active states intact. Clearing `localStorage` in DevTools + reload returns to empty state. Toggling `window.__forceError` still shows the error state regardless of stored data.
