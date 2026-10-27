# Findings: card

Reference: Tegel `tds-card` at `@scania/tegel@1.66.1`
(`packages/core/src/components/card/`). Cell: `cells/react/card/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS (after the gate caught a missing `.tl-card__inner` rule) |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | All Tegel props and `onTdsClick`, except `modeVariant` (out of scope); `thumbnail`, `bodyImage`, `body`, `actions` added |
| Behaviour (DOM tests) | `div` or `button` root, `aria-label` fallback, `tdsClick` with `detail.cardId`, every section, image placement order, stretch, ids from `cardId`, expandable open and closed |
| Tokens added | 14 |

## Departures from Tegel

1. **Element.** Tegel renders a `<tds-card>` host with shadow DOM. The cell renders the
   card element (`div`, or `button` when clickable) directly.
2. **Slots become props.** `thumbnail`, `body-image`, `body` and `actions` are the props
   `thumbnail`, `bodyImage`, `body` and `actions` (`ReactNode`). The `header` and
   `subheader` slots are dropped; the props of the same name cover them.
3. **Expand and collapse use `<details>`/`<summary>`.** Tegel keeps `expanded` as mutable
   internal state and toggles it from a `tds-button` in the header. A bootstrap cell has
   no state (BOB finding 1), so the header becomes a native `<summary>` and the browser
   holds the open state; `expanded` sets the initial state.
   - The whole header toggles, not only the chevron button.
   - The accessible name of the toggle is the header text; Tegel's is
     "Toggle card content".
   - Everything after the header collapses. With `imagePlacement="below-header"` the
     image and divider hide too; Tegel hides only the body.
   - Changing `expanded` after the user has toggled does not override the browser state.
4. **The inner pieces are the cell's own markup.** Tegel's card uses `tds-button`,
   `tds-icon` and `tds-divider`. The cell draws the chevron as an inline SVG and the
   divider as an `<hr>`, styled in `component.css` (BOB finding 2).
5. **No random `cardId`.** Tegel generates one; without hooks there is no stable id, so
   the cell sets the `header-*` and `body-*` ids only when `cardId` is given. The
   clickable label falls back to "Card" instead of "Card <random id>".
6. **`tdsClick` is a callback.** `onTdsClick` receives a real `CustomEvent('tdsClick')`
   with `detail.cardId`, so a handler written for `@scania/tegel-react` still works. It
   does not bubble through the DOM.
7. **Image placement has no class.** Tegel adds `above-header`/`below-header` classes; the
   cell expresses placement by element order only, so no rule is owed for them.
8. **`modeVariant`** is out of scope (ADR 0002 D8).

## Findings about BOB

1. **No state.** Expandable is Tegel's only stateful behaviour in these five components,
   and the prompt's ban on imports makes `useState` unreachable. A native element was the
   only stateful option left.
2. **Cells cannot compose cells.** A bootstrap cell imports nothing, so the card cannot
   use the button cell for its toggle. It re-implements a ghost `sm` button's padding in
   its own stylesheet. In Tegel the card reuses `tds-button`, `tds-icon` and
   `tds-divider`.
3. **The gate caught a real gap.** The first draft named `tl-card__inner` in the markup
   with only `--stretch-*` modifier rules. Class closure failed it; the prompt-rule check
   (which looks the other way: rules the markup cannot render) did not. The fix gives
   `.tl-card__inner` Tegel's `border-box`.
4. **No shadow type.** Shadows are composed from `size` offsets and 8-digit hex `color`
   tokens. They pass `token-usage` because `color` is allowed on `box-shadow`.
5. **Nested interactive content.** A clickable card is a `<button>` that can contain the
   `actions` buttons. Tegel does the same; neither the gate nor the prompt checks it.

## Open for visual comparison (Phase 7)

- Tegel's `card.scss` styles `.tds-divider`, but its divider is a `<tds-divider>` element;
  check whether Tegel's divider really has the 16px side margins the cell gives it.
- Compare the header height with the expand chevron: the cell pads the chevron to match a
  `sm` ghost button, without the button's border.
