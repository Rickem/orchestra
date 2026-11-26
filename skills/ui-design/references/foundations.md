# Foundations

Load when designing tokens in `direct`, laying out or styling a screen in `build`, or checking
layout, type, colour and accessibility in `review`. Covers layout order, spacing, type, colour,
token tiers, radius, elevation and the accessibility numbers. Token syntax lives in `web.md` and `flutter.md`.

## Layout: outside-in

Decide the frame before the content. A screen built from the inside out ends with regions sized by accident.

1. **Shell.** Name the regions: navigation, header, main, supporting panel, footer or bottom bar. State which are fixed, which scroll, and which collapse first when space runs out.
2. **Region widths.** Give each region a width rule: fixed, a minimum and maximum, or the remainder. Cap the main region so text and forms never stretch to the window edge.
3. **Grid inside the region.** Set columns, gutters and the alignment edges that repeat down the screen.
4. **Groups.** Place groups of content on the grid. Order them by product priority, not by what the framework offers.
5. **Content.** Fill each group with real copy and realistic data lengths last.

Rules:

- One region carries the primary task and gets the strongest hierarchy. One primary action per action group.
- Squint test: with detail blurred, the primary element, the secondary element and the main groups must still be identifiable, in that order.
- Group by proximity and alignment first. Add a container, divider or background only when space alone fails.
- Reflow is structural: decide what reorders, stacks, collapses or scrolls at narrow widths. Reading order and focus order must still agree with visual order.
- Size components against their container, not the window, when the same component appears in regions of different width.
- Check the frame with long content, empty content and an open overlay before detailing anything.

## Spacing

Base unit 4. Every space is a step on one scale; no one-off values.

Suggested scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.

| Tier | Joins | Typical steps | Choose it when |
|---|---|---|---|
| Within a component | Icon and label, label and field, lines of one item | 4 to 12 | The parts are read as one thing. |
| Between components | Fields in a form, items in a list, cards in a grid, control groups | 16 to 24 | The parts are peers within one group. |
| Between sections | Distinct concerns on a screen, page regions | 32 to 96 | The parts answer different questions. |

How to choose:

- Ask what relationship the gap expresses, then take a step from that tier. Related things sit closer than unrelated things.
- Each tier is visibly larger than the one below it. If two tiers use the same step, the hierarchy is flat.
- Vary on purpose: one gap repeated everywhere gives every element equal weight. Contrast tight and generous intervals.
- Padding inside a container is at least the largest gap between its children, so the content does not look closer to the edge than to itself.
- Density (the dial) shifts the whole scale up or down a step. It does not remove a tier.
- Helper text, validation messages and optional actions stay attached to what they serve when they appear. Reserve their space or let the group grow; do not let them break the rhythm.
- Controls in one row share an apparent height and a baseline. A control may look compact and still keep a larger hit area.

## Type

Use roles, not sizes. Text takes the role that matches its job.

| Role | Job | Notes |
|---|---|---|
| Display | The single loudest statement on a Persuade or Experience screen | Rare on Operate screens. |
| Heading | Page title and section titles; two or three levels | Each level clearly outranks the next. |
| Body | Running text and primary content | About 16 px or the platform default; never the smallest role. |
| Label | Controls, field labels, table headers, compact data | Stays attached to its control or value. |
| Caption | Supporting and secondary text, metadata | Quieter than body but still readable; must not look disabled. |
| Mono | Code, identifiers, aligned figures | Only where the content needs it. Use tabular figures for columns of numbers. |

Scale:

- Pick a ratio and derive the steps; do not collect sizes. About 1.2 to 1.25 suits dense product UI; about 1.25 to 1.5 suits marketing and editorial.
- Adjacent roles must differ visibly. Use size, weight, space and tone together; steps that differ by a pixel or two carry no hierarchy.
- **Operate screens: a fixed scale.** Sizes do not change with window width, so dense layouts stay predictable. Example steps: 12, 14, 16, 20, 24, 32.
- **Persuade and Read screens: fluid sizing.** Display and heading sizes scale between a minimum and a maximum with the available width. Define both ends in units that respect the user's text setting, keep the maximum within about 2.5 times the minimum, and leave body text near its base size.
- Use the fewest families and weights that make the hierarchy plain. A second family needs a job only it can do. An existing brand typeface wins.

Reading:

- Line length 45 to 75 characters, aiming for about 65. Constrain the text block; do not let it grow with the window.
- Line height: about 1.5 for body, tighter (1.1 to 1.3) for large headings. Longer lines need more; light text on dark needs slightly more.
- Never lock the height of an element that holds text. Let content set it, with a minimum if needed.
- Avoid justified text, long runs of capitals and emphasis on everything.

## Colour

Strategy before palette. Decide these in words before choosing any value:

- **Temperature and tone**: what the product should feel like in use, from the audience and the screen's job. Never from a product-category association.
- **Dosage**: how much of the screen is coloured. Restrained (neutral surfaces, one accent) to immersive (colour owns regions). Operate screens usually sit at the restrained end so that colour stays free to mean action and status.
- **Where the strongest colour lives**: one role or region. Do not spend the primary colour on decoration.
- **Contrast range**: how far apart surfaces and text sit.

Then build roles, not swatches:

| Role | Purpose |
|---|---|
| Surface | Backgrounds: page, raised container, overlay. A short ladder of steps, each distinguishable from the next. |
| On-surface | Text and icons on a surface: primary, secondary, disabled. Chosen as a pair with its surface, never alone. |
| Primary | The main action, selection and focus. Has its own on-primary colour. |
| Status | Success, warning, error, information. Each needs a quiet form (tinted surface plus text) and a solid form (fill plus contrasting content). |
| Border | Separators, container edges, and a stronger step for form-control outlines. |

Rules:

- A foreground colour is only valid against a named background. Check every pair that actually occurs, in every state.
- Hover and pressed states tint the existing surface; they do not swap it for an unrelated block.
- Secondary text and disabled text must be distinguishable from each other.
- Neutrals may carry a hint of the brand hue when it helps cohesion. Plain grey is acceptable.
- Follow platform and domain conventions for status hues.
- **Never colour alone.** Status, selection, errors, links in text and data series each need a second cue: icon, label, shape, weight, underline, pattern or position.
- Gradients, glows and glass are allowed only where they carry meaning, not as decoration.

Light and dark come from the use scene, not from taste:

- Ask where and when the product is used: ambient light, session length, what surrounds the screen, whether the content is itself imagery or data.
- Support both modes when users will reasonably expect it; then design each one. Do not invert the light theme mechanically.
- In dark mode, raise surfaces by making them lighter, reduce saturation of large fills, and re-check every contrast pair.
- Switching mode remaps semantic roles. Component code does not change.

## Tokens in three tiers

| Tier | Holds | Named by | Example | Used by |
|---|---|---|---|---|
| Primitive | Raw values: colour ramps, the spacing scale, sizes, radii, durations | What it is | `blue-600`, `space-4` | Semantic tokens only |
| Semantic | A role mapped to a primitive | What it is for | `surface-raised`, `on-surface-secondary`, `border-control`, `space-group` | Screens and components |
| Component | One component's part mapped to a semantic token | Component and part | `button-primary-bg`, `card-padding` | That component only |

Rules:

- **Built UI uses tokens only.** No hard-coded colour, spacing or radius value in a screen or component. A value that seems to need hard-coding is a missing token or a wrong design.
- References point one way: component to semantic to primitive. Screens never reach for a primitive.
- Themes and colour modes change the semantic mapping. Primitives and component code stay still.
- Name semantic tokens by purpose, never by value. `text-danger`, not `red-text`.
- Build role ladders, not single tokens: emphasis steps for each paint property (text, icon, background, border), so a quieter or stronger variant exists without inventing a value.
- Add a component token only when a component departs from the semantic default. Do not mint a token for every value.
- Extract a new token or shared component once the same value or pattern is used three times with the same intent. Similar looks with different intent stay separate.
- Tokens cover: colour roles, type roles, spacing, radius, elevation, motion durations and curves.

## Radius, elevation and edges

**Radius.**

- Radius follows role: inner content, control, container, page region, fully round. A handful of steps is enough.
- Nested corners are concentric: **inner radius = outer radius minus the padding between them**. Where the result reaches zero or below, use a square or minimal corner.
- Set the product's overall sharpness once, through the tokens. Do not round isolated elements differently.
- Accents follow the shape. A thick stripe down one side of a rounded container fights its corners; use a full border or a tint.
- Focus and selection rings trace the shape of the element they belong to.

**Elevation.** Few levels, each with a job:

| Level | Used for |
|---|---|
| 0 | The page and anything resting on it |
| 1 | Raised containers; sticky headers and bars once content scrolls beneath |
| 2 | Menus, popovers, tooltips |
| 3 | Dialogs and drawers, over a scrim |
| 4 | Transient messages above everything |

- What looks higher must be higher: it covers lower content and is not clipped by a lower container.
- Keep depth quiet. A shadow that draws attention is too strong.
- Focus and validation rings are state, not depth. They must not read as a shadow.
- Boundaries must survive without shadows: dark mode and high-contrast settings weaken or remove them.

**One edge language.** Each surface has one primary boundary: a defined edge (border or tonal step) or soft elevation (shadow). Choose one for the product's resting surfaces and hold to it. Do not add a border and a shadow to the same surface by reflex. Combine them only as a recorded decision, with one of the two kept faint.

## Accessibility numbers

| Check | Minimum |
|---|---|
| Text contrast | 4.5:1 against its actual background |
| Large text contrast (24 px and up, or about 19 px bold) | 3:1 |
| UI components: control boundaries, icons, focus indicators, state indicators | 3:1 against adjacent colours |
| Target size, web | 24 by 24 px minimum; 44 by 44 px comfortable, and the default for touch |
| Target size, iOS | 44 by 44 pt |
| Target size, Android | 48 by 48 dp, with about 8 dp between targets |
| Reflow | Usable at 320 px wide with no horizontal scrolling of the page |
| Text scaling | Text resizes to 200% with no loss of content or function; the layout honours the system text-size setting |

- Measure contrast; do not judge it by eye. Check text over images and gradients at the worst point, and check hover, selected, disabled and error states in every colour mode.
- A small visible mark can keep a full-size target: extend the hit area, not the glyph.
- Text scaling breaks fixed heights, single-line assumptions and truncation first. Test them.
- Focus is always visible, and the indicator meets the 3:1 component contrast.
- These are floors. Meeting them does not prove the screen is usable.

The brief or the project's design system overrides any default here.
