function HeaderLauncher({ tdsAriaLabel, children }) {
  let detach;
  // Light dismiss closes the menu on pointerup, before the click, so read the state on
  // pointerdown. A keyboard click has no pointerdown.
  let wasOpen;
  return (
    <li className="tl-header-launcher">
      <button
        className="tl-header-launcher__button"
        type="button"
        aria-expanded="false"
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
        <svg className="tl-header-launcher__icon" viewBox="0 0 32 32" role="img">
          {tdsAriaLabel && <title>{tdsAriaLabel}</title>}
          <path className="tl-header-launcher__bento" />
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
        className="tl-header-launcher__menu"
        popover="auto"
      >
        {children}
      </div>
    </li>
  );
}
