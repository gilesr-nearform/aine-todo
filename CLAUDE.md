# CLAUDE.md

> Master context file for Claude Code sessions. Read first, then consult `docs/` for details. Keep this thin — it's a pointer, not a duplicate.

## Project at a glance

**Working name:** ListLens *(placeholder — finalise in `docs/brief.md`)*

**What it is:** A personal todo app prototype built using the Government of Ireland Design System, demonstrating Spec-Driven Development with the BMAD Framework. The primary user is the builder — a service designer at OGCIO managing personal workday tasks.

**Why it exists:** Deliverable for an AI training programme on SDD using Cursor + Claude Code. The official training PRD is the source of truth; `docs/` are the BMAD artifacts produced from it.

## Read these first, in this order

1. `docs/brief.md` — *the why*. Analyst output. Personas, scope, decision log.
2. `docs/prd.md` — *the what*. PRD refinement against the official training PRD.
3. `docs/architecture.md` — *the technical how*. Stack, state, gov.ie design system integration.
4. `docs/component-inventory.md` — *the parts*. Components, hierarchy, user flows.
5. `docs/ux-spec.md` — *the look and feel*. Defers to the gov.ie design system as source of truth.
6. `docs/stories/` — *the work*. UI-focused user stories with acceptance criteria.

## Stack

- **Build:** Vite + React 18 + TypeScript (strict)
- **Design system:** `@ogcio/design-system-react`, `@ogcio/design-system-tokens`, `@ogcio/design-system-tailwind`, `@ogcio/theme-govie`
- **Styling:** Tailwind CSS (gov.ie preset) + CSS variables from gov.ie tokens
- **State:** React Context + useReducer, with `localStorage` persistence (`listlens:v1:todos` key)
- **Data:** Mock only — no backend, no real APIs. localStorage is the only persistence layer; everything else simulated.

## Design north star

Government of Ireland Design System. We don't invent visual tokens; we consume them.

When implementing UI:
1. Check the [gov.ie React Storybook](https://ds.services.gov.ie/storybook-react/) for an existing component
2. If gov.ie has it → import from `@ogcio/design-system-react`
3. If gov.ie doesn't have it → build custom *using gov.ie tokens*
4. Never override gov.ie token values

Voice and tone follow gov.ie plain-English standards: direct, sentence case, no emoji, no exclamations.

## What this project is *not*

- Not a real AI app
- Not deployed (runs locally per training brief)
- Not collaborative or multi-user
- No accounts, no cloud sync, no analytics
- No photo-scanning (moved to v2 — see `docs/brief.md` §10)

## Conventions for AI agents

- **Specs before code.** If a story isn't written, don't implement it.
- **No dependencies without checking `docs/architecture.md`.** Stack is intentionally minimal.
- **No features outside the official PRD.** Photo-scan is cut from v1.
- **TypeScript strict mode.** No `any`. No `@ts-ignore` without an inline justification.
- **All interactive components ship with all states:** hover, focus, active, disabled.
- **All UI states ship polished:** empty, loading, error, populated.
- **Use gov.ie components where they exist.** Custom only where the design system has gaps.
- **Update the decision log** in `docs/brief.md` (section 9) for any non-trivial choice.

## Build order (strict)

1. App shell, routing, state plumbing, gov.ie design system installed and verified
2. localStorage persistence (Story 1.4 — required, not optional)
3. Core components: `<TodoList>`, `<TodoItem>` (with gov.ie `Checkbox`), `<TodoInputBar>` (with gov.ie `Input` + `Button`)
4. Create / complete / delete flows wired with mock data + persistence
5. Empty / loading / error states — all polished
6. Responsive pass — mobile breakpoints, real-device check
7. Interaction states pass — every component
8. Day-5 evaluation: keep "completed stays in place" or add grouped Completed section (Story 5.4)

## Commands

*To be filled in once the project is scaffolded on day 1.*

```bash
# pnpm install
# pnpm dev
# pnpm build
# pnpm lint
```
