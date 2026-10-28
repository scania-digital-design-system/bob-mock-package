# Findings across the cells

This page collects what the cells show about BOB. It has four parts:

- [Findings about BOB](#findings-about-bob), grouped by the rule that causes them.
- [Conflicts and resolutions](#conflicts-and-resolutions): each place where Tegel and a
  BOB rule disagree, and how the cell resolves it inside the rules.
- [Relaxations](#relaxations): rules a cell breaks on purpose, because no resolution
  inside the rules exists.
- [Steps for a new conflict](#steps-for-a-new-conflict).

Each `<component>.md` keeps the full detail. Prompt line numbers (L11, L12) refer to
`pipeline/prompts/bootstrap_system_react.txt`, as quoted in `docs/research/bob-pipeline.md`.

## Result

| Component | BOB hard gate | Prompt rules | API vs Tegel | Departures | Findings about BOB | Tokens added |
|---|---|---|---|---|---|---|
| badge | PASS | PASS | exact | 4 | 6 | 3 |
| button | PASS | PASS | 2 added | 8 | 5 | 19 |
| link | PASS | PASS | 3 added | 4 | 3 | 3 |
| spinner | PASS | PASS | exact | 4 | 3 | 10 |
| card | PASS | PASS | 4 added | 8 | 5 | 14 |
| divider | PASS | PASS | exact | 2 | 1 | 5 |
| block | PASS | PASS | 1 added | 4 | 3 | 5 |
| tag | PASS | PASS | 1 added | 4 | 2 | 14 |
| message | PASS | PASS | 1 added | 6 | 3 | 9 |
| breadcrumbs | PASS | PASS | 1 added | 4 (family) | 1 (family) | 0 |
| breadcrumb | PASS | PASS | 1 added | — | — | 2 |
| stepper | PASS | PASS | 1 added | 7 (family) | 3 (family) | 2 |
| step | PASS | Relaxed | 1 added | — | — | 17 |
| footer | PASS | PASS | 4 added | 10 (family) | 6 (family) | 15 (family) |
| footer-group | PASS | Relaxed | 2 added | — | — | — |
| footer-item | PASS | Relaxed | 1 added | — | — | — |
| checkbox | PASS | PASS | 1 added, 2 methods dropped | 7 | 4 | 15 |
| radio-button | PASS | PASS | 1 added, 1 method dropped | 5 | 1 | 3 |
| toggle | PASS | PASS | 1 added, 2 methods dropped | 6 | 1 | 18 |
| chip | PASS | PASS | 3 added | 5 | 1 | 7 |
| textarea | PASS | Relaxed | 1 method dropped | 7 | 4 | 20 |
| accordion | PASS | PASS | 1 added | 8 (family) | 2 (family) | 6 (family) |
| accordion-item | PASS | Relaxed | 1 added, 4 methods dropped | — | — | — |
| banner | PASS | Relaxed | 1 added, 2 methods dropped | 6 | 1 | 3 |
| toast | PASS | Relaxed | 1 added, 2 methods dropped | 7 | 1 | 11 |
| text-field | PASS | Relaxed | 2 added, 1 method dropped | 4 (plus the textarea's) | 2 | 19 |
| folder-tabs | PASS | PASS | 1 added, 2 methods dropped | 15 (tabs) | 3 (tabs) | 14 (tabs) |
| folder-tab | PASS | PASS | 1 added, 2 methods dropped | — | — | — |
| inline-tabs | PASS | PASS | 1 added, 2 methods dropped | — | — | — |
| inline-tab | PASS | PASS | 1 added, 1 method dropped | — | — | — |
| navigation-tabs | PASS | PASS | 1 added, 2 methods dropped | — | — | — |
| navigation-tab | PASS | PASS | 1 added, 1 method dropped | — | — | — |
| datetime | PASS | Relaxed | 3 methods dropped | 9 | 3 | 12 |
| modal | PASS | PASS | 2 added, 5 methods dropped | 10 | 4 | 10 |
| slider | PASS | PASS | 1 method dropped | 11 | 3 | 31 |
| dropdown | PASS | Relaxed | 1 added, 7 methods dropped | 14 (family) | 3 (family) | 26 (family) |
| dropdown-option | PASS | Relaxed | 1 added, 1 method and 2 events dropped | — | — | — |
| icon | PASS | PASS | exact | 6 | 3 | 263 |
| popover-core | PASS | PASS | 1 added, 1 method and 3 props dropped | 11 (popover) | 3 (popover) | 9 (popover) |
| popover-canvas | PASS | PASS | 1 added, 1 method and 3 props dropped | — | — | — |
| popover-menu | PASS | PASS | 1 added, 1 method and 2 props dropped | — | — | — |
| popover-menu-item | PASS | PASS | 1 added | — | — | — |
| tooltip | PASS | PASS | 1 added, 2 props dropped | 5 | 0 (popover's apply) | 3 |
| table | PASS | PASS | 1 added, 1 method and 1 prop dropped | 17 (table) | 3 (table) | 31 (table) |
| table-toolbar | PASS | Relaxed | 2 added | — | — | — |
| table-header | PASS | Relaxed | 1 added | — | — | — |
| header-cell | PASS | Relaxed | 1 added, 1 prop dropped | — | — | — |
| table-header-input-wrapper | PASS | Relaxed | 1 added | — | — | — |
| table-body | PASS | PASS | 1 added | — | — | — |
| table-body-row | PASS | Relaxed | 1 added | — | — | — |
| table-body-row-expandable | PASS | Relaxed | 2 added, 2 methods dropped | — | — | — |
| body-cell | PASS | Relaxed | 1 added | — | — | — |
| table-body-input-wrapper | PASS | Relaxed | 1 added | — | — | — |
| table-footer | PASS | PASS | exact | — | — | — |
| side-menu | PASS | PASS | 5 added | 21 (side menu) | 3 (side menu) | 23 (side menu) |
| side-menu-item | PASS | Relaxed | 1 added | — | — | — |
| side-menu-dropdown | PASS | Relaxed | 3 added | — | — | — |
| side-menu-dropdown-list | PASS | Relaxed | 1 added | — | — | — |
| side-menu-dropdown-list-item | PASS | Relaxed | 1 added | — | — | — |
| side-menu-collapse-button | PASS | Relaxed | 1 added | — | — | — |
| side-menu-close-button | PASS | PASS | 1 added | — | — | — |
| side-menu-overlay | PASS | PASS | 1 added | — | — | — |
| side-menu-user | PASS | Relaxed | 1 added | — | — | — |
| side-menu-user-image | PASS | PASS | 1 added | — | — | — |
| side-menu-user-label | PASS | PASS | exact | — | — | — |

A family (a parent and its children) shares one findings file, so its departures and
findings are counted once. The three tabs families share `tabs.md`; the four popover
cells share `popover.md`; the eleven table cells share `table.md`; the eleven side menu
cells share `side-menu.md`. The foundation set adds 31 tokens. The `tegel` set has 671
names in total, 263 of them icon paths. BOB's stock set has 45.

## Findings about BOB

Ordered by effect. The first three change behaviour or the API. The rest change metadata,
length or token fidelity.

The source tells whether a finding stays true when the pipeline runs from Figma (ADR 0006
D5). **Structural** findings come from the prompt, the gate or the token model; use these
to tune BOB. **Tegel-specific** findings come from Tegel's names or markup; a Figma run
takes names from Figma properties and variables, so these may not apply.

| # | Finding | Source |
|---|---|---|
| 1 | A cell imports nothing | Structural |
| 2 | `className` takes only a bare prop name | Structural |
| 3 | The gate treats every `var()` as a design token | Structural |
| 4 | No number, duration, shadow or font-weight token type | Structural (Figma variables have the same types) |
| 5 | `token-usage` categories differ from Tegel's use | Structural rule, Tegel-specific trigger |
| 6 | The stock vocabulary covers little of Tegel | Tegel-specific |
| 7 | The drafted contract leaves metadata empty or wrong | Structural |
| 8 | The gate does not see some states | Structural |
| 9 | The resolve path gives a different button | Structural |
| 10 | The surface has no number, event or method type | Structural (Figma properties have the same types) |

### 1. A cell imports nothing (L12)

JSX works through the automatic runtime. Hooks, state, context, `cloneElement` and other
cells are out of reach.

- **button:** no keyboard `.active` state.
- **link:** the cell cannot style a passed-in `<a>`, so it renders its own.
- **card:** expand and collapse needs a native `<details>`. The card draws its own
  toggle, icon and divider instead of using other cells. It has no random `cardId`.
- **message:** the four Tegel icons are copied into the cell as SVG paths. With no
  `useId`, it drops the generated id behind `aria-describedby`.
- **block:** the nesting level needs the DOM or a context, so it moves into CSS
  (finding 2).
- **dropdown-option:** Tegel's option renders a button or a checkbox by its parent's
  `multiselect`. The cell renders both, and the parent's class shows one.
- **step, footer-group, footer-item:** a child cannot read its parent's props or place.
  This needs the first relaxation, `parent-modifier-selectors` (see
  [Relaxations](#relaxations)).
- **footer:** the mobile collapse needs state. A media query replaces Tegel's resize
  listener, and the open state needs the relaxation `react-hooks`.
- **tabs:** the parent's selection reaches its children through the DOM. The parent sets
  `aria-selected` from a callback ref and a click handler, and the children's styles
  read it. No relaxation is needed, but the contract between the cells is recorded
  nowhere. The three parents repeat the same script.

### 2. `className` takes only a bare prop name (L11)

A modifier class cannot come from logic.

- **badge:** the pill shape is derived from `value` and `size`. It needs a second
  `return` branch with a static class.
- **button:** icon and icon-only padding are derived from children. They move into CSS
  with `:has()`.
- **badge, button, link:** a boolean prop renders `--x-true` or `--x-false`. The gate
  needs a rule for both. Each `false` rule carries a filler declaration. The message
  shows the better case: its `--minimal-false` rule holds the default styles.
- **block:** the alternating nested background depends on DOM ancestors. It moves into
  descendant selectors, for six levels.
- **divider, tag:** an alias value (`dark-blue`) and a case variant (`Success`) cannot be
  mapped to another class. Each gets its own selector. The gate compares class names
  with case, so a missing casing fails it.
- **stepper:** modifiers that change only the children (`--lg`, `--below`,
  `--hide-labels-*`) need filler rules in the parent's stylesheet.
- **datetime:** the validation state must show in a class. The cell renames the `state`
  prop and gives its state variable the prop's name and values. The checks cannot tell
  the two apart, so `tl-datetime--${state}` passes.

### 3. The gate treats every `var()` as a design token

- **spinner:** local custom properties fail token membership and token closure. Each size
  writes out its geometry and has its own `@keyframes`. The stylesheet is about four times
  longer than Tegel's.
- **badge, tag:** BOB has no alias tokens. Tegel's component token points to a system
  token; the cell uses the system token directly. The tag drops six icon tokens that
  alias its text tokens.

### 4. The token model has no number, duration, shadow or font-weight type

- **spinner, card:** durations and timings are carried as `COLOR`.
- **footer:** the wordmark URL is carried as `COLOR`. BOB has no image or asset type.
- **icon:** the 263 SVG paths are carried as `COLOR` (`path('…')`). BOB has no string
  type, and no way to load a token only where a cell uses it.
- **stepper:** Tegel's literal line geometry becomes 13 tokens named by value.
- **card:** shadows are composed from `size` offsets and 8-digit hex `color` tokens.
- **modal:** `85vh` is carried as `COLOR`, because a `FLOAT` token is always pixels.
- **badge:** the font weight is the keyword `bold`.
- `tokens.dtcg.json` labels every carried value `$type: "color"`. A typography
  `.fontSize` emits an empty declaration. Details: `docs/tokens.md`.

### 5. `token-usage` categories differ from Tegel's use

- **button:** Tegel sizes the icon with spacing tokens. BOB forbids `space` on `width` and
  `height`, so the cell adds `size/button/icon*` tokens with the same values.
- **spinner:** `token-usage` has no rule for SVG geometry (`cx`, `r`, `stroke-width`). Any
  category passes.
- **modal:** `token-usage` does not list `scrollbar-color` as a colour property. The gate
  fails a colour token there, so the Firefox scrollbar colour is dropped.
- **table:** a `space` token is allowed on `inset-inline-start` and `inset-inline-end`
  but not on `left` and `right`. The input wrappers and the toolbar use the logical
  properties.
- **slider:** nor `border-image` or `accent-color`, the two CSS-only ways to colour a
  native range's fill. The cell draws the fill with a `<progress>` instead.

### 6. The stock vocabulary covers little of Tegel

The cells reuse 6 stock names where the meaning is the same. Every other name is in the
generated `tegel` set. The button alone needs 17 component tokens, and the tag 12 colours.

### 7. The drafted contract leaves metadata empty or wrong

- **all:** `a11y.json` holds only `structure` rules. `role` and `aria-*` are recorded
  nowhere.
- **all:** the `prop-value` rule says "the caller selects one" for a `TEXT` property.
- **block:** the `prop-value` rule asks for "a modifier class per value" on a markup-only
  target. `componentTag` picks the element instead, and renders no class.
- **all:** `tokens.dtcg.json` has wrong types for carried values (finding 4).

### 8. The gate does not see some states

- **link:** `disabled` is the attribute selector `[aria-disabled='true']`. Class closure
  does not inspect attribute selectors.
- **card:** a clickable card is a `<button>` that can contain action buttons. Neither the
  gate nor the prompt checks nested interactive content. Tegel has the same problem.
- **card:** the gate caught a class in the markup with no rule (`tl-card__inner`). Our
  prompt-rule check did not, because it checks the opposite direction. Keep both checks.
- **breadcrumb, footer-item:** styles for consumer content (`> *`, `a`, `button`) name no
  class, so no check reads them.
- **footer:** the 992px breakpoint is a literal in a media query. No check reads at-rule
  preludes, and CSS cannot put `var()` there.
- **slider:** the gate's `markup-inline-style` check matches only a quoted `style="…"`. A
  JSX `style={{ … }}` passes it. Our `no-style-attribute` prompt rule catches both.

### 9. The resolve path gives a different button

BOB's registry has a React button template with `label`, `onClick` and inline styles. A
real publish of `button` resolves through it and never bootstraps. These cells show the
bootstrap path only (ADR 0002 D2).

### 10. The surface has no number, event or method type

A surface property is `VARIANT`, `BOOLEAN`, `TEXT` or `INSTANCE_SWAP`, the same types as
Figma component properties.

- **textarea, radio-button:** `maxLength`, `cols`, `rows` and `tdsTabIndex` are numbers in
  Tegel and `TEXT` here, so the generated prop types are `string`.
- **button, card, checkbox, radio-button, toggle, chip, textarea:** every event comes from
  the hand-written override map in `build/prop-types.ts`, because no property type
  describes a callback.
- **checkbox, radio-button, toggle, textarea:** element methods (`focusElement`,
  `toggleCheckbox`, `toggle`) are dropped. Exposing them needs a ref handle (imports) and
  a place in the contract.
- **tabs:** `leftPadding` is a free number in Tegel that sets a custom property. With no
  number type and no `style` attribute, it becomes a `VARIANT` with seven values.
- **datetime:** `customValidator` is a function prop. It is typed through the override
  map, as events are.

## Conflicts and resolutions

Each row is one kind of conflict. "Cost" is what the resolution gives up.

### Markup

| Tegel has | BOB rule | Resolution | Cost | Where |
|---|---|---|---|---|
| A custom element host, often with shadow DOM | The cell is a bare function that returns markup | Render the inner native element. Move host styles onto the root class. | Consumers cannot select `tds-*` tags. | all |
| A named slot | An instance swap is a prop | Make it a `ReactNode` prop with the slot's name in camelCase. | None in React. Angular needs the same mapping. | button `icon`; card `thumbnail`, `bodyImage`, `body`, `actions`; tag `prefix` |
| A default slot for any content | An instance swap is a prop | Make it the `children` prop. | None in React. | block, message, breadcrumbs, stepper, footer group and item |
| A default slot for a consumer element that needs styles but no attributes | No `cloneElement` (L12) | Keep it as `children`. Style it with a child combinator (`.tl-x__item > *`), as Tegel does with `::slotted(*)`. | No check reads those selectors. | breadcrumb, footer-item |
| A text slot next to a text prop | — | Drop the slot. Keep the prop. | Rich content in the label or header is lost. | button `label`; card `header`, `subheader` |
| A default slot for a consumer element, styled with `::slotted` | No imports, so no `cloneElement` (L12) | Render the element in the cell. Make its attributes props. | Only the listed attributes are exposed (`rel`, `download` are not). | link `href`, `target`, `children` |
| Other Tegel components inside | No imports, so no other cells (L12) | Draw them in the cell's own markup and CSS (inline SVG, `<hr>`). | Styles are duplicated and can drift from the button cell. | card toggle, chevron, divider |
| A Tegel icon (`tds-icon`) | No imports, so no icon cell or icon data (L12) | Copy the icon's path from Tegel's `iconsArray.js` into an inline `<svg>`. | About 250 bytes per icon, repeated in every cell that shows it. | message |

### Classes

| Tegel has | BOB rule | Resolution | Cost | Where |
|---|---|---|---|---|
| A class derived from several props | Bare prop name only (L11) | A second `return` branch with a static class. | Markup is duplicated per branch. | badge pill |
| A class derived from children | Bare prop name only (L11) | A `:has()` selector on a child class. | Logic moves into CSS. Needs `:has()` support. | button icon, icon-only |
| A boolean prop on the host | Booleans expand to `--x-true` and `--x-false`; the gate needs a rule for each | Put the default state's styles on the `false` rule. If there are none, give it a rule with the base value (`display: block`, `width: auto`, `font: inherit`). | Filler rules when the default state has no styles. | badge, button, link; message (no filler) |
| A state shown by an attribute | — | Style `[aria-*]` instead of a modifier. | Class closure does not see it. | link disabled |
| A class with no visual effect in our markup | Every class in the markup needs a rule | Express it with element order. Drop the class. | None. | card image placement |
| A class derived from DOM ancestors (nesting level) | Bare prop name only (L11), no refs or context (L12) | Descendant selectors, one rule per level, to a fixed depth. | Deeper levels repeat the last rule. | block nesting |
| A value mapped to another class (alias, case folding) | Bare prop name only (L11) | One modifier per value. Share the rule with a selector list. | More selectors. | divider `dark-blue`; tag capitalised variants |
| A child whose markup depends on the parent's props (button or checkbox) | No context or `cloneElement` (L12) | Render every form. With `parent-modifier-selectors`, the child's stylesheet shows one under the parent's class. | The child's content is in the DOM once per form. | dropdown-option |
| A child that reads its parent's props or place | No context or refs (L12); style only your own classes (L7) | Relaxation `parent-modifier-selectors`: the child's stylesheet styles its own classes under the parent's classes. | Breaks L7. The parent needs filler rules for modifiers only its children use. | step; footer-group, footer-item; dropdown-option |

Choose between a `return` branch and `:has()` like this:

- The class depends on prop values: use a `return` branch.
- The class depends on which children are present: use `:has()`.
- Keep the number of branches small. More than two branches means the markup is
  duplicated too often; report it as a finding.

### State and events

| Tegel has | BOB rule | Resolution | Cost | Where |
|---|---|---|---|---|
| Mutable internal state | No hooks (L12) | Use a native element that holds state (`<details>`). The prop sets the initial state. | Different toggle area and name. A prop change after a user toggle is ignored. | card `expanded` |
| Open state, focus trap and Escape (a modal) | No hooks or listeners (L12) | A native `<dialog>`: `showModal()` and `close()` from a callback ref and handlers; `cancel` for Escape. | Tab can reach the browser's controls. | modal |
| A listener on an element outside the cell (`selector`, `referenceEl`) | No effects (L12) | Add it in a callback ref. Remove it when React calls that ref with `null`. | The listener is replaced on every render. | modal, popovers, tooltip |
| A floating element placed by script (Popper.js) | No `style` attribute; no imports (L12) | A native popover. `showPopover({ source })` sets the reference as anchor; a `position-area` rule per placement places it. | Needs anchor positioning; free offsets are dropped; `auto` opens below and flips. | popovers, tooltip |
| A setting that applies once (`defaultShow`) | No hooks (L12) | Apply it on the first attach of the ref, and mark the element with a `data-` attribute. | React does not own the attribute. | popovers, tooltip |
| Mutable state that no native element can hold | No hooks (L12) | Relaxation `react-hooks`: `useState`. Expose the state as an ARIA attribute (`aria-expanded`) or `hidden`, and style it with an attribute selector. | Breaks L12. Class closure does not see the state. | footer-group mobile toggle, accordion-item, banner, toast |
| A mutable prop that a class shows (`state` after validation) | Bare prop name only (L11) | With `react-hooks`: rename the prop (`state: initialState`) and give the state variable the prop's name. It holds only the prop's declared values. | The checks cannot tell the variable from the prop. A later prop change is ignored. | datetime |
| A cancelable event (`tdsToggle`, `tdsClose`) | No event emitter | Build a `CustomEvent` with `cancelable: true`, pass it to the callback, then change state only if `!event.defaultPrevented`. | Needs `react-hooks` for the state. | accordion-item, banner, toast |
| A slot and a prop with the same name (`header`) | — | One `ReactNode` prop takes both text and markup. | The prop type is wider than Tegel's `string`. | accordion-item, banner, toast |
| An open set of named icons | No imports, so no icon set | Copy the few icons the component needs. Render nothing for other names. | Other icon names show no icon. | banner `icon` |
| State with no native element | No hooks (L12) | Drop it. Record a departure. | Behaviour is lost. | button keyboard `.active` |
| A custom event (`tdsClick`) | No event emitter | A callback prop that receives a real `CustomEvent` with the same `detail`. | The event does not bubble through the DOM. | card `onTdsClick` |
| Logic that runs once (`componentWillLoad`, one-way flags) | The cell renders from props only | Derive on every render. Do not copy the stale-state bug. | None. A behaviour departure to record. | badge, button `onlyIcon`, link disabled |
| A generated id | No hooks for a stable id | Set ids only when the id prop is given. With no id prop, drop the id and what points at it. | No id by default. The message loses `aria-describedby`. | card `cardId`; message |
| A geometry that follows a value (a fill width, a tooltip over the thumb) | No `style` attribute; every `var()` is a token | Use a native control that takes the value as an attribute (`<progress>` for a fill), and set it through the DOM. Otherwise drop it and show the value elsewhere. | The fill ends under the thumb, not at its centre; the tooltip does not move. | slider |
| Viewport state (resize listener) | No hooks or listeners (L12) | Render both variants. A media query shows one. | Content is rendered twice; the hidden copy is `display: none`. | footer-group title and toggle |
| A parent that sets state on its children (`setSelected`) | No context, refs or `cloneElement` (L12) | The parent sets an ARIA attribute on its children's elements, from a callback ref and a click handler. The child's stylesheet reads it with `:has([aria-…])`. | The contract between the cells is recorded nowhere. React does not own the attribute. | folder, inline and navigation tabs; table (`aria-sort`, `data-text-align`, `data-hover`) |
| A prop that both the consumer and the user change (`selected`) | No hooks (L12) | Apply the prop in a callback ref only when it differs from the last applied value, kept in a `data-` attribute. | React does not own the attribute. | table rows and header |
| A child that adds columns by the parent's props (multiselect, expand) | No context (L12) | Render the column always. With `parent-modifier-selectors`, the parent's class hides it. Count columns from the header row in a ref. | Hidden cells in every row. | table |
| A parent state that one child changes and every child shows (`collapsed`) | No context (L12); a modifier reads only a prop (L11) | Render the prop as a `data-` attribute on the parent's root, so React applies a prop change. The child's click changes the attribute. The other children read it with `parent-modifier-selectors`. | React does not see the click. Neither check reads the attribute. | side menu |
| A listener that consumers add to a host element (`onclick` on the overlay) | The destructured props are the whole API | Add an `onClick` prop. List it in `DEPARTURES`. | The API is wider than Tegel's. No other host attribute passes through. | side menu close button, overlay |
| Overflow state (scroll buttons, `ResizeObserver`) | No hooks or effects (L12) | Measure in a callback ref and in `onScroll`. Set `disabled` on the buttons directly, and hide a disabled button with CSS. | A resize alone does not update the buttons. | folder, inline and navigation tabs |

### CSS and tokens

| Tegel has | BOB rule | Resolution | Cost | Where |
|---|---|---|---|---|
| Local custom properties | Every `var()` is a token | Write the values out per variant. One `@keyframes` per variant. | A longer stylesheet. | spinner |
| An alias token | No alias tokens | Use the token the alias resolves to. Drop an alias whose value another used token already has. | The component-level name is lost. | badge; tag icon colours |
| A value with no token type (duration, opacity, shadow) | Only `COLOR`, `FLOAT` (px) and `STRING` (font family) | Carry it as `COLOR`. Compose a shadow from `size` and `color` tokens. | Wrong `$type` in `tokens.dtcg.json`. | spinner, card |
| A font weight | No font-weight token | Use the keyword (`bold`). | Not a token. | badge |
| A brand asset (a logo URL) | No image or URL type | Carry it as `COLOR`, in an `image/…` category. | Wrong `$type` in `tokens.dtcg.json`. | footer wordmark |
| A value per name from an open set (icon paths) | Every value is a token; bare prop name only (L11) | One token per name (`icon/<name>/d`) and one modifier rule per name that reads it with the CSS `d` property. | 263 tokens and rules; every consumer loads every path. | icon |
| Literal geometry with no meaning to name | Every value is a token | One token per value, named by the value (`size/stepper/13`). | Names carry no meaning. | stepper |
| A breakpoint | CSS cannot read `var()` in a media query | Keep the literal in the media query. | Not a token; no check sees it. | footer |
| A spacing token on `width` or `height` | `token-usage`: `space` only on padding, margin, gap, inset | A `size` token with the same value. | More tokens. | button icon |
| A name BOB's stock set does not have | The gate checks names against the rule data | Reuse a stock name when the meaning is the same. Otherwise add it to the `tegel` set. | The set grows: 112 names against 45. | all |

### API

| Tegel has | BOB rule | Resolution | Cost | Where |
|---|---|---|---|---|
| A prop missing from Tegel's types that React needs | The public API is the destructured props (ADR 0004) | Add it. List it in `DEPARTURES` in `tests/api-parity.test.ts`. | The API is wider than Tegel's. | button `onClick` |
| A variant axis | `DraftContract` needs an `answers` entry | Add the entry to the payload. | None. | every cell with a variant axis |
| `modeVariant`, `animation` | — | Out of scope (ADR 0002 D8). | Dark mode and animation are absent. | button, card, block, message, footer |
| A prop that only routes internal events | — | Accept it and ignore it. | None. | stepper `stepperId` |
| A number prop | Surface types are `VARIANT`, `BOOLEAN`, `TEXT`, `INSTANCE_SWAP` | Declare it `TEXT`. Convert with `Number()` where the cell computes with it. | The prop type is `string`. | textarea `maxLength`, `cols`, `rows`; radio `tdsTabIndex`; tabs indices |
| A number prop that sets a style (`--padding-left`) | No `style` attribute; no number type | A `VARIANT` with a fixed list of values. Each value is a modifier with a token. | Other values are not possible. | inline and navigation tabs `leftPadding` |
| An element method (`@Method`) | No ref handle (L12); no method in the contract | Drop it. List it as `dropped` in `tests/api-parity.test.ts`. | The method is lost. | checkbox, radio-button, toggle, textarea |
| A free number that moves an element (`offsetDistance`, `offsetSkidding`) or a library option (`modifiers`) | No `style` attribute; no number type | Drop it. The default becomes a token. | Other offsets are not possible. | popovers, tooltip |
| A DOM property that JSX cannot set (`indeterminate`) | No hooks (L12) | Set it in a callback ref: `ref={(el) => …}` needs no import. | Runs on every render. | checkbox |
| A DOM call from a handler (focus, value) | No refs (L12) | Use `event.target` or `event.currentTarget` in the handler. | None. | text-field click-to-focus and clamping |
| A label tied to the input by a random id | No `useId` (L12) | Wrap the input and its text in one `<label>`. | The label element is the root. | checkbox, radio-button, toggle, chip |
| A UI state class (focused, has a value) | No hooks (L12); bare prop name only (L11) | A CSS state selector: `:focus-within`, `:not(:placeholder-shown)`. | `:placeholder-shown` needs a placeholder, so it falls back to a space. | textarea inside label |
| A Tegel event mapped to React | — | A callback prop that receives a `CustomEvent` with Tegel's `detail`. | React's `onChange` fires on input, not on commit. | textarea `tdsChange` |

## Relaxations

A relaxation breaks one BOB rule on purpose, for a cell where no resolution in the tables
above works (ADR 0006). `rules/relaxations.json` maps each cell ID to the relaxations it
uses. The prompt-rule check skips those cells. A test fails when a listed relaxation has
no entry here.

### `parent-modifier-selectors`

- **Breaks:** `no-extra-rules` (L7: "define CSS for EXACTLY the classes the markup uses").
- **Allows:** a child cell's stylesheet styles its own classes under its parent cell's
  classes, for example `.tl-stepper--sm .tl-step__marker` or
  `.tl-footer__top .tl-footer-item > a`. Only the parent's classes are foreign; every
  class the rule styles is the child's own.
- **Why:** in Tegel, a child reads its parent's props at runtime (`tds-step` reads the
  stepper's size, orientation, label position and hidden labels) or its position in the
  parent (`tds-footer-group` and `tds-footer-item` in the footer's top part). A cell has
  no context, ref or import to read them (L12), and cannot derive a class from them
  (L11). Props on each child were rejected: the API differs from Tegel and every child
  repeats the parent's props. Data attributes were rejected: they pass the checks only
  because neither check reads attribute selectors.
- **Cells:** step, footer-group, footer-item, accordion-item (Tegel's
  `:host(:active)` on the accordion shades every item header), dropdown-option (the
  dropdown's `multiselect` picks a button or a checkbox, and its size sets the padding),
  table-toolbar, table-header, header-cell, table-header-input-wrapper, table-body-row,
  table-body-row-expandable, body-cell and table-body-input-wrapper (the table's
  `multiselect`, `expandableRows`, `compactDesign`, `verticalDividers`, `noMinWidth` and
  `zebraMode`), side-menu-item, side-menu-dropdown, side-menu-dropdown-list,
  side-menu-dropdown-list-item and side-menu-collapse-button (the menu's collapsed state
  and its `end` part; the list item also reads the dropdown's icon), and side-menu-user
  (the item's hover and selected states).
- **Gate:** PASS. Class closure does not object to rules for classes the markup does not
  render.
- **Source:** structural. Any compound component has the same problem, whatever its
  names.
- **BOB change that removes it:** let a cell's stylesheet name the classes of a declared
  parent cell, or give compound components a shared state (context) in the prompt.

### `react-hooks`

- **Breaks:** `no-module` (L12: "no import and no export statement").
- **Allows:** `import { useState, useId } from 'react';` (or a subset) at the top of
  `component.jsx`. Add another hook to this entry before a cell uses it.
- **Why:** below 992px, Tegel's footer group turns its title into a toggle and keeps the
  open state. A native `<details>` was tried, as in the card: it hides its content in
  every viewport, and showing it again on desktop needs `::details-content`, which not
  every browser supports. No CSS keeps a state that a click changes.
- **How:** the cell keeps only the open state. The toggle and the title are both in the
  markup, and a media query shows one of them, so the cell needs no viewport listener.
  The closed state is `aria-expanded="false"` on the toggle, and the stylesheet reads it
  with an attribute selector, because a state variable is not a declared property and
  cannot be a modifier class (L11; the gate's class closure would fail).
- **Why (textarea):** the character counter shows the current length while the user
  types, which no CSS can count (`useState`). The label's `htmlFor` and the helper's
  `aria-describedby` need ids that are stable and unique on the page (`useId`); wrapping
  the field in its `<label>` does not work, because the inside label is positioned over
  the field and the helper is outside it.
- **Why (accordion item, banner, toast):** each keeps a state a click changes and that
  a listener can veto: Tegel's `tdsToggle` and `tdsClose` are cancelable. The cell sends
  a cancelable `CustomEvent` to the callback first and changes its state only when the
  event is not prevented, as Tegel does. The accordion item also needs `useId` for
  `aria-controls` and `aria-labelledby`.
- **Why (text-field):** the same as the textarea: a live counter and stable ids.
- **Why (datetime):** the field validates on input and on blur, and the result changes
  the state class and which helper text shows. The labels need stable ids (`useId`).
- **Why (dropdown):** open, selection and filter text change the trigger's text, the
  clear button, the no-result text and the selection actions. The DOM pattern of the
  tabs cannot hold them: the selected labels are text that React renders. The labels
  and helper need stable ids (`useId`).
- **Cells:** footer-group, banner, toast (`useState`); textarea, text-field,
  accordion-item, datetime, dropdown (`useState`, `useId`).
- **Gate:** PASS. No gate check reads imports.
- **Source:** structural. Every stateful Tegel component needs it.
- **BOB change that removes it:** allow a fixed list of React hooks in the bootstrap
  prompt, and let a modifier interpolate a state variable as well as a prop.

Each entry uses this form:

```md
### `<relaxation-id>`

- **Breaks:** the prompt rule and line, for example `no-module` (L12).
- **Allows:** the exact construct, for example `import { useState } from 'react'`.
- **Why:** the resolutions tried, and why each fails.
- **Cells:** the cells that use it.
- **Gate:** PASS, or the real-gate rules it makes fail.
- **Source:** structural or tegel-specific.
- **BOB change that removes it:** for example, let a cell import React hooks.
```

## Steps for a new conflict

1. Keep Tegel's API and visual result. Change the markup or CSS before you change the API.
2. Find the conflict in the tables above. Use its resolution.
3. If the conflict is new, choose the resolution with the smallest cost. Add a row here.
4. If no resolution inside the rules works, add a relaxation. Write its entry under
   [Relaxations](#relaxations). Add the cell to `rules/relaxations.json`.
5. Run `npm run gate` and `npm test`. Both must pass.
6. Record a departure in `docs/findings/<component>.md`.
7. If a BOB rule forces the departure, also record a finding about BOB.
8. If the API changes, add the prop to `DEPARTURES` in `tests/api-parity.test.ts`.
9. If you add a token, record it in `docs/tokens.md`.

## Changes in BOB that would remove conflicts

These are options to evaluate in the backbone. None is decided.

| Change | Removes |
|---|---|
| Let a cell import React hooks, or a fixed list of React APIs | Finding 1 (state, `cloneElement`, stable ids) |
| Let a cell import other cells, including an icon cell | Finding 1 (duplicated toggle, icons, divider) |
| Allow a derived modifier, for example a ternary in `className` | Finding 2 (`return` branches, `:has()`) |
| Need a rule for a boolean modifier only when the cell renders a difference | Finding 2 (filler rules) |
| Treat a custom property declared in the same stylesheet as local, not as a token | Finding 3 (spinner length) |
| Add alias tokens and number, duration, shadow, font-weight and image types | Findings 3 and 4 |
| Let a cell style its classes under a declared parent cell's classes | Relaxation `parent-modifier-selectors` |
| Let `space` tokens size icons, or document the `size` rule | Finding 5 |
| Copy `role` and `aria-*` from the markup into `a11y.json` | Finding 7 |
| Add number and callback property types, and a place for methods in the contract | Finding 10 |
| Include attribute selectors in class closure | Finding 8 |
