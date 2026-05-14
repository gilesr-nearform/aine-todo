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

This stub adds no decisions of its own. The product-side decision log lives in `[brief.md](brief.md)` §9; architecture-side decisions live in `[architecture.md](architecture.md)` §12; UX-side decisions live in `[ux-spec.md](ux-spec.md)` §10.