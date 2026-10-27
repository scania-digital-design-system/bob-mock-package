# Findings: spinner

Reference: Tegel `tds-spinner` at `@scania/tegel@1.66.1`
(`packages/core/src/components/spinner/`). Cell: `cells/react/spinner/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | Exact: `size`, `variant` |
| Behaviour (DOM tests) | `role="status"`, `aria-live="assertive"`, `aria-label="loading"`, hidden SVG, size and variant classes |
| Tokens added | 10 (8 sizes, 2 durations carried as `COLOR`) |

## Departures from Tegel

1. **Element.** Tegel renders a `<tds-spinner>` host (light DOM) around the same
   `<div role="status">`. The cell renders the `<div>`, with a `tl-spinner` class for the
   host's `display: block`.
2. **Size classes on the SVG, geometry by descendant selector.** Tegel's size class sets
   local custom properties that the circle reads. The cell repeats the geometry under
   `.tl-spinner__svg--<size> .tl-spinner__circle` instead (BOB finding 1).
3. **One keyframes rule per size.** Tegel has one `dash` animation that reads the local
   dash length. The cell has `tl-spinner-dash-{xs,sm,md,lg}` (BOB finding 1). The keyframe
   names are also namespaced, so they cannot collide with a consumer's `dash`.
4. **No TRATON or dark values** (ADR 0002 D8).

## Findings about BOB

1. **No local custom properties.** The gate treats every `var(--…)` as a design-token
   reference. A component-scoped variable such as `--spinner-radius` fails both token
   membership and token closure, so each size must spell out its geometry and its
   animation. The stylesheet is about four times longer than Tegel's. Covered by a gate
   test in `bob/gate_test.go`.
2. **Durations have no type.** `1.8s` and `2s` are carried as `COLOR` (`docs/tokens.md`
   finding 1); `tokens.dtcg.json` labels them `$type: "color"`.
3. **`size` tokens on SVG geometry.** `cx`, `cy`, `r` and `stroke-width` take `size`
   tokens. BOB's `token-usage` has no rule for them, so any category would pass.

## Open for visual comparison (Phase 7)

- `cx`, `cy` and `r` set from CSS need SVG 2 geometry-property support; Tegel relies on
  the same. Compare in the target browsers.
- The demo shows inverted spinners on a dark row; Tegel's inverted stroke is white.
