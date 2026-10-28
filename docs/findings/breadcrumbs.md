# Findings: breadcrumbs

Reference: Tegel `tds-breadcrumbs` and `tds-breadcrumb` at `@scania/tegel@1.66.1`
(`packages/core/src/components/breadcrumbs/`). Cells: `cells/react/breadcrumbs/scania/v1/`
and `cells/react/breadcrumb/scania/v1/`.

## Result

| Check | breadcrumbs | breadcrumb |
|---|---|---|
| BOB hard gate (real, `npm run gate`) | PASS | PASS |
| Bootstrap prompt rules | PASS | PASS |
| Public API vs `@scania/tegel` types | `tdsAriaLabel`; `children` added | `current`; `children` added |
| Behaviour (DOM tests) | Labelled `nav` around a `list` | `listitem`, `aria-current="page"` when current, the consumer link kept as a direct child |
| Tokens added | 0 | 2 |

## Departures from Tegel

1. **Elements.** Tegel renders `<tds-breadcrumbs>` and `<tds-breadcrumb>` hosts (shadow
   DOM). The cells render the `<nav>` and the `listitem` directly.
2. **The default slots are `children`.**
3. **The consumer's link stays the consumer's.** The breadcrumb styles it with
   `.tl-breadcrumb__item > *`, as Tegel does with `::slotted(*)`. A router link works.
   The link cell renders its own `<a>` instead, because it must set attributes on it
   (`link.md`); the breadcrumb sets none.
4. **No `last` class.** Tegel's breadcrumbs adds `last` to its last child on every render.
   No Tegel style reads it, so the cell does not reproduce it.

## Findings about BOB

1. **Styles for consumer content are unchecked.** `> *`, `a` and `button` selectors name
   no class, so neither class closure nor the prompt rules look at them. Source:
   structural (finding 8 in `README.md`).
