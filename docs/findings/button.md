# Findings: button

Reference: Tegel `tds-button` at `@scania/tegel@1.66.1`
(`packages/core/src/components/button/`). Cell: `cells/react/button/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | All Tegel props except `modeVariant`, `animation` (out of scope); `icon` and `onClick` added |
| Behaviour (DOM tests) | Classes, `type`, `name`/`value` only when set, label and icon, `aria-label` only for icon-only, disabled blocks clicks |
| Tokens added | 19 (2 foundation, 17 button) |

## Departures from Tegel

1. **Element.** Tegel renders a `<tds-button>` host (scoped, light DOM) around an inner
   `<button>`. The cell renders the `<button>` only. Host styles (`inline-flex` wrapper,
   host `fullbleed` width) are on the button itself.
2. **Slots become props.** The `icon` slot is an `icon` prop (BOB treats an instance swap
   as a prop). The `label` slot is dropped; `text` covers it.
3. **`onClick` is a declared prop.** Tegel's types do not list the native `click`; a React
   consumer needs it, and BOB's own registry button template exposes `onClick` too.
4. **The label is a `<span class="tl-button__label">`.** Tegel renders `text` as a bare
   text node. The cell needs an element so the stylesheet can tell icon-only from
   text-and-icon (see BOB finding 1).
5. **No keyboard `.active` state.** Tegel adds `.active` to the inner button while Enter is
   held, so the active colours show for keyboard presses. That needs component state and
   a derived class, which the prompt does not allow (BOB finding 1). Not reproduced.
6. **No stale `onlyIcon`.** Tegel sets `onlyIcon` to true when there is no text and never
   resets it. The cell decides on every render.
7. **`modeVariant` and `animation`** are out of scope (ADR 0002 D8).
8. **`:host(.disabled:active) { pointer-events: none }`** is not reproduced; a disabled
   native button already ignores clicks.

## Findings about BOB

1. **Derived classes are pushed into CSS.** Tegel adds `.icon` and `.only-icon` from slot
   presence. The prompt allows only a bare prop name in `className` (L11), so the cell
   expresses both with `:has(.tl-button__icon)` and `:not(:has(.tl-button__label))`. The
   gate accepts this; it relies on `:has()` browser support and moves logic into the
   stylesheet. The badge took the other route (a second `return` branch).
2. **Tegel's token use breaks BOB's `token-usage`.** Tegel sizes the icon with spacing
   tokens; BOB forbids `space` on `width` and `height`. The cell adds `size/button/icon*`
   with the same values.
3. **A boolean modifier needs a rule for `false`.** `tl-button--fullbleed-false` carries
   `width: auto` only so the gate finds a rule.
4. **The resolve path would produce a different button.** BOB's registry has a React
   button template (`label`, `onClick`, inline styles from `tokens.js`). A real publish of
   `button` resolves through it and never bootstraps. This cell follows the bootstrap
   path on purpose (ADR 0002 D2), with the drafted contract. The real pipeline would ship
   a two-prop button.
5. **Many tokens for one component.** Tegel's button needs 17 component tokens on top of
   the foundation set; BOB's stock vocabulary has none of them. The `tegel` set is now 53
   names against BOB's 45.

## Open for visual comparison (Phase 7)

- Check `:has()`-based icon padding against Tegel's `.icon` and `.only-icon` padding.
- Check focus ring (`:focus` 1px outline vs `:focus-visible` 2px ring with a white inner
  ring) side by side with keyboard focus.
