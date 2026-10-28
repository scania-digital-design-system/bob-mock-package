# Findings: table

Reference: Tegel `tds-table` and its children at `@scania/tegel@1.66.1`
(`packages/core/src/components/table/`): `tds-table-toolbar`, `tds-table-header`,
`tds-header-cell`, `tds-table-header-input-wrapper`, `tds-table-body`,
`tds-table-body-row`, `tds-table-body-row-expandable`, `tds-body-cell`,
`tds-table-body-input-wrapper` and `tds-table-footer`. Cells: one folder per tag in
`cells/react/`, named after the tag (`header-cell`, `body-cell`).

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS for all 11, after one change (departure 13) |
| Bootstrap prompt rules | PASS for table, table-body, table-footer; relaxed (`parent-modifier-selectors`) for the other 8 |
| Public API vs `@scania/tegel` types | All props and events. `children` added to 9 cells; `start`, `end` (toolbar) and `expandRow` added. Dropped: `horizontalScrollWidth`, `getSelectedRows` (table), `customWidth` (header cell), `expand`, `collapse` (expandable row) |
| Behaviour (DOM tests) | Modifier classes, sort state from the table and from clicks, `tdsSort`, text alignment and hover passed to body cells, `tdsSelect` and `tdsSelectAll` with the selected rows, `selected` and `indeterminate`, `tdsClick` with the row index, expand and auto-collapse, `tdsChange`, the expanded row's span, Enter to the next input, the toolbar search and `tdsFilter`, pagination, `tdsPagination`, the footer's span |
| Tokens added | 31 (family) |

## Departures from Tegel

1. **Native table elements.** Tegel's hosts take `display: table-row` and similar, and
   most render inside shadow DOM. The cells render `<table>`, `<caption>`, `<thead>`,
   `<tbody>`, `<tfoot>`, `<tr>`, `<th>` and `<td>` directly. The expandable row renders
   its two `<tr>` elements in a fragment.
2. **The children read the table's props from its modifier classes**
   (`tl-table--multiselect-true` and so on), with the relaxation
   `parent-modifier-selectors`. Tegel copies them to every child with the internal
   `internalTdsTablePropChange` event. The header, rows and footer render the
   multiselect and expand columns always, and the table's class hides them.
3. **The cells share state through the DOM,** as the tabs do:
   - The sort direction is `aria-sort` on the header cell. A click sets it and resets the
     other header cells; the table sets it from `sortColumnKey` and `sortDirection`.
   - A header cell sets `data-text-align` on the body cells with its `cellKey` that have
     no own `textAlign`, and `data-hover` while the pointer is over it. Tegel sends
     internal events for both.
   - Selection is the row's checkbox state; expansion is `aria-expanded` on the expand
     button.
   - The footer's page is the page input's value; the buttons are disabled through the
     DOM.
4. **`selected` (rows and header) applies when it changes.** The ref keeps the last
   applied value in `data-selected`, so a re-render with the same value does not undo a
   user's click.
5. **`selectedRows` is read from the DOM** when a checkbox changes. Each cell gives
   `cellKey` and its text; Tegel gives `cellValue` when it is set (a number stays a
   number). `getSelectedRows()` is dropped (no methods, L12).
6. **`horizontalScrollWidth` is dropped.** It sets a width in pixels in a `style`
   attribute. Put the table in a container with `overflow-x: auto` instead.
7. **`customWidth` is dropped,** for the same reason. With `noMinWidth`, columns take
   their content width.
8. **The column counts of the expanded row and the footer** come from the header row
   and the table's classes, read in a ref. Tegel counts in `componentWillRender`. A
   `colSpan` or `cols` prop still wins.
9. **Auto-collapse changes the other rows' DOM only.** Tegel's other rows also send
   their own `tdsChange`; a cell cannot call another cell's callback.
10. **The expand button sits in its cell.** Tegel positions it absolutely in a cell
    with no size.
11. **The toolbar search is a plain input and button.** Tegel uses `tds-text-field` and
    `tds-button` (L12). The field opens on the button and closes when focus leaves it
    empty; Tegel listens to document clicks and Tab.
12. **The rows-per-page selector is a native `<select>`.** Tegel uses `tds-dropdown`
    (L12). `rowsPerPageDropdownOpenDirection` has no effect. `rowsPerPageValues` is a
    comma-separated string (finding 10 in the README); Tegel takes a number array.
13. **Icon offsets use logical properties** (`inset-inline-start`, `inset-inline-end`).
    The gate's `token-usage` rule does not allow a `space` token on `left` or `right`.
14. **The page input commits on blur and Enter** and restores the last valid page when
    the value is out of range. Tegel also shakes the input; there is no animation
    (ADR 0002 D8). A smaller `pages` does not move the page back.
15. **The footer buttons and the search button have no visible text,** as in Tegel. The
    search button takes `tdsSearchAriaLabel` as its name; the footer buttons have none.
16. **Cell borders and radii follow the collapsed border model.** Tegel's
    `border-radius` on header cells has no effect there; the cells drop it.
17. **No `modeVariant`** (ADR 0002 D8).

Visual checks for Phase 7: the header and body heights in both designs, the checkbox
column, the sort icons, the zebra stripes, the expanded row, the toolbar search and the
footer controls.

## Findings about BOB

1. **A compound component with many children multiplies the relaxation.** Eight of the
   eleven cells style their classes under the table's modifiers. Source: structural.
2. **`token-usage` reads physical and logical insets differently.** A `space` token is
   allowed on `inset-inline-start` but not on `left`. Source: structural.
3. **A shared protocol between cells is recorded nowhere.** The header cell writes
   `data-text-align` and `data-hover` that the body cell's stylesheet reads, and the
   rows read the table's classes in script. Neither check sees it. Source: structural.
