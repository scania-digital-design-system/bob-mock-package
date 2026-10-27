# Findings: badge

Reference: Tegel `tds-badge` at `@scania/tegel@1.66.1`
(`packages/core/src/components/badge/`). Cell: `cells/react/badge/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | Exact: `value`, `size`, `isHidden`, `tdsAriaLive` |
| Behaviour (DOM tests) | Matches `checkProps` and `render`: number, `99+`, pill, `sm`, hidden, `aria-live`, `aria-hidden` text |
| Tokens added | 3 (`radius/badge`, `size/badge/lg`, `size/badge/sm`) |

## Departures from Tegel

1. **Element.** Tegel renders the `<tds-badge>` custom element with shadow DOM; the cell
   renders a `<div>` with `role="status"`. Classes are `tl-badge…`, not `tds-badge…`.
2. **No empty `aria-label`.** Tegel sets `aria-label` from an internal state that is
   always `''` and cannot be set. The cell omits it; the accessible name is the same (none).
3. **No stale state.** Tegel's `checkProps` only writes `shape` and `text` when the value
   is numeric and the size is not `sm`, so a badge that changes from `"42"` to `"new"`,
   or from `lg` to `sm`, keeps its old text and pill shape. The cell derives both on every
   render. We do not reproduce the bug.
4. **Dark mode** is out of scope (ADR 0002 D8). Tegel's badge has no dark values anyway.

## Findings about BOB

1. **Derived state cannot be a class modifier.** The prompt allows only a bare prop name
   in a `className` interpolation (L11), and the gate rejects anything else. The pill
   shape is derived from `value` and `size`, so the only conforming way to add
   `tl-badge--pill` is a second `return` branch with a static class. The markup is
   duplicated.
2. **Booleans become a modifier per value.** `isHidden` renders `tl-badge--hidden-true` or
   `tl-badge--hidden-false`, and the gate requires a rule for both. The `false` rule
   carries `display: block`, which Tegel puts on the base class.
3. **`a11y.json` is empty.** A drafted contract only has `structure` rules, so
   `role="status"` and `aria-live` are recorded nowhere in the cell's metadata.
4. **The `prop-value` rule text does not fit free text.** BOB drafts "the caller selects
   one" for a `TEXT` property, which has no values to select from.
5. **No alias tokens.** Tegel's `--component-badge-background-default` resolves to
   `--color-system-danger-default`; BOB cannot express that reference, so the cell uses
   `color/danger` directly (`docs/tokens.md`).
6. **No font-weight token.** The text uses the keyword `bold` (`docs/tokens.md` finding 2).

## Open for visual comparison (Phase 7)

- Tegel's `badge.scss` styles `.tds-badge` and its size classes inside the shadow root,
  but those classes are on the host element, where only `:host(...)` selectors match.
  Check in a real browser which sizes Tegel actually renders.
- Tegel's `tds-box-sizing` sets `border-box` on the host and every child; the cell sets
  it on `.tl-badge` only.
