# Findings: header

Reference: Tegel `tds-header` and its parts at `@scania/tegel@1.66.1`
(`packages/core/src/components/header/`): `tds-core-header-item`, `tds-header-item`,
`tds-header-hamburger`, `tds-header-title`, `tds-header-brand-symbol`,
`tds-header-dropdown`, `tds-header-dropdown-list`, `tds-header-dropdown-list-item`,
`tds-header-dropdown-list-user`, `tds-header-launcher`, `tds-header-launcher-button`,
`tds-header-launcher-grid`, `tds-header-launcher-grid-item`,
`tds-header-launcher-grid-title`, `tds-header-launcher-list`,
`tds-header-launcher-list-item` and `tds-header-launcher-list-title`. Cells: one folder
per tag in `cells/react/`. Compositions: Tegel's header story and the navigation pattern
stories (`packages/core/src/stories/patterns/navigation/`).

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS for all 18 |
| Bootstrap prompt rules | PASS for 17; relaxed (`parent-modifier-selectors`) for header-dropdown-list-item |
| Public API vs `@scania/tegel` types | All props; the family has no events. Added: `hamburger`, `title`, `children`, `end` (header); `children`, `icon` (dropdown); `onClick` (hamburger); `thumbnail` (list user); `children` on 13 other parts. Nothing dropped |
| Behaviour (DOM tests) | List order and `<li>` parts, the hamburger and title as children, item and launcher button modifiers, the hamburger's name, state and click, the title heading, the brand link; dropdown and launcher: light-dismiss popover, open under the button, `aria-expanded`, focus on the first link, close on a second click, no reopen after light dismiss, close on a link click with focus back to the button, listener removal, modifiers, `aria-current`, icon, label and chevron; list sizes, list item modifiers, the list user with an image or a thumbnail, launcher titles, lists and grid; the hamburger with the side menu |
| Tokens added | 27 (family) |

## Departures from Tegel

1. **One native list.** The header renders `<nav>` with one `<ul>`, and every part in it
   renders an `<li>`. Tegel's header has no shadow DOM; it relocates its children into
   the list and sets `role="listitem"` on them with a `MutationObserver`. The launcher
   grid and its items keep Tegel's `role="list"` and `role="listitem"` on `<div>`s.
2. **Slots are props.** `hamburger`, `title` and `end` (header); `icon` and `label`
   (dropdown); `header`, `subheader` and `thumbnail` (list user). `hamburger` and `title`
   render in the list before the items. Tegel renders those two slots before the list,
   but its stories put both parts in the default slot, which also puts them in the list.
   Children give the same result here.
3. **Each part hides itself by viewport.** Below 992px the items, the dropdowns and the
   brand symbol hide, and at 992px or wider the hamburger hides. Tegel's header
   stylesheet hides items and dropdowns by tag, inside the header only. Tegel's stories
   show a part on mobile with a class on the host; a cell takes no class.
4. **The divider before the first item** comes from `:nth-child(3)` on the item and the
   dropdown, as in Tegel's header stylesheet.
5. **The dropdown and launcher menus are native popovers,** placed with CSS anchor
   positioning (`position-area: bottom span-right`, no fallback), as in the popover
   cells. Tegel uses `tds-popover-canvas` with Popper. Light dismiss closes a menu on a
   click outside and on Escape; Tegel listens to document clicks and window key
   presses. The menu's `max-height` is the space below the button; Tegel uses the
   viewport height minus the header height. A launcher of lists fills that space, as in
   Tegel.
6. **The menu content is always in the DOM.** Tegel renders the slot only while the menu
   is open.
7. **`aria-expanded` follows the popover's `toggle` event.** `aria-controls` is dropped:
   it needs an id, and a cell has no stable one (no `useId`).
8. **Focus.** On open, focus moves to the first link, as in Tegel. When the menu closes
   with focus inside it, focus goes back to the button; Tegel does that on Escape only.
9. **The hamburger takes `onClick`** and renders `aria-haspopup="true"` and
   `aria-expanded="false"`. The side menu sets `aria-expanded` from its open state and
   moves focus to the hamburger when it closes. Tegel copies the host's ARIA attributes
   to the button; its stories set `aria-expanded` on the host, where it does not reach
   the button. The undocumented `persistent` attribute is dropped.
10. **The brand symbol loads the CDN image only.** Tegel tries a local asset first. The
    console warning for a link with no `aria-label` is dropped.
11. **The item's `order` attribute is dropped.** Tegel reads it and sets CSS `order` in a
    `style`.
12. **Icon and image offsets apply to direct children** (`> svg:only-child`, `> img`).
    Tegel adds classes to the first icon and image it finds at any depth.
13. **No host attributes.** Tegel copies the header's ARIA attributes (for example
    `aria-label`) to the `<nav>`. The cell takes none.
14. **The dropdown's `label` takes text or nodes.** One prop takes Tegel's `label` prop
    and `label` slot, so its type is wider than Tegel's `string`.
15. **The list item reads the list's size from its class.** Tegel's list sets each
    child's `size` property when it loads. Here the list item styles its own classes
    under `.tl-header-dropdown-list--lg`, with the relaxation `parent-modifier-selectors`.
    An item's own `size` also works.
16. **No `aria-labelledby` on the lists.** Tegel gives each launcher title a generated id
    and points the next list at it. A cell has no stable id.
17. **Below 384px, a menu and its lists take the full width** of the menu's position
    area. Tegel sets the lists to `100vw`.
18. **The list user's `thumbnail` works.** Tegel's markup names the slot `thumbanil`, so
    its documented `thumbnail` slot never shows. `header` and `subheader` take text or
    nodes (prop and slot in one).
19. **The launcher, launcher list and launcher list item draw their own markup** (L12:
    no other cells). Tegel builds them from `tds-header-launcher-button`,
    `tds-header-dropdown-list` and `tds-header-dropdown-list-item` (size `lg`). The
    item button styles are copied into six cells.
20. **The core header item is a cell for completeness.** No other cell uses it (L12).
21. **The title's heading has no margin.** Tegel's `h4` keeps the browser margins; the
    header centres the title, so the result is the same.
22. **No icon transitions.** Tegel fades the background and colour of item icons in
    0.2 s (ADR 0002 D8: animation is out).

Visual checks for Phase 7: the item heights and dividers, the selected and active lines,
the title font, the brand symbol, the dropdown chevron, the open menus and their
shadows, the list user, the launcher grid tiles and titles, and the mobile header.

## Findings about BOB

1. **One look copied into six cells.** The item button's styles are in the item,
   hamburger, brand symbol, dropdown, launcher and launcher button. Tegel composes them
   from `tds-header-item`. A change to the item does not reach the copies, and no check
   compares them. Source: structural (L12).
2. **A parent that pushes a prop to its children needs the relaxation.** Tegel's list
   sets each item's `size`. A cell cannot set another cell's props, so the item reads
   the list's class. Source: structural.
3. **A consumer cannot show or hide a part by viewport.** Tegel's stories add classes to
   the host for that. A cell's props are its whole API, so it takes no class. Source:
   structural.
