# Story 12 — Theme switcher (light + dark)

## Why

Personal-use prototype. The user wants the option to flip the app into a dark
appearance for low-light workdays. Gov.ie publishes paired
`[data-theme="govie-light"]` / `[data-theme="govie-dark"]` selector sheets, so
the application-level switch is officially supported via a single attribute on
`<html>`.

**Important caveat:** as of this writing, `@ogcio/theme-govie/dark.css` is
byte-identical to `light.css` aside from the selector. Gov.ie hasn't published
real dark token values yet. To actually deliver a dark appearance we have to
override gov.ie tokens ourselves under the `[data-theme="govie-dark"]` selector.
This is a scoped, deliberate exception to the project rule "never override
gov.ie token values" (`docs/brief.md` decision log entry, Epic 12). The
override is constrained to:

- The neutral primitives (`--gieds-color-neutral-white`, `--gieds-color-base-white`)
- The gray scale (`--gieds-color-gray-50` … `--gieds-color-gray-950`), which
  semantic surface/text/border tokens cascade through

Brand colours (greens, blues, reds, etc.) and intent tokens are untouched, so
the gov.ie identity remains intact.

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
- Invert the neutral primitives and gray scale under `[data-theme="govie-dark"]`
  in `src/styles/globals.css` so both gov.ie semantic tokens and our Tailwind
  utilities (`bg-gray-200`, `text-gray-700`, etc., which resolve to the same
  CSS variables) flip together. Add a single utility-level override for
  `.bg-white` because Tailwind hardcodes white as `#ffffff`, not a variable.
- Persist the theme across reloads. Respect `prefers-color-scheme` only on the
  very first run when no preference is stored.

## Cuts

- No per-component, fully designed dark palette — the scale inversion gets us
  a competent dark surface set without inventing a parallel design system.
- No system / auto mode UI — the toggle is a binary flip. The OS preference is
  used once, at first paint, as the initial default.
- No animation on the swap.
- Brand colours and intent tokens (success, error, warning, info, focus) are
  deliberately not touched. If a future iteration wants tuned dark variants of
  the gov.ie green, that's a separate decision.

## Accessibility

- The toggle has a visible focus ring (gov.ie `IconButton` default).
- `aria-pressed` reflects current state.
- Keyboard-reachable via the same tab order as the language toggle.

## Persistence

Stored as `'light'` or `'dark'` in `localStorage` under `listlens:v1:theme`.
Invalid values are ignored. Storage is read once on boot and written on every
change.
