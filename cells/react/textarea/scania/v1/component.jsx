import { useId, useState } from 'react';

function Textarea({
  label = '',
  name = '',
  helper,
  cols,
  rows,
  labelPosition = 'no-label',
  placeholder = '',
  value = '',
  disabled = false,
  readOnly = false,
  hideReadOnlyIcon = false,
  state = 'default',
  maxLength,
  hideMaxLength = false,
  autofocus = false,
  noMinWidth = false,
  tdsAriaLabel,
  onTdsChange,
  onTdsBlur,
  onTdsInput,
  onTdsFocus,
}) {
  const id = useId();
  const [length, setLength] = useState(value.length);
  return (
    <div
      className={`tl-textarea tl-textarea--label-${labelPosition} tl-textarea--${state} tl-textarea--disabled-${disabled} tl-textarea--read-only-${readOnly} tl-textarea--no-min-width-${noMinWidth}`}
    >
      {labelPosition !== 'no-label' && (
        <label htmlFor={`${id}-input`} className="tl-textarea__label">
          {label}
        </label>
      )}
      <div className="tl-textarea__wrapper">
        <textarea
          id={`${id}-input`}
          className="tl-textarea__input"
          disabled={disabled}
          readOnly={!disabled && readOnly}
          placeholder={placeholder || ' '}
          defaultValue={value}
          name={name}
          autoFocus={autofocus}
          maxLength={maxLength}
          cols={cols}
          rows={rows}
          aria-invalid={state === 'error' ? 'true' : 'false'}
          aria-readonly={readOnly ? 'true' : 'false'}
          aria-label={tdsAriaLabel || label}
          aria-describedby={`${id}-helper`}
          onFocus={(event) =>
            !readOnly &&
            onTdsFocus &&
            onTdsFocus(new CustomEvent('tdsFocus', { detail: event.nativeEvent }))
          }
          onBlur={(event) =>
            !readOnly &&
            onTdsBlur &&
            onTdsBlur(new CustomEvent('tdsBlur', { detail: event.nativeEvent }))
          }
          onInput={(event) => {
            setLength(event.target.value.length);
            if (onTdsInput) onTdsInput(new CustomEvent('tdsInput', { detail: event.nativeEvent }));
          }}
          onChange={(event) =>
            onTdsChange && onTdsChange(new CustomEvent('tdsChange', { detail: event.nativeEvent }))
          }
        />
        <span className="tl-textarea__resizer">
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.8536 0.853553C12.0488 0.658291 12.0488 0.341709 11.8536 0.146447C11.6583 -0.0488155 11.3417 -0.0488155 11.1464 0.146447L0.146447 11.1464C-0.0488155 11.3417 -0.0488155 11.6583 0.146447 11.8536C0.341709 12.0488 0.658291 12.0488 0.853553 11.8536L11.8536 0.853553ZM11.8536 4.64645C12.0488 4.84171 12.0488 5.15829 11.8536 5.35355L5.35355 11.8536C5.15829 12.0488 4.84171 12.0488 4.64645 11.8536C4.45118 11.6583 4.45118 11.3417 4.64645 11.1464L11.1464 4.64645C11.3417 4.45118 11.6583 4.45118 11.8536 4.64645ZM11.8536 8.64645C12.0488 8.84171 12.0488 9.15829 11.8536 9.35355L9.35355 11.8536C9.15829 12.0488 8.84171 12.0488 8.64645 11.8536C8.45118 11.6583 8.45118 11.3417 8.64645 11.1464L11.1464 8.64645C11.3417 8.45118 11.6583 8.45118 11.8536 8.64645Z"
              fill="currentColor"
            />
          </svg>
        </span>
        {!disabled && !hideReadOnlyIcon && readOnly && (
          <span className="tl-textarea__readonly-icon" title="This field is non-editable">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="m21.8 17.3 5.6-5.6c.8-.8.8-2 0-2.8l-4.2-4.2c-.8-.8-2-.8-2.8 0l-5.6 5.6 1.4 1.4 2.1-2.1 4.2 4.2-2.1 2.1 1.4 1.4zm0-11.3 4.2 4.2-2.1 2.1-4.2-4.2L21.8 6zm-9.9 9.9L8 19.7l-1.6 5.8 5.8-1.6 3.9-3.9 1.4 1.4-3.9 3.9c-.2.2-.6.4-.9.5L5.3 28c-.3.1-.7 0-1-.3-.3-.3-.4-.6-.3-1l2.1-7.5c.1-.3.3-.6.5-.9l3.9-3.9 1.4 1.5zM2.3 2.3c.4-.4 1-.4 1.4 0l26 26c.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0l-26-26c-.4-.4-.4-1 0-1.4z" />
            </svg>
          </span>
        )}
      </div>
      <span className="tl-textarea__helper" aria-live="assertive" id={`${id}-helper`}>
        {state === 'error' && helper && !readOnly && (
          <svg className="tl-textarea__helper-icon" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zM2 16C2 8.3 8.3 2 16 2s14 6.3 14 14-6.3 14-14 14S2 23.7 2 16zm12.8-1.5V10h2.4v4.5l-.4 4.3h-1.7l-.3-4.3zm0 5.6h2.5v2.4h-2.5v-2.4z" />
          </svg>
        )}
        {helper}
      </span>
      {!hideMaxLength && Number(maxLength) > 0 && (
        <div className="tl-textarea__counter">
          {length}
          <span className="tl-textarea__counter-divider"> / </span> {maxLength}
        </div>
      )}
    </div>
  );
}
