# Findings: banner

Reference: Tegel `tds-banner` at `@scania/tegel@1.66.1`
(`packages/core/src/components/banner/`). Cell: `cells/react/banner/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | All props and `onTdsClose`; `actions` added; `hideBanner`, `showBanner` dropped |
| Behaviour (DOM tests) | Role and `aria-live`, icon by variant or name, header, subheader, actions, close with cancelable `tdsClose`, `isHidden`, `isHidden` after a close |
| Tokens added | 3 |

## Departures from Tegel

1. **Element.** Tegel puts the role and classes on the host (shadow DOM). The cell renders
   one `<div>` with them.
2. **The hidden state is the `hidden` attribute.** `isHidden` renders it, so React
   applies a change of `isHidden`. A close sends a cancelable `tdsClose`, and only if it
   is not prevented sets `hidden` and `aria-hidden` in the DOM. The stylesheet keeps a
   hidden banner hidden with `[hidden]`. React does not see the close, so `isHidden`
   shows the banner again only when its value changes.
3. **Only four icons.** Tegel's `icon` takes any of its icon names. The cell carries
   `info`, `error`, `warning` and `tick`; any other name renders no icon. The defaults by
   variant (`error`, `info`) are the same.
4. **`header` and `subheader` are `ReactNode` props.** Tegel has a prop and a slot for
   each (`accordion.md` departure 2). Tegel shows its header slot only when the
   subheader slot is used; the cell always shows the header.
5. **No `aria-atomic` copy.** Tegel copies it from the host's attribute.
6. **No methods** (`hideBanner`, `showBanner`).

## Findings about BOB

1. **An open icon set does not fit a cell.** A prop that names any icon needs the whole
   icon set, which a cell cannot import. The cell supports a fixed list. Source:
   structural.
