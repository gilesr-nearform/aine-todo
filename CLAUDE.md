# CLAUDE.md

> Master context file for Claude Code sessions. Read first, then consult `docs/` for details. Keep this thin — it's a pointer, not a duplicate.

## Project at a glance

**Name:** UX To-do list *(working name "ListLens" was retired Day 1 — see `docs/brief.md` §9. The localStorage keys still carry the `listlens:` prefix for storage-format compatibility; do not rename them.)*

**What it is:** A personal todo app prototype built using the Government of Ireland Design System, demonstrating Spec-Driven Development with the BMAD Framework. The primary user is the builder — a service designer at OGCIO managing personal workday tasks.

**Why it exists:** Deliverable for an AI training programme on SDD using Cursor + Claude Code. The official training PRD is the source of truth; `docs/` are the BMAD artifacts produced from it.

**Live URL:** https://gilesr-nearform.github.io/aine-todo/ — auto-deployed from `main` via `.github/workflows/deploy.yml`. The Day-0 "no deployment" rule was overridden as a scoped exception (assessment-link use case) — see `docs/brief.md` §9.

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
- **Fonts:** `@fontsource/lato` (gov.ie body font) + `material-symbols` (self-hosted Material Symbols Outlined font for gov.ie's `Icon` API — gov.ie ships the icon-name API but not the font, see `docs/brief.md` §9)
- **Styling:** Tailwind CSS (gov.ie preset) + CSS variables from gov.ie tokens
- **State:** React Context + useReducer, with `localStorage` persistence (`listlens:v2:state` for the lists+todos+view-state envelope; `listlens:v1:lang` for language; `listlens:v1:theme` for theme)
- **i18n:** Custom lightweight Context-based dictionary (`src/i18n/`) — English + Irish (Gaeilge). No i18next dependency. See Epic 10.
- **Theme:** Light + dark via gov.ie's `data-theme` attribute, with a scoped exception that overrides gov.ie's neutral/gray primitives in dark mode (gov.ie's `dark.css` ships byte-identical to `light.css` as of build). See Epic 12 and `docs/brief.md` §9.
- **Data:** Mock only — no backend, no real APIs. localStorage is the only persistence layer; everything else simulated.
- **Deploy:** GitHub Pages via Actions (`.github/workflows/deploy.yml`), publishes on every push to `main`.

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
- Not collaborative or multi-user
- No accounts, no cloud sync, no analytics
- No photo-scanning (moved to v2 — see `docs/brief.md` §10)
- *Deployed only to GitHub Pages for the assessment review link — see top of file.* No backend or real APIs introduced.

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

Epics 01–08 shipped Day 1. Epics 10–12 followed. Build order is preserved in `docs/stories/`:

1. **Epic 01 — Foundation:** app shell, routing, state plumbing, gov.ie design system installed and verified, `localStorage` persistence (Story 1.4 — required, not optional)
2. **Epic 02 — Core actions:** create, view, toggle complete (with gov.ie `Checkbox`)
3. **Epic 03 — Delete & undo:** delete row, `<UndoToast>` countdown
4. **Epic 04 — UI states:** empty / loading / error / populated, all polished
5. **Epic 05 — Polish:** responsive pass, interaction states pass, completion-grouping decision (kept "completed stays in place" — see decision log)
6. **Epic 06 — Reorder:** up/down buttons (no drag, WCAG 2.5.7)
7. **Epic 07 — Reminders-style depth:** notes + filters (flag feature later removed in Epic 11)
8. **Epic 08 — Multiple lists:** sidebar on desktop, drawer on mobile, "All tasks" smart list, v1→v2 storage migration
9. **Epic 10 — Bilingual gov.ie header + i18n:** two-bar header, harp logo, Gaeilge/English toggle
10. **Epic 11 — Completion-flow tightening:** auto-hide completed by default, remembered showCompleted, flag feature removed, Completed smart view
11. **Epic 12 — Theme switcher:** light + dark via gov.ie's `data-theme`, sun/moon toggle in the header

## Commands

```bash
pnpm install    # install deps (Node 20+ required)
pnpm dev        # vite dev server with HMR at localhost:5173
pnpm build      # type-check + production build into dist/
pnpm preview    # serve the production build locally
pnpm lint       # eslint over src/
pnpm format     # prettier --write
```
