function TableBodyInputWrapper({ showIcon = true, children }) {
  return (
    <div
      className={`tl-table-body-input-wrapper tl-table-body-input-wrapper--show-icon-${showIcon}`}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' || event.target.tagName !== 'INPUT') return;
        event.preventDefault();
        const inputs = [...document.querySelectorAll('.tl-table-body-input-wrapper > input')];
        const next = inputs[inputs.indexOf(event.target) + 1];
        if (next) next.focus();
      }}
    >
      {children}
      {showIcon && (
        <svg className="tl-table-body-input-wrapper__icon" viewBox="0 0 32 32" aria-hidden="true">
          <path className="tl-table-body-input-wrapper__edit" />
        </svg>
      )}
    </div>
  );
}
