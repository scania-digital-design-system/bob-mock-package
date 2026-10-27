function Button({
  text,
  type = 'button',
  variant = 'primary',
  size = 'lg',
  disabled = false,
  fullbleed = false,
  tdsAriaLabel,
  name,
  value,
  icon,
  onClick,
}) {
  return (
    <button
      type={type}
      name={name || undefined}
      value={value || undefined}
      disabled={disabled}
      aria-label={!text && tdsAriaLabel ? tdsAriaLabel : undefined}
      onClick={onClick}
      className={`tl-button tl-button--${variant} tl-button--${size} tl-button--fullbleed-${fullbleed}`}
    >
      {text ? <span className="tl-button__label">{text}</span> : null}
      {icon ? <span className="tl-button__icon">{icon}</span> : null}
    </button>
  );
}
