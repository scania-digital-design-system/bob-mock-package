function SideMenuDropdown({
  defaultOpen = false,
  buttonLabel,
  selected = false,
  open = false,
  children,
  icon,
  label,
}) {
  return (
    <div className={`tl-side-menu-dropdown tl-side-menu-dropdown--selected-${selected}`}>
      <button
        ref={(button) => {
          if (button && defaultOpen && !button.dataset.defaultOpen) {
            button.dataset.defaultOpen = 'true';
            button.setAttribute('aria-expanded', 'true');
          }
        }}
        className="tl-side-menu-dropdown__button"
        type="button"
        aria-expanded={open}
        onClick={(event) => {
          const button = event.currentTarget;
          const next = button.getAttribute('aria-expanded') !== 'true';
          button.setAttribute('aria-expanded', String(next));
          if (!next) return;
          (button.closest('.tl-side-menu') || document)
            .querySelectorAll('.tl-side-menu-dropdown__button[aria-expanded="true"]')
            .forEach((other) => other !== button && other.setAttribute('aria-expanded', 'false'));
        }}
      >
        <span className="tl-side-menu-dropdown__icon">{icon}</span>
        <span className="tl-side-menu-dropdown__label">
          {buttonLabel}
          {label}
        </span>
        <svg className="tl-side-menu-dropdown__chevron" viewBox="0 0 32 32" role="img">
          <title>Chevron Down</title>
          <path className="tl-side-menu-dropdown__chevron-path" />
        </svg>
      </button>
      <div className="tl-side-menu-dropdown__menu">
        <h3 className="tl-side-menu-dropdown__heading">
          {buttonLabel}
          {label}
        </h3>
        {children}
      </div>
    </div>
  );
}
