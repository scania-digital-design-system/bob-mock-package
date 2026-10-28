# Findings: checkbox

Reference: Tegel `tds-checkbox` at `@scania/tegel@1.66.1`
(`packages/core/src/components/checkbox/`). Cell: `cells/react/checkbox/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | All props and events; `label` added; methods `focusElement`, `toggleCheckbox` dropped |
| Behaviour (DOM tests) | Label, checked, indeterminate, disabled, form attributes, `tdsChange` detail, `tdsFocus`/`tdsBlur` around the `FocusEvent` |
| Tokens added | 15, shared with the radio button (`docs/tokens.md`) |

## Departures from Tegel

1. **The root is a `<label>`.** Tegel renders an `<input>` and a `<label for>` with a
   random id. The cell wraps the input and the text in one `<label>`, so it needs no id.
   `checkboxId` sets the input's id only when given.
2. **The label slot is a `label` prop.**
3. **The browser holds the checked state.** `checked` is the initial state
   (`defaultChecked`). Tegel's `checked` is reactive; the cell ignores a later change.
   A form reset restores the initial state natively, as Tegel's reset listener does.
4. **`indeterminate` is set by a callback ref on every render.** A click clears it
   natively. If the prop stays `true`, the next render sets it again; Tegel sets its prop
   to `false` on a click.
5. **No `aria-checked`.** The native checkbox exposes its state. Tegel's attribute is
   set from the prop, so it goes stale after a click.
6. **No methods.** `focusElement()` and `toggleCheckbox()` need a handle on the element.
7. **Events are callbacks.** `onTdsChange` gets Tegel's detail. `onTdsFocus` and
   `onTdsBlur` get a `CustomEvent` whose `detail` is the `FocusEvent`, as Tegel emits.

## Findings about BOB

1. **A callback ref needs no import.** `ref={(input) => …}` sets a DOM property
   (`indeterminate`) that JSX cannot set as an attribute. This is a resolution inside the
   rules. Source: structural.
2. **No method surface.** Exposing methods needs `forwardRef` or `useImperativeHandle`,
   which need imports, and the contract has no place for methods. Source: structural.
3. **The check and dash icons are image tokens.** Tegel's CSS masks are SVG data URLs;
   they are carried as `COLOR` in an `image/…` category, like the footer wordmark.
   Source: structural.
4. **`opacity: 1` needs a token.** The literal rule forbids a bare number on `opacity`, so
   `opacity/full` is a token. Source: structural.
