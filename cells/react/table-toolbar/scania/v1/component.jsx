function TableToolbar({ tableTitle = '', filter = false, tdsSearchAriaLabel = '', start, end, onTdsFilter }) {
  return (
    <caption className="tl-table-toolbar">
      <div className="tl-table-toolbar__bar">
        <div className="tl-table-toolbar__start">
          {tableTitle && <span className="tl-table-toolbar__title">{tableTitle}</span>}
          {start}
        </div>
        <div className="tl-table-toolbar__end">
          {filter && (
            <div
              className="tl-table-toolbar__search"
              onBlur={(event) => {
                const search = event.currentTarget;
                if (search.contains(event.relatedTarget)) return;
                if (search.querySelector('input').value.trim()) return;
                search.querySelector('button').setAttribute('aria-expanded', 'false');
              }}
            >
              <div className="tl-table-toolbar__field">
                <input
                  className="tl-table-toolbar__input"
                  type="text"
                  placeholder="Search..."
                  aria-label={tdsSearchAriaLabel || undefined}
                  onKeyUp={(event) => {
                    const table = event.currentTarget.closest('table');
                    if (onTdsFilter) {
                      onTdsFilter(
                        new CustomEvent('tdsFilter', {
                          cancelable: true,
                          detail: {
                            tableId: table ? table.dataset.tableId : undefined,
                            query: event.currentTarget.value.toLowerCase(),
                          },
                        }),
                      );
                    }
                  }}
                />
                <svg className="tl-table-toolbar__suffix" viewBox="0 0 32 32" aria-hidden="true">
                  <path className="tl-table-toolbar__search-path" />
                </svg>
              </div>
              <button
                className="tl-table-toolbar__open"
                type="button"
                aria-expanded="false"
                aria-label={tdsSearchAriaLabel || undefined}
                onClick={(event) => {
                  const button = event.currentTarget;
                  button.setAttribute('aria-expanded', 'true');
                  button.parentElement.querySelector('input').focus();
                }}
              >
                <svg className="tl-table-toolbar__open-icon" viewBox="0 0 32 32" aria-hidden="true">
                  <path className="tl-table-toolbar__search-path" />
                </svg>
              </button>
            </div>
          )}
          {end}
        </div>
      </div>
    </caption>
  );
}
