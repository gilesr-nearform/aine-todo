# Project Brief

> **Owner:** Analyst persona · **Status:** Locked for week 1 · **Last updated:** Week 1, Day 0
>
> **Training context:** Submitted as part of an AI training programme on Spec-Driven Development (SDD), using the BMAD Framework with Cursor + Claude Code. The official training PRD is the source of truth for scope. This brief is the Analyst-persona output sitting alongside it.
>
> **Working name:** ListLens *(placeholder — finalised in section 8)*

---

## 1. Problem statement

A service designer's day is fragmented by design. Discovery sessions, design critique, stakeholder reviews, ticket triage, async comments to clear, training to attend, training to design — none of it lives in one place. The default tools are either too heavyweight (project-management platforms designed for managers tracking *other people's* work) or too lightweight (a sticky note that gets lost between meeting rooms).

What's missing is a quiet personal tracker that:

- Captures a task in one keystroke
- Shows what's pending without ceremony
- Never grows into a workspace-style productivity system that demands maintenance

The goal isn't to manage projects. The goal is to remember what you said you'd do today.

## 2. Who is this for?

### Primary persona — "the in-house service designer"
A service or UX designer working at OGCIO on gov.ie services. Their week is meeting-heavy and context-switching-heavy. They take handwritten notes, capture todos in a mix of tools (Apple Reminders, post-its, a notebook), and lose track of items between them.

They are professionally fluent in the Government of Ireland Design System — both as users and contributors — and have strong opinions about accessibility, plain English, and the kind of UI that respects users' attention.

This is, frankly, the builder of this app. We're not pretending otherwise: building for oneself is a legitimate v1 strategy when the builder is a clear member of the target audience and the assessment doesn't require generalisation.

### Not the audience (yet)
- Project managers tracking team workloads
- People needing shared lists, delegation, or assignment
- Power users wanting priorities, deadlines, projects, tags, recurring tasks, or any of the surface area that productivity tools accrete over time

## 3. Value proposition

**One sentence:**
> A quiet personal todo app for an OGCIO workday — built using the Government of Ireland Design System, demonstrating Spec-Driven Development with AI agents.

**Why this exists (training-programme framing):**
- The product is intentionally simple; the *process* is the deliverable. The grade comes from the quality of the BMAD artifacts and how visibly those specs drove the build.
- Building it on top of the gov.ie design system — rather than inventing a visual language — demonstrates real-world design-system literacy, which is closer to how design actually happens in an OGCIO context than a from-scratch brand exercise would be.

## 4. Success criteria (POC, end of week 1)

The POC succeeds if all of these are true. The first four come directly from the training-programme success criteria.

- [ ] **Prototype coverage:** Create, complete, delete, and empty state are all implemented and polished
- [ ] **BMAD artifacts:** Brief, PRD refinement, component inventory, and user stories with UI-focused acceptance criteria are all written and committed
- [ ] **Responsive design:** Prototype works well on desktop *and* mobile breakpoints
- [ ] **Documentation:** README explains how BMAD and Cursor were used together, what was learned, and how to run the prototype locally
- [ ] All four required UI states feel **polished, not placeholder**: empty, loading, error, populated
- [ ] All interaction states are present on every interactive component: hover, focus, active, disabled
- [ ] The app visibly uses the Government of Ireland Design System: components from `@ogcio/design-system-react`, tokens from `@ogcio/design-system-tokens`, the `@ogcio/theme-govie` theme applied
- [ ] Completed tasks are visually distinguishable from active ones at a glance

## 5. Scope

### In scope for POC (v1)
The four core actions per the official PRD:
- **Create** a todo via typed input (description, completion status defaults to `false`, creation timestamp set automatically)
- **View** the current list of todos
- **Complete / un-complete** a todo
- **Delete** a todo
- **Reorder** tasks via up/down buttons (added Day 1 as a scope expansion — see §9 decision log)
- **Notes, flags, and filters** — second-line notes per task, flag toggle, search/show-completed/flagged-only filters (Epic 07, see §9 decision log)
- **Multiple lists** — create/rename/delete lists, sidebar on desktop and drawer on mobile, "All tasks" smart list, storage migration (Epic 08, see §9 decision log)

Plus, per the official PRD's explicit instructions:
- All four UI states: empty, loading, error, populated
- All interaction states on all interactive components: hover, focus, active, disabled
- Responsive layout (desktop + mobile)
- Mock data only — no live backend, no real API calls
- Component hierarchy that reflects the user flows defined in the BMAD stories
- "Production-ready feel" despite minimal scope

Plus our own discipline:
- **Persistence via `localStorage`** so tasks survive page reloads — required for the brain-dump-once-a-day usage pattern
- Built using `@ogcio/design-system-react` components wherever the design system covers our needs; custom components only where it doesn't (e.g. swipe-to-delete, undo toast)
- Voice and tone follow gov.ie plain-English guidance

### Out of scope for v1
Per the official PRD:
- User accounts / authentication
- Task prioritisation
- Deadlines or due dates
- Filtering or sorting
- Notifications
- Categorisation / tagging
- Multi-list management

Per our own discipline:
- **Photo-scanning a paper list** (moved to v2 — see appendix). Doesn't fit the workday-tracker framing as cleanly as it would a general-purpose tool.
- Backend or database integration
- Real AI or vision API calls
- Exports (no `.ics`, no copy-as-table)
- Integrations with Apple Reminders / Google Tasks / anything else
- PWA install or deployment to a public URL
- Onboarding flows
- Analytics or tracking

## 6. Constraints

- **Timeline:** 7 days from kickoff to deliverable
- **Builder:** Service designer with light coding background, leveraging Cursor + Claude Code following BMAD's workflow
- **Stack:** Vite + React + TypeScript + Tailwind, with `@ogcio/design-system-react` + `@ogcio/design-system-tailwind` + `@ogcio/theme-govie` for visual language
- **Cost:** Zero — no paid services needed for v1; the gov.ie design system is MIT-licensed and free

## 7. Risks and mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Scope creep — adding "just one more" feature that the PRD excludes | **High** | This brief + the PRD are the contract. Any addition needs a decision-log entry first. |
| Gov.ie design system doesn't have a component we need (e.g. swipe-to-delete on mobile, undo toast) | Medium | Defer to gov.ie components first; build custom components in the gov.ie *style* (using gov.ie tokens) only where the library lacks coverage. Document each custom component in `component-inventory.md`. |
| Gov.ie components don't visually compose with one another for our specific layout | Low | Sketch the main screen on day 1 using the React Storybook to validate before sinking implementation time. |
| Loading and error states get phoned in (they're easy to skip) | Medium | The PRD flags these as a *graded deliverable* — "should feel considered and polished rather than placeholder." Treat them with the same care as the populated state. |
| Component inventory done after-the-fact rather than driving the build | **High** | The inventory is written *before* any UI code (already done as of day 0). The whole point of SDD is the spec leads. |
| README treated as paperwork, not part of the deliverable | Medium | README is explicitly assessed for "AI integration notes." Draft it incrementally through the week, not on day 7. |

## 8. Open questions

- **App name** — `ListLens` is a working placeholder. Maybe something more workday-feeling? Decide by day 6.
- **Gov.ie component coverage** — verify on day 1 in the React Storybook that the design system covers: Button, Input, Checkbox, error message component. Custom components needed for: swipe-to-delete on mobile, undo toast (likely — design system may not include destructive-action undo flows).

## 9. Decision log

| Date | Decision | Rationale |
|---|---|---|
| Day 0 | Project anchored to the official training PRD; this brief sits alongside it, not in place of it | The PRD is the source of truth for assessment; the brief is the Analyst-persona artifact for SDD demonstration |
| Day 0 | Persona is the in-house OGCIO service designer (the builder, plainly) | Building for oneself is legitimate at v1 when the builder is a clear member of the target audience |
| Day 0 | Use case is personal workday task tracking | Smaller, sharper, and more relevant than a general-purpose tracker |
| Day 0 | Adopt the Government of Ireland Design System for visual language | Aligns the project with the builder's actual work; demonstrates design-system literacy; eliminates a class of from-scratch design decisions that would distract from SDD demonstration |
| Day 0 | Photo-scanning cut from v1, moved to v2 appendix | Fits a general-purpose personal tracker better than a workday-tracker for a design office; cutting also reduces scope to fit the week cleanly |
| Day 0 | Vite + React + TS retained as the stack | Matches the gov.ie design system's example project (`pnpm examples:vite`); minimises integration friction |
| Day 0 | Tooling: Cursor + Claude Code, both reading from the same `docs/` | One source of truth across two AI tools; rules files (`.cursor/rules/*.mdc` and `CLAUDE.md`) are thin pointers |
| Day 0 | No deployment, no PWA, no exports, no integrations in v1 | Out of scope per the training brief ("runs locally, uses mock data") |
| Day 0 | `localStorage` persistence promoted from optional polish to required v1 | Once-a-day brain-dump cadence means losing your tab loses your work; persistence isn't a nice-to-have at that cadence |
| Day 0 | Completion-reorder behaviour defaults to "stays in place" for v1, with day-5 evaluation point in `stories/05-polish.md` | User wants to live with the interaction before committing to grouping; building "stays in place" first is the cheap default that doesn't preclude either path |
| Day 1 | `tailwind.config.ts` wires the gov.ie preset via `theme: createTheme()` instead of `presets: [preset]` (Story 1.1) | The published `@ogcio/design-system-tailwind` package exports `{ createTheme }`, not a default preset. The architecture-doc snippet in §3 was outdated; this is the canonical usage per the package's own npm docs and the gov.ie monorepo. Architecture doc to be updated to match. |
| Day 1 | `src/styles/globals.css` imports `@ogcio/theme-govie/theme.css` and `@ogcio/design-system-react/styles.css` instead of `@ogcio/design-system-tokens/dist/tokens.css` (Story 1.1) | The tokens package only ships JS exports — `dist/tokens.css` does not exist. The CSS variables come from the theme package; component CSS comes from the React package. This matches the gov.ie React README and the official Vite reference example. |
| Day 1 | Tailwind pinned to `^3.4` rather than the latest `4.x` (Story 1.1) | The gov.ie preset's peer dep is `tailwindcss >=3.4.0` and its `createTheme` returns `Partial<CustomThemeConfig>` typed against `tailwindcss/types/config.js` — a Tailwind 3 module path. Tailwind 4's CSS-first config model would not consume the gov.ie preset as designed. |
| Day 1 | Epic 02 authored with 3 stories (Create, View, Toggle Complete), not 4 as the stories README originally listed | The brief's core actions for Epic 02 collapse cleanly into 3 stories; the "visual differentiation of completed vs active" item is folded into Story 2.3's AC rather than split out, because it's the natural concern of the toggle flow. Delete + undo remains Epic 03. Stories README index updated to match. |
| Day 1 | `docs/prd.md` and `docs/component-inventory.md` added as forwarding stubs, not standalone artifacts | Both files were referenced by `CLAUDE.md`, `.cursor/rules/project.mdc`, and several stories but had not been written. Stubs that forward each cited section to where the content actually lives (in `brief.md`, `architecture.md`, `ux-spec.md`) resolve the cross-references without duplicating content that could drift. Promote to standalone artifacts later if a BMAD audit requires it. |
| Day 1 | Epic 03 ships a tap-target delete icon; swipe-to-delete deferred to v2 | The gov.ie design system supplies an icon-button primitive but no swipe gesture handling, and inventing one adds significant scope (touchmove tracking, threshold detection, opening/closing states, accessibility for the gesture). A tap-target icon works identically on mobile and desktop, is keyboard-accessible by default, and matches established patterns (Apple Mail, Things, Notion). The swipe gesture is recorded as a v2 enhancement in §10. |
| Day 1 | Epic 08 added — multiple lists, the largest single change so far | User asked "how about multiple lists?" after Epic 07 shipped. Originally cut from Epic 07 as "major restructure of routing, header, state shape." Re-scoped on inspection: gov.ie ships `SideNav` and `Drawer` components which absorb most of the navigation cost. Touches data model (new `List` type, `listId` on every todo), storage schema (v1 array → v2 object — first storage migration of the project), and layout (sidebar on desktop, drawer on mobile). Several sub-features cut inside the epic — see `docs/stories/08-multiple-lists.md` — including move-to-list per row, list colours, list reorder, URL routing, and Flagged/Completed smart lists (Epic 07's filters cover those). |
| Day 1 | Epic 07 added — Apple Reminders–style depth (notes, flags, filters) — as a further scope expansion past the official training PRD | User asked to "copy Apple Reminders as best as possible, but cut things that take too long." Ship list was triaged to four cheap, high-value items: notes per todo, flag per todo, show/hide completed, and search. Each named cut is recorded in `docs/stories/07-reminders-features.md` — including due dates, multiple lists, subtasks, alerts, recurrence, priority levels, and tags — so the SDD demonstration values transparent cuts as much as transparent additions. Light SDD process: one combined story file, one decision-log entry, then implement. |
| Day 1 | Reorder added to v1 scope as a 6th epic, despite the official training PRD excluding "Filtering or sorting" | Builder (a service designer using the app for their own workday) found that without reorder the list felt static — important tasks couldn't migrate up as priorities shifted, and "completed stays in place" (the Day-0 default) makes the order question more pressing, not less. Implementing reorder via up/down buttons (not drag) preserves the WCAG 2.5.7 baseline from `architecture.md` §8 and is a small reducer + UI addition. This expansion is recorded *because* the SDD demonstration values transparent scope decisions over silent scope creep — the cost is being explicit, the benefit is the v1 actually fits the use case. Epic 06 spec authored before any implementation. |
| Day 1 | App header swapped from custom composition to gov.ie `HeaderNext` (green default variant) | Original `ux-spec.md` §3 entry called for a custom header to avoid the prototype reading as a real gov.ie service. Builder (a service designer at OGCIO) explicitly opted in to the gov.ie green bar to strengthen the "visibly uses the design system" graded deliverable. The training-programme context makes the impersonation risk acceptable — the assessor sees this is a personal-prototype context. If this app were ever deployed publicly, the header should revert to a custom composition. `ux-spec.md` §3 row updated to match. |
| Day 1 | Completed todos **stay in place** for v1 (Story 5.4 default kept) | The Day-0 default was "build stays-in-place first, evaluate on day 5." The day-5 evaluation requires at least 2 days of real use with realistic content, which has not yet happened. The default is therefore retained for v1. If a user evaluation surfaces friction, Story 5.4's grouped-completed-section path remains an option without architectural rework: it's a render-time grouping of `state.todos`, not a state-shape change. |

## 10. Appendix — v2 considerations (not in scope, recorded for product-thinking transparency)

Documented to show product thinking beyond v1, and to ensure the v1 component architecture doesn't foreclose them.

- **Swipe-to-delete on mobile.** v1 ships a tap-target delete icon (always-visible on mobile, hover-reveal on desktop) because gov.ie doesn't supply gesture primitives and the icon path is universally understood. Swipe is a credible mobile-feel upgrade for v2.
- **Photo-scanning of paper notes for action-item extraction.** Could realistically fit a service designer's workflow (capture from notebook → digital list), but adds enough scope to v1 to be a distraction this week. The architecture supports a future "additional create-input method" without restructuring.
- **Lightweight categorisation** (e.g. project, admin, training) — would need to integrate with how gov.ie design system handles tag-style components.
- **Persistence** — `localStorage` first, eventually a real backend if multi-device sync is desired.
- **Integration with gov.ie workday tooling** — e.g. surfacing tasks from Microsoft Teams meeting notes via the Graph API. Long-tail v2+ work.
- **Native iOS app** with similar gov.ie design language for use on phones outside work hours.
