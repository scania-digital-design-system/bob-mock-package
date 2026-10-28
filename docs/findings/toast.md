# Findings: toast

Reference: Tegel `tds-toast` at `@scania/tegel@1.66.1`
(`packages/core/src/components/toast/`). Cell: `cells/react/toast/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | All props and `onTdsClose`; `actions` added; `hideToast`, `showToast` dropped |
| Behaviour (DOM tests) | Role, `aria-live`, variant class and icon, closable, close with cancelable `tdsClose`, `isHidden` after a close |
| Tokens added | 11 |

## Departures from Tegel

1. **Element.** Tegel's host (shadow DOM) wraps a styled `<div>`. The cell renders both
   as `<div>`s.
2. **`toastRole` sets `role`.** Tegel writes it to a `toastrole` attribute, so the toast
   has no ARIA role. The cell sets the `role` it describes.
3. **The hidden state is the `hidden` attribute**, as in the banner (`banner.md` departure 2).
4. **`header` and `subheader` are `ReactNode` props** (`accordion.md` departure 2). Their
   content takes the header and body type, as Tegel forces with `!important`.
5. **The close button has no padding.** Tegel leaves the browser's padding on a 20px
   button; the cell removes it, so the 20px icon fits.
6. **No `aria-describedby` copy and no console warning** for a missing close label.
7. **No methods** (`hideToast`, `showToast`).

## Findings about BOB

1. **No `z-index` token.** Tegel computes the toast's layer (800) from a named list. The
   cell writes the number, as the gate allows a unitless `z-index`. Source: structural.
