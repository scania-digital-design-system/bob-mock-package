import { useId, useState } from 'react';

function TextField({
  type = 'text',
  labelPosition = 'no-label',
  label = '',
  min,
  max,
  step,
  helper,
  placeholder = '',
  value = '',
  disabled = false,
  readOnly = false,
  hideReadOnlyIcon = false,
  size = 'lg',
  noMinWidth = false,
  name = '',
  state = 'default',
  maxLength,
  hideMaxLength = false,
  autofocus = false,
  tdsAriaLabel,
  required = false,
  autocomplete = 'off',
  hideNumberArrows = false,
  prefix,
  suffix,
  onTdsChange,
  onTdsInput,
  onTdsFocus,
  onTdsBlur,
  onTdsError,
}) {
  const id = useId();
  const [length, setLength] = useState(value.length);
  const counter = !hideMaxLength && Number(maxLength) > 0;
  const blur = (event) => {
    const input = event.target;
    if (type === 'number') {
      const number = input.valueAsNumber;
      const low = min !== undefined ? Number(min) : undefined;
      const high = max !== undefined ? Number(max) : undefined;
      if (low !== undefined && high !== undefined && low > high) {
        console.warn('tds-text-field: min value is greater than max value');
        return;
      }
      if (!Number.isNaN(number)) {
        const originalValue = input.value;
        let clampedValue = originalValue;
        let reason = null;
        if (low !== undefined && number < low) {
          clampedValue = String(min);
          reason = 'min';
        }
        if (high !== undefined && number > high) {
          clampedValue = String(max);
          reason = 'max';
        }
        if (reason && clampedValue !== originalValue) {
          input.value = clampedValue;
          setLength(clampedValue.length);
          if (onTdsError) {
            onTdsError(
              new CustomEvent('tdsError', { detail: { originalValue, clampedValue, reason } }),
            );
          }
        }
      }
    }
    if (onTdsBlur) onTdsBlur(new CustomEvent('tdsBlur', { detail: event.nativeEvent }));
  };
  return (
    <div
      className={`tl-text-field tl-text-field--${size} tl-text-field--label-${labelPosition} tl-text-field--${state} tl-text-field--disabled-${disabled} tl-text-field--read-only-${readOnly} tl-text-field--no-min-width-${noMinWidth} tl-text-field--hide-number-arrows-${hideNumberArrows}`}
    >
      {labelPosition === 'outside' && (
        <div className="tl-text-field__label-outside">
          <label htmlFor={`${id}-input`}>{label}</label>
        </div>
      )}
      <div
        className="tl-text-field__container"
        onClick={(event) => event.currentTarget.querySelector('input').focus()}
      >
        {prefix && <div className="tl-text-field__prefix">{prefix}</div>}
        <div className="tl-text-field__input-container">
          <input
            id={`${id}-input`}
            className="tl-text-field__input"
            type={type}
            disabled={disabled}
            readOnly={!disabled && readOnly}
            placeholder={placeholder || ' '}
            defaultValue={value}
            autoFocus={autofocus}
            maxLength={maxLength}
            name={name}
            min={min}
            max={max}
            step={step}
            required={required}
            autoComplete={autocomplete}
            aria-invalid={state === 'error' ? 'true' : 'false'}
            aria-label={tdsAriaLabel || label}
            aria-describedby={`${id}-helper`}
            aria-readonly={readOnly}
            onInput={(event) => {
              setLength(event.target.value.length);
              if (onTdsInput) onTdsInput(new CustomEvent('tdsInput', { detail: event.nativeEvent }));
            }}
            onChange={(event) =>
              onTdsChange && onTdsChange(new CustomEvent('tdsChange', { detail: event.nativeEvent }))
            }
            onFocus={(event) =>
              !readOnly &&
              onTdsFocus &&
              onTdsFocus(new CustomEvent('tdsFocus', { detail: event.nativeEvent }))
            }
            onBlur={(event) => !readOnly && blur(event)}
          />
          {labelPosition === 'inside' && size !== 'sm' && (
            <label className="tl-text-field__label-inside" htmlFor={`${id}-input`}>
              {label}
            </label>
          )}
        </div>
        {suffix && <div className="tl-text-field__suffix">{suffix}</div>}
        {readOnly && !hideReadOnlyIcon && (
          <span className="tl-text-field__readonly-icon" title="This field is non-editable">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="m21.8 17.3 5.6-5.6c.8-.8.8-2 0-2.8l-4.2-4.2c-.8-.8-2-.8-2.8 0l-5.6 5.6 1.4 1.4 2.1-2.1 4.2 4.2-2.1 2.1 1.4 1.4zm0-11.3 4.2 4.2-2.1 2.1-4.2-4.2L21.8 6zm-9.9 9.9L8 19.7l-1.6 5.8 5.8-1.6 3.9-3.9 1.4 1.4-3.9 3.9c-.2.2-.6.4-.9.5L5.3 28c-.3.1-.7 0-1-.3-.3-.3-.4-.6-.3-1l2.1-7.5c.1-.3.3-.6.5-.9l3.9-3.9 1.4 1.5zM2.3 2.3c.4-.4 1-.4 1.4 0l26 26c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0l-26-26c-.4-.4-.4-1 0-1.4z" />
            </svg>
          </span>
        )}
      </div>
      <div aria-live="assertive">
        {(helper || counter) && (
          <div className="tl-text-field__helper" id={`${id}-helper`}>
            {state === 'error' && (
              <div className="tl-text-field__helper-error">
                {!readOnly && (
                  <svg className="tl-text-field__helper-icon" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zM2 16C2 8.3 8.3 2 16 2s14 6.3 14 14-6.3 14-14 14S2 23.7 2 16zm12.8-1.5V10h2.4v4.5l-.4 4.3h-1.7l-.3-4.3zm0 5.6h2.5v2.4h-2.5v-2.4z" />
                  </svg>
                )}
                {helper}
              </div>
            )}
            {state !== 'error' && helper}
            {!readOnly && counter && (
              <span className="tl-text-field__counter">
                {length} / {maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
