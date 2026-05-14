# Stories

> **Owner:** PM / Architect personas · **Status:** Locked for week 1 · **Last updated:** Week 1, Day 0
>
> Five epics, numbered by build order. Acceptance criteria are plain bullets. Each story references the relevant section in `architecture.md`, `component-inventory.md`, and `ux-spec.md` rather than duplicating them.

## Reading guide

- Numeric prefix = build order. Don't jump ahead.
- "**AC:**" = acceptance criteria. Every bullet must hold for the story to be done.
- "**Done when:**" = the integration check.
- "**Refs:**" = inventory / architecture / UX sections the implementer should re-read before starting.
- "**Design decisions:**" = the calls embedded in this story, per the training brief's "Design Decisions per story" requirement.

## Index

| Epic | File | Stories | Status |
|---|---|---|---|
| 01 — Foundation | `01-foundation.md` | 4 | Required |
| 02 — Core Actions | `02-core-actions.md` | 3 | Required |
| 03 — Delete & Undo | `03-delete-and-undo.md` | 4 | Required |
| 04 — UI States | `04-ui-states.md` | 4 | Required |
| 05 — Polish | `05-polish.md` | 4 | Required |
| 06 — Reorder | `06-reorder.md` | 1 | Added Day 1 — scope expansion, see `brief.md` §9 |

## Build-order rule

Epic 1 → Epic 2 → Epic 3 → Epic 4 → Epic 5. No interleaving. The polish epic (05) is the integration sweep across everything that came before; running it before then is pointless.

## What changed since the previous draft

- **Photo-scan epic removed entirely.** Cut from v1 scope per the OGCIO-context pivot. Moved to v2 appendix in `docs/brief.md` §10.
- **Stories reference gov.ie design system components** where applicable. Most "build a checkbox" / "build a button" / "build an input" stories now read "use the gov.ie component," dramatically simplifying implementation.
