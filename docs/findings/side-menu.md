# Findings: side menu

Reference: Tegel `tds-side-menu` and its children at `@scania/tegel@1.66.1`
(`packages/core/src/components/side-menu/`): `tds-side-menu-item`,
`tds-side-menu-dropdown`, `tds-side-menu-dropdown-list`,
`tds-side-menu-dropdown-list-item`, `tds-side-menu-collapse-button`,
`tds-side-menu-close-button`, `tds-side-menu-overlay`, `tds-side-menu-user`,
`tds-side-menu-user-image` and `tds-side-menu-user-label`. Cells: one folder per tag in
`cells/react/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS for all 11 |
| Bootstrap prompt rules | PASS for side-menu, close button, overlay, user image and user label; relaxed (`parent-modifier-selectors`) for item, dropdown, dropdown list, dropdown list item, collapse button and user |
| Public API vs `@scania/tegel` types | All props and events. Added: `children`, `overlay`, `closeButton`, `end`, `stickyEnd` (menu); `children`, `icon`, `label` (dropdown); `children` (item, list, list item, collapse button, user image); `onClick` (close button, overlay); `icon` (user). Nothing dropped |
| Behaviour (DOM tests) | Open and collapsed state from props, slot order, an empty upper list, Escape on mobile only, a new `open` after Escape, focus on open, the Tab trap, listener removal; collapse and expand from the collapse button, `tdsCollapse` from the button and the menu, prevention from either, `aria-expanded` from the `collapsed` prop; item modifiers; dropdown toggle, `defaultOpen` once, the `open` prop, one dropdown open at a time, icon and label; list items; close button and overlay clicks; the three user cells |
| Tokens added | 23 (family) |

## Departures from Tegel

1. **Native elements, no shadow DOM.** The menu renders a `<div>` root with `<aside>`,
   `<nav>` and two `<ul>` lists. The dropdown list and its items are `<ul>` and `<li>`;
   Tegel puts `role="list"` and `role="listitem"` on its hosts. Tegel's slots are props:
   `overlay`, `closeButton`, `end`, `stickyEnd` (menu), `icon`, `label` (dropdown) and
   `icon` (user).
2. **The menu keeps its state in the DOM.** `data-open` and `data-collapsed` on the root
   come from the props, so React applies a prop when it changes. Escape and the collapse
   button change them too. The children read `data-collapsed` with the relaxation
   `parent-modifier-selectors`. Tegel sends the state to each child with the internal
   `internalTdsSideMenuPropChange` event.
3. **CSS decides by viewport, not a listener.** Media queries at 992px show the open state
   on mobile and the collapsed state on desktop. Tegel listens to `matchMedia`, sets
   `collapsed` to false on mobile and `open` to false on desktop. Here both attributes
   stay as they are. A menu opened on desktop shows when the window gets narrow.
4. **The menu also sends `tdsCollapse`.** Tegel declares the event on `tds-side-menu` but
   only the collapse button sends it, and it does not bubble. Here the button sends its
   event first, then the menu sends its own. Either listener can prevent the change.
5. **Escape closes the menu with no event,** as in Tegel. React does not see the change.
   Thus `open={true}` has no effect again until `open` changes. Set `open` to false in
   the close button's and the overlay's `onClick`.
6. **The close button and the overlay take `onClick`.** Tegel's consumers add a click
   listener to the host. Neither cell closes the menu itself, as in Tegel.
7. **The close button's name is always "Close".** Tegel copies the host's ARIA attributes
   to the button and sets `aria-controls` to the menu's `id`. A cell has no host
   attributes. As in Tegel, a click sets `aria-expanded="false"` on the header
   hamburger.
8. **No host attributes on the menu.** Tegel sets `aria-expanded` on the host, and its
   story sets `id` and `aria-label` there. The root takes neither. Style the persistent
   menu's height and position through a parent element.
9. **Focus and the hamburger.** On open, focus moves to the first focusable element
   when React commits; Tegel waits 100 ms. On close, focus moves to the header
   hamburger, as in Tegel, when focus was in the menu. The menu also sets the
   hamburger's `aria-expanded` from its open state; Tegel leaves that to the consumer.
   The Tab trap moves from the focused element and skips hidden elements
   (`checkVisibility`); Tegel counts from a stored index.
10. **An empty upper list is found with `:empty`.** Tegel checks the slot's assigned
    elements after load.
11. **The collapsed item centres a direct `<svg>` child.** Tegel adds a class to the
    first `tds-icon` or `svg` it finds at any depth. Tegel's `component-has-user` layout
    for a button with a user inside is dropped: it changes only the gap, which has no
    effect on one child.
12. **The dropdown draws its own button** (L12: no other cells). The item styles are
    copied into the dropdown's stylesheet. `aria-expanded` is on the button; Tegel puts
    it on the item host.
13. **The dropdown label renders twice:** in the button and in the heading of the
    collapsed list. CSS shows one. Tegel moves its one `label` slot between the two.
14. **`defaultOpen` applies once,** on the first attach, marked with
    `data-default-open`. The `open` prop applies when it changes.
15. **The dropdown opens with the native button.** Tegel also listens to Enter and Space
    on the whole host, so Enter on a link in the list toggles the dropdown and blocks
    the link.
16. **One dropdown open at a time, per menu.** Opening one closes the others in the same
    menu. Tegel closes every other dropdown on the page.
17. **The collapsed dropdown opens on `:hover` and `:focus-within`.** A `visibility`
    transition keeps it open for 150 ms after the pointer leaves; Tegel uses pointer and
    focus listeners with the same tolerance. `aria-expanded` follows clicks only. The
    list itself takes no focus; Tegel gives it `tabindex="0"`.
18. **The collapsed dropdown's position needs no script.** Tegel writes the host's
    distance from the top into a `style`. Here the list's `max-height` is 70% of the
    menu's height, not 70% of the space below the item. An `end` dropdown opens upwards
    with `translate`, so its bottom lines up with the button's bottom, as in Tegel.
19. **The list item's focus ring also shows on a `<button>`.** Tegel styles it on an
    `<a>` only.
20. **The collapse button renders both arrows,** each with its own title. CSS shows one.
    The menu sets the button's `aria-expanded`.
21. **The user draws its own image and label** (L12), with `<span>` elements so it can
    sit inside a button. Tegel's user renders the image and label components. The user
    and the user image wrap the image in a flex box, which removes the line gap under
    it.

Visual checks for Phase 7: the item and sub-item heights, the selected indicator, the
dropdown chevron, the user in the end dropdown, the collapsed width, the collapsed
dropdown list and its heading, and the mobile drawer with its overlay.

## Findings about BOB

1. **A state that one child changes and every child shows has no place in a cell.** The
   collapse button changes the menu's state, and the items, dropdowns and lists change
   their layout. A modifier reads only a prop, and a cell has no context. The state is a
   `data-` attribute on the menu's root, read under the relaxation. Source: structural.
2. **A cell has no host attributes.** The destructured props are the whole API, so a
   consumer cannot add `id`, `aria-label` or a click listener to a cell's root. The
   close button and the overlay need an `onClick` prop. Source: structural.
3. **Props that apply in one viewport only stay in the DOM in both.** No listener can
   reset them (L12), so CSS ignores them by media query. Source: structural.
