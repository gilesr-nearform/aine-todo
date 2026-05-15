# PRD Refinement

> **Status:** Forwarding stub. The PRD-shaped content for this project lives across the official training PRD (the assessment source of truth, held outside this repo) and `[brief.md](brief.md)`, which is the Analyst-persona refinement sitting alongside it. This file exists so the cross-references in `stories/*.md` and `CLAUDE.md` resolve. Promote this to a standalone artifact later if the BMAD set is audited.
>
> **Owner:** PM persona. **Last updated:** Week 1, Day 1 (post-Epic-12).

---

## 1. Source of truth

- **Official training PRD** — the assessment source of truth. Lives outside this repo. Anything in this stub or in `[brief.md](brief.md)` that conflicts with the official PRD loses.
- `**[brief.md](brief.md)`** — Analyst output: problem statement, persona, scope, success criteria, decision log. Refines the training PRD with project-specific framing without contradicting it.

This file does **not** restate the training PRD. It points at where each PRD-shaped concept already lives in the repo.

## 2. Forwarding table


| Concept                              | Canonical location                       |
| ------------------------------------ | ---------------------------------------- |
| Problem statement                    | `[brief.md](brief.md)` §1                |
| Persona and audience                 | `[brief.md](brief.md)` §2                |
| Value proposition                    | `[brief.md](brief.md)` §3                |
| Success criteria (assessment-graded) | `[brief.md](brief.md)` §4                |
| In-scope features                    | `[brief.md](brief.md)` §5 (in scope)     |
| Out-of-scope features                | `[brief.md](brief.md)` §5 (out of scope) |
| Constraints (timeline, stack, cost)  | `[brief.md](brief.md)` §6                |
| Risks and mitigations                | `[brief.md](brief.md)` §7                |
| Open questions                       | `[brief.md](brief.md)` §8                |
| Product decision log                 | `[brief.md](brief.md)` §9                |
| Technical architecture decisions     | `[architecture.md](architecture.md)` §12 |
| Performance constraints              | `[architecture.md](architecture.md)` §9  |
| Accessibility baseline               | `[architecture.md](architecture.md)` §8  |
| Voice and tone                       | `[ux-spec.md](ux-spec.md)` §6            |


---

## 3. In-scope features

See `[brief.md](brief.md)` §5. Briefly: create / view / complete / delete, plus the four UI states (empty / loading / error / populated), plus all interaction states on every interactive element, plus responsive layout, plus `localStorage` persistence.

## 4. Out-of-scope features

See `[brief.md](brief.md)` §5. Notably: no accounts, no deadlines, no priorities, no tags, no backend, no real AI / vision, no exports, no integrations, no PWA, no photo-scanning (moved to v2 — see `[brief.md](brief.md)` §10).

**Originally out of scope but added Day 1 as scope expansions** (each logged in `[brief.md](brief.md)` §9): reorder (Epic 06), notes + filters (Epic 07), multiple lists (Epic 08), bilingual gov.ie header + i18n (Epic 10), completion-flow tightening (Epic 11), light + dark theme (Epic 12). **Deployment to a public URL** was opened as a scoped exception (GitHub Pages auto-deploy of static build only, no backend) to make the prototype reviewable via a single link — see §9.

---

## 5. Feature notes

### 5.1 Create / view / complete / delete

Covered in `[brief.md](brief.md)` §5 and in `[architecture.md](architecture.md)` §5.2–§5.4.

### 5.2 The four UI states

Covered in `[architecture.md](architecture.md)` §4.1 (`LoadStatus`) and `[component-inventory.md](component-inventory.md)` §3.5 (the routing rule). The brief flags these as graded — see `[brief.md](brief.md)` §4 and the risk row in `[brief.md](brief.md)` §7 about loading/error states being phoned in.

### 5.3 Completion-reorder behaviour — referenced by Story 5.x

Decided in `[brief.md](brief.md)` §9 decision log: completed items default to "stays in place" for v1 (Day-5 evaluation kept the default). **Superseded Day 1 by Epic 11** — completed tasks are now hidden by default with a Show / Hide completed toggle and a separate "Completed" smart view, replacing the grouped-completed-section idea entirely.

### 5.4 Multiple lists (Epic 08)

Brought in-scope Day 1 as a scope expansion. Substantive spec lives in `[architecture.md](architecture.md)` §4.1 (state shape — `lists`, `activeListId`, `activeSmartView`), §4.2 (the list-related reducer actions), and §7 (v1→v2 storage migration). Story file: `[stories/08-multiple-lists.md](stories/08-multiple-lists.md)`.

User-facing behaviour worth flagging here:

- Sidebar on `md+`, drawer on `< md`. The same `Sidebar` component renders in both places; the drawer is composed inline in `Header.tsx` via gov.ie's `DrawerWrapper` + `DrawerBody`. There is no separate `MobileNav` component (see `[brief.md](brief.md)` §9).
- Two smart views — "All tasks" and "Completed" — sit above user lists in the sidebar. They flip `activeListId` to `null` and switch via `activeSmartView`.
- Deleting a list cascade-deletes its todos; the `ConfirmModal` makes the irreversibility explicit.
- The legacy single-list `localStorage` key (`listlens:v1:todos`) is silently migrated onto a default "Tasks" list on first read.

### 5.5 Bilingual header + i18n (Epic 10)

Brought in-scope Day 1. Substantive spec lives in `[architecture.md](architecture.md)` §1 (i18n stack row) and §7 (the `listlens:v1:lang` storage key). UI mapping in `[ux-spec.md](ux-spec.md)` §3. Story file: `[stories/10-bilingual-header-i18n.md](stories/10-bilingual-header-i18n.md)`.

User-facing behaviour worth flagging here:

- Two-bar gov.ie header pattern: a thin identity strip carrying the language toggle, then gov.ie's `HeaderNext` (white-on-green) below carrying the harp, app title, and on mobile a burger.
- Toggle flips the entire app UI between English and Irish (Gaeilge). Date formatting honours the active locale (`en-IE` / `ga-IE`).
- User content (task descriptions, list names) is **not** translated.
- Gov.ie's component-internal strings stay in English (their i18n config isn't exposed via package `exports`).
- No `i18next` dependency — ~80 strings via a custom Context + dictionary. See `[brief.md](brief.md)` §9.

### 5.6 Light + dark theme (Epic 12)

Brought in-scope Day 1. Substantive spec lives in `[architecture.md](architecture.md)` §1 (theme stack row), `[ux-spec.md](ux-spec.md)` §2 (the scoped exception note), and `[brief.md](brief.md)` §9 (Day 1, theme-toggle entry). Story file: `[stories/12-theme-switcher.md](stories/12-theme-switcher.md)`.

User-facing behaviour worth flagging here:

- First paint follows `prefers-color-scheme`; subsequent reloads honour the user's last toggle (`listlens:v1:theme`).
- The toggle lives at the bottom of the sidebar, under the Add-list form — not in the header. The Day-1 relocation rationale is in `[brief.md](brief.md)` §9.
- Dark mode applies a **scoped** override of gov.ie's neutral / gray primitives because `@ogcio/theme-govie/dark.css` ships byte-identical to `light.css` as of build. Brand and intent tokens are untouched.

### 5.7 Reorder, notes, search, completion-flow tightening

Each of Epic 06 (reorder), Epic 07 (notes + search), and Epic 11 (completion-flow tightening) is fully specced in its own story file and covered by a row in the `[brief.md](brief.md)` §9 decision log. Nothing PRD-shaped to add here that isn't already in those source-of-truth artifacts. Epic 11 supersedes the original "completed stays in place" decision (see §5.3 above).

---

## 6. Non-functional requirements

### 6.1 Accessibility

Substantive spec lives in `[architecture.md](architecture.md)` §8. Built on gov.ie design-system primitives, which carry public-sector accessibility expectations.

### 6.2 Performance — referenced by Story 1.4

Substantive spec lives in `[architecture.md](architecture.md)` §9. Summary of the obligations that matter for the persistence story:

- "UI updates should be reflected instantly when a user performs an action" — no artificial debouncing on input; state changes render synchronously in React's commit phase.
- The **only** deliberately simulated delay is the initial-load loader (600–900ms). That delay is preserved even on `localStorage` cache hits, because the loading state is a graded UI deliverable per `[brief.md](brief.md)` §4 — skipping it on the most common path (returning user with cached data) would defeat the demonstration.
- All `localStorage` reads and writes are wrapped in `try`/`catch` so quota or corruption errors degrade gracefully to the empty state rather than blocking the UI.

### 6.3 Responsive design

Substantive spec lives in `[ux-spec.md](ux-spec.md)` §8. Desktop and mobile breakpoints are a graded deliverable per `[brief.md](brief.md)` §4.

---

## 7. Constraints

See `[brief.md](brief.md)` §6.

## 8. Decision log

This stub holds no decisions of its own — the product-side log lives in `[brief.md](brief.md)` §9, architecture-side in `[architecture.md](architecture.md)` §12, UX-side in `[ux-spec.md](ux-spec.md)` §10. As a navigability aid, here are the decisions a PM-persona reader is most likely to want to find:

| Decision | Rationale |
|---|---|
| App rename: "ListLens" retired in favour of "UX To-do list"; `listlens:` storage prefix kept | `brief.md` §9 (Day 1) |
| GitHub Pages auto-deploy of `main` (scoped exception to "no deployment") | `brief.md` §9 (Day 1) |
| Reorder added to v1 scope (Epic 06) — up/down buttons, no drag (WCAG 2.5.7) | `brief.md` §9 (Day 1) |
| Apple Reminders–style depth (Epic 07) — notes + search; flag feature later removed | `brief.md` §9 (Day 1) |
| Multiple lists added (Epic 08) — first storage migration of the project | `brief.md` §9 (Day 1) |
| Bilingual gov.ie header + Gaeilge / English toggle (Epic 10) | `brief.md` §9 (Day 1) |
| Completion-flow tightening (Epic 11) — auto-hide completed by default; flag feature removed | `brief.md` §9 (Day 1) |
| Light + dark theme (Epic 12) — gov.ie `data-theme`, scoped neutral-token override | `brief.md` §9 (Day 1) |
| Undo flow removed; per-task delete now guarded by `ConfirmModal` | `brief.md` §9 (Day 1) |
| Photo-scanning cut from v1, moved to v2 appendix | `brief.md` §9 (Day 0) |
| `localStorage` persistence promoted from optional polish to required v1 | `brief.md` §9 (Day 0) |