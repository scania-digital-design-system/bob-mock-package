function HeaderCell({
  cellKey,
  cellValue,
  sortable = false,
  textAlign = 'left',
  disablePadding = false,
  tdsAriaLabelSortButton = '',
  colSpan,
  rowSpan,
  children,
  onTdsSort,
}) {
  const hover = (th, key) => {
    const table = th.closest('table');
    if (!table) return;
    table.querySelectorAll('.tl-body-cell').forEach((cell) => {
      cell.toggleAttribute('data-hover', Boolean(key) && cell.dataset.cellKey === key);
    });
  };
  const sort = (button) => {
    const th = button.closest('th');
    const table = th.closest('table');
    const direction = th.getAttribute('aria-sort') === 'ascending' ? 'desc' : 'asc';
    if (table) {
      table.querySelectorAll('th[data-sortable]').forEach((other) => other.setAttribute('aria-sort', 'none'));
    }
    th.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');
    if (onTdsSort) {
      onTdsSort(
        new CustomEvent('tdsSort', {
          cancelable: true,
          detail: {
            tableId: table ? table.dataset.tableId : undefined,
            columnKey: cellKey,
            sortingDirection: direction,
          },
        }),
      );
    }
  };
  return (
    <th
      ref={(th) => {
        if (!th || !cellKey) return;
        const table = th.closest('table');
        if (!table) return;
        table
          .querySelectorAll(`.tl-body-cell[data-cell-key="${cellKey}"]:not([data-text-align])`)
          .forEach((cell) => cell.setAttribute('data-text-align', textAlign));
      }}
      className={`tl-header-cell tl-header-cell--sortable-${sortable} tl-header-cell--${textAlign} tl-header-cell--disable-padding-${disablePadding}`}
      data-cell-key={cellKey}
      data-sortable={sortable || undefined}
      aria-sort="none"
      colSpan={colSpan}
      rowSpan={rowSpan}
      onMouseOver={(event) => hover(event.currentTarget, cellKey)}
      onFocus={(event) => hover(event.currentTarget, cellKey)}
      onMouseLeave={(event) => hover(event.currentTarget, '')}
      onBlur={(event) => hover(event.currentTarget, '')}
    >
      {sortable ? (
        <button
          className="tl-header-cell__button"
          type="button"
          aria-label={tdsAriaLabelSortButton || undefined}
          onClick={(event) => sort(event.currentTarget)}
        >
          <span className="tl-header-cell__button-text">
            {cellValue}
            {children}
          </span>
          <svg className="tl-header-cell__icon tl-header-cell__icon--unsorted" viewBox="0 0 32 32" aria-hidden="true">
            <path className="tl-header-cell__sorting" />
          </svg>
          <svg className="tl-header-cell__icon tl-header-cell__icon--sorted" viewBox="0 0 32 32" aria-hidden="true">
            <path className="tl-header-cell__arrow" />
          </svg>
        </button>
      ) : (
        <p className="tl-header-cell__text">
          {cellValue}
          {children}
        </p>
      )}
    </th>
  );
}
