# Findings: footer

Reference: Tegel `tds-footer`, `tds-footer-group` and `tds-footer-item` at
`@scania/tegel@1.66.1` (`packages/core/src/components/footer/`). Cells:
`cells/react/footer/scania/v1/`, `cells/react/footer-group/scania/v1/` and
`cells/react/footer-item/scania/v1/`.

## Result

| Check | footer | footer-group | footer-item |
|---|---|---|---|
| BOB hard gate (real, `npm run gate`) | PASS | PASS | PASS |
| Bootstrap prompt rules | PASS | Relaxed: `parent-modifier-selectors`, `react-hooks` | Relaxed: `parent-modifier-selectors` |
| Public API vs `@scania/tegel` types | `modeVariant` out of scope; `top`, `start`, `end`, `copyright` added | All Tegel props; `title`, `children` added | `children` added (Tegel has no props) |
| Behaviour (DOM tests) | `contentinfo`, each part only when used, default copyright with the year | Labelled `nav` and `list`, title slot over `titleText`, toggle opens and closes | `listitem`, consumer link kept as a direct child |
| Tokens added | 15 (all three) | — | — |

## Departures from Tegel

1. **Elements.** Tegel renders hosts (shadow DOM) around a `<footer>`, a group and an item.
   The cells render the `<footer>`, the group `<div>` and the `listitem`.
2. **Slots are props.** `top`, `start`, `end` and `copyright` on the footer; `title` and
   `children` on the group; `children` on the item.
3. **Groups and items read their place through CSS.** Tegel checks the parent's `slot`
   attribute when it connects. The cells style themselves under the footer's part classes
   (`.tl-footer__top`, `__start`, `__end`; relaxation `parent-modifier-selectors`).
4. **The mobile collapse uses a media query and `useState`.** Below 992px, Tegel turns
   each top group's title into a toggle, from a window resize listener and an
   `isMobile` state. The cell renders the title and the toggle in every viewport, and a
   media query shows one of them, so it needs no listener. Only the open state is kept,
   with `useState` (relaxation `react-hooks`). The groups start closed, as in Tegel.
   - The title content is rendered twice, once in each element. The hidden one is
     `display: none`, so assistive technology reads one.
   - A top group with no title has an empty toggle on mobile, as in Tegel.
5. **The brand name is fixed.** Tegel reads "Scania" or "Traton" from a `.traton`
   ancestor. The cell is the `scania` cell, so it writes "Scania".
6. **The wordmark loads from Tegel's CDN only.** Tegel tries its local asset first. The
   cell has only the CDN URL, from a token (BOB finding 2), so it needs the network.
7. **`aria-expanded` is on the toggle, not the group.** Tegel sets it on the group host,
   so it is `false` on every desktop group too. The cell sets it on the button that
   controls the list, and the stylesheet reads it to hide the closed list.
8. **No console warnings** for a missing `tdsListAriaLabel` or a deprecated `titleText`.
9. **Not reproduced: Tegel's `p.copyright` mobile padding.** The copyright is a `<small>`,
   so Tegel's own rule never matches.
10. **A heading in the title takes the title's type.** Tegel leaves the slotted heading
    to the page's global heading styles (`tegel.css` styles every `h1`–`h6`). The package
    has no global styles, so the cell sets `font: inherit` on the title's content, which
    gives it Tegel's `headline-07`. Tegel's stories use `<h6>`, which renders as
    `headline-06` there: the same size and weight, in the wider Scania Sans.

## Findings about BOB

1. **Compound components need a relaxation, again** (`stepper.md` finding 1).
   Source: structural.
2. **No asset token.** The wordmark is a brand asset, so it belongs in the brand's
   tokens, but BOB has no image or URL type. It is carried as `COLOR`
   (`image/footer/wordmark`), and `tokens.dtcg.json` calls it a colour. Figma variables
   have no image type either. Source: structural.
3. **Breakpoints cannot be tokens.** CSS does not allow `var()` in a media query, so the
   992px breakpoint is a literal. Neither the prompt-rule check nor the gate reads at-rule
   preludes, so nothing flags it. Source: structural.
4. **Brand text has no token type.** A `STRING` token binds only as a font family, so the
   brand name is written in the cell. BOB keeps one cell per brand, so this stays
   correct, but it is copied into every brand's cell. Source: structural.
5. **State needs a relaxation.** The mobile collapse needs `useState`, which L12 forbids
   (`react-hooks` in `README.md`). The viewport part needs none: a media query does it.
   Source: structural.
6. **A state cannot be a modifier class.** L11 interpolates only a declared prop, so the
   open state is read from `aria-expanded` with an attribute selector, which no check
   reads (finding 8 in `README.md`). Source: structural.

## Open for visual comparison (Phase 7)

- The wordmark and the top part's four-column grid.
- The mobile layout below 992px, with the groups open.
