# Component Inventory

> **Status:** Forwarding stub. The substantive content for each section below lives in `architecture.md` and `ux-spec.md`. This file exists so the cross-references in `stories/*.md`, `CLAUDE.md`, and `.cursor/rules/project.mdc` resolve to *something* rather than 404. Promote this to a standalone artifact later if the BMAD set is audited.
>
> **Owner:** Architect / UX persona (shared). **Last updated:** Week 1, Day 1 (post-Epic-12).

---

## 1. Purpose

A single index of every component in the build, what it's for, and where it sits in the hierarchy. The detailed shape of each component (props, behaviour, state ownership) is documented in `architecture.md` and `ux-spec.md`; this file is the index that points at them.

## 2. Source of truth — forwarding table


| Topic                                                            | Canonical location                      |
| ---------------------------------------------------------------- | --------------------------------------- |
| File and folder layout (where each component lives on disk)      | `[architecture.md](architecture.md)` §2 |
| Custom vs gov.ie component decisions per component               | `[ux-spec.md](ux-spec.md)` §3           |
| State management plumbing (`TodosProvider`, `useTodos`)          | `[architecture.md](architecture.md)` §4 |
| Data flow per interaction (create / toggle / delete)             | `[architecture.md](architecture.md)` §5 |
| Mock data loader and dev triggers                                | `[architecture.md](architecture.md)` §6 |
| Persistence (read / write to `localStorage`)                     | `[architecture.md](architecture.md)` §7 |
| Accessibility baseline per component                             | `[architecture.md](architecture.md)` §8 |
| Visual language tokens and component mapping table               | `[ux-spec.md](ux-spec.md)` §2, §3       |
| Voice and tone applied per surface (empty / error / confirm / etc.) | `[ux-spec.md](ux-spec.md)` §6        |
| Motion (durations, easing, what animates)                        | `[ux-spec.md](ux-spec.md)` §7           |
| Responsive behaviour (breakpoints, layout shifts)                | `[ux-spec.md](ux-spec.md)` §8           |


---

## 3. Component overview

Every component in the build, grouped by area. For each, see the canonical doc cited in §2.

### 3.1 Custom components

The full list lives in `[architecture.md](architecture.md)` §2 and the gov.ie-vs-custom decision table in `[ux-spec.md](ux-spec.md)` §3. As of Epic 12:

**App-wide chrome:**
- `AppShell` — full-viewport column: gov.ie identity strip + green service bar + main content + pinned input bar. Custom layout; gov.ie components live inside.
- `GovieBranding` — top identity strip carrying the Gaeilge ↔ English language toggle. The toggle is a custom `<button>` styled with gov.ie focus tokens, not gov.ie's `HeaderToolItemButton` — the strip is custom-composed and the tool-item pattern is meant for gov.ie's white-on-dark utility menu, which we don't use. (Epic 10)
- `Header` — gov.ie `HeaderNext` (green default variant) carrying the harp (`LogoWhite`), the app title (`HeaderTitle`), and on `< md` a burger menu (`HeaderPrimaryMenu` + `HeaderMenuItemButton`) that opens the sidebar in a gov.ie `DrawerWrapper`. The drawer is composed inline here — there is no separate `MobileNav` component (see `[brief.md](brief.md)` §9, Day-1 theme-toggle-relocation entry).
- `MainContent` — owns the four-way state routing (see §3.5).
- `ThemeToggle` — exports `useThemeToggle` hook + `ThemeIcon` (sun / moon, inline SVGs). Consumed by `Sidebar`, which renders the toggle pinned to the sidebar footer. **Not** in the header — the relocation is logged in `[brief.md](brief.md)` §9. (Epic 12)

**Sidebar / drawer (Epic 08):**
- `Sidebar` — smart views ("All tasks", "Completed"), user lists, count badges, add-list form, theme toggle pinned at the bottom. The same `Sidebar` component is rendered in two places — `<aside className="hidden md:flex">` in `AppShell` for desktop, and inside gov.ie's `DrawerBody` in `Header.tsx` for mobile. There is no separate `MobileNav` wrapper.

**List pane:**
- `TodoList` — composes the list header, summary, filter controls, and the list of items
- `ListSummary` — "x of y completed" + Clear completed + Show / Hide completed toggle (Epic 11)
- `ListControls` — search input
- `TodoItem` — single row: checkbox, description, timestamp, action cluster
- `TodoEditor` — inline editor for description + notes (Epic 07)
- `TodoReorderActions` — up / down icon buttons (Epic 06, refined Epic 11)
- `TodoDeleteAction` — delete icon button per row

**Cross-cutting:**
- `TodoInputBar` — pinned task-creation bar (gov.ie `Input` + `Button`)
- `ConfirmModal` — shared confirm dialog (used by Clear completed and Delete list, Epic 09/08)
- `EmptyState`, `LoadingState`, `ErrorState` — non-populated UI states

**Removed in Epic 11:** the `FlagIcon` component, the amber-border treatment, the flagged-only filter button, the `TOGGLE_FLAG` / `SET_FLAGGED_ONLY` reducer cases, and the related translation keys.

### 3.2 State plumbing — referenced by Story 1.2

Substantive spec lives in `[architecture.md](architecture.md)` §4 (state shape, actions, reducer rationale) and §5.1 (initial-load flow).

- `TodosProvider` mounts at the root and owns the initial-load effect. Children consume state via `useTodos()`.
- `useTodos()` throws clearly when called outside a provider.
- See the `Action` union in `[architecture.md](architecture.md)` §4.2.

### 3.3 App shell — referenced by Story 1.3

Substantive spec: `[architecture.md](architecture.md)` §2 (file layout) and §8 (accessibility, including focus order).

Layout rule: `AppShell` renders a full-viewport column — `Header` at the top, `MainContent` in the middle (the only scrollable region), `TodoInputBar` pinned at the bottom with iOS safe-area padding via `env(safe-area-inset-bottom)`. The shell renders identically regardless of which UI state the routing chooses (see §3.5), so transitions between states cause no layout shift.

### 3.4 Input bar and list — referenced by Story 1.3

Substantive spec: `[ux-spec.md](ux-spec.md)` §3 (component mapping); `[architecture.md](architecture.md)` §5.2 (create flow), §5.3 (toggle), §5.4 (delete).

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
- `ErrorState` announces via `role="alert"`.
- `ConfirmModal` renders gov.ie's `ModalWrapper`, which handles the dialog ARIA semantics itself.
- Keyboard navigation: tab order matches visual order; focused `TodoItem` + Delete/Backspace deletes (no drag-and-drop required, per WCAG 2.5.7).
- Visible focus indicators on every interactive element, drawn from gov.ie tokens.

---

## 5. Interaction states matrix — referenced by Story 5.x

> The interaction-states matrix was not written as a separate document; the obligation lives in the success-criteria checklist in `[brief.md](brief.md)` §4 ("all interaction states are present on every interactive component"), and is treated as binding. As of Epic 05 the polish pass landed for every interactive component below, and Epic 12 added a dark-mode pass over the same surface.

Interactive components covered:

- `TodoInputBar` — `Input` and `Button` (gov.ie defaults)
- `TodoItem` — row hover / focus, completion checkbox, the action cluster (edit, reorder up, reorder down, delete)
- `TodoEditor` — description input, notes textarea, Save / Cancel
- `Sidebar` — list rows (selected / hover / focus), Add list submit, count badges (which hide on hover/selected via `z-100`)
- `ListSummary` — Clear completed (flat button), Show / Hide completed (outline toggle button, `aria-pressed`)
- `ListControls` — search field with clear button
- `Header` — Gaeilge / English toggle button, theme toggle button
- `ConfirmModal` — confirm and cancel buttons (clear-completed, delete-list, delete-todo)
- `ErrorState` — retry button
- `EmptyState` — no interactive elements, included here only for completeness

Per Epic 12, every text colour above also passes against the dark-mode neutral palette (WCAG 4.5:1 for body, 3:1 for large / decorative). The list-pane action buttons (Clear completed, Show / Hide completed, Edit, Delete in the list title) take their dark-mode text colour from a bespoke `.list-action-btn` hook in `globals.css` — a documented workaround for gov.ie's `gi-text-color-*` classes sharing specificity with Tailwind utilities, see the dark-mode entry in `brief.md` §9.