# Findings: slider

Reference: Tegel `tds-slider` at `@scania/tegel@1.66.1`
(`packages/core/src/components/slider/`). Cell: `cells/react/slider/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS, after one change (departure 2) |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | All props and events; `reset` dropped |
| Behaviour (DOM tests) | Modifier classes, range attributes, aria-label, ticks and snapping, tooltip and aria-valuetext, `tdsInput` and `tdsChange`, controls, number field, read-only keys, min greater than max |
| Tokens added | 31 |

## Departures from Tegel

1. **The slider is a native `<input type="range">`.** Tegel hides a native range and
   draws its own track, fill and thumb, which its script moves with `style.left` and
   `style.width`. A cell has no `style` attribute. The native range gives dragging,
   track clicks, the keyboard (arrows, Home, End, Page Up, Page Down), touch and form
   reset for free. The thumb stays inside the track at both ends.
2. **The fill is a `<progress>` under the range.** WebKit has no fill part for a range,
   and a CSS-only fill needs a colour token on `border-image`, which BOB's `token-usage`
   rule rejects. The cell draws the track with `.tl-slider__inner::before` and the fill
   with a hidden `<progress>`; the range draws only the thumb. The input handler sets the
   progress value through the DOM. The fill spans the whole track, so its end stays under
   the thumb at every value; it does not end exactly at the thumb centre. A form reset
   does not move it.
3. **The tooltip is a fixed value readout.** Tegel's tooltip floats over the thumb,
   positioned by script. The cell shows the same bubble at the end of the label row. A
   relaxation that sets the position from script was considered and rejected: it breaks
   the rule against styles for a visual detail only.
4. **The tooltip, the number field, the fill and `aria-valuetext` follow the range
   through the DOM.** The input handler writes them. A form reset moves the range only.
5. **The controls are buttons.** Tegel uses `<div role="button">`. Tegel's `+` and `-`
   keys are not handled; the native range has its own keys.
6. **The number field is drawn by the cell.** Tegel uses `tds-text-field`. A cell cannot
   use another cell (L12), so it draws a small number field with the text field's
   styles. Clicking the max value does not step the slider down, as it does in Tegel.
7. **The hover halo and the pressed thumb are `box-shadow` and a larger thumb.** Tegel
   draws a `::before` circle; a native thumb has no `::before`. The focused thumb shows
   the focus ring, not Tegel's larger thumb with a faint halo.
8. **The label row is in the flow.** Tegel pads the slider by 65px and places the label
   over it with `translateY(-100%)`.
9. **No live region.** The native range announces its own value; Tegel adds an
   `aria-live` element.
10. **The label is linked only when `sliderId` is set.** Tegel makes a random id.
11. **No method** (`reset`).

Visual checks for Phase 7: the thumb, halo and pressed sizes, the tick positions over
the native track, the label spacing, and the fill end under the thumb.

## Findings about BOB

1. **A value-driven geometry has no general conforming path.** A tooltip that follows a
   value needs the value in a style (a `style` attribute, or a custom property set in
   one). The bootstrap prompt forbids both, so the tooltip stays fixed. The fill has a
   workaround only because `<progress>` takes its value as an attribute. Source:
   structural.
2. **`token-usage` does not list `border-image` or `accent-color`.** Both take colours, and
   both are the CSS-only ways to colour a native range. Source: structural.
3. **The gate's inline-style check reads only quoted attributes.** `style="…"` fails it;
   JSX `style={{ … }}` passes it. Our prompt-rule check catches both. Source: structural.
