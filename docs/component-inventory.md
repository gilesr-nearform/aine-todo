# Component Inventory

> **Status:** Forwarding stub. The substantive content for each section below lives in `architecture.md` and `ux-spec.md`. This file exists so the cross-references in `stories/*.md`, `CLAUDE.md`, and `.cursor/rules/project.mdc` resolve to *something* rather than 404. Promote this to a standalone artifact later if the BMAD set is audited.
>
> **Owner:** Architect / UX persona (shared). **Last updated:** Week 1, Day 1.

---

## 1. Purpose

A single index of every component in the build, what it's for, and where it sits in the hierarchy. The detailed shape of each component (props, behaviour, state ownership) is documented in `architecture.md` and `ux-spec.md`; this file is the index that points at them.

## 2. Source of truth — forwarding table


| Topic                                                            | Canonical location                      |
| ---------------------------------------------------------------- | --------------------------------------- |
| File and folder layout (where each component lives on disk)      | `[architecture.md](architecture.md)` §2 |
| Custom vs gov.ie component decisions per component               | `[ux-spec.md](ux-spec.md)` §3           |
| State management plumbing (`TodosProvider`, `useTodos`)          | `[architecture.md](architecture.md)` §4 |
| Data flow per interaction (create / toggle / delete / undo)      | `[architecture.md](architecture.md)` §5 |
| Mock data loader and dev triggers                                | `[architecture.md](architecture.md)` §6 |
| Persistence (read / write to `localStorage`)                     | `[architecture.md](architecture.md)` §7 |
| Accessibility baseline per component                             | `[architecture.md](architecture.md)` §8 |
| Visual language tokens and component mapping table               | `[ux-spec.md](ux-spec.md)` §2, §3       |
| Voice and tone applied per surface (empty / error / undo / etc.) | `[ux-spec.md](ux-spec.md)` §6           |
| Motion (durations, easing, what animates)                        | `[ux-spec.md](ux-spec.md)` §7           |
| Responsive behaviour (breakpoints, layout shifts)                | `[ux-spec.md](ux-spec.md)` §8           |


---

## 3. Component overview

Every component in the build, grouped by area. For each, see the canonical doc cited in §2.

### 3.1 Custom components

The full list lives in `[architecture.md](architecture.md)` §2 and the gov.ie-vs-custom decision table in `[ux-spec.md](ux-spec.md)` §3. Briefly:

- `AppShell`, `Header` — app-wide layout chrome
- `MainContent` — owns the four-way state routing (see §3.5)
- `TodoList`, `TodoItem`, `TodoText`, `TodoTimestamp`, `TodoDeleteAction` — populated list
- `TodoInputBar` (composes gov.ie `Input` + `Button`) — create affordance
- `EmptyState`, `LoadingState`, `ErrorState` — non-populated UI states
- `UndoToast`, `UndoToastContainer` — destructive-action undo flow

### 3.2 State plumbing — referenced by Story 1.2

Substantive spec lives in `[architecture.md](architecture.md)` §4 (state shape, actions, reducer rationale) and §5.1 (initial-load flow).

- `TodosProvider` mounts at the root and owns the initial-load effect. Children consume state via `useTodos()`.
- `useTodos()` throws clearly when called outside a provider.
- See the `Action` union in `[architecture.md](architecture.md)` §4.2.

### 3.3 App shell — referenced by Story 1.3

Substantive spec: `[architecture.md](architecture.md)` §2 (file layout) and §8 (accessibility, including focus order).

Layout rule: `AppShell` renders a full-viewport column — `Header` at the top, `MainContent` in the middle (the only scrollable region), `TodoInputBar` pinned at the bottom with iOS safe-area padding via `env(safe-area-inset-bottom)`. The shell renders identically regardless of which UI state the routing chooses (see §3.5), so transitions between states cause no layout shift.

### 3.4 Input bar and list — referenced by Story 1.3

Substantive spec: `[ux-spec.md](ux-spec.md)` §3 (component mapping); `[architecture.md](architecture.md)` §5.2 (create flow), §5.3 (toggle), §5.4 (delete + undo).

- `TodoInputBar` composes gov.ie `Input` + `Button`. In Story 1.3 it is rendered inert; wiring happens in Epic 2.
- `TodoList` is a custom layout container; it reads nothing in Story 1.3 (renders nothing while `state.todos.length === 0`). Items are appended at the bottom on create (see `[architecture.md](architecture.md)` §5.2).

### 3.5 Four-way state routing — referenced by Story 1.3

Substantive spec: `[architecture.md](architecture.md)` §4.1 (`LoadStatus`) and §5.1 (which status maps to which UI).

`MainContent` selects exactly one of four state components based on `state.status` and `state.todos.length`:


| `state.status` | `state.todos.length` | Renders                                                                                                                    |
| -------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `'loading'`    | —                    | `<LoadingState>`                                                                                                           |
| `'error'`      | —                    | `<ErrorState>`                                                                                                             |
| `'success'`    | `0`                  | `<EmptyState>`                                                                                                             |
| `'success'`    | `> 0`                | `<TodoList>` (populated)                                                                                                   |
| `'idle'`       | —                    | Nothing visible — provider dispatches `INIT_LOAD_START` immediately on mount, so `'idle'` is never observed in normal flow |


The shell (`Header` + `TodoInputBar`) renders around the active state component, so transitions do not cause layout shift.

---

## 4. Accessibility per component — referenced by Story 5.x

Substantive spec lives in `[architecture.md](architecture.md)` §8. Summary of the per-component obligations:

- Every interactive element is a real `<button>` or `<input>`, never a clickable `<div>` — applies to every custom component listed in §3.
- `Checkbox` for completion uses gov.ie `Checkbox` semantics (real checkbox input under the hood).
- `UndoToast` announces itself via `role="status"` / `aria-live="polite"`.
- `ErrorState` announces via `role="alert"`.
- Keyboard navigation: tab order matches visual order; focused `TodoItem` + Delete/Backspace deletes (no drag-and-drop required, per WCAG 2.5.7).
- Visible focus indicators on every interactive element, drawn from gov.ie tokens.

---

## 5. Interaction states matrix — referenced by Story 5.x

> **Known gap:** the per-component interaction-states matrix (hover / focus / active / disabled coverage for each interactive component) has not been written yet. The success-criteria checklist in `[brief.md](brief.md)` §4 captures the intent ("all interaction states are present on every interactive component"). Story 5.x is the natural place to author the matrix when polish work begins; until then, treat the brief's checklist as the binding obligation.

Interactive components that the matrix will cover, when written:

- `TodoInputBar` — `Input` and `Button` (gov.ie defaults supply most states; verify against tokens)
- `TodoItem` — row hover/focus, completion checkbox, delete action
- `UndoToast` — undo button
- `ErrorState` — retry button
- `EmptyState` — no interactive elements, included here only for completeness