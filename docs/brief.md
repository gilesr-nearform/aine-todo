# Project Brief

> **Owner:** Analyst persona · **Status:** Locked + iterated through Day 1 · **Last updated:** Week 1, Day 1 (post-Epic-12, post-deploy)
>
> **Training context:** Submitted as part of an AI training programme on Spec-Driven Development (SDD), using the BMAD Framework with Cursor + Claude Code. The official training PRD is the source of truth for scope. This brief is the Analyst-persona output sitting alongside it.
>
> **Name:** UX To-do list *(working name "ListLens" was retired Day 1 — see §8 and §9. The `listlens:` `localStorage` prefix is a stable storage identifier and intentionally preserved.)*
>
> **Live URL:** https://gilesr-nearform.github.io/aine-todo/ *(GitHub Pages auto-deploy from `main` — Day-1 scoped exception, see §9.)*

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

- [x] **Prototype coverage:** Create, complete, delete, and empty state are all implemented and polished
- [x] **BMAD artifacts:** Brief, PRD refinement, component inventory, and user stories with UI-focused acceptance criteria are all written and committed
- [x] **Responsive design:** Prototype works well on desktop *and* mobile breakpoints (sidebar collapses to drawer below `md`)
- [x] **Documentation:** README explains how BMAD and Cursor were used together, what was learned, and how to run the prototype locally
- [x] All four required UI states feel **polished, not placeholder**: empty, loading, error, populated
- [x] All interaction states are present on every interactive component: hover, focus, active, disabled
- [x] The app visibly uses the Government of Ireland Design System: components from `@ogcio/design-system-react`, tokens from `@ogcio/design-system-tokens`, the `@ogcio/theme-govie` theme applied
- [x] Completed tasks are visually distinguishable from active ones at a glance (auto-hidden by default in Epic 11; strikethrough + checkbox state when visible)

## 5. Scope

### In scope for POC (v1)
The four core actions per the official PRD:
- **Create** a todo via typed input (description, completion status defaults to `false`, creation timestamp set automatically)
- **View** the current list of todos
- **Complete / un-complete** a todo (auto-hides on completion by default, Epic 11)
- **Delete** a todo (with undo toast, Epic 03)
- **Reorder** tasks via up/down buttons (Epic 06 — scope expansion logged in §9)
- **Notes and search filter** — second-line notes per task, free-text search across description + notes (Epic 07; the flag feature shipped here was removed in Epic 11)
- **Multiple lists** — create / rename / delete lists, sidebar on desktop and drawer on mobile, "All tasks" + "Completed" smart views, v1→v2 `localStorage` migration (Epic 08)
- **Bilingual gov.ie header** — two-bar gov.ie identity strip, harp logo, English ↔ Gaeilge toggle translating the entire app UI (Epic 10)
- **Light + dark theme** — sun / moon toggle in the header, persists across reloads, follows `prefers-color-scheme` on first paint (Epic 12)

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
- PWA install
- ~~Deployment to a public URL~~ — **opened Day 1 as a scoped exception** (assessment-link use case). Static build only, no backend. See §9. The default rule "runs locally per training brief" still applies to anything beyond a static deploy.
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

- ~~**App name** — `ListLens` is a working placeholder. Maybe something more workday-feeling? Decide by day 6.~~ **Resolved Day 1:** retired "ListLens" in favour of "UX To-do list" — plainer-English, sentence-case, gov.ie tone. Decision-log entry in §9. The `listlens:` `localStorage` prefix is kept as a stable storage identifier, since renaming it would invalidate every persisted user's state without buying anything.
- ~~**Gov.ie component coverage** — verify on day 1 in the React Storybook that the design system covers: Button, Input, Checkbox, error message component.~~ **Resolved Day 1:** verified. Custom components built only where gov.ie has no equivalent (`UndoToast`, `ConfirmModal`, `TodoEditor`, the timer-bar countdown, `MobileNav` drawer composition).
- **Material Symbols footprint** — the self-hosted woff2 is ~3.9MB unsubsetted. For a v2 / production pass, subset to the ~12 glyphs the app actually uses to drop the asset to <50kB. Out of scope for v1 deliverable but flagged in §10 v2 considerations.

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
| Day 1 | Epic 11 added — tighten the completion flow; drop flags entirely | After a day living with Epic 07's flag feature, the builder confirmed two things: (1) in a single-user app every task is implicitly "mine", so flagging adds visual noise without information value; (2) ticked tasks lingering inline read as clutter rather than memory aid. Epic 11 inverts the default (completing auto-hides, persisted across reload), adds a new "Completed" smart view under "All tasks" with a check-circle icon, deletes the entire flag surface (Todo.flagged, TOGGLE_FLAG / SET_FLAGGED_ONLY reducer cases, FlagIcon, amber border, flagged-only button, related translation keys), moves the list-rename affordance from a sidebar button to a right-aligned pencil on the list title heading (because that's where users look when they want to rename what they're looking at), and persists `showCompleted` plus the active smart-view selection in localStorage. Cuts inside the epic — no migration toast for lost flags, no "Completed" count badge, no F2-style keyboard shortcut for rename — are documented in `docs/stories/11-completion-flow-tightening.md`. |
| Day 1 | Epic 10 added — bilingual gov.ie branding bar + Gaeilge/English toggle | User asked for "Government of Ireland + Gaeilge with harp logo and light green top bar with Gaeilge toggle to translate all content". This is the standard gov.ie two-bar header pattern (light bilingual identity above the dark site bar) plus a working language switch. Implementation cuts inside the epic — see `docs/stories/10-bilingual-header-i18n.md` — include skipping i18next/react-i18next (custom Context + dictionary instead, ~80 strings doesn't justify the dependency), leaving gov.ie's component-internal strings in English (their i18n config is not exposed via package `exports`), not translating user content (task descriptions, list names), and not building a Gaeilge plural-rule engine. Date formatting honours the active locale (`en-IE` / `ga-IE`). Language preference persists in localStorage under a separate `listlens:v1:lang` key, not in `AppState`, because language is presentation rather than domain. |
| Day 1 | Epic 08 added — multiple lists, the largest single change so far | User asked "how about multiple lists?" after Epic 07 shipped. Originally cut from Epic 07 as "major restructure of routing, header, state shape." Re-scoped on inspection: gov.ie ships `SideNav` and `Drawer` components which absorb most of the navigation cost. Touches data model (new `List` type, `listId` on every todo), storage schema (v1 array → v2 object — first storage migration of the project), and layout (sidebar on desktop, drawer on mobile). Several sub-features cut inside the epic — see `docs/stories/08-multiple-lists.md` — including move-to-list per row, list colours, list reorder, URL routing, and Flagged/Completed smart lists (Epic 07's filters cover those). |
| Day 1 | Epic 07 added — Apple Reminders–style depth (notes, flags, filters) — as a further scope expansion past the official training PRD | User asked to "copy Apple Reminders as best as possible, but cut things that take too long." Ship list was triaged to four cheap, high-value items: notes per todo, flag per todo, show/hide completed, and search. Each named cut is recorded in `docs/stories/07-reminders-features.md` — including due dates, multiple lists, subtasks, alerts, recurrence, priority levels, and tags — so the SDD demonstration values transparent cuts as much as transparent additions. Light SDD process: one combined story file, one decision-log entry, then implement. |
| Day 1 | Reorder added to v1 scope as a 6th epic, despite the official training PRD excluding "Filtering or sorting" | Builder (a service designer using the app for their own workday) found that without reorder the list felt static — important tasks couldn't migrate up as priorities shifted, and "completed stays in place" (the Day-0 default) makes the order question more pressing, not less. Implementing reorder via up/down buttons (not drag) preserves the WCAG 2.5.7 baseline from `architecture.md` §8 and is a small reducer + UI addition. This expansion is recorded *because* the SDD demonstration values transparent scope decisions over silent scope creep — the cost is being explicit, the benefit is the v1 actually fits the use case. Epic 06 spec authored before any implementation. |
| Day 1 | App header swapped from custom composition to gov.ie `HeaderNext` (green default variant) | Original `ux-spec.md` §3 entry called for a custom header to avoid the prototype reading as a real gov.ie service. Builder (a service designer at OGCIO) explicitly opted in to the gov.ie green bar to strengthen the "visibly uses the design system" graded deliverable. The training-programme context makes the impersonation risk acceptable — the assessor sees this is a personal-prototype context. If this app were ever deployed publicly, the header should revert to a custom composition. `ux-spec.md` §3 row updated to match. |
| Day 1 | Completed todos **stay in place** for v1 (Story 5.4 default kept) | The Day-0 default was "build stays-in-place first, evaluate on day 5." The day-5 evaluation requires at least 2 days of real use with realistic content, which has not yet happened. The default is therefore retained for v1. If a user evaluation surfaces friction, Story 5.4's grouped-completed-section path remains an option without architectural rework: it's a render-time grouping of `state.todos`, not a state-shape change. |
| Day 1 | App name finalised: "UX To-do list" (working name "ListLens" retired) | The Day-0 working name "ListLens" was placeholder framing during the initial spec pass. After implementation completed and the prototype had a recognisable voice, the builder picked "UX To-do list" — plainer-English, sentence-case, gov.ie tone, accurately describes what the thing is. The rename is purely cosmetic: applied to the document `<title>`, the gov.ie `HeaderTitle`, the `header.title` / `header.siteAria` translation strings in both `en` and `ga`, the project's README heading, and the `name` field in `package.json`. The internal `listlens:` `localStorage` key prefix (`listlens:v2:state`, `listlens:v1:lang`, `listlens:v1:theme`) is deliberately not renamed — it's a stable storage identifier and a rename would invalidate every persisted user's state for no functional gain. The hard rule "do not rename the `listlens:` storage prefix" is recorded in `CLAUDE.md` and `.cursor/rules/project.mdc`. |
| Day 1 | GitHub Pages auto-deploy of `main` via Actions, as a scoped exception to the Day-0 "no deployment" decision | The Day-0 decision was "No deployment, no PWA, no exports, no integrations in v1 — out of scope per the training brief (runs locally, uses mock data)." After implementation completed, the builder needed to share the prototype with a reviewer for the AI-training programme assessment. The three review-path options were (a) clone-and-run locally — highest friction for the reviewer, (b) GitHub Codespaces — zero install but still requires the reviewer to start the dev server in a VS Code session, (c) a public live URL — one link, no setup for the reviewer. Option (c) was chosen explicitly for the assessment use case. The deployment is scoped to publishing the static build artifact to GitHub Pages from a workflow file (`.github/workflows/deploy.yml`); no backend, no analytics, no real APIs are introduced. The Vite build is invoked with `--base=/<repo-name>/` so asset URLs resolve under the GitHub Pages sub-path; the dev config is untouched (`pnpm dev` still serves from `/`). The published URL is `https://gilesr-nearform.github.io/aine-todo/`. If the brief context ever changed and "runs locally only" was reinstated as a hard constraint, the workflow file deletes in one commit with no other code changes required. |
| Day 1 | Material Symbols Outlined font self-hosted via the `material-symbols` npm package, and the sidebar's "All tasks" entry switched from `apps` to `list` | The gov.ie `Icon` component renders most of its curated icon names (including `apps`, `add_circle`, `more_horiz`, `edit`, `delete`, `menu`) via a `<span class="material-symbols-outlined">` ligature span — but neither `@ogcio/theme-govie` nor `@ogcio/design-system-react` ships the actual Material Symbols Outlined font. The result, before this fix, was that the design system's own icon API rendered the icon *name* as plain text in any browser without the font installed locally. First attempt loaded the font from Google's CDN with `preconnect` + `display=block`, but the runtime environment (Cursor's in-IDE browser, and likely any sandboxed preview) blocks external font requests, so zero glyphs ever rendered. Switched to the `material-symbols` npm package — the canonical community-maintained package, just CSS + woff2 — and imported `material-symbols/outlined.css` from `src/styles/globals.css`. This matches the project's existing self-hosted-font pattern (`@fontsource/lato` is already a dependency for the same reason). The font asset is ~340kB and ships alongside the bundle. Side effect: the runtime now accepts any valid Material Symbols name (the design system's `IconId` TypeScript type is narrower than the runtime accepts), which the user asked for to give the "All tasks" sidebar entry a list glyph that visually echoes the Apple Reminders icon. The cast to `IconId` is narrowed to one named constant `ALL_TASKS_ICON` in `Sidebar.tsx` so the escape hatch is auditable. New dependency `material-symbols` recorded here per the "No new dependencies without checking docs/architecture.md" rule — justified because it's required to make the existing gov.ie Icon API work at all (without it the design system's own curated icons render as their literal text names). |
| Day 1 | Epic 12 added — theme switcher (light + dark) — and a scoped exception to the "never override gov.ie token values" rule | User asked for a theme switcher in the top right of the green header. Gov.ie publishes `[data-theme="govie-light"]` and `[data-theme="govie-dark"]` selector sheets, so the application-level switch is officially supported via a single attribute on `<html>`. **However**, as of build, `@ogcio/theme-govie/dark.css` is byte-identical to `light.css` aside from the selector — gov.ie hasn't published real dark token values yet. To deliver an actually dark appearance we therefore override gov.ie's neutral primitives and gray scale ourselves under `[data-theme="govie-dark"]` in `src/styles/globals.css` (inverted scale: `gray-50` becomes near-black, `gray-950` becomes near-white, `neutral-white` becomes near-black). This is a deliberate, scoped exception to the project rule "never override gov.ie token values" (`CLAUDE.md`, `.cursor/rules/project.mdc`). The exception is constrained to neutral/gray primitives only — brand colours and intent tokens (success, error, warning, info, focus) are untouched, so the gov.ie identity remains intact and gov.ie components flip via their own semantic tokens that already cascade through those primitives. Tailwind utilities like `bg-gray-200` also resolve to the same CSS variables, so they flip together; only `bg-white` needed an explicit utility-level override because Tailwind hardcodes white as a literal. A small `ThemeContext` writes `data-theme` and `color-scheme` on `<html>` and persists the preference in localStorage (`listlens:v1:theme`). First-paint default follows `prefers-color-scheme`. The toggle itself uses gov.ie's `HeaderPrimaryMenu` + `HeaderMenuItemButton` for the built-in tool-item hover/focus styling; sun/moon glyphs are inline SVGs because gov.ie's IconId set doesn't ship them (the smallest possible custom-icon footprint). See `docs/stories/12-theme-switcher.md` for the cuts (no system/auto tri-state, no animation, no tuned per-component dark palette). When gov.ie publishes real dark tokens upstream, this override can be removed in one diff and the project rule restored without changing any consumer code. |

## 10. Appendix — v2 considerations (not in scope, recorded for product-thinking transparency)

Documented to show product thinking beyond v1, and to ensure the v1 component architecture doesn't foreclose them.

- **Swipe-to-delete on mobile.** v1 ships a tap-target delete icon (always-visible on mobile, hover-reveal on desktop) because gov.ie doesn't supply gesture primitives and the icon path is universally understood. Swipe is a credible mobile-feel upgrade for v2.
- **Photo-scanning of paper notes for action-item extraction.** Could realistically fit a service designer's workflow (capture from notebook → digital list), but adds enough scope to v1 to be a distraction this week. The architecture supports a future "additional create-input method" without restructuring.
- **Lightweight categorisation** (e.g. project, admin, training) — would need to integrate with how gov.ie design system handles tag-style components.
- **Persistence** — `localStorage` first, eventually a real backend if multi-device sync is desired.
- **Integration with gov.ie workday tooling** — e.g. surfacing tasks from Microsoft Teams meeting notes via the Graph API. Long-tail v2+ work.
- **Native iOS app** with similar gov.ie design language for use on phones outside work hours.
- **Material Symbols font subsetting.** The Day-1 self-hosted `material-symbols` package ships every Material Symbol — a ~3.9MB woff2 — to make gov.ie's `Icon` API work. The app uses around a dozen glyphs (`list`, `check_circle`, `add_circle`, `edit`, `delete`, `more_horiz`, `arrow_upward`, `arrow_downward`, `visibility`, `visibility_off`, `menu`, `close`). Subsetting to just those glyphs would drop the asset to well under 50kB. Out of scope for the v1 prototype — the full font loads adequately on first paint behind `font-display: block` — but a clear, mechanical optimisation if the prototype ever moved to a higher-traffic context.
