# Findings: popover

Reference: Tegel `tds-popover-core`, `tds-popover-canvas`, `tds-popover-menu` and
`tds-popover-menu-item` at `@scania/tegel@1.66.1` (`packages/core/src/components/popover-*`).
Cells: `cells/react/popover-core/`, `popover-canvas/`, `popover-menu/` and
`popover-menu-item/`, each in `scania/v1/`. The tooltip uses the same pattern
(`tooltip.md`).

## Result

| Check | popover-core | popover-canvas | popover-menu | popover-menu-item |
|---|---|---|---|---|
| BOB hard gate (real, `npm run gate`) | PASS | PASS | PASS | PASS |
| Bootstrap prompt rules | PASS | PASS | PASS | PASS |
| Public API vs `@scania/tegel` types | `children` added; `close`, `modifiers`, `offsetDistance`, `offsetSkidding` dropped | the same | `children` added; `close`, `offsetDistance`, `offsetSkidding` dropped | `children` added |
| Behaviour (DOM tests) | Placement class, popover mode, click toggle with the reference as anchor, `referenceEl`, keyboard focus, `show`, `defaultShow`, hover by mouse and focus, `hover-popover`, Escape | Role, placement, click | Width classes, items, click | Role, `aria-disabled`, classes |
| Tokens added | 9 (family) | — | — | — |

## Departures from Tegel

1. **Each popover is a native popover.** Tegel moves a host with Popper.js and
   `style` attributes, and hides it with `visibility`. The cell is a `<div popover>` in
   the top layer, opened with `showPopover()`. It needs no `z-index`.
2. **CSS anchor positioning replaces Popper.js.** `showPopover({ source })` makes the
   reference the popover's anchor. A `position-area` rule per placement puts the popover
   next to it, and `position-try-fallbacks` flips it when it does not fit. Popper's
   `auto` picks the side with the most space; the cell opens below and flips up.
3. **Browsers without anchor positioning or `source`** show the popover at the top left
   of the viewport.
4. **`offsetDistance`, `offsetSkidding` and `modifiers` are dropped.** A free offset and
   Popper's modifiers need a `style` attribute. The 8px default distance is the token
   `space/popover/offset`.
5. **A click popover is `popover="auto"`.** The browser closes it on a click outside and
   on Escape, and closes other open click popovers, as Tegel's `internalTdsShow` does.
   A popover with `show` or a hover trigger is `popover="manual"`. Opening it does not
   close the others. Light dismiss also runs on a click on the reference: it hides the
   popover on pointerup, before the click. So the cell reads the open state on
   `pointerdown`, and a second click closes the popover, as in Tegel.
6. **The listeners live in a callback ref,** as in the modal. The ref adds them to the
   reference and the document and removes them when React detaches it. Tegel also
   watches the DOM for a reference that appears later. The cell finds it on the next
   render.
7. **`defaultShow` applies once.** The ref marks the popover with `data-ready` after the
   first attach, so a later render does not open it again.
8. **A keyboard click moves focus into the popover.** The cell tests `event.detail === 0`.
   Tegel listens for Enter and Space and also does this on a hover by focus, which takes
   focus away from the reference. The cell does not copy that.
9. **`autoHide` has no effect.** Tegel declares it but does not read it.
10. **The menu item styles the consumer's link or button with `> *`.** Tegel uses
    `::slotted(*:not(tds-icon))`. The menu styles a divider with `> [role='separator']`.
11. **No methods** (`close`), no animation and no `modeVariant` (ADR 0002 D8).

Visual checks for Phase 7: the position for each placement, the flip near the viewport
edge, the canvas and menu shadows, and the menu item hover and focus ring.

## Findings about BOB

1. **The platform can replace a positioning library.** The popover API and CSS anchor
   positioning give placement, flip, light dismiss and Escape with no `style` and no
   hooks. Source: structural.
2. **A placement is a modifier with a rule per value.** Popper has 15 placements, so each
   popover stylesheet repeats 12 rules. The four cells repeat the same script. A cell
   cannot share code with another (L12). Source: structural.
3. **A free number that moves an element has no conforming path,** as with the slider
   tooltip. The offsets are dropped. Source: structural.
