function Chip({
  type = 'button',
  size = 'lg',
  chipId,
  checked = false,
  name,
  value,
  disabled = false,
  tdsAriaLabel,
  prefix,
  label,
  suffix,
  onTdsChange,
  onTdsClick,
}) {
  const selectable = type !== 'button';
  return (
    <label className={`tl-chip tl-chip--${size} tl-chip--disabled-${disabled}`}>
      <input
        className="tl-chip__input"
        type={type}
        role={type}
        id={chipId}
        aria-label={tdsAriaLabel}
        disabled={disabled}
        name={selectable ? name : undefined}
        value={selectable ? value : undefined}
        defaultChecked={selectable ? checked : undefined}
        onChange={(event) =>
          selectable &&
          onTdsChange &&
          onTdsChange(
            new CustomEvent('tdsChange', {
              detail: { chipId, checked: event.target.checked, value },
            }),
          )
        }
        onClick={() =>
          !selectable &&
          !disabled &&
          onTdsClick &&
          onTdsClick(new CustomEvent('tdsClick', { detail: { chipId } }))
        }
      />
      <span className="tl-chip__pill">
        {prefix && <span className="tl-chip__prefix">{prefix}</span>}
        {label && <span className="tl-chip__label">{label}</span>}
        {suffix && <span className="tl-chip__suffix">{suffix}</span>}
      </span>
    </label>
  );
}
