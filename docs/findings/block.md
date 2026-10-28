# Findings: block

Reference: Tegel `tds-block` at `@scania/tegel@1.66.1`
(`packages/core/src/components/block/`). Cell: `cells/react/block/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | `componentTag`, except `modeVariant` (out of scope); `children` added |
| Behaviour (DOM tests) | The element from `componentTag` (default `div`), `tl-block` on every nested block |
| Tokens added | 5 |

## Departures from Tegel

1. **Element.** Tegel renders a `<tds-block>` host (shadow DOM) around the chosen element.
   The cell renders the chosen element only.
2. **The default slot is `children`.**
3. **Nesting is styled in CSS.** Tegel counts its `tds-block` ancestors when it renders
   and adds `tds-block-even` or `tds-block-odd`. The cell writes the alternation as
   descendant selectors (`.tl-block .tl-block`, …) for six levels. A seventh level and
   deeper keep the sixth level's background.
   - Tegel counts once per render, so a block moved in the DOM keeps its old class until
     it renders again. The cell's selectors always match the current DOM.
4. **`modeVariant`** is out of scope (ADR 0002 D8).

## Findings about BOB

1. **A class that depends on DOM context is not reachable.** The nesting level needs the
   DOM (a ref) or a context, and a bootstrap cell has neither (L12), nor a derived class
   (L11). Descendant selectors are the conforming resolution, for a fixed depth.
   Source: structural.
2. **A variant can pick the element, not a class.** `componentTag` is a `VARIANT` with
   an `answers` entry, but it selects the tag and renders no modifier class. The gate
   accepts it: class closure only checks the classes the markup names. The drafted
   `prop-value` rule text ("a modifier class per value … where the target carries only
   markup") fits a markup-only target, not this one. Source: structural.
3. **Typography needs four tokens per style.** `body-01` needs a family, a size, a line
   height and a letter spacing token, and the weight stays a keyword
   (`docs/tokens.md`). Source: structural.

## Open for visual comparison (Phase 7)

- Compare the nested demo row: four levels on both sides.
