function SideMenu({
  open = false,
  persistent = false,
  collapsed = false,
  children,
  overlay,
  closeButton,
  end,
  stickyEnd,
  onTdsCollapse,
}) {
  let detach;
  const mobile = () => !window.matchMedia || !window.matchMedia('(min-width: 992px)').matches;
  const focusable = (menu) =>
    [
      ...menu.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((element) => !element.checkVisibility || element.checkVisibility());
  return (
    <div
      ref={(menu) => {
        if (!menu) {
          if (detach) detach();
          return;
        }
        const expanded = String(menu.dataset.collapsed !== 'true');
        menu
          .querySelectorAll('.tl-side-menu-collapse-button__button')
          .forEach((button) => button.setAttribute('aria-expanded', expanded));
        if (open && menu.dataset.open === 'true' && mobile() && !menu.contains(document.activeElement)) {
          const [first] = focusable(menu);
          if (first) first.focus();
        }
        const keydown = (event) => {
          if (menu.dataset.open !== 'true' || !mobile()) return;
          if (event.key === 'Escape') {
            menu.dataset.open = 'false';
            return;
          }
          if (event.key !== 'Tab') return;
          const elements = focusable(menu);
          if (elements.length === 0) return;
          event.preventDefault();
          const index = elements.indexOf(document.activeElement);
          const next = event.shiftKey
            ? (index <= 0 ? elements.length : index) - 1
            : (index + 1) % elements.length;
          elements[next].focus();
        };
        window.addEventListener('keydown', keydown, true);
        detach = () => window.removeEventListener('keydown', keydown, true);
      }}
      className={`tl-side-menu tl-side-menu--persistent-${persistent}`}
      data-open={open}
      data-collapsed={collapsed}
      onClick={(event) => {
        const button = event.target.closest('.tl-side-menu-collapse-button__button');
        if (!button || event.nativeEvent.defaultPrevented) return;
        const menu = event.currentTarget;
        const next = menu.dataset.collapsed !== 'true';
        const tdsCollapse = new CustomEvent('tdsCollapse', {
          cancelable: true,
          detail: { collapsed: next },
        });
        if (onTdsCollapse) onTdsCollapse(tdsCollapse);
        if (tdsCollapse.defaultPrevented) return;
        menu.dataset.collapsed = String(next);
        menu
          .querySelectorAll('.tl-side-menu-collapse-button__button')
          .forEach((other) => other.setAttribute('aria-expanded', String(!next)));
      }}
    >
      <div className="tl-side-menu__wrapper">
        <div className="tl-side-menu__overlay-slot">{overlay}</div>
        <aside className="tl-side-menu__menu">
          <nav className="tl-side-menu__nav">
            <div className="tl-side-menu__close-slot">{closeButton}</div>
            <div className="tl-side-menu__content">
              <ul className="tl-side-menu__upper">
                <li className="tl-side-menu__slot">{children}</li>
              </ul>
              <ul className="tl-side-menu__end">
                <li className="tl-side-menu__slot">{end}</li>
              </ul>
            </div>
            {stickyEnd}
          </nav>
        </aside>
      </div>
    </div>
  );
}
