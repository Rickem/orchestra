# Direction

Load when classing screens, setting dials, or writing and testing a design direction in `direct` mode.
Also load for the self-check pass in `build` and the distinctiveness check in `review` (anti-slop list).
For a small change that follows an existing `docs/design/DESIGN.md`, read section 5 only.

## 1. Surface modes

Class every screen by the job it does for the person in front of it. Never class by product category: a developer tool's landing page is Persuade; a fashion brand's help centre is Read. One product usually holds several modes.

| Mode | The screen's job | Typical screens | Density | Type | Motion |
|---|---|---|---|---|---|
| Persuade | Make someone understand an offer and act | Marketing, landing, pricing, onboarding pitch | Low to mid; one idea per view | Display and body roles with clear contrast; a face with a point of view is welcome | May carry one authored moment; never hides the offer or the action |
| Operate | Let someone finish a task | Dashboards, tools, settings, forms, tables | Mid to high; scanning beats atmosphere | One workhorse family is often enough; fixed scale with small steps; no display faces in labels or data | Short, state-driven only: feedback, reveal, loading. No entrance choreography |
| Read | Let someone understand something | Articles, docs, guides, changelogs | Low to mid; line length 45 to 75 characters, aim near 65 | Body text is the design; wayfinding (headings, contents, position) comes second | Close to none; nothing moves under the reader |
| Experience | Put someone inside the work itself | Showcase, portfolio, immersive, playful | Whatever the work needs; chrome recedes | Type supports the work or is the work | Can lead, if it is the piece's own behaviour and can be interrupted |

Rules:

- State the mode per screen in the Surface modes table of `docs/design/DESIGN.md`. A screen with two jobs is split or given one primary job.
- Operate screens earn trust through familiarity: standard navigation, standard controls, the same component looking the same everywhere. Strangeness without a purpose is the failure there, not plainness.
- Persuade and Experience screens have permission for bolder colour and layout. Take it only when the brief supports it.

## 2. The three dials

Set each from 1 to 10, per product, with a one-line reason drawn from the design read. A mode may shift a dial for its screens; say so. The user can change any value in conversation.

| Dial | 1 to 3 | 4 to 7 | 8 to 10 |
|---|---|---|---|
| Design variance (how far layout departs from a regular grid) | Symmetric, even columns, predictable alignment | Deliberate offsets: uneven column weights, mixed media proportions, one broken alignment per view | Strongly asymmetric: large empty zones, overlapping layers, irregular grids |
| Motion intensity (how much moves, and how far) | Still. Only immediate feedback on press, focus and state change | Short transitions between states, light staggered entry on key content | Choreographed: scroll-linked or gesture-linked sequences, shared-element transitions, physics |
| Visual density (how much sits in one view) | Airy: large gaps, one focus per view | Everyday app spacing | Packed: tight padding, separators instead of boxes, aligned tabular numerals |

Dial rules:

- High variance collapses to one column on narrow windows. Asymmetry is a wide-window privilege.
- A motion value above 3 is a promise: the build must actually move, and must honour the reduced-motion setting (fewer and gentler, short cross-fades kept). If working motion cannot be delivered in scope, lower the dial.
- Density above 7 removes card boxes. Group with space and hairlines.
- Dials describe intensity only. They never choose the look.

### Presets

Starting points. Adjust from the design read and state the change.

| Preset | Fits | Variance | Motion | Density |
|---|---|---|---|---|
| Restrained product UI | Operate screens by default: tools, settings, forms, admin | 2 to 3 | 2 to 3 | 6 to 7 |
| Dense data tool | Operate screens used all day by experts: monitoring, trading, operations | 2 | 2 | 8 to 9 |
| Everyday consumer app | Operate screens used briefly and often, mostly on a phone | 3 to 4 | 4 | 4 to 5 |
| Trust-first service | Public, regulated or accessibility-critical flows | 2 to 3 | 2 | 4 to 5 |
| Mainstream marketing | Persuade screens for a broad audience | 5 to 6 | 4 to 5 | 3 to 4 |
| Expressive marketing | Persuade screens where the brief asks for a strong voice | 7 to 8 | 6 to 7 | 3 |
| Long-form reading | Read screens | 3 to 4 | 1 to 2 | 3 |
| Showcase | Experience screens | 8 to 9 | 7 to 9 | 2 to 3 |
| Refinement of an existing design | Any | Match what exists | Match what exists | Match what exists |

"Restrained product UI" is a full preset, not a fallback. It means: neutrals plus one accent kept for the primary action, current selection and state; one type family; fixed type scale; rows and tables before cards; motion only for state. Brand lives in precise details.

## 3. What a direction contains

A direction is complete only when every field is filled with a decision.

| Field | Write |
|---|---|
| Thesis | One sentence: the idea this product's interface owns, and the category default it accepts or refuses |
| First screen or viewport | Concretely what is where, at what relative size, and where the primary action sits. Specific enough to sketch from |
| Colour strategy | The strategy before the colours: restrained (neutrals plus one accent), committed (one colour carries large regions), full palette (three or four named roles), or drenched (the surface is the colour). Then the roles |
| Type roles | Named faces and which role each plays (display, body, UI label, data). State the reason for each face |
| Layout approach | Shell, regions, grid behaviour, how it changes between narrow and wide windows |
| Signature element | One thing that makes the product recognisable with the logo removed. One, not five |
| Use scene | One sentence of physical scene: who, where, on what device, under what light. This sentence decides light, dark or both. Never decide it from the category |
| Costs and gains | What this direction makes easy, what it makes hard or expensive, and its honest risk |

Operate default: restrained colour strategy. Persuade and Experience may take a bolder one when the brief allows.

## 4. Two tests

Run both on every direction before showing it.

**Mood test.** Read each line. If it describes a feeling and could be built ten different ways, it is not a decision. Rewrite until a builder could not misread it.

| Vague | Decided |
|---|---|
| "Clean, modern and trustworthy, with a calm palette." | "Off-white ground. One deep green, used only for the primary action, the current selection and success. One sans family at five fixed sizes. Records in rows split by hairlines. Shadows on overlays only." |
| "Bold, energetic hero." | "First view: the headline at the largest scale step, left-aligned, over a full-width working demo of the product. One action, bottom left of the text block. No secondary button." |

**Category test.** Cover the product name and ask: could someone guess this look from the product category alone? Or from the category plus "the opposite of the usual"? If yes to either, rework it from the audience, the screen's job and the use scene.

- Name the category default in one line, so it can be consciously accepted or refused. Accepting it is legitimate when familiarity serves the user (common on Operate screens); write down that it was a choice and why.
- A memory check helps: if someone left after one view, what would they describe an hour later? "A mood" means the direction has not committed.

## 5. Anti-slop list

None of these is banned. Each is a default that generated interfaces reach for without deciding. When one appears, either state the reason it belongs here or use the replacement. The brief or the design system can earn any of them back.

### Layer 1: cluster looks

Whole looks that appear regardless of subject.

| Look | Replace with |
|---|---|
| Purple-to-blue gradient, centred headline over a dark blurred mesh, three equal feature cards | A first view that shows the product doing its job; colour derived from the brand or the use scene |
| Warm cream ground, high-contrast serif display with italic accents, terracotta or red accent | The subject's own material range; cream and serif only when the brief names them |
| Near-black ground, one neon accent, glowing edges | Dark only if the use scene calls for it; depth from layered neutrals, accent used for state |
| Broadsheet pastiche: hairline rules everywhere, italic serif display, tiny tracked capitals in a mono | Editorial structure only on Read screens that carry real editorial content |
| Frosted-glass panels on everything | Opaque surfaces; blur only where it signals a dismissible layer over live content |
| The metric dashboard: a row of big-number tiles, each with a small label and a tiny trend line | Lead with the one figure the user acts on; put the rest in a table or rows |

### Layer 2: reflex defaults

Single choices made without a reason.

| Reflex | Replace with |
|---|---|
| Fonts from the reflex list: Inter, Space Grotesk, DM Sans, Plus Jakarta Sans, Outfit, Playfair Display, Fraunces, IBM Plex, a mono as "technical" voice | An existing brand font always wins. Otherwise: platform or workhorse faces are fine on Operate and Read screens without apology; on Persuade and Experience screens, pick a face for a stated reason no other face meets. "Bookish means serif" and "technical means mono" are not reasons. Any listed face is allowed with a stated reason |
| Gradient as background, on text, or on buttons | Flat colour roles; emphasis by weight and size. A gradient only when it carries meaning (a data scale, a real light source in an image) |
| Glow or coloured halo around elements | Elevation by a soft offset shadow or a surface step; glow only for a true "live" or "active" state |
| Glass or blur as decoration | Blur only to show that a background is still there and can be returned to |
| Light or dark chosen by category ("developer tool, so dark") | Decide from the use scene sentence |
| Cards as the page structure; equal cards of icon, heading and text | Rows for records. Cards only for self-contained widgets. Never a card inside a card; group inside a card with space or a hairline |
| Centred hero by habit | Alignment chosen from content length and the variance dial |
| A dialog as the first answer | Inline editing, a side panel, or a new screen; a dialog only when focus must be protected |
| Oversized headline to create importance | Hierarchy from weight, colour role and space before raw size |
| Identical entrance animation on every section | One authored moment, or none; motion tied to a state change |
| Bounce or elastic easing | Decelerating ease-out; platform spring curves where the platform expects them |
| Small label ("eyebrow") above every heading; section numbers 01, 02, 03 | Let the heading stand alone; number only when order is information |

### Layer 3: mechanical tells

Small giveaways. Fix on sight.

| Tell | Replace with |
|---|---|
| Thick coloured stripe down one edge of a card, row or alert | A status icon with text, or a tinted surface from the semantic colour role |
| Emoji or text glyphs used as icons | One icon set, one stroke weight |
| Pure black on pure white | Off-black and off-white from the neutral ramp, contrast still at or above the accessibility floor |
| Grey text on a coloured surface | Text tinted from that surface's hue or from the foreground colour |
| Placeholder people and brands ("John Doe", "Acme"); round numbers (50%, 99.99%) | Real copy from the brief; where sample data is unavoidable, plausible uneven values labelled as sample. No invented facts |
| Filler verbs ("elevate", "seamless", "unleash") | A concrete verb and object: what the product does |
| Tiny charts, rings and rounded blocks standing in for content | The actual content, or nothing |
| Hard zero-blur offset shadows outside a deliberately brutalist direction | The elevation tokens |
| Mono type for non-code text | Mono only for code, identifiers and aligned figures |
| Platform surfaces left unstyled beside a custom design (selection, focus ring, scroll indicators, cursor) | Theme them from the tokens, keeping platform behaviour |
| Half the component states missing | Every state in the matrix; see `states-content.md` |

## 6. Redesign procedure

Refinement preserves; a redesign replaces. Decide which one the request is before touching anything, and say it in one line.

1. **Classify.** Small change or new screen inside an existing design: refinement. The user asks to replace the look, or there is no coherent design to follow: redesign. If unclear, ask once: keep the existing identity, or start the visuals again?
2. **Refinement.** Touch only the named target. Use only colours, faces, radii, shadows and components the design already owns. To make a part bolder, bring it up to the strongest moves its neighbours already make; to make it quieter, remove noise before removing character. If the existing system cannot express what is asked, stop and name the exact addition needed. Never restyle neighbours.
3. **Redesign: audit first.** Record what exists: brand assets and tokens, navigation and screen structure, content, recognisable patterns worth keeping, patterns to retire, accessibility already won, and the current dial reading.
4. **Redesign: preserve.** Product truth, content, function, constraints and explicit brand commitments survive. Structure survives unless the user asks otherwise: routes, navigation labels, identifiers that analytics or tests depend on. The old look is evidence about the subject, not authority over the result.
5. **Redesign: replace.** Write directions as for a new product (`research.md`). Prefer the lowest-risk lever that satisfies the brief, in this order: type, spacing and rhythm, colour, motion, recomposing key screens, replacing whole blocks.
6. **Never smuggle.** A redesign is never delivered inside a small change. If a small task reveals that the design itself is the problem, report it and propose a redesign as separate work.
7. **Never change silently:** routes, navigation labels, copy voice, accessibility behaviour, a brand colour. Each needs the user's approval and, during `build`, a dated exception in `docs/design/DESIGN.md`.

The user's brief or the project's design system overrides any default in this file.
