# Findings: banner

Reference: Tegel `tds-banner` at `@scania/tegel@1.66.1`
(`packages/core/src/components/banner/`). Cell: `cells/react/banner/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | Relaxed: `react-hooks` |
| Public API vs `@scania/tegel` types | All props and `onTdsClose`; `actions` added; `hideBanner`, `showBanner` dropped |
| Behaviour (DOM tests) | Role and `aria-live`, icon by variant or name, header, subheader, actions, close with cancelable `tdsClose`, `isHidden` |
| Tokens added | 3 |

## Departures from Tegel

1. **Element.** Tegel puts the role and classes on the host (shadow DOM). The cell renders
   one `<div>` with them.
2. **The hidden state uses `useState`** (relaxation `react-hooks`). `isHidden` is the
   initial state. A close sends a cancelable `tdsClose` and hides only if it is not
   prevented. The hidden banner uses the `hidden` attribute, and the stylesheet keeps it
   hidden with `[hidden]`.
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
