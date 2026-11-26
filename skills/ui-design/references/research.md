# Research

Load when the work is a new product or a redesign and `direct` mode reaches references or alternative directions.
Also load whenever the user supplies a screenshot, site or app to learn from, at any size of work.
Skip for a small change, and for a new screen that reuses an approved direction with no references given.

## 1. Whose references, and when

| Source | Runs when | Conditions |
|---|---|---|
| References the user provides (screenshots, sites, apps, brand files) | Always | Analyse every one. Ask what the user likes about it if that is not stated; do not guess the reason |
| The agent's own research | Only when the user agrees, and the session has a browser or search tool | Say what will be searched before searching. Include at least one reference from outside the product's category. Keep search terms clean (below) |
| Neither available | | Say "no references studied" in `docs/design/DESIGN.md` and proceed from the design read. Never invent a reference or describe a site from memory as if it had been inspected |

**Why one reference must come from outside the category.** Products in one category copy each other until they share a layout, a palette and a tone. Research confined to the category returns that average and pulls the direction to the default the category test in `direction.md` exists to catch. An outside reference solves the same underlying problem (dense scanning, one-handed entry, calm waiting, trust at a payment step) in a different visual language, and gives the direction something the competitors do not have.

Find the outside reference by problem, not by look: name the hardest thing a screen must do, then ask who else solves that well. Timetables, field equipment, printed forms, reference books, instrument panels and games all count, as do software products in unrelated fields.

**Search hygiene.** Search terms carry no confidential project details.

- Never include: the product name, the client or company name, unreleased features, internal code names, real user data, or text pasted from project files.
- Search by the general problem and pattern: "dense schedule view on a phone", not the project's name plus "app".
- Do not upload project screenshots or documents to an outside service to find similar work.
- If the category alone would identify a confidential project, ask the user before searching it.

## 2. Reading a reference: four passes

Read each reference four times, once per pass. Write what is observed, not whether it is liked. For a static screenshot, mark the navigation and interaction passes "not observable" where they cannot be seen; do not infer behaviour.

| Pass | Look for |
|---|---|
| Type | How many families and what role each plays. The number of sizes actually in use and the step between them. How emphasis is made: weight, size, colour or case. Body line length and line spacing. How figures are set in data. Where the largest text sits and what it says |
| Layout | The shell: fixed regions and their widths. The grid and where it is broken on purpose. Density: how many items share one view. Grouping method: space, lines, surfaces or boxes. What the first view contains and what is pushed below. How it changes between narrow and wide windows |
| Navigation | The model: hierarchy, hub and spoke, tabs, linear flow, search-first. How many levels, and how the current position is shown. Where the primary action lives on each screen. How the user gets back. What is always reachable and what is buried |
| Interaction | What responds to input and how fast. Feedback after an action: where it appears and how long it stays. When forms validate. How loading, empty and error conditions look. Gestures and keyboard paths. What moves, for how long, and what state change the motion explains |

A reference the user only describes, or one that is not software (a printed planner, a control panel), is recorded as "described, not inspected": analyse only what the description states, mark the other passes "not observable", and count it as outside the category.

Then note two more things per reference: the one decision that most makes it work, and one thing it does badly. The second keeps the analysis honest.

## 3. From observation to principle

A reference is studied for its reasoning. Its interface is never copied: no reproduced layouts, palettes, assets, copy or distinctive ornaments.

Turn each useful observation into a principle in three moves:

1. **Observe.** State what the reference does, concretely and measurably.
2. **Explain.** State the problem it solves for its user. If no problem can be named, it is a style, not a principle; leave it.
3. **Transfer.** Restate it without the reference's subject, visuals or brand, so it could apply to a different product. Then say how it applies here, and what is left behind.

Worked example:

| Step | Text |
|---|---|
| Observe | A transit app shows the next departure in very large numerals at the top; the rest of the day's departures sit below in a compact list |
| Explain | Most visits ask one question ("when is the next one?"). The answer is readable at arm's length in a second; the full set is still one glance away |
| Transfer (principle) | Give the single most likely answer the largest element on the screen; keep the complete set directly beneath it in a denser register |
| Apply here | An invoicing tool's home screen: the amount due this week is the largest element; all invoices follow in rows |
| Deliberately left | The transit app's colour-coding by line and its rounded tile style. Neither solves a problem this product has |

A principle passes if it still makes sense with the reference's name removed. "Looks like that app" fails. "The most likely answer is the largest element" passes.

## 4. The record

Record every reference, including the ones that contributed nothing. The table goes into the References section of the project's `docs/design/DESIGN.md`.

| Reference | Source | In category? | Why relevant | Borrowed (as a principle) | Deliberately left |
|---|---|---|---|---|---|
| Name or short description; no confidential names | User / agent research | Yes / no | The problem it shares with this product | The transferable principle, and the screen it applies to | What was not taken, and why |

Rules for the record:

- "Borrowed" holds principles only. If a cell describes a look, rewrite it or move it to "left".
- "Deliberately left" is never empty. Every reference has something that does not fit this product.
- At least one row reads "no" under "In category?" when the agent's own research ran.
- State which references were screenshots only, so later readers know behaviour was not observed.

## 5. Alternative directions

Write alternatives only for a new product or a redesign. A new screen in an existing product gets one direction: the approved one, applied. A small change gets none.

Write two or three. Each has every field from section 3 of `direction.md`: thesis, first screen or viewport, colour strategy, type roles, layout approach, signature element, use scene, costs and gains. Each passes the mood test and the category test.

**Directions must differ on an axis taken from the product itself.** A set that is the same design turned up or down (safe, medium, bold; muted, vivid) does not count: it offers one idea in three volumes, and the choice tells nothing about the product.

Finding a real axis from the design read:

1. Re-read the design read and the answers to the questions. List the tensions in it: places where two things the user needs pull against each other.
2. Common axes, each a genuine product question:

| Axis | The question it settles |
|---|---|
| Density | See everything at once, or one thing at a time? |
| Navigation model | Linear flow, hub with spokes, or one long surface? |
| Tone | Authoritative instrument, or encouraging companion? |
| Primary object | Is the home screen built around the task, the record, or the timeline? |
| Entry point | Start from search, from a list, or from a recommendation? |
| Guidance | Expert tool with everything exposed, or guided path with choices hidden until needed? |

3. Pick the one axis where the brief does not already give the answer. If the brief settles density, density is not the axis.
4. Place each direction at a different point on that axis. Let colour, type and layout follow from the position; do not vary them for their own sake.
5. Check: describe each direction in one line without any adjective of intensity (bold, subtle, loud, calm, minimal). If the lines become identical, the directions differ only in loudness. Start again.

Example. Design read: "inspection logging for field technicians, on a phone, outdoors, often one-handed and offline." Tension: fast entry on site against reviewing the whole report before sending. Axis: navigation model.

| Direction | Position on the axis | Consequence |
|---|---|---|
| A | One question per screen, linear | Very large targets, nothing to scan; slow to review or jump back |
| B | One long form with a section bar | Whole report visible and easy to review; smaller targets, more scrolling |
| C | Checklist hub; each item opens and closes | Progress visible at a glance, any order; one extra tap per item |

All three could share one palette and still be three different products. That is the mark of a real axis.

Presenting the set:

- Show the directions side by side with the same fields in the same order, so they can be compared.
- Name the axis and say why it was chosen.
- Recommend one, with the reason tied to the design read. A recommendation is not a decision.
- The user picks one or combines parts. When parts are combined, rewrite the result as one complete direction and run both tests again; a merged direction can contradict itself.
- Record the chosen direction in `docs/design/DESIGN.md`, and each refused direction in one line with the reason it was refused.
- Stop for approval. No UI is built before the direction is approved.

## 6. Throwaway samples

Optional. Build only when the user asks to see the directions rendered.

| Rule | Detail |
|---|---|
| Scope | One key screen per direction: the same screen, with the same real content, in every sample, so only the direction varies |
| Form | Web: a single static HTML file with styles inline, no build step, no framework. Flutter: one screen, only where it can be rendered in the session; otherwise say so and offer a written description |
| Content | Real copy from the brief. No placeholder text, no invented facts. Sample data is labelled as sample |
| Label | Mark each file and each rendered screen "throwaway sample, not production" |
| Location | Outside the project's source tree, or in a clearly named scratch folder that is not committed |
| Lifetime | Delete after the user chooses. Not kept, not referenced by the build, not copied into production code |
| Status | A sample is not UI built and does not satisfy any gate. The approved direction in `docs/design/DESIGN.md` is the authority, not the sample |
| Confidentiality | Do not send project content to an outside image or mock-up service to make a sample |

After the choice, record in `docs/design/DESIGN.md` that samples were made and discarded. Tokens are then designed properly; they are not lifted from the sample.

The user's brief or the project's design system overrides any default in this file.
