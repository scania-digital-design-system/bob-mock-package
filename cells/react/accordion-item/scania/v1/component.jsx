import { useId, useState } from 'react';

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
  const id = useId();
  const [open, setOpen] = useState(expanded);
  const toggle = () => {
    const event = new CustomEvent('tdsToggle', { cancelable: true, detail: { expanded: !open } });
    if (onTdsToggle) onTdsToggle(event);
    if (!event.defaultPrevented) setOpen(!open);
  };
  return (
    <div
      className={`tl-accordion-item tl-accordion-item--${expandIconPosition} tl-accordion-item--disabled-${disabled} tl-accordion-item--padding-reset-${paddingReset}`}
    >
      <div role="heading" aria-level={ariaLevelValue}>
        <button
          id={`${id}-header`}
          type="button"
          className="tl-accordion-item__header"
          aria-controls={`${id}-panel`}
          aria-expanded={open}
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
      <div
        id={`${id}-panel`}
        role="region"
        aria-live="polite"
        aria-labelledby={`${id}-header`}
        className="tl-accordion-item__panel"
      >
        {children}
      </div>
    </div>
  );
}
