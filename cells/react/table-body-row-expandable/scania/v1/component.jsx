function TableBodyRowExpandable({
  colSpan,
  rowId,
  expanded = false,
  overflow = 'auto',
  autoCollapse = false,
  tdsAriaLabelExpandButton = '',
  selected = false,
  disabled = false,
  children,
  expandRow,
  onTdsChange,
  onTdsSelect,
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
  const setExpanded = (button, open) => {
    button.setAttribute('aria-expanded', String(open));
    const table = button.closest('table');
    if (onTdsChange) {
      onTdsChange(
        new CustomEvent('tdsChange', {
          detail: { rowId, isExpanded: open, tableId: table ? table.dataset.tableId : undefined },
        }),
      );
    }
    if (!open || !table) return;
    table
      .querySelectorAll(
        '.tl-table-body-row-expandable--auto-collapse-true .tl-table-body-row-expandable__control[aria-expanded="true"]',
      )
      .forEach((other) => other !== button && other.setAttribute('aria-expanded', 'false'));
  };
  return (
    <>
      <tr
        className={`tl-table-body-row-expandable tl-table-body-row-expandable--auto-collapse-${autoCollapse}`}
        id={rowId ? `expandable-content-${rowId}` : undefined}
      >
        <td className="tl-table-body-row-expandable__select">
          <label className="tl-table-body-row-expandable__label">
            <input
              ref={(input) => {
                if (input && input.dataset.selected !== String(selected)) {
                  input.checked = selected;
                  input.dataset.selected = String(selected);
                }
              }}
              className="tl-table-body-row-expandable__checkbox"
              type="checkbox"
              disabled={disabled}
              onChange={(event) => {
                const table = event.target.closest('table');
                if (onTdsSelect) {
                  onTdsSelect(
                    new CustomEvent('tdsSelect', {
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
        </td>
        <td className="tl-table-body-row-expandable__control-cell">
          <button
            className="tl-table-body-row-expandable__control"
            type="button"
            aria-expanded={expanded}
            aria-controls={rowId ? `expandable-content-${rowId}` : undefined}
            aria-label={tdsAriaLabelExpandButton || undefined}
            onClick={(event) =>
              setExpanded(event.currentTarget, event.currentTarget.getAttribute('aria-expanded') !== 'true')
            }
          >
            <svg className="tl-table-body-row-expandable__icon" viewBox="0 0 32 32" aria-hidden="true">
              <path className="tl-table-body-row-expandable__chevron" />
            </svg>
          </button>
        </td>
        {children}
      </tr>
      <tr className={`tl-table-body-row-expandable__expand tl-table-body-row-expandable--overflow-${overflow}`}>
        <td
          ref={(cell) => {
            if (!cell) return;
            const table = cell.closest('table');
            const head = table ? table.querySelector('thead tr') : null;
            const multiselect = table && table.classList.contains('tl-table--multiselect-true');
            const columns = head ? head.children.length - 1 + (multiselect ? 1 : 0) : 1;
            cell.colSpan = colSpan ? Number(colSpan) : columns;
          }}
          className="tl-table-body-row-expandable__cell"
        >
          <div className="tl-table-body-row-expandable__content">{expandRow}</div>
        </td>
      </tr>
    </>
  );
}
