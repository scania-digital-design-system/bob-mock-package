function HeaderLauncherButton({ active = false, tdsAriaLabel }) {
  return (
    <div className={`tl-header-launcher-button tl-header-launcher-button--active-${active}`}>
      <button className="tl-header-launcher-button__button" type="button" aria-label={tdsAriaLabel}>
        <svg className="tl-header-launcher-button__icon" viewBox="0 0 32 32" role="img">
          {tdsAriaLabel && <title>{tdsAriaLabel}</title>}
          <path className="tl-header-launcher-button__bento" />
        </svg>
      </button>
    </div>
  );
}
