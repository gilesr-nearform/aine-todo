# Story 12 — Theme switcher (light + dark)

## Why

Personal-use prototype. The user wants the option to flip the app into a dark
appearance for low-light workdays. Gov.ie design tokens already publish a paired
`[data-theme="govie-light"]` / `[data-theme="govie-dark"]` sheet, so we can opt
into dark mode without touching design-system token values — the rule we agreed
in `docs/brief.md`.

## Scope

- Add a `ThemeContext` (`light` | `dark`) with `localStorage` persistence under
  `listlens:v1:theme`. Default to the user's `prefers-color-scheme` on first
  load; fall back to `light`.
- Set `document.documentElement.dataset.theme` to `govie-light` or `govie-dark`
  on every change so all gov.ie components reflow their CSS variables.
- Add a sun / moon `IconButton` inside `HeaderNext`, right-aligned on the same
  row as the "ToDo" title. The icon flips between `light_mode` and `dark_mode`
  Material Symbols. `ariaLabel` reads "Switch to dark mode" / "Switch to light
  mode" (translated into Gaeilge as well).
- Configure Tailwind's `darkMode` to follow `[data-theme="govie-dark"]` so we
  can add `dark:` variants on the surfaces we authored ourselves (AppShell, the
  list pane, the sidebar background, body text).
- Persist the theme across reloads. Respect `prefers-color-scheme` only on the
  very first run when no preference is stored.

## Cuts

- We do **not** ship per-component dark overrides. Gov.ie's own dark token
  sheet handles components; we only flip the surfaces we authored.
- No system / auto mode UI — the toggle is a binary flip. The OS preference is
  used once, at first paint, as the initial default.
- No animation on the swap.

## Accessibility

- The toggle has a visible focus ring (gov.ie `IconButton` default).
- `aria-pressed` reflects current state.
- Keyboard-reachable via the same tab order as the language toggle.

## Persistence

Stored as `'light'` or `'dark'` in `localStorage` under `listlens:v1:theme`.
Invalid values are ignored. Storage is read once on boot and written on every
change.
