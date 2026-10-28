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

The foundation set adds 31 tokens. The `tegel` set has 112 names in total. BOB's stock
set has 45.

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

### 3. The gate treats every `var()` as a design token

- **spinner:** local custom properties fail token membership and token closure. Each size
  writes out its geometry and has its own `@keyframes`. The stylesheet is about four times
  longer than Tegel's.
- **badge, tag:** BOB has no alias tokens. Tegel's component token points to a system
  token; the cell uses the system token directly. The tag drops six icon tokens that
  alias its text tokens.

### 4. The token model has no number, duration, shadow or font-weight type

- **spinner, card:** durations and timings are carried as `COLOR`.
- **card:** shadows are composed from `size` offsets and 8-digit hex `color` tokens.
- **badge:** the font weight is the keyword `bold`.
- `tokens.dtcg.json` labels every carried value `$type: "color"`. A typography
  `.fontSize` emits an empty declaration. Details: `docs/tokens.md`.

### 5. `token-usage` categories differ from Tegel's use

- **button:** Tegel sizes the icon with spacing tokens. BOB forbids `space` on `width` and
  `height`, so the cell adds `size/button/icon*` tokens with the same values.
- **spinner:** `token-usage` has no rule for SVG geometry (`cx`, `r`, `stroke-width`). Any
  category passes.

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

### 9. The resolve path gives a different button

BOB's registry has a React button template with `label`, `onClick` and inline styles. A
real publish of `button` resolves through it and never bootstraps. These cells show the
bootstrap path only (ADR 0002 D2).

## Conflicts and resolutions

Each row is one kind of conflict. "Cost" is what the resolution gives up.

### Markup

| Tegel has | BOB rule | Resolution | Cost | Where |
|---|---|---|---|---|
| A custom element host, often with shadow DOM | The cell is a bare function that returns markup | Render the inner native element. Move host styles onto the root class. | Consumers cannot select `tds-*` tags. | all |
| A named slot | An instance swap is a prop | Make it a `ReactNode` prop with the slot's name in camelCase. | None in React. Angular needs the same mapping. | button `icon`; card `thumbnail`, `bodyImage`, `body`, `actions`; tag `prefix` |
| A default slot for any content | An instance swap is a prop | Make it the `children` prop. | None in React. | block, message |
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

Choose between a `return` branch and `:has()` like this:

- The class depends on prop values: use a `return` branch.
- The class depends on which children are present: use `:has()`.
- Keep the number of branches small. More than two branches means the markup is
  duplicated too often; report it as a finding.

### State and events

| Tegel has | BOB rule | Resolution | Cost | Where |
|---|---|---|---|---|
| Mutable internal state | No hooks (L12) | Use a native element that holds state (`<details>`). The prop sets the initial state. | Different toggle area and name. A prop change after a user toggle is ignored. | card `expanded` |
| State with no native element | No hooks (L12) | Drop it. Record a departure. | Behaviour is lost. | button keyboard `.active` |
| A custom event (`tdsClick`) | No event emitter | A callback prop that receives a real `CustomEvent` with the same `detail`. | The event does not bubble through the DOM. | card `onTdsClick` |
| Logic that runs once (`componentWillLoad`, one-way flags) | The cell renders from props only | Derive on every render. Do not copy the stale-state bug. | None. A behaviour departure to record. | badge, button `onlyIcon`, link disabled |
| A generated id | No hooks for a stable id | Set ids only when the id prop is given. With no id prop, drop the id and what points at it. | No id by default. The message loses `aria-describedby`. | card `cardId`; message |

### CSS and tokens

| Tegel has | BOB rule | Resolution | Cost | Where |
|---|---|---|---|---|
| Local custom properties | Every `var()` is a token | Write the values out per variant. One `@keyframes` per variant. | A longer stylesheet. | spinner |
| An alias token | No alias tokens | Use the token the alias resolves to. Drop an alias whose value another used token already has. | The component-level name is lost. | badge; tag icon colours |
| A value with no token type (duration, opacity, shadow) | Only `COLOR`, `FLOAT` (px) and `STRING` (font family) | Carry it as `COLOR`. Compose a shadow from `size` and `color` tokens. | Wrong `$type` in `tokens.dtcg.json`. | spinner, card |
| A font weight | No font-weight token | Use the keyword (`bold`). | Not a token. | badge |
| A spacing token on `width` or `height` | `token-usage`: `space` only on padding, margin, gap, inset | A `size` token with the same value. | More tokens. | button icon |
| A name BOB's stock set does not have | The gate checks names against the rule data | Reuse a stock name when the meaning is the same. Otherwise add it to the `tegel` set. | The set grows: 112 names against 45. | all |

### API

| Tegel has | BOB rule | Resolution | Cost | Where |
|---|---|---|---|---|
| A prop missing from Tegel's types that React needs | The public API is the destructured props (ADR 0004) | Add it. List it in `DEPARTURES` in `tests/api-parity.test.ts`. | The API is wider than Tegel's. | button `onClick` |
| A variant axis | `DraftContract` needs an `answers` entry | Add the entry to the payload. | None. | every cell with a variant axis |
| `modeVariant`, `animation` | — | Out of scope (ADR 0002 D8). | Dark mode and animation are absent. | button, card, block, message |

## Relaxations

A relaxation breaks one BOB rule on purpose, for a cell where no resolution in the tables
above works (ADR 0006). `rules/relaxations.json` maps each cell ID to the relaxations it
uses. The prompt-rule check skips those cells. A test fails when a listed relaxation has
no entry here.

None yet. Each entry uses this form:

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
| Add alias tokens and number, duration, shadow and font-weight types | Findings 3 and 4 |
| Let `space` tokens size icons, or document the `size` rule | Finding 5 |
| Copy `role` and `aria-*` from the markup into `a11y.json` | Finding 7 |
| Include attribute selectors in class closure | Finding 8 |
