# States and content

Load when writing the state matrix in `direct`, building screens or components in `build`, or
checking states and copy in `review`. Covers what each screen shows in every condition, the states
of each component, interface copy, and content that is long, missing or translated.

## The state matrix

A screen designed only for ideal data is unfinished. For every screen, decide what the user sees in each state below before building.

| State | The user sees | Good looks like | Common failure |
|---|---|---|---|
| Loading | That content is on its way, and roughly what shape it has. | A skeleton or placeholder with the dimensions of the real content; the shell and navigation already usable; a named operation when the wait is long. No layout shift when content lands. | A blank screen; a full-page spinner over a page that is mostly ready; a jump on arrival. |
| Empty (first use) | What this area is for and how to start. | One sentence on what will appear here, one on why it is worth it where not obvious, and one primary action. A sample or template when it helps. | "No data"; a decorative illustration with no action; several competing actions. |
| Empty (no results) | That the search or filter matched nothing, and how to widen it. | The query or active filters restated, a way to clear them, a hint for a different query. Never the first-use message. | Looks identical to first use; no way to clear filters. |
| Error | What failed, and what can be done. | The failed region only is replaced; the message follows the error formula below; retry or an alternative is offered; the user's input is intact. | A raw code or stack text; the whole page replaced; input wiped; a dead end. |
| Offline | That there is no connection and what still works. | A persistent, quiet indicator; cached content readable and marked with its age; writes queued or blocked with a plain reason; automatic recovery when the connection returns. | An endless spinner; a generic error; silent loss of a change. |
| Partial | The parts that loaded, and which did not. | Loaded parts usable; each failed or pending part marked in place with its own retry; totals that are incomplete say so. | All-or-nothing failure; incomplete figures shown as final. |
| Success | That the action completed, and what changed. | Confirmation in place, sized to the effort: brief for routine saves, fuller for rare milestones. The next step is shown only when there is one. | No acknowledgement; a blocking dialog for a routine save; celebration on every click. |
| Long content | The same layout holding far more than expected. | Text wraps or truncates by rule; long lists paginate, virtualise or load on demand; the primary action stays reachable. | Overflow, overlap, pushed-off actions, a page that loads thousands of rows at once. |

Rules for all states:

- Keep the region's size and place between states so nothing jumps.
- Scope a state to the smallest region it is true for. One failed widget does not take down the screen.
- Do not carry meaning by colour alone: pair it with an icon or text.
- A state that cannot occur on a screen is written as "n/a" with the reason, not left blank.
- Also consider where they apply: no permission (say why and how to get access), read-only, and the user having cleared everything (a lighter message than first use).

### Table shape for `docs/design/SCREENS.md`

One row per screen, one column per state. Each cell is a short statement of what the user sees, or "n/a: reason".

| Screen | Loading | Empty (first use) | Empty (no results) | Error | Offline | Partial | Success | Long content |
|---|---|---|---|---|---|---|---|---|
| Invoice list | Eight skeleton rows; filters usable | "No invoices yet" + what invoices are for + "Create invoice" | Filters restated + "Clear filters" | Table region shows message + "Try again" | Cached list with "Updated 2 h ago"; create is queued | Rows shown; totals marked "still loading" | New row appears highlighted once | Customer name truncates with full name on focus; 50 rows per page |
| Sign in | Button goes busy | n/a: nothing to list | n/a: no search | Message above the form; fields keep their values | "You are offline" + retry | n/a: single request | Goes to the last visited screen | Long email scrolls inside the field |

Where a cell needs more than a line, give it a short note under the table, keyed by screen and state.

## Component states

Build every state that applies to each component the screens use. Each state is visibly different from the others.

| State | What it shows | Notes |
|---|---|---|
| Default | The resting look; says what the control is and that it can be used. | Interactive things look interactive without hover. |
| Hover | A light response under a pointer. | Pointer devices only. Never the only signal or the only route. Skip in Flutter mobile layouts unless pointer input is supported. |
| Focus | A clear visible indicator. | Always present for keyboard and switch users; distinct from hover and from selected. |
| Pressed | Immediate response on press or touch down. | Clears on release. A disabled control shows none. |
| Selected / on | A persistent state (chosen tab, checked box, active filter). | Applies to controls that hold a value. Must survive hover and press. |
| Disabled | Muted and inoperable. | The reason is discoverable. Prefer hiding an action that is never available to this user, and explaining one that is temporarily unavailable. |
| Loading | Work in progress on this control. | Keeps its width and label context; blocks repeat activation. |
| Error | The value or action was not accepted. | Text and icon next to the control, not colour alone; cleared as soon as it is fixed. |

Also define, where relevant: read-only, dragging, and the empty and overflow forms of containers (a table with no rows, a tag list with forty tags).

## Copy

Copy is part of the design. Write it with the screen, not after.

### Error messages

Answer three questions, in this order:

1. What happened, in the user's terms.
2. Why, when it is known and useful.
3. What to do next, or what alternative remains.

- Never blame the user. Describe the problem with the input or the system, not the person: "This date is in the past" and not "You entered an invalid date".
- Be specific to the field and the fix. "Something went wrong" is acceptable only when nothing more is known, and then it still offers a next step.
- Do not show internal codes as the message. A reference code may follow for support.
- Do not promise a cause or a fix the system cannot know.
- Serious moments (money, deletion, privacy, lost access, blocked work) get a plain, calm tone. No jokes.

### Empty states

State what this is, why it is empty, and offer one action. First use explains and invites; no results restates the query and offers to clear it; no permission says who can grant access. Each kind has its own wording.

### Loading and success

- Loading text names the real operation ("Importing 240 contacts") and gives an honest expectation for long waits. Never invent progress.
- Success states the completed outcome in the words of the button that caused it. Keep routine success short.

### Buttons and links

- Label with a verb plus its object: "Save changes", "Delete project", "Send invite". The label says what will happen, not how to trigger it.
- Avoid bare "OK", "Yes", "No", "Submit" and "Click here". In a confirmation, the button repeats the action named in the question.
- A destructive label names the thing destroyed.
- Link text makes sense read alone. An icon-only control has an accessible name that matches its action.
- One action, one wording, everywhere it appears.

### Consistent terms

- One word per concept across the product. Do not alternate "remove", "delete" and "archive" unless they are different actions.
- Use the audience's vocabulary, not internal names. Keep domain terms the audience really uses.
- Keep capitalisation, date, number and unit formats the same throughout. Record recurring terms in a short glossary in `docs/design/DESIGN.md` when the product is large enough to drift.
- Say each thing once. A heading that explains the state needs no sentence repeating it.

### Real content only

- No placeholder text in anything delivered: no lorem ipsum, "Title here", stock names, dead links or sample tags.
- No invented facts. Do not make up figures, prices, dates, customer counts, ratings, reviews, testimonials, client names, logos, awards or people.
- Use the copy and data in the brief. Realistic sample data for a product screen (names, amounts, dates) is allowed only when it is plainly test data for a build, is varied and plausible, and is never presented as a claim about the product.
- When real copy is missing, do not fill the gap with a guess. Either leave the element out, or mark it with one searchable token of the form `[NEEDS INPUT: what is needed]` and list every such marker in the report so the user can supply it. Nothing marked this way counts as finished.
- Ask before changing a factual claim, legal wording or a domain term.

## Long and awkward content

Test each screen with the worst realistic content, not the tidy sample.

| Content | Rule |
|---|---|
| Long names and titles | Decide per element: wrap, clamp to a set number of lines, or truncate on one line. Truncated text is available in full on focus, tap or the detail view. Never let text overlap or push an action off screen. |
| Unbroken strings | Email addresses, URLs and identifiers break or scroll inside their container; they do not widen the layout. |
| Very short or missing text | A one-character name, an empty optional field and a missing description each leave a sound layout. Show a neutral fallback ("No description") only where absence would confuse. |
| Large and odd numbers | Check zero, negative, decimals, millions and more. Align figures in columns, use tabular numerals, format by locale, and abbreviate (1.2 M) only where the exact value is available nearby. |
| Counts | Handle none, one and many with correct plural forms from the localisation system, not by adding a letter. Cap badges ("99+"). |
| Many items | Forty tags, two hundred options, ten thousand rows: collapse with a count, search, paginate or virtualise. |
| Missing or broken images | Reserve the space with a fixed aspect ratio. Show a designed fallback (initials, a neutral tile, an icon), never a broken-image mark or a collapsed box. Odd aspect ratios are cropped by rule. |
| Translated text | Assume text grows by 30 to 40 per cent. Size controls by padding and content, not fixed width. Do not build sentences from fragments; keep variables whole so word order can change. |
| Right-to-left | Lay out with start and end, not left and right, so the layout mirrors. Mirror directional icons (back, next, progress); do not mirror logos, media controls or numbers. |
| Other scripts and emoji | Chinese, Japanese, Korean, accented and combined characters render without clipping; line height allows for tall scripts. |
| Dates, times, currency | Format with the platform's locale tools. Never hard-code the order of day and month or a currency symbol's position. |
| Larger text | The layout holds at the user's larger text setting (200 per cent zoom on the web, text scale 1.3 or more in Flutter): containers grow, nothing clips. |

The brief or the project's design system overrides any default here.
