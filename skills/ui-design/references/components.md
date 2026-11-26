# Components

Load when writing the component inventory in `direct`, choosing or building a component in `build`,
or checking component choice and states in `review`. Covers which component fits which job, guidance
by family, and what to record per component. Platform detail lives in `web.md` and `flutter.md`.

## Choosing a component for a job

Start from the job, then take the first rule that fits. Name the component refused as well as the one chosen.

**Rows or cards**

| Use | When |
|---|---|
| Rows (list or table) | The items are records of one kind that the user scans, compares, sorts or acts on. |
| Cards | Each item is a self-contained widget: its own mixed content, its own actions, meaningful when lifted out of the set. |
| Neither: plain spacing and a heading | The content is simply a section of the page. |

Never put a card inside a card. Group inside a card with spacing, a heading or a divider.

**Dialog, drawer or inline**

| Use | When |
|---|---|
| Inline (in place, or an expanding region) | The task is short, belongs to what is on screen, and the user gains from seeing the surrounding content. Default choice. |
| Drawer or side panel | The user needs the page behind for reference, or is inspecting and editing one item from a list and will move to the next. |
| Dialog (modal) | The flow must stop: a decision that blocks progress, an irreversible action, or a short self-contained task. |
| A full screen or page | The task is long, has several steps, or deserves its own address. |

**Tabs or segmented control**

| Use | When |
|---|---|
| Tabs | Switching between different panels of content in the same context. Each tab owns its panel. |
| Segmented control | Choosing one of two to five options that change the mode, filter or presentation of the same content. |
| Navigation (bar, links) | The options are separate destinations. Tabs are not page navigation. |
| Select or list | There are more options than fit in one row. |

**Table or list**

| Use | When |
|---|---|
| Table | Records share several attributes and the user compares across columns, sorts or filters. |
| List | Each item has one main line and little secondary data; the user picks or scans, not compares. |

**Menu or select**

| Use | When |
|---|---|
| Menu | The items are commands or destinations. Choosing one does something now. |
| Select | The items are values. Choosing one sets a field and the control shows the current choice. |
| Radio group or segmented control | Five or fewer values, and seeing them all at once helps. |
| Combobox with search | Many values. |

**Toast, inline message or banner**

| Use | When |
|---|---|
| Inline message | The message concerns one field, item or region. Place it there. Use for every validation error. |
| Banner | The message concerns the whole screen or product and persists until resolved or dismissed: offline, a failed sync, an expiring trial. |
| Toast | A brief, non-critical confirmation of something the user just did, optionally with Undo. Never the only place an error or required action appears. |
| Dialog | The user must decide before continuing. |

## Guidance by family

For each family: when to use, the common misuse, and what to decide.

### Buttons and interactive elements

- **Use** a button for an action, a link for a destination, a toggle for an on/off state that applies at once.
- **Misuse:** several primary buttons in one group; a link styled as a button that performs an action, or the reverse; icon-only buttons with no accessible name; a disabled button with no reason given; colour as the only difference between variants.
- **Decide:**
  - Emphasis ladder: primary (one per action group), secondary, quiet or text, destructive. Destructive is not automatically primary.
  - Sizes: usually two or three, sharing heights with fields so mixed rows align.
  - Label rule: a verb plus its object. Icon placement and whether icon-only is allowed, and where.
  - Loading keeps the button's width and blocks a second submit.
  - Target size meets the numbers in `foundations.md` even when the visible button is compact.

### Navigation

- **Use** one primary pattern per product, chosen from the number of destinations and the window size: a bottom bar or top bar for three to five peers, a side rail or sidebar for more or for deep hierarchies, a drawer when space is short.
- **Misuse:** more than five items on a bottom bar; a hamburger hiding three items on a wide screen; mixing two primary patterns at one level; no mark on the current destination; tabs used as site navigation; destinations that move between screens.
- **Decide:**
  - What collapses, and to what, as width shrinks.
  - How the current item is marked, with a second cue besides colour.
  - Where secondary navigation, search and account live.
  - Back behaviour and whether breadcrumbs appear. Behaviour rules are in `interactions.md`.

### Forms and validation

- **Use** the most specific input for the data: the right keyboard and field type, a picker for dates, a switch only for settings that apply immediately, a checkbox for a choice submitted with the form.
- **Misuse:** placeholder text as the only label; errors shown while the user is still typing a first attempt; errors listed only at the top; clearing input on error; asking for everything up front; multi-column forms that break the reading path; fields wider or narrower than their expected content.
- **Decide:**
  - Label position (above the field by default) and how required or optional is marked. Mark whichever is rarer.
  - Helper text placement, tied to its field.
  - Validation timing: on leaving the field or on submit; clear the error as soon as the value becomes valid.
  - Error message: next to the field, says what is wrong and how to fix it, carries an icon or text cue besides colour. On submit, move focus to the first error; add a summary for long forms.
  - Grouping and step structure for long forms; what is deferred until needed.
  - Field sizes shared with buttons; one field border role that meets 3:1.

### Tables and data presentation

- **Use** a table for comparison across attributes; a list for simple records; a chart only when the shape of the data is the message; a single figure with its label when one number matters.
- **Misuse:** a grid of cards for tabular records; every column given equal weight; centred or left-aligned numbers; truncation with no way to see the full value; hiding row actions behind hover alone; a dashboard of decorative figures no one acts on.
- **Decide:**
  - Columns: which are essential, their order, alignment (text to the start, numbers to the end with tabular figures), and which drop or stack first at narrow widths.
  - Narrow-width rule: horizontal scroll with a pinned first column, or a stacked layout per record. Headers stay visible while scrolling.
  - Density and row height; whether rows are clickable and what the click does.
  - Sorting, filtering, selection and bulk actions; pagination or loading on demand.
  - Empty, loading and error forms of the table, per `states-content.md`.

### Modals and drawers

- **Use** as chosen in the decision rules above. A modal is the costly option: it removes context.
- **Misuse:** a modal for information that could sit inline; a confirmation dialog for a reversible action (offer Undo; confirm only when the action cannot be undone); a dialog opened from a dialog; long or multi-step forms in a small modal; no visible close; closing on an outside tap while the user has unsaved input.
- **Decide:**
  - Size steps and the maximum height; where the content scrolls and whether actions stay pinned.
  - Dismissal: close button, Escape or back, outside tap. State which apply and what happens to unsaved input.
  - Focus: moves in on open, stays inside while modal, returns to the trigger on close.
  - Action order and labels: name the action ("Delete project"), not "OK". Follow the platform's order.
  - Narrow-width form: a dialog may become a full-screen sheet or bottom sheet.

### Cards and containers

- **Use** a card for a self-contained widget; a section (heading plus spacing) for everything else.
- **Misuse:** a card around every group by reflex; a card inside a card; identical card grids for content that is not equivalent; a border plus a shadow plus a tint on one surface; a whole card that is clickable while also holding other controls; cards of unequal height with misaligned actions.
- **Decide:**
  - Whether a container is needed at all. Try spacing and alignment first.
  - One edge language and one padding step per container size, from `foundations.md`. Nested corners stay concentric.
  - The regions (media, title, content, actions) and their order; which may be absent.
  - Interaction model: static, one destination for the whole card, or separate controls inside. Not a mixture.
  - How the grid reflows and how cards behave with long titles and missing content.

### Feedback and notifications

- **Use** the least interrupting form that still reaches the user: in place first, then banner, then toast, then dialog. Match prominence to urgency and persistence.
- **Misuse:** a toast for an error the user must act on; toasts that vanish before they can be read or that steal focus; a spinner over the whole screen for a local wait; success messages for every routine action; status shown by colour alone; several messages stacked for one event.
- **Decide:**
  - Which events get which form, as a short table in the design file.
  - Toast position, duration, stacking limit, and whether it carries an action. Anything that disappears must be findable elsewhere.
  - Progress: skeleton for content, in-place indicator for an action, determinate bar when the length is known. None of them shifts the layout.
  - Status vocabulary: one icon, colour and wording per meaning (success, warning, error, information), kept the same at every prominence.
  - How each message is announced to assistive technology: polite by default, assertive only for urgent, time-critical events.

## Component states

Every interactive component covers these. Decide each one; do not leave it to the library by accident.

| State | Must show |
|---|---|
| Default | What the component is and that it can be operated. |
| Hover (where a pointer exists) | A response that tints the existing surface. Never the only route to an action or to information. |
| Focus | A visible indicator at 3:1 that follows the component's shape. Never removed. |
| Pressed | Immediate acknowledgement on the part being pressed. |
| Disabled | Clearly unavailable, no response to input, and a reachable reason where it is not obvious. |
| Loading | Work in progress, with the component's size and identity kept; repeat activation blocked. |
| Error | What is wrong, attached to the component, with a cue besides colour. |

Add where they apply: selected, checked, expanded, read-only, dragging. A selected state stays visible under hover and press. Touch platforms have no hover: nothing may depend on it.

## What to record in `docs/design/DESIGN.md`

The component inventory is a record of decisions, not a catalogue.

- List only the components the project uses. Add an entry when a screen first needs the component.
- Never write a spec for a component family the project does not use.
- Record the job, the alternative refused for that job, and then only the departures from the library default.
- Where nothing is recorded, the library default stands: Material in Flutter, or the web component library in use.
- An empty departure cell means "library default". Do not restate the default.

Table shape:

| Component | Job | Refused for this job | Variants | Sizes | Behaviour | Responsive rule | States |
|---|---|---|---|---|---|---|---|
| Orders table | Compare and act on orders | Card grid: records need column comparison | Default only | Compact row (`table-row-compact`) | Row click opens the detail drawer | Where columns no longer fit: stacked record, status and total kept | Loading: 8 skeleton rows. Error: in place with retry |
| Confirm dialog | Block before an irreversible delete | Toast with Undo: the delete cannot be reversed | Destructive | (default) | Outside tap does not close | Full-width sheet on phones | (default) |

- "Refused" names the component and gives the reason in a few words.
- Variants, sizes, behaviour, responsive rule and states list only what differs. Reference tokens by name, never raw values.
- A later change to an entry that breaks the approved direction goes to the dated exceptions list, not into this table silently.

The brief or the project's design system overrides any default here.
