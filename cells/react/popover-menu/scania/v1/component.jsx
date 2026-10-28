function PopoverMenu({
  selector,
  referenceEl,
  show,
  defaultShow = false,
  placement = 'auto',
  fluidWidth = false,
  children,
}) {
  let detach;
  const findReference = () => referenceEl || (selector ? document.querySelector(selector) : null);
  const reveal = (popover) => {
    if (popover.matches(':popover-open')) return;
    const reference = findReference();
    popover.showPopover(reference ? { source: reference } : undefined);
  };
  const conceal = (popover) => {
    if (popover.matches(':popover-open')) popover.hidePopover();
  };
  return (
    <div
      ref={(popover) => {
        if (!popover) {
          if (detach) detach();
          return;
        }
        if (!popover.dataset.ready) {
          popover.dataset.ready = 'true';
          if (defaultShow && show === undefined) reveal(popover);
        }
        if (show === true) reveal(popover);
        if (show === false) conceal(popover);
        const reference = findReference();
        // Light dismiss closes the popover on pointerup, before the click, so read the
        // state on pointerdown. A keyboard click has no pointerdown.
        let wasOpen;
        const press = () => {
          wasOpen = popover.matches(':popover-open');
        };
        const toggle = (event) => {
          const open = wasOpen === undefined ? popover.matches(':popover-open') : wasOpen;
          wasOpen = undefined;
          if (open) {
            conceal(popover);
            return;
          }
          reveal(popover);
          if (event.detail === 0) {
            const first = popover.querySelector('a[href], button, input, textarea, select, [tabindex]');
            if (first) first.focus();
          }
        };
        const listeners = [[document, 'keydown', (event) => event.key === 'Escape' && conceal(popover)]];
        if (reference && show === undefined) {
          listeners.push([reference, 'pointerdown', press], [reference, 'click', toggle]);
        }
        listeners.forEach(([target, type, handler]) => target.addEventListener(type, handler));
        detach = () =>
          listeners.forEach(([target, type, handler]) => target.removeEventListener(type, handler));
      }}
      popover={show === undefined ? 'auto' : 'manual'}
      className={`tl-popover-menu tl-popover-menu--${placement} tl-popover-menu--fluid-width-${fluidWidth}`}
    >
      <div className="tl-popover-menu__list" role="menu">
        {children}
      </div>
    </div>
  );
}
