function Table({
  verticalDividers = false,
  compactDesign = false,
  noMinWidth = false,
  multiselect = false,
  expandableRows = false,
  responsive = false,
  zebraMode = 'none',
  sortColumnKey,
  sortDirection,
  tableId,
  children,
}) {
  return (
    <table
      ref={(table) => {
        if (!table || !sortColumnKey) return;
        table.querySelectorAll('th[data-sortable]').forEach((th) => {
          const sorted = th.dataset.cellKey === sortColumnKey && sortDirection;
          if (!sorted) th.setAttribute('aria-sort', 'none');
          else th.setAttribute('aria-sort', sortDirection === 'asc' ? 'ascending' : 'descending');
        });
      }}
      className={`tl-table tl-table--compact-design-${compactDesign} tl-table--vertical-dividers-${verticalDividers} tl-table--no-min-width-${noMinWidth} tl-table--multiselect-${multiselect} tl-table--expandable-rows-${expandableRows} tl-table--responsive-${responsive} tl-table--zebra-mode-${zebraMode}`}
      data-table-id={tableId}
    >
      {children}
    </table>
  );
}
