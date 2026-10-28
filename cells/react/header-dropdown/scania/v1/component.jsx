function HeaderDropdown({
  label,
  noDropdownIcon = false,
  selected = false,
  tdsAriaLabel,
  children,
  icon,
}) {
  let detach;
  // Light dismiss closes the menu on pointerup, before the click, so read the state on
  // pointerdown. A keyboard click has no pointerdown.
  let wasOpen;
  return (
    <li
      className={`tl-header-dropdown tl-header-dropdown--selected-${selected} tl-header-dropdown--no-dropdown-icon-${noDropdownIcon}`}
    >
      <button
        className="tl-header-dropdown__button"
        type="button"
        aria-expanded="false"
        aria-current={selected ? 'location' : 'false'}
        aria-label={tdsAriaLabel}
        onPointerDown={(event) => {
          wasOpen = event.currentTarget.nextElementSibling.matches(':popover-open');
        }}
        onClick={(event) => {
          const button = event.currentTarget;
          const menu = button.nextElementSibling;
          const open = wasOpen === undefined ? menu.matches(':popover-open') : wasOpen;
          wasOpen = undefined;
          if (open) {
            if (menu.matches(':popover-open')) menu.hidePopover();
            return;
          }
          menu.showPopover({ source: button });
          const first = menu.querySelector("a, [tabindex='0']");
          if (first) first.focus();
        }}
      >
        <span className="tl-header-dropdown__icon">{icon}</span>
        {label}
        <svg className="tl-header-dropdown__chevron" viewBox="0 0 32 32" role="img">
          <title>Dropdown icon</title>
          <path className="tl-header-dropdown__chevron-path" />
        </svg>
      </button>
      <div
        ref={(menu) => {
          if (!menu) {
            if (detach) detach();
            return;
          }
          const toggle = () => {
            const button = menu.previousElementSibling;
            const open = menu.matches(':popover-open');
            button.setAttribute('aria-expanded', String(open));
            if (!open && menu.contains(document.activeElement)) button.focus();
          };
          menu.addEventListener('toggle', toggle);
          detach = () => menu.removeEventListener('toggle', toggle);
        }}
        className="tl-header-dropdown__menu"
        popover="auto"
        onClick={(event) => {
          if (event.target.closest('a, button')) event.currentTarget.hidePopover();
        }}
      >
        {children}
      </div>
    </li>
  );
}
