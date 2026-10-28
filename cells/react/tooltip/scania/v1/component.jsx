function Tooltip({
  text = '',
  selector,
  referenceEl,
  defaultShow = false,
  mouseOverTooltip = false,
  trigger = 'hover',
  show,
  placement = 'bottom',
  tdsAriaDescribedby,
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
        const toggle = () => {
          const open = wasOpen === undefined ? popover.matches(':popover-open') : wasOpen;
          wasOpen = undefined;
          if (open) conceal(popover);
          else reveal(popover);
        };
        const open = () => reveal(popover);
        const close = () => conceal(popover);
        const listeners = [[document, 'keydown', (event) => event.key === 'Escape' && close()]];
        if (reference && trigger === 'click' && show === undefined) {
          listeners.push([reference, 'pointerdown', press], [reference, 'click', toggle]);
        }
        if (reference && trigger === 'hover') {
          listeners.push([reference, 'mouseenter', open], [reference, 'focusin', open]);
          listeners.push([reference, 'mouseleave', close], [reference, 'focusout', close]);
        }
        listeners.forEach(([target, type, handler]) => target.addEventListener(type, handler));
        detach = () =>
          listeners.forEach(([target, type, handler]) => target.removeEventListener(type, handler));
      }}
      popover={trigger === 'click' && show === undefined ? 'auto' : 'manual'}
      role="tooltip"
      aria-label={text || undefined}
      aria-describedby={tdsAriaDescribedby}
      className={`tl-tooltip tl-tooltip--${placement}`}
      onMouseEnter={
        trigger === 'hover' && mouseOverTooltip ? (event) => reveal(event.currentTarget) : undefined
      }
      onMouseLeave={
        trigger === 'hover' && mouseOverTooltip ? (event) => conceal(event.currentTarget) : undefined
      }
    >
      {text}
      {children}
    </div>
  );
}
