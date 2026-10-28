function TableHeader({
  allSelected = false,
  selected,
  disabled = false,
  indeterminate = false,
  children,
  onTdsSelectAll,
}) {
  const selectedRows = (table) =>
    [...table.querySelectorAll('tbody tr')]
      .filter((row) => row.querySelector(':scope > td > label > input:checked'))
      .map((row) =>
        [...row.querySelectorAll(':scope > .tl-body-cell')].map((cell) => ({
          cellKey: cell.dataset.cellKey ?? '',
          cellValue: cell.textContent,
        })),
      );
  const checked = Boolean(allSelected || selected);
  return (
    <thead className="tl-table-header">
      <tr className="tl-table-header__row">
        <th className="tl-table-header__select">
          <label className="tl-table-header__label">
            <input
              ref={(input) => {
                if (!input) return;
                input.indeterminate = indeterminate;
                if (input.dataset.selected !== String(checked)) {
                  input.checked = checked;
                  input.dataset.selected = String(checked);
                }
              }}
              className="tl-table-header__checkbox"
              type="checkbox"
              disabled={disabled}
              onChange={(event) => {
                const table = event.target.closest('table');
                if (onTdsSelectAll) {
                  onTdsSelectAll(
                    new CustomEvent('tdsSelectAll', {
                      detail: {
                        tableId: table ? table.dataset.tableId : undefined,
                        checked: event.target.checked,
                        selectedRows: table ? selectedRows(table) : [],
                      },
                    }),
                  );
                }
              }}
            />
          </label>
        </th>
        <th className="tl-table-header__expand" />
        {children}
      </tr>
    </thead>
  );
}
