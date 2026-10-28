function TableBodyRow({
  selected = false,
  disabled = false,
  clickable = false,
  children,
  onTdsSelect,
  onTdsClick,
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
  const click = (event) => {
    if (!clickable || !onTdsClick) return;
    const row = event.currentTarget;
    const table = row.closest('table');
    onTdsClick(
      new CustomEvent('tdsClick', {
        detail: {
          event: event.nativeEvent,
          tableId: table ? table.dataset.tableId : undefined,
          rowIndex: [...row.parentElement.children].indexOf(row),
        },
      }),
    );
  };
  return (
    <tr
      className={`tl-table-body-row tl-table-body-row--clickable-${clickable}`}
      tabIndex={clickable ? 0 : undefined}
      onClick={click}
      onKeyDown={(event) => {
        if (!clickable || event.target !== event.currentTarget) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        click(event);
      }}
    >
      <td className="tl-table-body-row__select">
        <label className="tl-table-body-row__label">
          <input
            ref={(input) => {
              if (input && input.dataset.selected !== String(selected)) {
                input.checked = selected;
                input.dataset.selected = String(selected);
              }
            }}
            className="tl-table-body-row__checkbox"
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
      {children}
    </tr>
  );
}
