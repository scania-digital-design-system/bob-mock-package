# Findings: tag

Reference: Tegel `tds-tag` at `@scania/tegel@1.66.1`
(`packages/core/src/components/tag/`). Cell: `cells/react/tag/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | `text`, `size`, `variant`; `prefix` added |
| Behaviour (DOM tests) | Size and variant classes in both casings, text, prefix before the text |
| Tokens added | 14 |

## Departures from Tegel

1. **Element.** Tegel puts the classes on a `<tds-tag>` host (scoped, light DOM). The cell
   renders a `<div>` with the classes.
2. **The prefix slot is a `prefix` prop.** It renders where Tegel's slot does, before the
   text, with no wrapper.
3. **The prefix inherits the text colour.** Tegel colours `[slot='prefix']` with the
   variant's icon token. Each icon token aliases the text token of the same variant, so
   the colour is the same, and the cell adds no rule for it.
4. **Capitalised variants keep their case in the class.** Tegel lower-cases the variant
   (`Success` → `success`) before it becomes a class. The cell renders `tl-tag--Success`,
   and the stylesheet lists both casings for each variant.

## Findings about BOB

1. **Case folding is a derived class.** Lower-casing in `className` is a call, which L11
   forbids. So twelve values need twelve selectors instead of six. The gate's class
   closure compares case exactly: a copy with only lowercase rules fails on
   `tl-tag--Warning`. Source: structural rule, Tegel-specific trigger (Tegel keeps
   capitalised values for backwards compatibility).
2. **No alias tokens, again.** The six icon colours are aliases of the text colours. The
   cell drops them instead of adding six tokens with copied values (`badge.md` finding 5).
   Source: structural.

## Open for visual comparison (Phase 7)

- The `lg` tag has no type style in Tegel, so it inherits the page font. Check both demo
  pages inherit the same font.
