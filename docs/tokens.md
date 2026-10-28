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
`radius/control`, `border/control`. The block adds a sixth, `font/size/body`. Every other
name is in the generated `tegel` set.

| After | `tegel` set |
|---|---|
| Foundation | 31 |
| Badge | 34 |
| Button | 53 |
| Link | 56 |
| Spinner | 66 |
| Card | 80 |
| Divider, block, tag, message | 112 |
| Breadcrumbs, stepper, footer | 146 |
| Footer mobile toggle | 148 |
| Checkbox, radio button, toggle, chip, textarea | 210 |
| Accordion, banner, toast, text field | 249 |
| Folder, inline and navigation tabs | 263 |
| Datetime | 275 |
| Modal | 285 |
| Slider | 316 |
| Dropdown | 342 |
| Icon | 605 |
| Popover core, canvas, menu, menu item; tooltip | 617 |
| Table family | 648 |
| Side menu family | 671 |
| Header family | 698 |

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

### Card

Source: `packages/core/src/components/card/card.scss`, `card-vars.scss`, the Scania light
blocks of `tokens/scss/component/card.scss` and `divider.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/shadow/{1,5,15,20}` | `#00000003`, `#0000000d`, `#00000026`, `#00000033` | `rgb(0 0 0 / 1%, 5%, 15%, 20%)` in `--tds-card-box*` |
| `size/shadow/{1,3}`, `size/shadow/minus-1` | 1, 3, -1 | shadow offsets and blurs in `--tds-card-box*` |
| `size/card/thumbnail` | 36 | thumbnail `width`/`height` |
| `size/card/body-max` | 336 | body `max-width` |
| `size/card/chevron` | 16 | expand icon `size="16px"` |
| `border/focus-inset` | -2 | clickable `:focus-visible` `outline-offset: -2px` |
| `color/divider/discrete` | `#d1d7e0` | `--component-divider-border-discrete-default` = grey-200 |
| `motion/card/rotate` (carrier) | `160ms` | chevron `transform` transition |
| `motion/card/fade` (carrier) | `120ms` | chevron `opacity` transition |

Reused: `color/background/base` (card background, Tegel's `base-white`),
`color/background/layer-03`, `color/text/{strong,soft,defined,base}`, `radius/control`,
`border/focus`, `color/border/focus`, `space/element/{4,16}`, `space/button/only-icon-sm`
(the toggle's padding, as in Tegel's `sm` ghost button), and the `headline-06` and
`detail-03` typography tokens.

Shadows are composed from `size` and `color` tokens: BOB has no shadow type, and the
gate's `color` category is allowed on `box-shadow`.

### Divider

Source: `packages/core/src/components/divider/divider.scss`, `divider-vars.scss`, and the
Scania light block of `tokens/scss/component/divider.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/divider/subtle` | `#7e90a9` | `--component-divider-border-subtle-default` = grey-350 |
| `color/divider/soft` | `#5f728c` | `--component-divider-border-soft-default` = grey-500 |
| `color/divider/defined` | `#475467` | `--component-divider-border-defined-default` = grey-650 |
| `color/divider/expressive` | `#0f3263` | `--component-divider-border-expressive-default` = blue-700 |
| `size/divider` | 1 | `height: 1px` / `width: 1px` |

Reused: `color/divider/discrete` (added with the card) and `color/border/strong` (Tegel's
`strong` divider is `--color-border-strong`).

### Block

Source: `packages/core/src/components/block/block.scss`, `block-vars.scss`, the Scania
light block of `tokens/scss/component/block.scss`, and the `body-01` type style.

| Payload name | Value | Tegel source |
|---|---|---|
| `font/family/body.fontFamily` | `'Scania Sans', arial, 'Helvetica Neue'` | `--body-01-font-family` |
| `font/size/body` (stock name) | 16 | `--body-01-font-size` |
| `font/line-height/body-01` | 24 | `--body-01-line-height` |
| `font/letter-spacing/body` | -0.32 | `--body-01-letter-spacing` |
| `radius/block` | 4 | `--component-block-border-radius-default` = unit-4 |

Reused: `color/background/layer-01` (primary and even), `color/background/layer-02`
(odd), `color/text/strong`, `space/element/16`. The weight is the keyword `normal`.

### Tag

Source: `packages/core/src/components/tag/tag.scss`, `tag-vars.scss`, the Scania light
block of `tokens/scss/component/tag.scss`, and the `detail-05` type style.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/tag/{error,new,information,neutral,success,warning}` | `#ffb9b8`, `#bacde8`, `#87afe8`, `#e0e5eb`, `#9bd9c2`, `#f9eec3` | `--component-tag-background-{error,featured,information,neutral,success,warning}-default` |
| `color/tag/on-{error,new,information,neutral,success,warning}` | `#6c0011`, `#0f3263`, `#041e42`, `#242c37`, `#0a382e`, `#6b3b10` | `--component-tag-text-*-default` |
| `radius/tag` | 4 | `--component-tag-border-radius-default` = unit-4 |
| `font/line-height/detail-05` | 16 | `--detail-05-line-height` |

Reused: `space/element/{2,4}`, `font/family/detail`, `font/size/caption` (detail-05's
12px). The `--component-tag-icon-*` tokens alias the text tokens, so they are not added.

### Message

Source: `packages/core/src/components/message/message.scss`, `message-vars.scss`, the
Scania light block of `tokens/scss/component/message.scss`, `color-light.scss`, and the
`headline-07`, `detail-02` and `detail-03` type styles.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/system/success` | `#009e7e` | `--color-system-success-default` = green-300 |
| `color/system/warning` | `#b87c14` | `--color-system-warning-default` = yellow-500 (icon) |
| `color/system/warning-subtle` | `#eaad06` | `--color-system-warning-subtle` = yellow-400 (border) |
| `color/system/danger-discrete` | `#ffdfe3` | `--color-system-danger-discrete` = red-50 (error background) |
| `size/message/icon` | 20 | `tds-icon size="20px"` |
| `border/message` | 4 | `--component-message-border-width-default` = unit-4 |
| `radius/message` | 4 | `--component-message-border-radius-default` = unit-4 |
| `space/element/24` | 24 | content `padding-right: 24px` |
| `font/line-height/headline-07` | 16 | `--headline-07-line-height` |

Reused: `color/background/layer-01`, `color/background/none` (minimal),
`color/text/strong`, `color/system/info`, `color/danger`, `space/element/{2,4,8,16}`,
`font/family/detail`, `font/size/detail`, `font/letter-spacing/detail` and
`font/line-height/detail-{02,03}`.

### Breadcrumbs

Source: `packages/core/src/components/breadcrumbs/breadcrumb/breadcrumb.scss`,
`breadcrumbs.scss`, and the Scania light block of `tokens/scss/component/breadcrumbs.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `size/breadcrumb/separator-width` | 4 | separator `width: 4px` |
| `size/breadcrumb/separator-height` | 8 | separator `height: 8px` |

Reused: `color/text/strong` (link, hover, separator), `color/text/soft` (current),
`space/element/4`, the button's focus ring tokens, and the `detail-02` tokens.

### Stepper

Source: `packages/core/src/components/stepper/step/step.scss`, `stepper.scss`,
`stepper-vars.scss`, and the Scania light block of `tokens/scss/component/stepper.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/stepper/strong` | `#2d3643` | grey-750: current background, upcoming border, connecting line |
| `color/stepper/success` | `#008064` | green-400: success background and border |
| `color/text/inverse-strong` | `#f6f7f9` | `--color-text-inverse-strong` (current index, success icon) |
| `radius/stepper` | 9999 | `--component-stepper-border-radius-default` = unit-9999 |
| `space/stepper/vertical-lg`, `vertical-sm` | 52, 36 | vertical list `gap` |
| `size/stepper/{1,10,13,16,20,24,28,30,32,34,36,40}`, `size/stepper/minus-10` | the value | literal marker sizes, icon sizes and line positions in `step.scss` |

Tegel writes the line geometry as literals, so the tokens are named by value. The
`type-system-body-01` (lg) and `label-01` (sm) styles equal `detail-02` and `detail-05` in
Scania, so the cell reuses those tokens.

### Footer

Source: `packages/core/src/components/footer/footer.scss`, `footer-vars.scss`,
`footer-group/footer-group.scss`, `footer-item/footer-item.scss`, the Scania light block
of `tokens/scss/component/footer.scss`, and `color-light.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/footer/main` | `#041e42` | `--component-footer-background-main-default` = blue-800 |
| `color/footer/divider` | `#0f3263` | `--component-footer-border-divider-default` = blue-700 |
| `color/footer/item-active` | `#e0e5eb` | `--component-footer-background-list-item-active` = grey-150 |
| `color/text/inverse-soft` | `#c3d8f7b8` | `--color-text-inverse-soft` (copyright) |
| `color/icon/inverse-strong` | `#f6f7f9` | `--color-icon-inverse-strong` (end part) |
| `color/border/discrete` | `#303c612b` | `--color-border-discrete` (mobile item divider) |
| `image/footer/wordmark` (carrier) | `url(https://cdn.digitaldesign.scania.com/…/scania-wordmark-white.svg)` | `--tds-background-image-scania-wordmark-white-svg` |
| `size/footer/wordmark-width`, `wordmark-height` | 117, 20 | `.brand` size |
| `space/element/{32,40,48}` | 32, 40, 48 | footer padding and gaps |
| `space/footer/item-mobile` | 19 | mobile item `padding: 19px 40px`, toggle `padding: 19px 24px` |
| `size/footer/chevron` | 20 | toggle `tds-icon size="20px"` |
| `motion/footer/rotate` (carrier) | `200ms` | toggle icon `transition: transform 0.2s` |

Reused: `color/background/layer-01` (top), `color/text/strong`,
`color/text/inverse-base` (main links, Tegel's `base-white`), `border/control`,
`space/element/{8,12,24}`, the focus ring tokens and the `detail-02` and `headline-07`
tokens. The 992px breakpoint stays a literal: a media query cannot read `var()`.

### Form controls

Source: each component's `.scss` and `-vars.scss` in `packages/core/src/components/`
(`checkbox`, `radio-button`, `toggle`, `chip`, `textarea`), the Scania light blocks of
`tokens/scss/component/{checkbox,radio-button,toggle,chip,textarea,-input}.scss`, and the
`detail-01`, `detail-05` and `detail-07` type styles.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/input/selected` | `#0e1013` | checkbox and radio `background-selected` = grey-950 |
| `border/input-indicator` | 2 | hover ring `box-shadow: 0 0 0 2px` |
| `size/input/indicator`, `size/input/height` | 16, 24 | box and dot size, input height |
| `space/input/offset` | -4 | `margin-left: -4px` |
| `motion/input/indicator` (carrier) | `200ms` | ring `transition` |
| `radius/focus-medium`, `radius/full` | 3, 9999 | `--component--focus-ring-radius-{medium,full}` |
| `opacity/full` (carrier) | `1` | checked mark `opacity: 1` |
| `size/checkbox/width`, `size/checkbox/inset`, `radius/checkbox` | 24, 4, 2 | checkbox input, mark position, radius |
| `image/checkbox/check`, `image/checkbox/indeterminate` (carriers) | SVG data URLs | `--tds-checkbox-icon-mask*` |
| `size/radio-button/width`, `size/radio-button/dot`, `space/radio-button/label` | 20, 6, 6 | radio input, dot, label padding |
| `color/toggle/{off,off-hover,off-active}` | `#7e90a9`, `#5f728c`, `#4e5e75` | grey-350, -500, -600 |
| `color/toggle/{on,on-hover,on-active}` | `#009e7e`, `#008064`, `#00664f` | green-300, -400, -500 |
| `size/toggle/*` | 44, 24, 16, 4, 24 (lg); 28, 16, 8, 16 (sm) | track, knob, knob offsets |
| `motion/toggle/duration`, `motion/easing/scania` (carriers) | `200ms`, `cubic-bezier(0.4, 0, 0, 1)` | `--tds-motion-duration-moderate-01`, `--tds-motion-easing-scania` |
| `font/letter-spacing/detail-01` | -0.16 | `detail-01` (toggle label) |
| `color/chip/{standard,standard-hover,selected-hover}` | `#e0e5eb`, `#d1d7e0`, `#16417f` | grey-150, grey-200, blue-600 |
| `radius/chip`, `size/chip/label`, `space/chip/gap-lg`, `space/chip/edge-lg` | 24, 16, 6, 10 | chip radius, pill height, gap, prefix/suffix edge |
| `color/border/defined`, `color/icon/subtle`, `color/icon/strong`, `color/text/disabled` | `#041530b8`, `#07275880`, `#0e1013`, `#3a517c59` | semantic colours used by the textarea |
| `radius/input`, `border/input` | 4, 1 | `--component--input-border-radius-default`, bottom border width |
| `size/textarea/*`, `space/textarea/readonly` | 12, 208, 2, 1, 18, 16, 20, 16, 8; 54 | resizer, minimum width, icon positions, label positions |
| `font/size/detail-07`, `font/line-height/detail-07` | 10, 8 | `detail-07` (floating label) |
| `motion/textarea/{border,placeholder,label}` (carriers) | `200ms`, `350ms`, `100ms` | the three transitions |

Reused: `color/border/{strong,subtle,soft,none}`, `color/icon/inverse-strong`,
`color/system/info`, `color/danger`, `color/text/{strong,soft,defined,inverse-strong,inverse-base}`,
`opacity/disabled`, the focus ring tokens and the `detail-02` and `detail-05` tokens.

## Not included

- Dark mode and TRATON values (ADR 0002 D8).
- The Scania Sans web fonts. Tegel loads them from its own CSS; this package does not
  ship them, so text falls back to arial until a consumer loads the fonts.

### Accordion, banner, toast, text field

Source: each component's `.scss` and `-vars.scss` in `packages/core/src/components/`, the
Scania light blocks of `tokens/scss/component/{accordion,banner,toast,-input}.scss`, and
`color-light.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/accordion/active` | `#edeff3` | `--component-accordion-background-primary-active` = grey-100 |
| `space/layout/64`, `space/accordion/expanded-bottom`, `space/accordion/hover-offset` | 64, 31, -1 | panel padding, expanded padding, hover margin |
| `size/accordion/chevron`, `motion/accordion/rotate` (carrier) | 16, `150ms` | chevron size and turn |
| `color/banner/neutral`, `color/banner/information` | `#e0e5eb`, `#bacde8` | grey-150, blue-100 backgrounds |
| `size/banner/icon` | 20 | icon and close icon size |
| `color/toast/background` | `#0e1013` | `--color-background-inverse-base` = grey-950 |
| `color/toast/information`, `color/toast/warning` | `#4a89f3`, `#f1c21b` | blue-300, yellow-300 border and icon |
| `size/toast/{width,content-max,icon}`, `border/toast`, `radius/toast` | 348, 250, 20, 4, 4 | `calc(352px - 4px)`, content width, icon, border, radius |
| `space/toast/{icon,close-left,content-left}` | 14, 22, 10 | icon and close offsets, content padding |
| `size/text-field/{lg,md,sm}` | 56, 48, 40 | container heights |
| `size/text-field/{min-width,icon,helper-icon,readonly-icon}` | 208, 20, 16, 18 | minimum width and icon sizes and offset |
| `size/text-field/label-*` | 16, 20, 16, 12, 8 | inside label left, top and floating top |
| `space/text-field/{inside-bottom-lg,inside-bottom,affix,readonly}` | 15, 11, 14, 54 | inside-label padding, prefix and suffix margin, read-only padding |
| `motion/text-field/{border,placeholder,label}` (carriers) | `200ms`, `350ms`, `100ms` | the three transitions |

Reused: `color/system/{info,success,danger-discrete}`, `color/danger`,
`color/icon/strong`, `color/text/{strong,defined,disabled,inverse-strong}`,
`color/border/{subtle,strong,soft,defined}`, `radius/input`, `border/input`, the
`detail-02`, `detail-03`, `detail-05`, `detail-07`, `headline-06` and `headline-07`
tokens.

### Folder, inline and navigation tabs

Source: each family's `.scss` and `-vars.scss` in `packages/core/src/components/tabs/`, the
Scania light block of `tokens/scss/component/tabs.scss`, and `tokens/scss/scania/primitive.scss`.
The three families share the `tabs` names.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/tabs/item`, `color/tabs/item-hover` | `#edeff3`, `#d1d7e0` | `--component-tabs-background-item-primary-{default,hover}` = grey-100, grey-200 |
| `color/tabs/scroll` | `#d1d7e0` | `--component-tabs-background-scroll-default` = grey-200 (folder scroll buttons) |
| `color/tabs/indicator`, `color/tabs/indicator-hover` | `#2a6ecf`, `#1c222b` | `--component-tabs-border-item-{indicator-default,hover}` = blue-400, grey-850 |
| `border/tabs-indicator`, `size/tabs/indicator` | 2, 2 | folder selected `border-top`, inline and navigation indicator height |
| `size/tabs/scroll`, `size/tabs/scroll-icon` | 48, 20 | scroll button `min-width`, `tds-icon` size |
| `size/tabs/folder-scroll-height`, `size/tabs/folder-min-width` | 50, 174 | folder scroll button height; `min-width: 142px` plus 2 × 16px padding (the cell is `border-box`) |
| `space/tabs/focus-inset`, `space/tabs/navigation-block` | 3, 25 | focus ring `inset`, navigation tab vertical padding |
| `motion/tabs/indicator` (carrier) | `150ms` | colour and indicator `transition` |

Reused: `color/background/{base,layer-01,none}`, `color/border/{discrete,none}`,
`color/icon/strong`, `color/text/{strong,soft}`, `opacity/disabled`, `border/control`,
`space/element/{8,16,20,24,32,40,48}`, the focus ring tokens and the `headline-07` and
detail tokens (Tegel's `title-01`).

### Datetime

Source: `packages/core/src/components/datetime/datetime.scss`, `datetime-vars.scss`, and
the Scania light block of `tokens/scss/component/-input.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `size/datetime/{lg,md,sm}` | 56, 48, 40 | container heights |
| `size/datetime/{min-width,icon,helper-icon}` | 208, 20, 16 | minimum width, calendar and clock icon, error icon |
| `size/datetime/icon-right` | 18 | icon `right` |
| `size/datetime/label-left`, `size/datetime/label-top-lg`, `size/datetime/label-top` | 16, 12, 8 | inside label position |
| `space/datetime/inside-bottom-lg`, `space/datetime/inside-bottom` | 15, 11 | inside-label input padding |

Reused: `color/background/layer-01`, `color/border/{soft,strong}`, `color/danger`,
`color/text/{strong,soft,defined}`, `radius/input`, `border/input`, `opacity/disabled`,
`space/element/{4,8,16,20,24}`, the focus ring tokens and the `detail-02`, `detail-05` and
`detail-07` tokens (Tegel's `body-01`, `label-01` and `label-02`).

### Modal

Source: `packages/core/src/components/modal/modal.scss`, `modal-vars.scss`,
`packages/core/src/mixins/_scrollbar.scss`, and the Scania light blocks of
`tokens/scss/component/{modal,overlay}.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/modal/backdrop` | `#00000099` | `--component-overlay-background-default` (black) at `--component-overlay-opacity-default` (60%) |
| `color/shadow/10` | `#0000001a` | `--component-shadow-base-modifier` = transparent-shadow-100 |
| `radius/modal` | 4 | `--component-modal-border-radius-default` |
| `size/modal/max-height` (carrier) | `85vh` | `$modal-max-height` |
| `size/modal/actions`, `size/modal/close` | 36, 20 | `$modal-actions-height`, close icon |
| `size/scrollbar/width`, `border/scrollbar-thumb`, `border/scrollbar-thumb-hover`, `radius/scrollbar` | 10, 3, 2, 8 | `tds-scrollbar` mixin variables |

Reused: `color/background/{layer-02,none}`, `color/border/{subtle,none}`,
`color/icon/strong`, `color/text/strong`, `color/shadow/15`, `size/shadow/{1,3,minus-1}`,
`space/element/{16,24,48}`, the focus ring tokens, the `body` tokens (Tegel's `body-01`)
and `font/family/headline` with the `body` size, line height and letter spacing (Tegel's
`headline-05` has the same values).

### Slider

Source: `packages/core/src/components/slider/slider.scss` and `slider-vars.scss`. The
slider reads Tegel's older `--tds-grey-*` variables, so its values come from those
(`--tds-grey-950` is `#0b0c0f`, not the newer `#0e1013`).

| Payload name | Value | Tegel source |
|---|---|---|
| `color/slider/thumb` | `#0b0c0f` | thumb, fill, label and values (grey-950) |
| `color/slider/track` | `#7e90a9` | track and dividers (grey-350) |
| `color/slider/disabled`, `color/slider/text-disabled` | `#d1d7e0`, `#b4becd` | disabled thumb, track and dividers (grey-200); disabled text (grey-250) |
| `color/slider/secondary` | `#475467` | tick numbers and controls (grey-650) |
| `color/slider/tooltip`, `color/slider/tooltip-text` | `#3a4554`, `#f6f7f9` | tooltip (grey-700, grey-50) |
| `color/slider/hover`, `color/slider/pressed` | `#303c612b`, `#3a517c59` | thumb halo (transparent-200, transparent-250) |
| `size/slider/thumb-{lg,sm}`, `size/slider/thumb-pressed-{lg,sm}` | 20, 16, 24, 20 | thumb sizes |
| `size/slider/halo-{lg,sm}`, `size/slider/halo-pressed-{lg,sm}` | 14, 12, 12, 10 | halo spread: (48 or 40 − thumb) / 2 |
| `size/slider/track`, `size/slider/fill` | 2, 4 | track and fill height |
| `size/slider/divider`, `size/slider/divider-width` | 16, 1 | tick dividers |
| `size/slider/tick-label`, `size/slider/tick-top` | 50, -7 | tick number width and offset |
| `size/slider/control-icon`, `size/slider/field` | 16, 40 | control icon; number field height (`tds-text-field` sm) |
| `radius/slider/track`, `radius/slider/fill`, `radius/slider/tooltip` | 1, 2, 4 | track, fill and tooltip radius |
| `space/slider/control`, `space/slider/label-offset`, `space/slider/tooltip-inline` | 18, 34, 11 | control and value padding; label padding with tick numbers; tooltip padding |

Reused: `color/background/{base,layer-01}`, `color/border/{soft,strong}`, `radius/input`,
`border/input`, `space/element/{8,12,16}`, the focus ring tokens and the `detail-02`,
`detail-05` and `body` tokens (Tegel's `detail-01` is 16/24).

### Dropdown

Source: `packages/core/src/components/dropdown/` (`dropdown.scss`, `dropdown-button.scss`,
`dropdown-filter.scss`, `dropdown-vars.scss`, `dropdown-option/dropdown-option.scss`), and
the Scania light block of `tokens/scss/component/dropdown.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/dropdown/item-hover`, `color/dropdown/item-selected` | `#edeff3`, `#e0e5eb` | `--component-dropdown-background-item-{hover,selected-default}` = grey-100, grey-150 |
| `radius/dropdown` | 4 | `--component-dropdown-border-radius-default` |
| `size/dropdown/{lg,md,sm,xs}` | 56, 48, 40, 30 | select heights (`sm` also the `xs` no-result height) |
| `size/dropdown/list-lg`, `size/dropdown/list-sm` | 312, 260 | the default list heights |
| `size/dropdown/icon`, `size/dropdown/shadow-y` | 16, 2 | icons; list `box-shadow: 0 2px 3px` |
| `size/dropdown/label-top`, `size/dropdown/label-float-lg`, `size/dropdown/label-float-md`, `size/dropdown/label-left` | 20, 12, 8, 16 | inside label position |
| `size/dropdown/actions`, `size/dropdown/action-button` | 12, 24 | selection actions bar and button height |
| `space/dropdown/{7,11,15,19}`, `space/dropdown/up-gap` | 7, 11, 15, 19, 1 | option paddings, named by value; gap above an upward list |
| `font/line-height/dropdown-value`, `font/line-height/dropdown-xs` | 18.2, 14 | `line-height: 1.3` and `1` at 14px |
| `motion/dropdown/fast`, `motion/dropdown/label` (carriers) | `150ms`, `200ms` | `--tds-motion-duration-fast-02`, label `transition: 0.2s` |

Reused: `color/background/{layer-01,none}`, `color/border/{soft,strong,subtle,discrete,none}`,
`color/danger`, `color/icon/strong`, `color/text/{strong,soft,defined}`, `color/shadow/10`,
`size/shadow/3`, `radius/input`, `border/input`, `opacity/disabled`, `motion/easing/scania`,
`space/element/{2,4,8,12,16,20}`, the scrollbar tokens, the checkbox tokens, the focus ring
tokens and the `detail-02`, `detail-05` and `detail-07` tokens.

### Icon

Source: the Scania block of `tokens/scss/component/icon.scss`, which `tds-icon` reads.

| Payload name | Value | Tegel source |
|---|---|---|
| `icon/<name>/d` (263 carriers) | `path('M…')` | `--tds-icon-<name>-d` |

Each path is a `COLOR` carrier: BOB has no string type. The category `icon` is
unconstrained. Tegel's `--tds-icon-<name>-fill-rule` and `-clip-rule` are all `evenodd`;
the stylesheet writes the keyword. The paths are about 280 KB of `tokens/scania.css`.

### Popover and tooltip

Source: `packages/core/src/components/popover-canvas/popover-canvas-vars.scss`,
`popover-menu/popover-menu-vars.scss`, `popover-menu/popover-menu.scss`,
`popover-menu/popover-menu-item/popover-menu-item.scss`, `tooltip/tooltip.scss` and
`tooltip-vars.scss`, and the Scania light blocks of `tokens/scss/component/popover.scss`
and `tooltip.scss`.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/popover/item-hover` | `#edeff3` | `--component-popover-background-link-primary-hover` = grey-100 (`-active` is the same) |
| `radius/popover` | 4 | `--component-popover-border-radius-default` (canvas `border-radius: 4px`) |
| `space/popover/offset` | 8 | Popper `offsetDistance` default |
| `size/shadow/2` | 2 | menu `box-shadow: 0 2px 3px 0` |
| `size/popover-menu/width` | 160 | menu `width: 160px` |
| `space/popover-menu/block` | 6 | menu `padding: 6px 0`; divider `padding: 6px` |
| `space/popover-menu/item` | 10 | item `padding: 10px 16px`, `gap: 10px` |
| `motion/popover-menu/hover`, `motion/easing/easy` (carriers) | `150ms`, `cubic-bezier(0.33, 0, 0.67, 1)` | `--tds-motion-duration-fast-02`, `--tds-motion-easing-easy` |
| `color/tooltip/background` | `#242c37` | `--component-tooltip-background-default` = `--color-background-inverse-layer-03` = grey-800 |
| `radius/tooltip` | 4 | `--component-tooltip-border-radius-default` |
| `size/tooltip/max-width` | 192 | `max-width: 192px` |

Reused: `color/background/{layer-01,none}`, `color/text/{strong,inverse-strong}`,
`color/shadow/{10,15}`, `size/shadow/{1,3,minus-1}`, `opacity/disabled`,
`space/element/{4,8,16}`, the focus ring tokens, and the `body-01` and `detail-05` tokens.

### Table

Source: `packages/core/src/components/table/` (`table-vars.scss` and each part's `.scss`),
the Scania light block of `tokens/scss/component/table.scss`, and the `title-01` and
`type-system-body-01` type styles.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/table/header` | `#e0e5eb` | `--component-table-background-{header,footer,cell-selected,cell-expanded}-default` = grey-150 |
| `color/table/header-hover` | `#d1d7e0` | `--component-table-background-{header-hover,toolbar-default,cell-selected-hover}` = grey-200 |
| `color/table/cell-hover` | `#edeff3` | `--component-table-background-cell-primary-hover` = grey-100 |
| `color/text/subtle` | `#07275880` | `--color-text-subtle` = transparent-350 (placeholder) |
| `radius/table` | 4 | `--component-table-border-radius-default` |
| `size/table/row`, `size/table/row-compact`, `size/table/header-compact` | 48, 32, 33 | row heights (`--unit-48`, `--unit-32`; compact header `33px`) |
| `size/table/min-width` | 192 | cell `min-width` |
| `size/table/expand-control`, `size/table/expand-control-compact`, `size/table/expand-cell` | 46, 30, 1 | expand button; expanded cell `max-width: 1px` |
| `size/table/toolbar`, `size/table/toolbar-compact` | 64, 56 | toolbar height |
| `size/table/search`, `size/table/search-closed`, `size/table/search-open`, `size/table/search-input` | 48, 50, 250, 204 | search bar |
| `size/table/field`, `size/table/field-width`, `size/table/navigation` | 40, 77, 160 | footer input, dropdown and buttons; search field height |
| `size/table/icon`, `size/table/icon-lg` | 16, 20 | icons |
| `space/table/expand-start` | 66 | expanded cell `padding-left` (`--unit-66`) |
| `space/table/filter-icon`, `space/table/filter-input` | 15, 35 | header filter icon offset and input padding |
| `space/table/10`, `space/table/search-icon`, `space/table/footer-text-top` | 10, 6, 1 | edit icon offset and page input margin; search button margin; footer text padding |
| `motion/table/hover`, `motion/table/search` (carriers) | `200ms`, `250ms` | `transition` durations |

Reused: `color/background/{layer-01,layer-02,base,none}`, `color/border/{discrete,soft,subtle,strong,none}`,
`color/icon/{strong,inverse-strong}`, `color/input/selected`, `color/text/{strong,base,disabled}`,
`radius/{input,control,checkbox,focus-medium}`, `border/{control,input,focus}`, `opacity/{disabled,full}`,
`space/element/{8,16,24,40}`, `size/shadow/3`, the checkbox tokens, the focus ring tokens,
the icon path tokens and the detail tokens (Tegel's `title-01` and `type-system-body-01`).

### Side menu

Source: `packages/core/src/components/side-menu/` (`side-menu-vars.scss` and each part's
`.scss`), the Scania light block of `tokens/scss/component/side-menu.scss`, and the
`title-01` and `body-02` type styles.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/side-menu/item-active` | `#e0e5eb` | `--component-side-menu-background-item-link-active` = grey-150 |
| `color/side-menu/indicator` | `#2a6ecf` | `--component-side-menu-border-item-indicator-default` = blue-400 |
| `color/side-menu/overlay` | `#000000` | `tds-side-menu-overlay` `background-color: black` |
| `opacity/side-menu/overlay` (carrier) | `0.4` | open state, `opacity: 0.4` on the slotted overlay |
| `radius/side-menu` | 0 | `--component-side-menu-border-radius-default` |
| `size/side-menu/item`, `size/side-menu/sub-item` | 68, 48 | `--tds-side-menu-item-height`, `--tds-side-menu-sub-item-height` |
| `size/side-menu/width`, `size/side-menu/collapsed` | 272, 68 | persistent width; `--tds-side-menu-width-collapsed` |
| `size/side-menu/close` | 64 | `--tds-side-menu-close-button-height` |
| `size/side-menu/user-image` | 34 | `--tds-side-menu-user-image-size` |
| `size/side-menu/indicator` | 4 | selected indicator width |
| `size/side-menu/flyout` | 190 | dropdown list and collapsed heading width |
| `size/side-menu/icon`, `size/side-menu/chevron` | 20, 16 | collapse and close icons; dropdown chevron |
| `space/side-menu/item` | 22 | `--tds-side-menu-item-horizontal-padding` |
| `space/side-menu/gap` | 10 | `--tds-side-menu-item-horizontal-gap` |
| `space/side-menu/sub-item-icon`, `space/side-menu/sub-item-user` | 58, 64 | left padding of `--tds-side-menu-sub-item-padding-{icon,user-image}` |
| `space/side-menu/heading-bottom` | 15 | collapsed heading `padding-bottom` |
| `space/side-menu/indicator-focus` | 3 | selected indicator inset while focused |
| `motion/side-menu/rotate`, `motion/side-menu/hover-delay` (carriers) | `200ms`, `150ms` | icon `transition`; the collapsed dropdown's hover tolerance |

Reused: `color/background/{base,layer-01,none}`, `color/border/{discrete,subtle,none,focus,focus-discrete}`,
`color/icon/strong`, `color/text/{strong,soft}`, `color/shadow/{1,15}`, `size/shadow/{1,3,minus-1}`,
`border/{control,focus,focus-offset,focus-inset}`, `space/element/{16,24,48}`, the scrollbar
tokens, the icon path tokens, the detail tokens (Tegel's `title-01`) and the body tokens
(`body-02`: `font/family/body`, `font/size/detail`, `font/line-height/detail-03`).

### Header

Source: `packages/core/src/components/header/` (`header-vars.scss` and each part's
`.scss`), the Scania light block of `tokens/scss/component/header.scss`, and the
`title-01`, `headline-06`, `headline-07`, `detail-02`, `detail-05` and `detail-06` type
styles.

| Payload name | Value | Tegel source |
|---|---|---|
| `color/header/background` | `#041e42` | `--component-header-background-main-standard-default` = blue-800 |
| `color/header/item-hover`, `color/header/item-active` | `#0f3263`, `#16417f` | `--component-header-background-nav-item-link-{hover,active}` = blue-700, blue-600 |
| `color/header/divider` | `#0f3263` | `--component-header-border-divider-default` = blue-700 |
| `color/header/indicator` | `#2a6ecf` | `--component-header-border-{nav,menu}-item-indicator-default` = blue-400 |
| `color/header/item-selected` | `#edeff3` | `--component-header-background-menu-item-current-default` = grey-100 |
| `image/header/symbol` (carrier) | `url(…/scania-symbol.svg)` | `--tds-background-image-scania-symbol-svg` (the CDN copy) |
| `font/family/headline-01.fontFamily` | `'Scania Sans Headline', arial, 'Helvetica Neue'` | `--tds-header-title-font-family` = `--headline-01-font-family` |
| `font/letter-spacing/detail-06` | 0.8 | `--tds-detail-06-ls` (0.08em of 10px) |
| `radius/header/tile` | 4 | launcher grid item `border-radius` |
| `size/header/height` | 64 | `--tds-header-height` |
| `size/header/list-item` | 48 | `--tds-header-list-item-md-height`; launcher title height |
| `size/header/list`, `size/header/list-lg` | 190, 320 | dropdown list width, `md` and `lg` |
| `size/header/user` | 84 | dropdown list user height |
| `size/header/avatar` | 32 | `--component-header-size-avatar-default` |
| `size/header/grid-item` | 96 | launcher grid item size |
| `size/header/brand` | 32 | `--tds-header-brand-logo-size` |
| `size/header/indicator` | 4 | the line under an active or selected item; the selected list item's left border |
| `size/header/icon`, `size/header/chevron`, `size/header/image` | 20, 16, 34 | item icons; dropdown chevron; item image |
| `space/header/icon-offset`, `space/header/icon-shift` | -6, 3 | `.__tds-header-item-icon` `margin-left` and `left` |
| `space/header/image-offset`, `space/header/image-shift` | -20, 10 | `.__tds-header-item-image` `margin-left` and `left` |
| `motion/header/tile` (carrier) | `150ms` | launcher grid item `transition` |

Reused: `color/background/{base,layer-01,none}`, `color/border/{discrete,subtle,none,focus,focus-discrete}`,
`color/icon/inverse-strong`, `color/text/{strong,soft}`, `color/shadow/{1,15}`,
`size/shadow/{1,3,minus-1}`, `border/{control,focus,focus-offset,focus-inset}`,
`space/element/{4,8,12,16,24,32}`, the scrollbar tokens, the icon path tokens, the detail
tokens (`title-01`, `headline-07`, `detail-02`: `font/family/detail`, `font/size/detail`,
`font/line-height/detail-02`, `font/letter-spacing/detail`), `font/size/caption` and
`font/line-height/detail-05` (`detail-05`), `font/family/body` and `font/size/detail-07`
(`detail-06`), and `font/line-height/headline-06` with `font/letter-spacing/headline`
(the title).
