# Stories

> **Owner:** PM / Architect personas · **Status:** Locked + iterated through Day 1 · **Last updated:** Week 1, Day 1 (post-Epic-12)
>
> Eleven epics, numbered by build order. Acceptance criteria are plain bullets. Each story references the relevant section in `architecture.md`, `component-inventory.md`, and `ux-spec.md` rather than duplicating them.

## Reading guide

- Numeric prefix = build order. Don't jump ahead.
- "**AC:**" = acceptance criteria. Every bullet must hold for the story to be done.
- "**Done when:**" = the integration check.
- "**Refs:**" = inventory / architecture / UX sections the implementer should re-read before starting.
- "**Design decisions:**" = the calls embedded in this story, per the training brief's "Design Decisions per story" requirement.

## Index

| Epic | File | Status |
|---|---|---|
| 01 — Foundation | `01-foundation.md` | Required — shipped |
| 02 — Core Actions | `02-core-actions.md` | Required — shipped |
| 03 — Delete & Undo | `03-delete-and-undo.md` | Required — shipped |
| 04 — UI States | `04-ui-states.md` | Required — shipped |
| 05 — Polish | `05-polish.md` | Required — shipped (kept "completed stays in place" per Day-5 decision, later superseded by Epic 11) |
| 06 — Reorder | `06-reorder.md` | Added Day 1 — scope expansion, shipped — see `brief.md` §9 |
| 07 — Reminders-style depth | `07-reminders-features.md` | Added Day 1 — shipped; flag feature surface later removed in Epic 11 |
| 08 — Multiple lists | `08-multiple-lists.md` | Added Day 1 — shipped, with v1→v2 storage migration |
| 10 — Bilingual gov.ie header + i18n | `10-bilingual-header-i18n.md` | Added Day 1 — shipped |
| 11 — Completion-flow tightening | `11-completion-flow-tightening.md` | Added Day 1 — shipped, supersedes Epic-07 flag feature |
| 12 — Theme switcher (light + dark) | `12-theme-switcher.md` | Added Day 1 — shipped, scoped gov.ie token exception (see `brief.md` §9) |

Epic 09 was rolled into Epic 08 during the Day-1 multi-list pass (Clear-completed needed the lists model) and into Epic 11 (Completed smart view), so there is no `09-*.md` file.

## Build-order rule

Foundation → Core → Delete & Undo → UI States → Polish. The polish epic (05) is the integration sweep across everything that came before; running it before then is pointless. Epics 06–12 layer features on top of the polished base.

## What changed since the original draft

- **Photo-scan epic removed entirely.** Cut from v1 scope per the OGCIO-context pivot. Moved to v2 appendix in `docs/brief.md` §10.
- **Day-1 scope expansions** added reorder, notes/filters, multiple lists, bilingual header + i18n, completion-flow tightening, and theme switcher. Each is a separate epic with its own story file; all are logged in `docs/brief.md` §9.
- **Flag feature removed** in Epic 11 (auto-hide-completed replaces the flag-then-filter pattern with a more direct "completed slides out of view" model). All flag-related state, components, translation keys, and stories sections are deprecated.
- **Stories reference gov.ie design system components** where applicable. Most "build a checkbox" / "build a button" / "build an input" stories read "use the gov.ie component," dramatically simplifying implementation.
