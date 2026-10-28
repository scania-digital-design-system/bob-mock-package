import { useId, useState } from 'react';

function Datetime({
  type = 'datetime-local',
  value = '',
  min,
  max,
  defaultValue = 'none',
  disabled = false,
  size = 'lg',
  noMinWidth = false,
  name,
  state: initialState = 'none',
  autofocus = false,
  label = '',
  labelPosition = 'no-label',
  helper = '',
  helperError,
  helperErrorInvalid = 'Invalid input',
  tdsAriaLabel,
  customValidator,
  onTdsChange,
  onTdsBlur,
  onTdsFocus,
  onTdsInput,
}) {
  const id = useId();
  const [state, setState] = useState(initialState);
  const [badInput, setBadInput] = useState(false);
  const start =
    defaultValue === 'none'
      ? value
      : {
          'datetime-local': `${defaultValue.slice(0, 10)}T${defaultValue.slice(11, 16)}`,
          date: defaultValue.slice(0, 10),
          month: defaultValue.slice(0, 7),
          week: `${defaultValue.slice(0, 4)}-W${defaultValue.slice(6, 8)}`,
          time: defaultValue.slice(0, 5),
        }[type];
  const validate = (input) => {
    const valid =
      !(min && input.validity.rangeUnderflow) &&
      !(max && input.validity.rangeOverflow) &&
      !input.validity.badInput &&
      !(customValidator && !customValidator(input.value));
    setBadInput(input.validity.badInput);
    if (!valid) setState('error');
    else setState(input.value ? 'success' : 'none');
  };
  return (
    <div
      className={`tl-datetime tl-datetime--${size} tl-datetime--${state} tl-datetime--label-${labelPosition} tl-datetime--disabled-${disabled} tl-datetime--no-min-width-${noMinWidth}`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && navigator.userAgent.toLowerCase().includes('chrome')) {
          event.target.showPicker();
        }
      }}
    >
      {labelPosition === 'outside' && label && (
        <label htmlFor={`${id}-input`} className="tl-datetime__label">
          {label}
        </label>
      )}
      <div
        className="tl-datetime__container"
        onClick={(event) => {
          event.currentTarget.querySelector('input').focus();
          if (onTdsFocus) onTdsFocus(new CustomEvent('tdsFocus', { detail: event.nativeEvent }));
        }}
      >
        <div className="tl-datetime__input-container">
          <input
            id={`${id}-input`}
            className="tl-datetime__input"
            type={type}
            disabled={disabled}
            defaultValue={start}
            min={min}
            max={max}
            autoFocus={autofocus}
            name={name}
            aria-label={tdsAriaLabel || label}
            aria-invalid={state === 'error'}
            onInput={(event) => {
              validate(event.target);
              if (onTdsInput) onTdsInput(new CustomEvent('tdsInput', { detail: event.nativeEvent }));
            }}
            onChange={(event) =>
              onTdsChange && onTdsChange(new CustomEvent('tdsChange', { detail: event.nativeEvent }))
            }
            onBlur={(event) => {
              validate(event.target);
              if (onTdsBlur) onTdsBlur(new CustomEvent('tdsBlur', { detail: event.nativeEvent }));
            }}
          />
          {labelPosition === 'inside' && size !== 'sm' && label && (
            <label className="tl-datetime__label-inside" htmlFor={`${id}-input`}>
              {label}
            </label>
          )}
          <div className="tl-datetime__icon">
            {type === 'time' ? (
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M17 7c0-.6-.4-1-1-1s-1 .4-1 1v8c0 1.1.9 2 2 2h6c.6 0 1-.4 1-1s-.4-1-1-1h-6V7zm-1-5C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zM4 16C4 9.4 9.4 4 16 4s12 5.4 12 12-5.4 12-12 12S4 22.6 4 16z" />
              </svg>
            ) : (
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M26 6h-2V3c0-.5-.5-1-1-1s-1 .5-1 1v3H10V3c0-.5-.5-1-1-1s-1 .4-1 1v3H6c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h20c2.2 0 4-1.8 4-4V10c0-2.2-1.8-4-4-4zM4 10c0-1.1.9-2 2-2h20c1.1 0 2 .9 2 2v2H4v-2zm24 16c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V14h24v12z" />
              </svg>
            )}
          </div>
        </div>
      </div>
      {state === 'error' && (
        <div className="tl-datetime__helper">
          <div className="tl-datetime__helper-text">
            <svg className="tl-datetime__helper-icon" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zM2 16C2 8.3 8.3 2 16 2s14 6.3 14 14-6.3 14-14 14S2 23.7 2 16zm12.8-1.5V10h2.4v4.5l-.4 4.3h-1.7l-.3-4.3zm0 5.6h2.5v2.4h-2.5v-2.4z" />
            </svg>{' '}
            {badInput ? helperErrorInvalid : helperError}
          </div>
        </div>
      )}
      {helper && state !== 'error' && (
        <div className="tl-datetime__helper">
          <div className="tl-datetime__helper-text">{helper}</div>
        </div>
      )}
    </div>
  );
}
