# Findings: modal

Reference: Tegel `tds-modal` at `@scania/tegel@1.66.1`
(`packages/core/src/components/modal/`). Cell: `cells/react/modal/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS, after one change (departure 9) |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | All props and events; `body`, `actions` added; 5 methods dropped |
| Behaviour (DOM tests) | Modifier classes, role, name, header, actions, close button, `show`, close from the button, backdrop, Escape and `data-dismiss-modal`, cancelable `tdsClose` and `tdsOpen`, reference element by selector and by element |
| Tokens added | 10 |

## Departures from Tegel

1. **The cell is a native `<dialog>`.** Tegel renders a host with a backdrop `<div>` and an
   inner `role="dialog"` box, and keeps the open state itself. The cell's `<dialog>`
   holds the open state and opens with `showModal()`. The browser puts it in the top
   layer, makes the page behind it inert, and returns focus on close. The dialog fills
   the viewport, as Tegel's host does, and draws its own backdrop `<div>`.
2. **Focus stays in the dialog through `inert`.** Tegel traps Tab with a window key
   listener and cycles through a list of focusable elements. The native dialog keeps
   focus out of the page; Tab can still reach the browser's own controls.
3. **`role`, `aria-modal` and the name are on the `<dialog>`.** The name is
   `aria-label` from a text `header`. Tegel links the header and body by generated ids
   (`aria-labelledby`, `aria-describedby`). Without `useId` the cell has no stable ids, so
   a header node gives no name and the body is not linked.
4. **`header` is a `ReactNode`.** Text renders in Tegel's `<h1>`; a node renders as it
   is. Tegel has a `header` prop and a `header` slot and warns when both are used.
5. **The `body` and `actions` slots are props.**
6. **The reference element listener lives in a callback ref.** The ref adds the click
   listener and removes it when React calls it with `null`. Tegel adds it in
   `componentWillLoad`.
7. **`show` applies on every render.** Tegel applies it only when it changes. If a user
   closes the modal while `show` stays `true`, the next render opens it again.
8. **Escape uses the dialog's `cancel` event.** The cell always prevents the native
   close and closes through the cancelable `tdsClose`, as Tegel does.
9. **Firefox scrollbars use the default colour.** BOB's `token-usage` rule does not allow
   a colour token on `scrollbar-color`, so the cell keeps only `scrollbar-width: thin`.
   WebKit scrollbars keep Tegel's styles.
10. **No methods** (`showModal`, `closeModal`, `isOpen`, `initializeModal`,
    `cleanupModal`) and no `z-index` (the top layer replaces it).

Visual checks for Phase 7: the widths per breakpoint, the sticky actions with a long
body, the backdrop colour and the focus ring on the close button.

## Findings about BOB

1. **A native element can hold the state of a whole component.** `<dialog>` gives open
   state, focus handling and Escape with no hooks, as `<details>` does for the card.
   Source: structural.
2. **`token-usage` does not list `scrollbar-color`.** A colour token there fails the
   gate. Source: structural.
3. **A ref callback can add and remove a listener on another element.** Each render's
   ref removes its own listener when React detaches it. No effect is needed. Source:
   structural.
4. **A viewport-relative value needs a carrier.** `max-height: 85vh` is a `COLOR`
   carrier (`size/modal/max-height`), because `FLOAT` tokens are pixels. Source:
   structural.
