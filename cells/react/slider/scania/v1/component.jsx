function Slider({
  label = '',
  value = '0',
  min = '0',
  max = '100',
  ticks = '0',
  showTickNumbers = false,
  tooltip = false,
  disabled = false,
  readOnly = false,
  controls = false,
  input = false,
  step = '1',
  name = '',
  thumbSize = 'lg',
  snap = false,
  tdsAriaLabel = '',
  sliderId,
  tdsReadOnlyAriaLabel = '',
  onTdsChange,
  onTdsInput,
}) {
  const low = parseFloat(min);
  const high = parseFloat(max);
  const tickCount = parseInt(ticks, 10);
  const precision = (parseFloat(step).toString().split('.')[1] || '').length;
  const tickValues =
    tickCount > 0
      ? [
          low,
          ...Array.from({ length: tickCount }, (_, i) =>
            parseFloat((low + ((high - low) / (tickCount + 1)) * (i + 1)).toFixed(precision)),
          ),
          high,
        ]
      : [];
  if (low > high) {
    console.warn('min-prop must have a higher value than max-prop for the component to work correctly.');
  }
  const sync = (root, range) => {
    range.setAttribute('aria-valuetext', `${range.value} of ${max}`);
    const field = root.querySelector('.tl-slider__input-field');
    if (field) field.value = range.value;
    const output = root.querySelector('.tl-slider__value');
    if (output) output.value = range.value;
    root.querySelector('.tl-slider__fill').value = parseFloat(range.value) - low;
  };
  const change = (root, range) => {
    sync(root, range);
    if (onTdsChange) onTdsChange(new CustomEvent('tdsChange', { detail: { value: range.value } }));
  };
  const stepBy = (event, direction) => {
    if (readOnly || disabled) return;
    const root = event.currentTarget.closest('.tl-slider');
    const range = root.querySelector('.tl-slider__input');
    if (direction > 0) range.stepUp();
    else range.stepDown();
    change(root, range);
  };
  const commit = (field) => {
    const root = field.closest('.tl-slider');
    const range = root.querySelector('.tl-slider__input');
    const number = parseFloat(field.value);
    if (Number.isNaN(number) || number === parseFloat(range.value)) return;
    range.value = String(Math.min(Math.max(number, low), high));
    change(root, range);
  };
  return (
    <div
      className={`tl-slider tl-slider--${thumbSize} tl-slider--disabled-${disabled} tl-slider--read-only-${readOnly} tl-slider--show-tick-numbers-${showTickNumbers}`}
    >
      <div className="tl-slider__header">
        <label className="tl-slider__label" htmlFor={sliderId}>
          {label}
        </label>
        {tooltip && <output className="tl-slider__value">{value}</output>}
      </div>
      <div className="tl-slider__row">
        {input && !controls && <div className="tl-slider__input-value">{min}</div>}
        {controls && (
          <button
            type="button"
            className="tl-slider__control"
            aria-label="Decrease value"
            tabIndex={disabled || readOnly ? -1 : 0}
            disabled={disabled}
            onClick={(event) => stepBy(event, -1)}
          >
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M3.98 16a1 1 0 0 1 1-1h22.04a1 1 0 0 1 0 2H4.98a1 1 0 0 1-1-1Z" />
            </svg>
          </button>
        )}
        <div className="tl-slider__inner">
          <progress
            className="tl-slider__fill"
            max={high - low}
            value={parseFloat(value) - low}
            aria-hidden="true"
          />
          {tickValues.length > 0 && (
            <div className="tl-slider__dividers">
              {tickValues.map((tick) => (
                <div className="tl-slider__divider" key={tick}>
                  {showTickNumbers && <span className="tl-slider__tick">{tick}</span>}
                </div>
              ))}
            </div>
          )}
          <input
            className="tl-slider__input"
            type="range"
            id={sliderId}
            name={name}
            min={min}
            max={max}
            step={snap && tickCount > 0 ? (high - low) / (tickCount + 1) : step}
            defaultValue={value}
            disabled={disabled || low > high}
            aria-label={readOnly ? tdsReadOnlyAriaLabel : label || tdsAriaLabel}
            aria-readonly={readOnly}
            aria-valuetext={`${value} of ${max}`}
            onKeyDown={(event) => {
              if (readOnly && event.key !== 'Tab') event.preventDefault();
            }}
            onInput={(event) => {
              sync(event.currentTarget.closest('.tl-slider'), event.currentTarget);
              if (onTdsInput) {
                onTdsInput(new CustomEvent('tdsInput', { detail: { value: event.currentTarget.value } }));
              }
            }}
            onChange={(event) =>
              onTdsChange &&
              onTdsChange(new CustomEvent('tdsChange', { detail: { value: event.currentTarget.value } }))
            }
          />
        </div>
        {input && !controls && (
          <>
            <div className="tl-slider__input-value">{max}</div>
            <div className="tl-slider__field-wrapper">
              <input
                className="tl-slider__input-field"
                type="number"
                size={max.length}
                min={min}
                max={max}
                defaultValue={value}
                readOnly={readOnly}
                disabled={disabled}
                aria-label={readOnly ? tdsReadOnlyAriaLabel : label || tdsAriaLabel}
                onBlur={(event) => commit(event.currentTarget)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    commit(event.currentTarget);
                    event.currentTarget.blur();
                  }
                }}
              />
            </div>
          </>
        )}
        {controls && (
          <button
            type="button"
            className="tl-slider__control"
            aria-label="Increase value"
            tabIndex={disabled || readOnly ? -1 : 0}
            disabled={disabled}
            onClick={(event) => stepBy(event, 1)}
          >
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M17 4.98a1 1 0 1 0-2 0V15H4.98a1 1 0 0 0 0 2H15v10.02a1 1 0 0 0 2 0V17h10.02a1 1 0 1 0 0-2H17V4.98Z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
