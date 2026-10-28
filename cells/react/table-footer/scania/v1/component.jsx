function TableFooter({
  pagination = false,
  paginationValue = '1',
  paginationLabel = 'of {pages} pages',
  rowsperpage = true,
  rowsPerPageLabel = 'Rows per page',
  rowsPerPageValues = '10,25,50',
  rowsPerPageDropdownOpenDirection = 'auto',
  rowsPerPageDropdownAriaLabel = 'Select rows per page',
  pages = '0',
  cols,
  rowsPerPageValue,
  onTdsPagination,
}) {
  const values = rowsPerPageValues
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const total = Number(pages);
  const page = Number(paginationValue);
  const label = paginationLabel.split('{pages}');
  const update = (footer, next) => {
    const input = footer.querySelector('.tl-table-footer__page');
    input.value = String(next);
    input.defaultValue = String(next);
    footer.querySelectorAll('.tl-table-footer__back').forEach((button) => {
      button.disabled = next <= 1;
    });
    footer.querySelectorAll('.tl-table-footer__forward').forEach((button) => {
      button.disabled = next >= total;
    });
    if (!onTdsPagination) return;
    const table = footer.closest('table');
    const select = footer.querySelector('.tl-table-footer__rows-select');
    const detail = { tableId: table ? table.dataset.tableId : undefined, paginationValue: next };
    if (rowsperpage) detail.rowsPerPage = Number(select ? select.value : (rowsPerPageValue ?? values[0]));
    onTdsPagination(new CustomEvent('tdsPagination', { cancelable: true, detail }));
  };
  const go = (button, step) => {
    const footer = button.closest('.tl-table-footer');
    update(footer, step(Number(footer.querySelector('.tl-table-footer__page').value)));
  };
  const commit = (input) => {
    if (input.value === input.defaultValue) return;
    const value = Number(input.value);
    const valid = value >= 1 && value <= total;
    update(input.closest('.tl-table-footer'), valid ? value : Number(input.defaultValue));
  };
  return (
    <tfoot className="tl-table-footer">
      <tr className="tl-table-footer__row">
        <td
          ref={(cell) => {
            if (!cell) return;
            const table = cell.closest('table');
            const head = table ? table.querySelector('thead tr') : null;
            let columns = head ? head.children.length - 2 : 0;
            if (table && table.classList.contains('tl-table--multiselect-true')) columns += 1;
            if (table && table.classList.contains('tl-table--expandable-rows-true')) columns += 1;
            cell.colSpan = cols ? Number(cols) : Math.max(columns, 1);
          }}
          className="tl-table-footer__cell"
        >
          {pagination && (
            <div className="tl-table-footer__pagination">
              <div className="tl-table-footer__row-selector">
                {rowsperpage && values.length > 0 && (
                  <div className="tl-table-footer__rows-per-page">
                    <p className="tl-table-footer__rows-label">{rowsPerPageLabel}</p>
                    <select
                      className="tl-table-footer__rows-select"
                      defaultValue={String(rowsPerPageValue ?? values[0])}
                      aria-label={rowsPerPageDropdownAriaLabel}
                      onChange={(event) => go(event.currentTarget, (current) => current)}
                    >
                      {values.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="tl-table-footer__page-selector">
                <input
                  className="tl-table-footer__page"
                  type="number"
                  min="1"
                  max={pages}
                  defaultValue={paginationValue}
                  pattern="[0-9]+"
                  dir="ltr"
                  onBlur={(event) => commit(event.currentTarget)}
                  onKeyDown={(event) => event.key === 'Enter' && commit(event.currentTarget)}
                />
                <p className="tl-table-footer__text">
                  {label.flatMap((part, index) =>
                    index === label.length - 1 ? [part] : [part, <span key={index}>{pages}</span>],
                  )}
                </p>
                <div className="tl-table-footer__navigation">
                  <button
                    className="tl-table-footer__button tl-table-footer__back"
                    type="button"
                    disabled={page <= 1}
                    onClick={(event) => go(event.currentTarget, () => 1)}
                  >
                    <svg className="tl-table-footer__icon" viewBox="0 0 32 32" aria-hidden="true">
                      <path className="tl-table-footer__first" />
                    </svg>
                  </button>
                  <button
                    className="tl-table-footer__button tl-table-footer__back"
                    type="button"
                    disabled={page <= 1}
                    onClick={(event) => go(event.currentTarget, (current) => Math.max(current - 1, 1))}
                  >
                    <svg className="tl-table-footer__icon" viewBox="0 0 32 32" aria-hidden="true">
                      <path className="tl-table-footer__previous" />
                    </svg>
                  </button>
                  <button
                    className="tl-table-footer__button tl-table-footer__forward"
                    type="button"
                    disabled={page >= total}
                    onClick={(event) => go(event.currentTarget, (current) => Math.min(current + 1, total))}
                  >
                    <svg className="tl-table-footer__icon tl-table-footer__icon--lg" viewBox="0 0 32 32" aria-hidden="true">
                      <path className="tl-table-footer__next" />
                    </svg>
                  </button>
                  <button
                    className="tl-table-footer__button tl-table-footer__forward"
                    type="button"
                    disabled={page >= total}
                    onClick={(event) => go(event.currentTarget, () => total)}
                  >
                    <svg className="tl-table-footer__icon tl-table-footer__icon--lg" viewBox="0 0 32 32" aria-hidden="true">
                      <path className="tl-table-footer__last" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </td>
      </tr>
    </tfoot>
  );
}
