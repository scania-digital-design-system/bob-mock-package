# Findings: message

Reference: Tegel `tds-message` at `@scania/tegel@1.66.1`
(`packages/core/src/components/message/`). Cell: `cells/react/message/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | All Tegel props except `modeVariant` (out of scope); `children` added |
| Behaviour (DOM tests) | Role, accessible name fallback, variant and minimal classes, icon per variant and `noIcon`, header, extended text hidden when minimal |
| Tokens added | 9 |

## Departures from Tegel

1. **Element.** Tegel puts the role and the label on a `<tds-message>` host (shadow DOM)
   around a styled wrapper. The cell renders one `<div>` with the role, the label and
   the classes.
2. **The default slot is `children`.**
3. **No `aria-describedby`.** Tegel generates a new id on every render and points
   `aria-describedby` at the extended text. A bootstrap cell has no stable id (no
   `useId`, L12), so the cell drops the ids. The accessible name (header, `tdsAriaLabel`
   or "<variant> message") is unchanged.
4. **The icon is an inline SVG.** Tegel uses `tds-icon` (20px, named by variant). The
   cell draws the same four paths, copied from Tegel's icon set (`iconsArray.js`), in an
   `aria-hidden` `<svg>`. Tegel's icon is also `aria-hidden`, so its title is not exposed
   either.
5. **Icon spacing is a margin.** Tegel pads the icon host. The cell uses `margin-right`
   on the `<svg>` with the same values.
6. **`modeVariant`** is out of scope (ADR 0002 D8).

## Findings about BOB

1. **Every icon is copied into the cell.** A cell cannot import an icon cell (L12), so the
   four paths (about 1 kB) live in the message. Every later component that shows a Tegel
   icon repeats this. Source: structural.
2. **No stable ids, again.** Like the card, the message drops an id that Tegel generates.
   Here it costs `aria-describedby`. `useId` would fix it, which makes this a candidate
   for a `react-hooks` relaxation. We kept the conforming resolution because the
   accessible name still works. Source: structural.
3. **A boolean modifier can carry the default state.** `tl-message--minimal-false` holds
   the padding and the left border, so it is a real rule, not a filler rule as in the
   badge, button and link. Source: structural.

## Open for visual comparison (Phase 7)

- The icon colours and the 4px left border in each variant.
- The minimal error header colour.
