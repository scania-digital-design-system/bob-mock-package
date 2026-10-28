function TableHeaderInputWrapper({ showIcon = true, compactDesign = false, children }) {
  return (
    <div
      className={`tl-table-header-input-wrapper tl-table-header-input-wrapper--show-icon-${showIcon} tl-table-header-input-wrapper--compact-design-${compactDesign}`}
    >
      {children}
      {showIcon && (
        <svg className="tl-table-header-input-wrapper__icon" viewBox="0 0 32 32" role="img">
          <title>search</title>
          <path className="tl-table-header-input-wrapper__search" />
        </svg>
      )}
    </div>
  );
}
