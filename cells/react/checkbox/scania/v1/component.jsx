function Checkbox({
  name,
  checkboxId,
  disabled = false,
  required = false,
  checked = false,
  indeterminate = false,
  value,
  tdsAriaLabel,
  tdsAriaDescribedby,
  label,
  onTdsChange,
  onTdsFocus,
  onTdsBlur,
}) {
  return (
    <label className="tl-checkbox">
      <input
        ref={(input) => {
          if (input) input.indeterminate = indeterminate;
        }}
        className="tl-checkbox__input"
        type="checkbox"
        id={checkboxId}
        name={name}
        value={value}
        defaultChecked={checked}
        required={required}
        disabled={disabled}
        aria-required={required}
        aria-label={tdsAriaLabel}
        aria-describedby={tdsAriaDescribedby}
        onChange={(event) =>
          onTdsChange &&
          onTdsChange(
            new CustomEvent('tdsChange', {
              detail: { checkboxId, checked: event.target.checked, indeterminate: false, value },
            }),
          )
        }
        onFocus={(event) =>
          onTdsFocus && onTdsFocus(new CustomEvent('tdsFocus', { detail: event.nativeEvent }))
        }
        onBlur={(event) =>
          onTdsBlur && onTdsBlur(new CustomEvent('tdsBlur', { detail: event.nativeEvent }))
        }
      />
      <span className="tl-checkbox__label">{label}</span>
    </label>
  );
}
