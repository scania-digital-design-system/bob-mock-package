# Tokens

The scania token set, Tegel's light-mode values in BOB's token model (ADR 0003 D4, D5).
`payloads/_tokens.json` is the source. `npm run tokens` emits `tokens/scania.css` and
`rules/ruledata.json` with BOB's own code; never edit those two by hand.

## How a token is written

| Kind of value | BOB type | Payload name | CSS custom property | Emitted as |
|---|---|---|---|---|
| Colour | `COLOR` | `color/<group>/<name>` | `--color-<group>-<name>` | verbatim |
| Length | `FLOAT` | `<category>/<group>/<name>` | `--<category>-<group>-<name>` | `<n>px` |
| Font family | `STRING` | `font/family/<name>.fontFamily` | `--font-family-<name>` | verbatim |
| Opacity, duration (no BOB type) | `COLOR` carrier | `opacity/…`, `motion/…` | `--opacity-…`, `--motion-…` | verbatim |
| Font weight | — | — | — | CSS keyword (`normal`, `bold`) in the stylesheet |

The first kebab segment is the category the gate's `token-usage` rule reads:

| Category | Allowed on (BOB `tokenUsage`) |
|---|---|
| `color` | colour, background, border and outline colours, `box-shadow`, `fill`, `stroke`, … |
| `space` | `padding*`, `margin*`, `gap`, `inset*` — **not** `width` or `height` |
| `radius` | `border-radius*` |
| `font` | `font*`, `line-height`, `letter-spacing` |
| anything else (`border`, `size`, `opacity`, `motion`, `elevation`, …) | unconstrained |

So a dimension that is not padding, margin or gap (a height, a width, a stroke width, a
shadow offset) needs a non-`space` category, normally `size`.

Do not use a typography group's `.fontSize` or `.fontWeight`: BOB stores them but emits
an empty custom property (`--font-detail: ;`).

## Findings about BOB's token model

1. **No number, duration or shadow type.** `FLOAT` always becomes px, so `opacity: 0.25`
   or `animation-duration: 2s` cannot be a faithful token. We carry them as `COLOR`,
   which binds any string. In `tokens.dtcg.json` they get `$type: "color"`, which is wrong.
2. **No font-weight token.** A `FLOAT` weight emits `700px`; a `.fontWeight` emits nothing.
   BOB's stock vocabulary lists `--font-weight-bold`, which the pipeline cannot emit
   correctly.
3. **A typography `.fontSize` emits an empty declaration** (`--<group>: ;`).

## Vocabulary gap

BOB's stock `ruledata.v2.json` holds 45 names. The foundation set reuses 5 of them where
the meaning is the same: `color/border/focus`, `color/danger`, `font/size/caption`,
`radius/control`, `border/control`. Every other name is in the generated `tegel` set.

| After | `tegel` set |
|---|---|
| Foundation | 31 |
| Badge | 34 |
| Button | 53 |
| Link | 56 |
| Spinner | 66 |

## Foundation set

Tegel source paths are relative to `../tegel` at `@scania/tegel@1.66.1`.
Primitives: `tokens/scss/scania/primitive.scss`; semantic colours:
`tokens/scss/scania/color-light.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/text/strong` | `#0e1013` | `--color-text-strong` |
| `color/text/defined` | `#041530b8` | `--color-text-defined` |
| `color/text/soft` | `#0a2850a3` | `--color-text-soft` |
| `color/text/base` | `#000000` | `--color-text-base` |
| `color/text/inverse-base` | `#ffffff` | `--color-text-inverse-base` |
| `color/background/base` | `#ffffff` | `--color-background-base` |
| `color/background/layer-01` | `#f6f7f9` | `--color-background-layer-01` |
| `color/background/layer-02` | `#ffffff` | `--color-background-layer-02` |
| `color/background/layer-03` | `#f6f7f9` | `--color-background-layer-03` |
| `color/border/soft` | `#0a2850a3` | `--color-border-soft` |
| `color/border/subtle` | `#07275880` | `--color-border-subtle` |
| `color/border/strong` | `#0e1013` | `--color-border-strong` |
| `color/border/focus` (BOB stock) | `#2a6ecf` | `--component--focus-ring-color-strong` = `--color-system-info-default` |
| `color/border/focus-discrete` | `#ffffff` | `--component--focus-ring-color-discrete` |
| `color/system/info` | `#2a6ecf` | `--color-system-info-default` |
| `color/danger` (BOB stock) | `#d1001b` | `--color-system-danger-default` |
| `opacity/disabled` (carrier) | `0.25` | `--scania-opacity-25` / 100 |
| `font/family/detail.fontFamily` | `'Scania Sans Semi Condensed', arial, 'Helvetica Neue'` | `detail-02`, `detail-03` mixins |
| `font/family/headline.fontFamily` | `'Scania Sans', arial, 'Helvetica Neue'` | `headline-06` mixin |
| `font/size/detail` | 14 | `detail-02`, `detail-03`, `headline-06` |
| `font/size/caption` (BOB stock) | 12 | badge text, button `xs` |
| `font/line-height/detail-02` | 16 | `detail-02` |
| `font/line-height/detail-03` | 20 | `detail-03` |
| `font/line-height/headline-06` | 16 | `headline-06` |
| `font/letter-spacing/detail` | -0.14 | `detail-02`, `detail-03` |
| `font/letter-spacing/headline` | -0.28 | `headline-06` |
| `space/element/{2,4,8,12,16,20}` | 2–20 | `spacing/_spacing-vars.scss` `--tds-spacing-element-N` |
| `radius/control` (BOB stock) | 4 | `--scania-unit-4` (button, card) |
| `border/control` (BOB stock) | 1 | button border, `:focus` outline, focus-ring discrete width |
| `border/focus` | 2 | `tds-focus-state` outline width |
| `border/focus-offset` | 1 | `tds-focus-state` outline offset |

Font weights: Tegel's `detail-*` are `normal`, `headline-06` and badge text are `bold`.

## Component sets

BOB has no alias (reference) tokens, so Tegel's `--component-*` layer cannot point at a
semantic token. Where a Tegel component token only resolves to a semantic one, the cell
uses the semantic token directly; a component token is added only for a value the
semantic layer does not hold.

### Badge

Source: `packages/core/src/components/badge/badge.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `radius/badge` | 12 | `.tds-badge` `border-radius: 12px` (hard-coded; `--tds-badge-border-radius` = 24 is unused) |
| `size/badge/lg` | 20 | `.tds-badge-lg` width, height, line-height |
| `size/badge/sm` | 8 | `.tds-badge-sm` width, height, line-height |

Reused: `color/danger` (`--component-badge-background-default`), `color/text/inverse-base`
(`--component-badge-text-default`), `font/size/caption`, `space/element/8`.

### Button

Source: `packages/core/src/components/button/button.scss`, `button-vars.scss`, and the
Scania light block of `tokens/scss/component/button.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/background/none` (foundation) | `transparent` | `--color-background-none` |
| `color/border/none` (foundation) | `transparent` | `--color-border-none` |
| `color/button/primary/default` | `#16417f` | `…-background-standard-primary-default` = blue-600 |
| `color/button/primary/hover` | `#0f3263` | `…-standard-primary-hover` = blue-700 |
| `color/button/primary/active` | `#041e42` | `…-standard-primary-active` = blue-800 |
| `color/button/danger/hover` | `#b20018` | `…-danger-primary-hover` = red-500 |
| `color/button/danger/active` | `#8a0012` | `…-danger-primary-active` = red-600 |
| `size/button/{lg,md,sm,xs}` | 56, 48, 40, 24 | `$btn-*-height` |
| `size/button/icon` | 20 | icon `width`/`height` (`--tds-spacing-element-20`) |
| `size/button/icon-sm` | 16 | `sm` icon `width`/`height` (`--tds-spacing-element-16`) |
| `space/button/icon-{lg,md,sm}` | 18, 14, 10 | `.icon` vertical padding (hard-coded) |
| `space/button/only-icon-{lg,md,sm}` | 17, 13, 11 | `$btn-*-only-icon-padding` |

Reused: `color/danger` (danger default), `color/text/inverse-base` (white text and icon),
`color/text/base` (black text and icon), `color/border/{soft,subtle,strong}`, focus ring
tokens, `radius/control`, `border/control`, `opacity/disabled`, `space/element/*`, and the
`detail-02` typography tokens. Tegel's white and black come from primitives
(`base-white`, `base-black`); the cell uses the semantic tokens with the same light value.

Tegel sizes the icon with spacing tokens. BOB's `token-usage` forbids a `space` token on
`width` and `height`, so the icon box uses `size/button/icon*` with the same values.

### Link

Source: `packages/core/src/components/link/link.scss`, `link-vars.scss`, and the Scania
light block of `tokens/scss/component/link.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/link/default` | `#2a6ecf` | `--component-link-text-accent-default` and `-hover` = blue-400 |
| `color/link/visited` | `#16417f` | `--component-link-text-accent-visited` = blue-600 |
| `border/link-focus` | 3 | focus `box-shadow` outer ring `0 0 0 3px` |

Reused: `color/system/info` (`--tds-link-focus`), `color/border/focus-discrete` (the white
inner ring, Tegel's `--tds-white`), `border/control` (inner ring 1px), `opacity/disabled`,
and the `detail-02` typography tokens for `standalone`.

### Spinner

Source: `packages/core/src/components/spinner/spinner.scss`, `spinner-vars.scss`, and the
Scania light block of `tokens/scss/component/spinner.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `size/spinner/{xs,sm,md,lg}` | 16, 24, 52, 84 | `--component-spinner-size-{extra-small,small,medium,large}` (diameters) |
| `size/spinner/stroke-{xs,sm,md,lg}` | 3, 4, 6, 8 | `--component-spinner-stroke-*` |
| `motion/spinner/duration` (carrier) | `1.8s` | `--spinner-speed` (literal in Tegel) |
| `motion/spinner/duration-lg` (carrier) | `2s` | `--spinner-speed-lg` (literal in Tegel) |

Reused: `color/system/info` (`--component-spinner-background-default`) and
`color/text/inverse-base` (inverted stroke, Tegel's `grey-00`). The radius and the dash
length are `calc()` on the diameter; π and the easing curve stay literal, as in Tegel.

## Not included

- Dark mode and TRATON values (ADR 0002 D8).
- The Scania Sans web fonts. Tegel loads them from its own CSS; this package does not
  ship them, so text falls back to arial until a consumer loads the fonts.
