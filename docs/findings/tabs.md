# Findings: tabs

Reference: Tegel `tds-folder-tabs`, `tds-inline-tabs` and `tds-navigation-tabs` with their
tab elements at `@scania/tegel@1.66.1` (`packages/core/src/components/tabs/`). Cells:
`cells/react/{folder-tabs,folder-tab,inline-tabs,inline-tab,navigation-tabs,navigation-tab}/scania/v1/`.

The three families share their behaviour and differ in styles, so one file covers all six
cells.

## Result

| Check | folder-tabs, inline-tabs, navigation-tabs | folder-tab, inline-tab, navigation-tab |
|---|---|---|
| BOB hard gate (real, `npm run gate`) | PASS | PASS |
| Bootstrap prompt rules | PASS | PASS |
| Public API vs `@scania/tegel` types | All props and `onTdsChange`; `modeVariant` out of scope; `children` added; `selectTab`, `reinitialize` dropped | `disabled`; `children` added; internal `setSelected` (and `setTabWidth`) dropped |
| Behaviour (DOM tests) | `tablist` role, initial, default and set selection, click selection, cancelable `tdsChange`, disabled tabs, scroll buttons and their labels, left padding | Disabled modifier and `aria-disabled` |
| Tokens added | 14 (family) | — |

## Departures from Tegel

1. **Elements.** Tegel renders hosts (shadow DOM). The parent renders a `tablist` root, a
   scroll wrapper, two scroll buttons and a tab list `<div>`. Each tab renders a `<div>`
   around the consumer's button or link.
2. **`aria-selected` is on the tab's button or link.** Tegel sets it on the tab host,
   which has no role. The cell sets it on the `button` or `a` inside the tab, the element
   that has `role="tab"`, as Tegel does with `aria-disabled`.
3. **The selection lives in the DOM.** Tegel's parent calls each tab's `setSelected`. The
   parent cell sets `aria-selected` from a callback ref and from its click handler. The
   tab's stylesheet reads it with `:has([aria-selected='true'])`. When no tab is
   selected, for example after the tab list changes, the ref selects the default again,
   as Tegel's `slotchange` handler does.
4. **`tdsChange` on load is not sent.** Tegel sends it once with the initial index. A cell
   has no effect that runs once after the first render.
5. **A set `selectedIndex` is controlled.** A click sends `tdsChange`, and the selection
   follows `selectedIndex` only. Tegel's click handler also changes its own
   `selectedIndex`.
6. **The scroll buttons update on render, scroll and click.** Tegel also uses a
   `ResizeObserver`. Without one, a window resize shows or hides the buttons only after
   the next scroll or render. A button is hidden while it is `disabled`; Tegel adds a
   `show` class and sets `disabled` too.
7. **`leftPadding` is one of `0`, `8`, `16`, `24`, `32`, `40` or `48`.** Tegel accepts any
   number and writes it to a `--padding-left` custom property in a `style` attribute.
   The cell has no `style` attribute, so each value is a modifier with a spacing token.
   The padding moves from the scroll wrapper to the tab list, so the left scroll button
   needs no negative offset.
8. **Indices are strings** (`defaultSelectedIndex="1"`), as other number props
   (finding 10 in `README.md`).
9. **The first and last tab use `:first-child` and `:last-child`.** Tegel adds `first`
   and `last` classes from its script. The folder tab's `first` rules have no visible
   effect in Tegel, so the cell leaves them out.
10. **The folder tab is `border-box`.** Tegel uses `width: calc(100% - 32px)` and
    `min-width: 142px` on a content box with 16px padding. The cell uses `width: 100%`
    and a 174px `min-width`, which give the same size.
11. **The folder tab's indicator is an inset `box-shadow`.** Tegel draws it as a
    `border-top` on an inner `<div>`, and positions the focus ring from the host, so the
    ring overlaps the indicator. The cell's root is both, and a border on it would push
    the ring 2px down, which shows two lines. The button keeps a 2px transparent top
    border in every state, so the height does not change.
12. **The scroll buttons are `type="button"`.** Tegel's buttons submit a surrounding form.
13. **The navigation scroll icon uses the icon colour.** Tegel's navigation stylesheet
    reads the folder tabs' colour variable, which is not set there.
14. **No console warnings** for a missing `role="tab"` or `aria-controls`.
15. **No methods** (`selectTab`, `reinitialize`). `setTabWidth` is never called by
    `tds-folder-tabs` in 1.66.1.

Visual checks for Phase 7: the scroll buttons in a narrow row, the indicator transition on
hover, and the focus rings on the tabs and scroll buttons.

## Findings about BOB

1. **A parent can share state with its children through the DOM.** The parent reads its
   tab list's children and sets ARIA attributes on them. The children's stylesheets read
   those attributes. This needs no relaxation, unlike the stepper and footer, where the
   child needs the parent's props. The contract between the two cells (`button, a`,
   `aria-selected`, `aria-disabled`) is not in any BOB artifact, and no check reads it.
   Source: structural.
2. **A number that drives CSS becomes a `VARIANT`.** With no `style` attribute and no
   number type, a free number (`leftPadding`) becomes a fixed list of values, each with
   a token. Source: structural.
3. **Three families repeat the same script.** The three parents differ only in their
   class names and `leftPadding`. A cell cannot import shared code (L12), so each copy
   must be kept in step by hand. Source: structural.
