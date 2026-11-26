# Web platform

Load when the stack is a website or web app: mapping tokens in `direct`, writing markup and styles in `build`,
or choosing capture sizes in `review`. Covers browser support, platform-first choices, tokens, layout, overlays,
forms, focus, reduced motion and loading defaults. Web only; Flutter lives in `flutter.md`.

## Browser support policy

| Feature status | Rule |
|---|---|
| Baseline "widely available" | Use it. No fallback, no polyfill. |
| Baseline "newly available" or limited | Use it only as progressive enhancement: detect it (`@supports`, a property check in script), and make sure the screen still works and reads well without it. |
| Project policy recorded in `docs/design/DESIGN.md` | It overrides both rows above (for example a named minimum browser version, or "no fallbacks: internal tool on evergreen browsers"). |

- Check a feature's current Baseline status before relying on it. Statuses move; memory of them goes stale.
- A fallback is the simpler layout or the plain control, not a second implementation of the feature.
- Never add a polyfill or a library to gain a newer feature unless the user approves the dependency.

## Platform-first stop-list

Stop before writing script or adding a library. Check whether the platform already does the job.

| Need | Use | Replaces |
|---|---|---|
| Blocking dialog | `<dialog>` opened with `showModal()`; close buttons inside `<form method="dialog">` | Hand-built modal, focus-trap library, backdrop element, Escape handler |
| Menu, picker, tooltip-like panel | `popover` attribute with `popovertarget` | Toggle state, click-outside listener, z-index stacking |
| Show and hide a section | `<details>` and `<summary>`; a shared `name` makes a one-open-at-a-time set | Accordion script |
| Required, format and length checks | `required`, `type`, `pattern`, `minlength`, `maxlength`, styled with `:user-invalid` | Validation library for simple fields |
| Date, time, colour, range input | The matching `<input type>` | Custom picker, unless the design file records why the native one fails |
| Short suggestion list | `<input list>` with `<datalist>` | Autocomplete widget for small fixed sets |
| Choice from a list | `<select>`, radio group for five options or fewer | Custom dropdown built from generic elements |
| Carousel, paged strip | Scroll container with `scroll-snap-type` and `scroll-snap-align` | Slider library |
| Header or column that stays put | `position: sticky` | Scroll listener |
| Jump to a section | Fragment link, `scroll-margin-top`, `scroll-behavior: smooth` | Scroll script |
| Media that keeps its shape | `aspect-ratio`, `object-fit` | Padding-ratio hack, resize script |
| Defer off-screen images and frames | `loading="lazy"` | Lazy-load library |
| Style a parent from its child's state | `:has()`, `:focus-within` | Class toggling in script |
| Take a region out of use | `inert` | Manual tab-index and `aria-hidden` juggling |
| Brand native checkboxes, radios, ranges | `accent-color` | Rebuilding the control |
| Light and dark | `color-scheme`, `prefers-color-scheme`, tokens | Theme script that flashes on load |
| Dates, numbers, currency, lists | `Intl` formatters | Formatting library |
| Navigate versus act | `<a href>` to go somewhere, `<button>` to do something | Clickable generic elements with handlers |

Newer conveniences (light dismiss through `closedby`, anchor positioning, view transitions, scroll-driven animation, customisable `<select>`, `field-sizing`, `text-wrap: balance`) follow the support policy: enhancement only, unless they have reached "widely available".

A library is justified when the platform control cannot meet a requirement written in the design file (for example a combobox with async search, a data grid with virtual rows). Record the reason in the component inventory.

## Tokens

Three tiers. Components read semantic or component tokens, never primitives, never raw values.

```css
:root {
  color-scheme: light dark;
  /* 1 primitive: the raw palette and scales */
  --blue-600: oklch(0.52 0.19 262);
  --grey-50: oklch(0.98 0 0);
  --grey-950: oklch(0.16 0 0);
  --space-1: 0.25rem; --space-2: 0.5rem; --space-4: 1rem; --radius-2: 0.375rem;
  /* 2 semantic: a role; this tier changes per colour mode */
  --color-surface: var(--grey-50);
  --color-text: var(--grey-950);
  --color-action: var(--blue-600); --radius-control: var(--radius-2);
  /* 3 component: only where a component departs from its role */
  --button-radius: var(--radius-control);
}
@media (prefers-color-scheme: dark) {
  :root { --color-surface: var(--grey-950); --color-text: var(--grey-50); }
}
```

- Spacing steps are multiples of 4. Name tokens by role (`--color-danger`), not by look (`--red`).
- Dark mode redefines the semantic tier only. If the product has a manual switch, mirror the same block under a root attribute such as `[data-theme="dark"]`.
- Tailwind: put the tiers in the theme, not in arbitrary values. Version 4: an `@theme` block in the CSS entry file. Version 3: `theme.extend` in the Tailwind config, pointing at the custom properties. A bracketed one-off value such as `p-[13px]` is a hard-coded value and breaks the token rule.
- An existing token file or component-library theme is the authority. Extend it; do not start a parallel set.

## Layout

| Concern | Rule |
|---|---|
| Component responsiveness | Container queries. Set `container-type: inline-size` on the component's wrapper and adapt with `@container`. The component then works in a sidebar, a grid cell or full width without knowing the page. |
| Page shell | Media queries: navigation form, number of regions, page gutters. |
| Input and preference | Media queries on `pointer`, `hover`, `prefers-color-scheme`, `prefers-reduced-motion`, `prefers-contrast`, `forced-colors`. Screen width says nothing about input type. |
| Full-height regions | Dynamic viewport units: `min-height: 100dvh`. Plain `vh` hides content behind mobile browser bars. Use `svh` when the region must never jump as bars move. |
| Notches and home indicators | `viewport-fit=cover` in the viewport meta, then pad fixed bars and edges with `env(safe-area-inset-*)`, written as `max(1rem, env(safe-area-inset-bottom))` so there is always a minimum. |
| Fluid type (Persuade and Read screens) | `clamp(min, base + viewport or container part, max)` with `rem` bounds, for example `clamp(2rem, 1rem + 4vw, 4rem)`. Keep max at 2.5 times min or less, or zoom can no longer enlarge the text to 200 per cent. Never size text in viewport units alone. |
| Fixed type (Operate screens) | A fixed `rem` scale. Dense tools need predictable sizes; let the layout adapt, not the type. |
| Line length | 45 to 75 characters, aim near 65: `max-inline-size: 65ch` on prose. |
| Direction | Logical properties (`margin-inline`, `padding-block`, `inset-inline-start`) so right-to-left needs no rewrite. |
| Zoom | Never disable it. No `user-scalable=no`, no `maximum-scale=1`. |

- Build mobile-first: base styles for the narrowest layout, then widen with `min-width` conditions.
- Prefer intrinsic layout (`grid` with `minmax()` and `auto-fit`, `flex-wrap`, `gap`) so many screens need no breakpoint at all.
- Wide tables scroll inside their own container, or change form by container query. The page itself never scrolls sideways.

## Breakpoints and the width sweep

- A breakpoint goes at the width where the content breaks: a label wraps badly, a column gets too narrow, a line gets too long. Never at a device's width.
- Find them by widening from 320 until something breaks, fixing it there, and continuing.
- The sweep: resize from 320 to 1440 in steps of 80 px or less, and check 1 px either side of every breakpoint. At each width note horizontal overflow, collisions, clipped or truncated text, orphaned single words in headings, and controls that fall below the touch size.
- Overflow test at each width: the document's `scrollWidth` must not exceed its `clientWidth`.
- 320 must work without sideways scrolling. It is also what a 1280 px window shows at 400 per cent zoom.

## Overlays

| Kind | Use when | Behaviour to keep |
|---|---|---|
| Modal `<dialog>` | The user must answer before continuing | Focus moves in, stays in, and returns to the trigger on close. Escape closes. A visible close or cancel control is always present. Style the dimmer with `::backdrop`. |
| Popover | Transient, non-blocking content: menus, pickers, hints | Light dismiss, normal tab flow, no dimmer. |
| `<details>` | Inline expansion | No overlay at all. Prefer this when content can sit in the page. |

- Do not write a focus trap for a native modal dialog; the browser makes the rest of the page inert.
- A custom overlay (only when the native ones cannot be used) needs `role="dialog"`, an accessible name, `inert` on everything outside it, and focus moved in and restored.
- Dialogs and popovers render in the top layer; do not fight them with z-index. Stop scroll chaining to the page with `overscroll-behavior: contain`.
- Never use the `title` attribute as a tooltip; keyboard and touch users cannot reach it.
- Destructive action: offer undo when the action can be reversed; show a confirming dialog only when it cannot.
- Status messages that need no answer go in a `role="status"` region, not a dialog.

## Forms

| Field | `type` | `inputmode` | `autocomplete` |
|---|---|---|---|
| Email | `email` | `email` | `email` (or `username` on sign-in) |
| Phone | `tel` | `tel` | `tel` |
| Current password | `password` | none | `current-password` |
| New password | `password` | none | `new-password` |
| One-time code | `text` | `numeric` | `one-time-code` |
| Card number | `text` | `numeric` | `cc-number` |
| Postcode | `text` | `numeric` only where codes are digits | `postal-code` |
| Full name | `text` | none | `name` |
| Street address | `text` or `<textarea>` | none | `street-address` |
| Search | `search` | `search` | `off` only if suggestions would mislead |
| Web address | `url` | `url` | `url` |
| Quantity | `number` | `numeric` or `decimal` | none |

- Every control has a visible `<label>` tied to it with `for` and `id`. A placeholder is a hint, never the label.
- Labels sit above text fields; they follow checkboxes and radios on the same line.
- Use `type="number"` only for true quantities. Codes, card numbers and postcodes lose leading zeros and gain spinners.
- One field per value. Do not split a code, a phone number or a card number across auto-advancing boxes.
- Never block paste, and never switch off autofill on credential, address, payment or contact fields.
- Set `enterkeyhint` to match the next step. Turn off autocorrect and autocapitalise on identifiers (usernames, emails, codes), not on prose.
- Control text is at least 16 px (`font-size: max(1rem, 16px)`), or iOS zooms the page on focus. Set `font: inherit` on controls.
- Validation timing follows `interactions.md`. On the web: style with `:user-invalid`, not `:invalid`; set `aria-invalid` and link the message with `aria-describedby`; on a failed submit, move focus to the first invalid field or an error summary.
- Keep the submit button enabled so the user can learn what is missing. Disable it only after a valid submit, to stop a double send.
- Group related controls in `<fieldset>` with a `<legend>`. Mark required fields in the label text as well as with `required`.

## Focus styles

- Style `:focus-visible`, not `:focus`. Use `outline` with `outline-offset`; it survives forced-colours mode where a shadow does not.
- The indicator contrasts at least 3:1 with what is next to it, in every colour mode.
- Never write `outline: none` without an equal replacement in the same rule.
- Tab order is DOM order. No positive `tabindex`. Do not reorder visually with `order` or reversed flex direction.
- Sticky headers must not cover the focused element: set `scroll-padding-top` to the header height.
- Add one skip link to main content when a page repeats a navigation block.
- Interactive targets are never under 24 by 24 CSS px; on coarse pointers use the touch size set in `foundations.md` (44 px or more).
- Hover styles go inside `@media (hover: hover)`. Nothing is reachable by hover alone.

## Reduced motion

Reduced motion means fewer and gentler, not none. Remove travel, scale, parallax and autoplay; keep short opacity changes so state changes are still visible.

```css
.sheet { transition: transform 280ms var(--ease-out), opacity 280ms var(--ease-out); }
@media (prefers-reduced-motion: reduce) {
  .sheet { transition: opacity 120ms linear; transform: none; }
}
```

- Never ship a global rule that zeroes every duration. It destroys feedback and breaks code waiting on transition events.
- Under the reduce setting also drop smooth scrolling, looping decoration and autoplaying video. Durations and curves come from tokens (`interactions.md`).

## Core Web Vitals defaults

Targets at the 75th percentile: Largest Contentful Paint 2.5 s or less, Interaction to Next Paint 200 ms or less, Cumulative Layout Shift 0.1 or less.

| Area | Default |
|---|---|
| Image dimensions | Every `<img>`, `<video>` and `<iframe>` has `width` and `height` (or a CSS `aspect-ratio`) so space is reserved before it loads. |
| Largest image | Present in the HTML, not injected by script; `fetchpriority="high"`; never lazy-loaded. Use high priority on one resource only. |
| Other images | `loading="lazy"` below the fold; `srcset` with `sizes`; modern formats through `<picture>` with a fallback. |
| Fonts | WOFF2, subset, self-hosted where possible. Preload only the one or two files used above the fold, with `crossorigin`. Choose a `font-display` that shows text at once, and tune the fallback face's metrics so the swap does not move the layout. |
| Late content | Reserve its space: skeletons the size of the real content, `min-height` on async regions. Never insert banners or results above content the user is already reading. |
| Animation | Animate `transform` and `opacity`. Animating size or position properties shifts layout. |
| Script | `defer` or module scripts; third-party scripts last. Show a visual response to input at once, then do heavy work in chunks under 50 ms. |
| Long pages | `content-visibility: auto` with `contain-intrinsic-size` on heavy off-screen sections; not on short pages, not above the fold. |

## Capture sizes

| Capture | Size | Purpose |
|---|---|---|
| Desktop | 1440 wide | Full shell, widest layout |
| Tablet | 768 wide | Middle layout, touch |
| Phone | 390 wide | Narrow layout, touch |
| Overflow check | 320 wide | No sideways scroll, nothing clipped |

- Take every capture in each colour mode the product supports.
- Settle or switch off entrance motion first. Capture with real content and the state under review on screen.
- Read the console in the same round. Validity rules and the full capture list are in `review.md`.

The brief or the project's design system overrides any default here.
