## Epic 10 — Bilingual gov.ie branding bar and Gaeilge toggle

> Fourth scope expansion past the official training PRD. The app now adopts the gov.ie two-bar header pattern (light branding bar with Rialtas na hÉireann / Government of Ireland + harp + language toggle, dark bar below with site name) and gains a working Irish/English language switch for all built-in UI strings. Logged in `brief.md` §9.
>
> **Shipped:** light-green branding bar with bilingual identity, language toggle, in-house i18n layer, Gaeilge translations for every UI string the app controls, persisted language preference, localised date formatting.
>
> **Cuts inside this epic** (each named so the decision is auditable):
>
> - **gov.ie component-internal strings stay in English.** The gov.ie package ships an `initI18n` helper backed by i18next, but it is not exposed via the public package exports (`@ogcio/design-system-react/i18n` is not in their `exports` field, only `.` / `./styles.css` / `./icons` / `./logos`). Reaching it would require a deep import that bypasses the supported entry points. Strings like the search input's "Clear input", drawer's "Close menu" placeholder, etc. therefore stay in English. Future Epic candidate.
> - **No new dependencies.** Specifically no `i18next` / `react-i18next` install. The architecture rule is "no new dependencies without checking `docs/architecture.md`"; with only ~80 strings, a custom React Context + dictionary is cheaper to maintain than the i18next ceremony.
> - **No language detection from `navigator.language`.** Default is English; user explicitly opts into Gaeilge via the toggle. Persisted in localStorage.
> - **User content is never translated.** Task descriptions, notes, and user-defined list names are user data. A migration option to translate the default "Tasks" list name on switch was considered and rejected: once the list exists, it belongs to the user.
> - **Grammatical complexity in Gaeilge** (séimhiú/eclipsis on proper nouns inside templates like "Add a task to {list}", noun-case agreement in counts) is handled with reasonable defaults, not a full grammatical engine. Strings read naturally but may not be perfectly inflected in every edge case. A Gaeilge-fluent reviewer is the right next step if this ever leaves the prototype.
> - **No RTL / no plural rules engine.** Gaeilge has plural forms (tasc / tascanna / dtasc); we use the most common form in each template rather than building a plural-rule engine.

---

## 10.1 — Two-bar gov.ie header pattern

As a citizen-facing service, I want the standard gov.ie two-bar header — a thin utility strip with the language switcher above the main green masthead carrying the bilingual identity — so the app matches the pattern used across `gov.ie` and OGCIO prototypes (reference: `dashboard-prototype/index.html`).

**AC:**

- A new `<GovieBranding>` component renders a **thin utility strip** above `<HeaderNext>`.
- The strip uses gov.ie *primary-subtle* (`#006658` — a slightly lighter shade of the main green, not a pale tint), with white text.
- Strip contents are right-aligned: a single language toggle styled as an underlined link/button. When active is English it reads `Gaeilge`, when active is Gaeilge it reads `English`. Clicking switches the language.
- Accessible name on the toggle is the action (`Switch to Gaeilge` / `Athraigh go Gaeilge`); the visible label is just the destination language name.
- The strip hides on very narrow screens (≤540px in the gov.ie reference); we keep it visible for now since the toggle is the only control.
- The masthead below uses gov.ie's existing `HeaderNext` (default green variant) and now renders `LogoWhite` (the full bilingual harp + "Rialtas na hÉireann / Government of Ireland" SVG) instead of `LogoHarpWhite` (harp-only).

**Refs:** `brief.md` §9; `ux-spec.md` §3; `../../ogcio/dashboard-prototype/index.html` (canonical pattern reference).

**Design decisions:**

- **Bilingual identity lives in the SVG, not in DOM text.** `LogoWhite` from `@ogcio/design-system-react/logos` is the equivalent of `assets/logos/gov-white.svg` in the reference: harp + "Rialtas na hÉireann" + "Government of Ireland" baked into one accessible image with a localised `label` prop. Recreating the text as separate DOM nodes (as the previous attempt did) duplicates what the SVG already provides and risks drifting from the official asset.
- **Two shades of the same green, not a light/dark contrast.** The reference uses `#006658` for the strip and `#004d44` (gov.ie primary, the HeaderNext default) for the masthead. The first attempt used Tailwind `bg-green-100` which read as a separate pale colour rather than a tonal step inside the gov.ie palette.
- **Toggle shows the destination language, not the current.** Standard language-switcher pattern.

---

## 10.2 — In-house i18n layer

As the maintainer, I want a tiny i18n primitive that doesn't pull in i18next, so the bundle stays light and the API stays simple.

**AC:**

- New module `src/i18n/translations.ts` exports a `translations` const with two locales: `en` and `ga`. Every UI string the app controls has an entry under each.
- New module `src/i18n/I18nContext.tsx` exports `<I18nProvider>` and `useT()`. The provider holds the current language in state, persists it to `localStorage` under `listlens:v1:lang`, and exposes a setter.
- `useT()` returns a function `t(key, vars?)` that performs the dictionary lookup and `{var}` interpolation. Type-safe: `key` is `keyof typeof translations.en`.
- Switching language re-renders the whole app via context (i.e. the I18nProvider wraps everything below it). No imperative re-mount required.
- Falls back to English if a key is missing in Gaeilge (developer guard).
- Date helpers consume the current language: `formatCreatedAt` accepts an optional `locale` argument and chooses `en-IE` / `ga-IE` accordingly.

**Refs:** `architecture.md` §4 (new orthogonal state slice — not in `AppState` because language is presentation, not domain).

**Design decisions:**

- **Separate context from `TodosContext`.** Language belongs to the presentation layer, not the todos reducer. Adding it to `AppState` would force every reducer test to thread language through.
- **No async loading.** Translations are bundled at build time. The whole pair is ~6KB, immaterial.
- **`localStorage` key versioned (`v1`).** Future schema changes can bump it.

---

## 10.3 — Translate every UI string the app owns

As a Gaeilge speaker, I want every label, button, placeholder, status message, aria-label, confirm dialog, and timestamp to switch to Irish when I toggle the language, so the experience feels coherent.

**AC:**

- Every visible English string written by this codebase is wired through `t()`. Spot-checked: sidebar headings, list names heading, summary row, controls, input bar, edit row labels, error/empty/no-matches states, undo toast, confirm dialogs, header labels, all aria-labels and visually hidden labels.
- Timestamps use `formatCreatedAt(date, locale)` with the active locale, producing `curtha leis ag 15:18` / `curtha leis ar 14 Beal, 15:18` when active is Gaeilge.
- The known limitation (gov.ie component-internal strings) is documented in the file header of `src/i18n/translations.ts` and in this story.

**Refs:** every component file.

**Done when:** Clicking the language toggle on the branding bar visibly switches every app-owned string between English and Gaeilge, the choice persists across reload, and the only English remaining is in gov.ie component-internal labels (search "Clear input", drawer "Close").

---

## Epic 10 done when

The app wears the bilingual gov.ie identity from the moment it loads, and a single click toggles every string the codebase controls between English and Irish. The cuts (gov.ie internals, no library) are visible in this spec rather than silent.
