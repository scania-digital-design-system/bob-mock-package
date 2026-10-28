function Toggle({
  checked = false,
  required = false,
  size = 'lg',
  name,
  headline,
  disabled = false,
  toggleId,
  tdsAriaLabel,
  label,
  onTdsToggle,
}) {
  return (
    <div className={`tl-toggle tl-toggle--${size} tl-toggle--disabled-${disabled}`}>
      {headline && <div className="tl-toggle__headline">{headline}</div>}
      <label className="tl-toggle__field">
        <input
          className="tl-toggle__input"
          type="checkbox"
          role="switch"
          id={toggleId}
          name={name}
          defaultChecked={checked}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-label={tdsAriaLabel}
          onChange={(event) =>
            onTdsToggle &&
            onTdsToggle(
              new CustomEvent('tdsToggle', {
                detail: { toggleId, checked: event.target.checked },
              }),
            )
          }
        />
        {label && <span className="tl-toggle__label">{label}</span>}
      </label>
    </div>
  );
}
