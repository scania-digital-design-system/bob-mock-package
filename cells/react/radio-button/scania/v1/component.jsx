function RadioButton({
  name,
  value,
  radioId,
  checked = false,
  required = false,
  disabled = false,
  tdsAriaLabel,
  tdsTabIndex,
  label,
  onTdsChange,
}) {
  return (
    <label className="tl-radio-button">
      <input
        className="tl-radio-button__input"
        type="radio"
        id={radioId}
        name={name}
        value={value}
        defaultChecked={checked}
        required={required}
        disabled={disabled}
        aria-label={tdsAriaLabel}
        tabIndex={tdsTabIndex}
        onChange={() =>
          onTdsChange && onTdsChange(new CustomEvent('tdsChange', { detail: { radioId, value } }))
        }
      />
      <span className="tl-radio-button__label">{label}</span>
    </label>
  );
}
