function Badge({ value = '', size = 'lg', isHidden = false, tdsAriaLive = 'polite' }) {
  const number = parseInt(value);
  const counted = !Number.isNaN(number) && size !== 'sm';
  const text = counted ? (String(number).length >= 3 ? '99+' : String(number)) : '';
  const content = (
    <div className="tl-badge__text" aria-hidden="true">
      {text}
    </div>
  );
  if (counted && value.length >= 2) {
    return (
      <div
        role="status"
        aria-live={tdsAriaLive}
        className={`tl-badge tl-badge--pill tl-badge--${size} tl-badge--hidden-${isHidden}`}
      >
        {content}
      </div>
    );
  }
  return (
    <div
      role="status"
      aria-live={tdsAriaLive}
      className={`tl-badge tl-badge--${size} tl-badge--hidden-${isHidden}`}
    >
      {content}
    </div>
  );
}
