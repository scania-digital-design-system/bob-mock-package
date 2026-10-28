# Findings: icon

Reference: Tegel `tds-icon` at `@scania/tegel@1.66.1`
(`packages/core/src/components/icon/`, with the Scania block of
`tokens/scss/component/icon.scss`). Cell: `cells/react/icon/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | exact |
| Behaviour (DOM tests) | Modifier class per name, size, title and description with their ids, `aria-hidden`, a path token and a rule for each of the 263 names |
| Tokens added | 263 |

## Departures from Tegel

1. **The cell renders the `<svg>` only.** Tegel renders an inline-block host with the
   `<svg>` in its shadow root. The `<svg>` takes the host's styles.
2. **The path comes from a token through a modifier.** Tegel binds the CSS `d` property
   to `var(--tds-icon-<name>-d)` in a `style` attribute. The cell has no `style`
   attribute, so each name has a rule, `.tl-icon--<name> .tl-icon__path`, that reads
   `--icon-<name>-d`. The result is the same.
3. **`fill-rule` and `clip-rule` are keywords in the stylesheet.** Tegel reads them from
   `--tds-icon-<name>-fill-rule` and `-clip-rule`. All 210 icons that set them use
   `evenodd`, so the rule writes the keyword.
4. **No fallback for old WebKit.** Tegel resolves the path in script where the CSS `d`
   property is not supported (Safari before 18). The cell shows no path there.
5. **263 names, not 243.** The names are those of Tegel's 1.66.1 token file, which
   `tds-icon` reads. The older `iconsArray.js` has 243. Tegel types `name` as `string`.
6. **`size` sets `width` and `height` only.** Tegel also sets `font-size` in a `style`
   attribute; the `<svg>` does not use it.

Visual checks for Phase 7: a few icons at 16, 24 and 48px, and an `evenodd` icon.

## Findings about BOB

1. **BOB has no string token type.** A path is carried as `COLOR` in an `icon`
   category, as the footer wordmark URL is. `tokens.dtcg.json` labels it
   `$type: "color"`. Source: structural.
2. **A value set this large is a token set.** The icon paths make up most of
   `tokens/scania.css` (about 280 KB of 296 KB) and of `dist/scania.css` (457 KB, 123 KB
   gzip). Every consumer loads every icon. BOB has no way to load a token only where a
   cell uses it. Source: structural.
3. **A cell cannot use the icon cell (L12).** Other cells still copy the paths they need
   into inline SVG. Source: structural.
