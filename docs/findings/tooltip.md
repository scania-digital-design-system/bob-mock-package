# Findings: tooltip

Reference: Tegel `tds-tooltip` at `@scania/tegel@1.66.1`
(`packages/core/src/components/tooltip/`). Cell: `cells/react/tooltip/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | `children` added; `offsetDistance`, `offsetSkidding` dropped |
| Behaviour (DOM tests) | Placement class, popover mode, text, `aria-label`, `aria-describedby`, hover by mouse and focus, click trigger, `mouseOverTooltip`, `defaultShow`, Escape |
| Tokens added | 3 |

## Departures from Tegel

1. **The tooltip is a native popover placed with CSS anchor positioning,** as the
   popover cells are (`popover.md`, departures 1 to 7). A hover tooltip is
   `popover="manual"`; a click tooltip is `popover="auto"`.
2. **The square corner follows the requested placement.** Tegel reads the placement
   Popper chose, after a flip. The cell reads the `placement` prop, so a flipped tooltip
   keeps the corner of the side it was asked for.
3. **`show` is not changed by the tooltip.** Tegel's `show` is mutable: the tooltip
   writes it when it opens or closes. The cell applies `show` on each render and keeps
   the open state in the popover.
4. **`offsetDistance` and `offsetSkidding` are dropped** (`popover.md`, departure 4).
5. **No fade.** Tegel fades in over 200ms; animation is out of scope (ADR 0002 D8).

Visual checks for Phase 7: the position below the reference, the square corner of the
`-start` and `-end` placements, and the wrap at 192px.

## Findings about BOB

The popover findings apply (`popover.md`).
