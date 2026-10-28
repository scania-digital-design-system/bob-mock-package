# Findings: accordion

Reference: Tegel `tds-accordion` and `tds-accordion-item` at `@scania/tegel@1.66.1`
(`packages/core/src/components/accordion/`). Cells: `cells/react/accordion/scania/v1/` and
`cells/react/accordion-item/scania/v1/`.

## Result

| Check | accordion | accordion-item |
|---|---|---|
| BOB hard gate (real, `npm run gate`) | PASS | PASS |
| Bootstrap prompt rules | PASS | Relaxed: `parent-modifier-selectors` |
| Public API vs `@scania/tegel` types | `hideLastBorder`; `modeVariant` out of scope; `children` added | All props and `onTdsToggle`; `children` added; 4 methods dropped |
| Behaviour (DOM tests) | Last-border modifier | Modifier classes, heading level, ids, initial state, toggle, cancelable `tdsToggle`, disabled, `expanded` after a click, stable ids |
| Tokens added | 6 (family) | — |

## Departures from Tegel

1. **Elements.** Tegel renders hosts (shadow DOM). The cells render the item `<div>`, the
   heading, the button and the panel directly.
2. **`header` is a `ReactNode`.** Tegel has a `header` string prop and a `header` slot,
   rendered one after the other. A prop and a slot cannot share a name in React, so one
   `header` prop takes both text and markup.
3. **The expanded state is the button's `aria-expanded`.** `expanded` renders it, so
   React applies a change of `expanded`. A click sends a cancelable `tdsToggle` first and,
   only if the listener does not prevent it, sets `aria-expanded` in the DOM, as Tegel
   toggles.
4. **The expanded styles read `aria-expanded`.** Tegel adds an `expanded` class from its
   state. A state cannot be a modifier (L11), so the panel and chevron rules use
   `:has(> [role='heading'] > [aria-expanded='true'])`.
5. **Ids generated once, in a callback ref.** The ref gives the button and the panel ids
   from `crypto.randomUUID()` on the first attach, and links them with `aria-controls`
   and `aria-labelledby`. Tegel makes new ids on every render. Server-rendered markup has
   no ids until the page runs.
6. **The accordion's `:active` shading uses the parent's class.** Tegel shades every item
   header while the accordion is pressed (`:host(:active)`). The item's stylesheet uses
   `.tl-accordion:active` (relaxation `parent-modifier-selectors`).
7. **No methods** (`toggleAccordionItem`, `expand`, `collapse`, `isExpanded`).
8. **The chevron is an inline SVG** with Tegel's `chevron_down` path, as in the footer.

## Findings about BOB

1. **A cancelable event needs a callback and a place for the state.** Tegel lets a
   listener veto the change. The cell sends the event to the callback and keeps the
   state in an ARIA attribute. The checks do not see that state. Source: structural.
2. **A hover margin of `-1px` needs a token** (`space/accordion/hover-offset`). Source:
   structural rule, Tegel-specific trigger.
