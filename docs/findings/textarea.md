# Findings: textarea

Reference: Tegel `tds-textarea` at `@scania/tegel@1.66.1`
(`packages/core/src/components/textarea/`). Cell: `cells/react/textarea/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | Relaxed: `react-hooks` (`useState`, `useId`) |
| Public API vs `@scania/tegel` types | All props and events except `modeVariant` (out of scope); method `focusElement` dropped |
| Behaviour (DOM tests) | Modifier classes, label and helper linked by id, `aria-invalid` and `aria-readonly`, live counter, error and read-only icons, `tdsInput`, no focus event when read-only |
| Tokens added | 20 |

## Departures from Tegel

1. **Focus and filled states come from CSS.** Tegel keeps a `focusInput` state and a
   `textarea-data` class for the inside label. The cell uses `:focus-within` and
   `:not(:placeholder-shown)`. The placeholder falls back to a space so that
   `:placeholder-shown` works without one.
2. **The browser holds the value** (`defaultValue`); a later `value` change is ignored.
   The counter keeps its own length with `useState`.
3. **`tdsChange` fires on every input.** React's `onChange` is the input event, so the
   cell cannot listen for the native `change` (on commit) without a ref and an effect.
4. **The read-only tooltip is a native `title`.** Tegel shows a `tds-tooltip`; the cell
   cannot use the tooltip cell.
5. **`maxLength`, `cols` and `rows` are strings** (`README.md` finding 10).
6. **`aria-invalid` comes from `state` only.** Tegel also reads an `aria-invalid`
   attribute on the host.
7. **No `focusElement()` method**, and **`modeVariant`** is out of scope. Tegel's
   read-only background depends on the mode variant, so it is not set either way.

## Findings about BOB

1. **The second user of `react-hooks`.** The live counter needs `useState`; the label and
   helper ids need `useId`. Source: structural.
2. **CSS state selectors replace UI state.** `:focus-within` and `:placeholder-shown`
   express Tegel's focus and data classes inside the rules. Source: structural.
3. **Event timing changes with the target.** Tegel's events follow the DOM; React's
   `onChange` does not. Mapping a Tegel event to a React prop is a choice BOB's contract
   has no field for. Source: structural (React target).
4. **Five modifier axes need many filler rules.** Each boolean renders `-true` and
   `-false`, and every value needs a rule, so several rules only repeat a default
   (`--no-min-width-false`, `--read-only-false`, `--label-outside`). Source: structural.
