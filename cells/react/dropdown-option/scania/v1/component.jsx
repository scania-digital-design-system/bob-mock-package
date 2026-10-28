function DropdownOption({ value, disabled = false, tdsAriaLabel, children, onTdsSelect }) {
  const select = (selected) =>
    onTdsSelect &&
    onTdsSelect(
      new CustomEvent('tdsSelect', {
        detail: { selected, value: value === undefined ? '' : String(value) },
      }),
    );
  return (
    <div className={`tl-dropdown-option tl-dropdown-option--disabled-${disabled}`}>
      <button
        type="button"
        role="option"
        className="tl-dropdown-option__button"
        value={value}
        aria-disabled={disabled}
        aria-label={tdsAriaLabel}
        disabled={disabled}
        onClick={() => select(true)}
      >
        <span className="tl-dropdown-option__single">
          {children}
          <svg className="tl-dropdown-option__tick" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M27.7 8.5c.4.4.4 1 0 1.4L19 18.6l-1.2 1.2-4.8 4.8c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3l-7.4-7.4c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l6.6 6.7 4.1-4.1 1.2-1.2c2.4-2.4 5.2-5.1 8.6-8.7.6-.4 1.3-.4 1.6 0z" />
          </svg>
        </span>
      </button>
      <label className="tl-dropdown-option__multi">
        <input
          type="checkbox"
          className="tl-dropdown-option__checkbox"
          value={value}
          disabled={disabled}
          aria-label={tdsAriaLabel}
          onChange={(event) => select(event.target.checked)}
        />
        <span className="tl-dropdown-option__label">{children}</span>
      </label>
    </div>
  );
}
