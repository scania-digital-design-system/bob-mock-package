function AccordionItem({
  header,
  expandIconPosition = 'end',
  disabled = false,
  expanded = false,
  paddingReset = false,
  ariaLevelValue = '6',
  children,
  onTdsToggle,
}) {
  const toggle = (event) => {
    const button = event.currentTarget;
    const open = button.getAttribute('aria-expanded') === 'true';
    const tdsToggle = new CustomEvent('tdsToggle', { cancelable: true, detail: { expanded: !open } });
    if (onTdsToggle) onTdsToggle(tdsToggle);
    if (!tdsToggle.defaultPrevented) button.setAttribute('aria-expanded', String(!open));
  };
  return (
    <div
      ref={(item) => {
        // Link the button and the panel once, with generated ids as Tegel does.
        const button = item && item.querySelector('.tl-accordion-item__header');
        const panel = item && item.querySelector('.tl-accordion-item__panel');
        if (!button || !panel || button.id) return;
        const id = `tl-accordion-item-${crypto.randomUUID()}`;
        button.id = `${id}-header`;
        panel.id = `${id}-panel`;
        button.setAttribute('aria-controls', panel.id);
        panel.setAttribute('aria-labelledby', button.id);
      }}
      className={`tl-accordion-item tl-accordion-item--${expandIconPosition} tl-accordion-item--disabled-${disabled} tl-accordion-item--padding-reset-${paddingReset}`}
    >
      <div role="heading" aria-level={ariaLevelValue}>
        <button
          type="button"
          className="tl-accordion-item__header"
          aria-expanded={expanded}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={toggle}
        >
          <div className="tl-accordion-item__title">{header}</div>
          <div className="tl-accordion-item__icon">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M4.273 9.783a1 1 0 0 1 1.415 0l9.888 9.888a.6.6 0 0 0 .848 0l9.888-9.888a1 1 0 1 1 1.415 1.414l-9.889 9.889a2.6 2.6 0 0 1-3.677 0l-9.888-9.889a1 1 0 0 1 0-1.414Z" />
            </svg>
          </div>
        </button>
      </div>
      <div role="region" aria-live="polite" className="tl-accordion-item__panel">
        {children}
      </div>
    </div>
  );
}
