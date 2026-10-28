import { useId, useState } from 'react';

function Dropdown({
  name,
  disabled = false,
  helper,
  label,
  labelPosition,
  openDirection = 'auto',
  placeholder = '',
  size = 'lg',
  error = false,
  multiselect = false,
  filter = false,
  normalizeText = true,
  noResultText = 'No result',
  defaultValue,
  value,
  tdsAriaLabel,
  showSelectionActions = false,
  selectAllText = 'Select all',
  selectFilteredText = 'Select filtered',
  clearAllText = 'Clear all',
  children,
  onTdsChange,
  onTdsFocus,
  onTdsBlur,
  onTdsInput,
  onTdsClear,
}) {
  const id = useId();
  const split = (raw) =>
    raw === undefined || raw === null || raw === ''
      ? []
      : multiselect
        ? String(raw).split(',').filter((part) => part !== '')
        : [String(raw)];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(split(defaultValue));
  const [display, setDisplay] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const current = value === undefined || value === null ? selected : split(value);
  const plain = (text) =>
    (normalizeText ? text.normalize('NFD').replace(/\p{Diacritic}/gu, '') : text).toLowerCase();
  const options = (list) =>
    Array.from(list.children).filter((option) => option.querySelector('[role="option"]'));
  const optionValue = (option) => option.querySelector('[role="option"]').value;
  const optionLabel = (option) => option.querySelector('[role="option"]').textContent.trim();
  const optionDisabled = (option) => option.querySelector('[role="option"]').disabled;
  const enabledValues = [children]
    .flat(Infinity)
    .filter((child) => child && child.props && child.props.value !== undefined)
    .filter((child) => !child.props.disabled)
    .map((child) => String(child.props.value));
  let detach;
  const commit = (next) => {
    if (value === undefined || value === null) setSelected(next);
    if (onTdsChange) {
      onTdsChange(
        new CustomEvent('tdsChange', {
          detail: { name, value: multiselect ? next.join(',') : next[0] || null },
        }),
      );
    }
  };
  const clear = (clearedValue) =>
    onTdsClear && onTdsClear(new CustomEvent('tdsClear', { detail: { clearedValue } }));
  const listOf = (element) => element.closest('.tl-dropdown').querySelector('.tl-dropdown__list');
  const runFilter = (list, text) => {
    const matches = options(list).filter((option) => plain(optionLabel(option)).includes(plain(text)));
    setResults(text === '' ? null : matches.length);
    return matches;
  };
  const toggle = () => {
    if (!disabled) setOpen(!open);
  };
  const move = (root, step) => {
    const controls = options(root.querySelector('.tl-dropdown__list'))
      .filter((option) => !option.hidden && !optionDisabled(option))
      .map((option) => option.querySelector(multiselect ? 'input' : '[role="option"]'));
    if (controls.length === 0) return;
    const index = controls.indexOf(document.activeElement);
    const next = index < 0 ? (step > 0 ? 0 : controls.length - 1) : index + step;
    controls[(next + controls.length) % controls.length].focus();
  };
  const placeholderText = labelPosition !== 'inside' || open ? placeholder : '';
  return (
    <div
      ref={(root) => {
        if (!root) {
          if (detach) detach();
          return;
        }
        const outside = (event) => {
          if (root.contains(event.target)) return;
          if (filter && query) clear(query);
          setOpen(false);
        };
        const form = root.closest('form');
        const reset = () => commit([]);
        document.addEventListener('mousedown', outside);
        if (form) form.addEventListener('reset', reset);
        detach = () => {
          document.removeEventListener('mousedown', outside);
          if (form) form.removeEventListener('reset', reset);
        };
      }}
      className={`tl-dropdown tl-dropdown--${size} tl-dropdown--${openDirection} tl-dropdown--disabled-${disabled} tl-dropdown--error-${error} tl-dropdown--multiselect-${multiselect} tl-dropdown--filter-${filter}`}
      onFocus={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        if (onTdsFocus) onTdsFocus(new CustomEvent('tdsFocus', { detail: event.nativeEvent }));
      }}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setQuery('');
        setResults(null);
        if (onTdsBlur) onTdsBlur(new CustomEvent('tdsBlur', { detail: event.nativeEvent }));
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          move(event.currentTarget, event.key === 'ArrowDown' ? 1 : -1);
        }
        if (event.key === 'Escape') {
          setOpen(false);
          event.currentTarget.querySelector('.tl-dropdown__trigger').focus();
        }
      }}
    >
      {label && labelPosition === 'outside' && (
        <div id={`${id}-label`} className="tl-dropdown__label-outside">
          {label}
        </div>
      )}
      <div className="tl-dropdown__select">
        {filter ? (
          <div className="tl-dropdown__filter">
            <div className="tl-dropdown__value-wrapper">
              {label && labelPosition === 'inside' && (
                <label id={`${id}-label`} htmlFor={`${id}-input`} className="tl-dropdown__label-inside">
                  {label}
                </label>
              )}
              <input
                id={`${id}-input`}
                className="tl-dropdown__trigger"
                type="text"
                role="combobox"
                aria-expanded={open}
                aria-controls={`${id}-list`}
                aria-label={tdsAriaLabel ?? (label ? undefined : 'Dropdown')}
                aria-labelledby={label ? `${id}-label` : undefined}
                aria-describedby={helper ? `${id}-helper` : undefined}
                aria-disabled={disabled}
                placeholder={placeholder || ' '}
                disabled={disabled}
                value={open ? query : display}
                onFocus={() => {
                  setOpen(true);
                  setQuery('');
                }}
                onChange={(event) => {
                  const text = event.target.value;
                  setOpen(true);
                  setQuery(text);
                  const matches = runFilter(listOf(event.target), text);
                  options(listOf(event.target)).forEach((option) => {
                    option.hidden = text !== '' && !matches.includes(option);
                  });
                  if (onTdsInput) onTdsInput(new CustomEvent('tdsInput', { detail: event.nativeEvent }));
                }}
              />
            </div>
            {(query || current.length > 0) && (
              <button
                type="button"
                className="tl-dropdown__clear"
                aria-label={query ? 'Clear filter' : 'Clear selection'}
                onClick={(event) => {
                  options(listOf(event.currentTarget)).forEach((option) => {
                    option.hidden = false;
                  });
                  setResults(null);
                  if (query && multiselect) {
                    setQuery('');
                    clear(query);
                  } else {
                    setQuery('');
                    if (current.length > 0) commit([]);
                    clear([query, current.join(',')].filter(Boolean).join(','));
                  }
                  event.currentTarget.parentElement.querySelector('input').focus();
                }}
              >
                <svg viewBox="0 0 33 32" aria-hidden="true">
                  <path d="M4.793 4.293a1 1 0 0 1 1.414 0L16.5 14.586 26.793 4.293a1 1 0 1 1 1.414 1.414L17.914 16l10.293 10.293a1 1 0 0 1-1.414 1.414L16.5 17.414 6.207 27.707a1 1 0 0 1-1.414-1.414L15.086 16 4.793 5.707a1 1 0 0 1 0-1.414Z" />
                </svg>
              </button>
            )}
            <button
              type="button"
              className="tl-dropdown__toggle"
              aria-label="Open/Close dropdown"
              tabIndex={-1}
              onClick={toggle}
            >
              <svg className="tl-dropdown__chevron" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M4.273 9.783a1 1 0 0 1 1.415 0l9.888 9.888a.6.6 0 0 0 .848 0l9.888-9.888a1 1 0 1 1 1.415 1.414l-9.889 9.889a2.6 2.6 0 0 1-3.677 0l-9.888-9.889a1 1 0 0 1 0-1.414Z" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="tl-dropdown__trigger"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-label={tdsAriaLabel}
            aria-labelledby={label ? `${id}-label` : undefined}
            aria-describedby={helper ? `${id}-helper` : undefined}
            aria-disabled={disabled}
            disabled={disabled}
            onClick={toggle}
          >
            <span className="tl-dropdown__value-wrapper">
              {label && labelPosition === 'inside' && (
                <span id={`${id}-label`} className="tl-dropdown__label-inside">
                  {label}
                </span>
              )}
              {current.length > 0 ? (
                <span className="tl-dropdown__value">{display}</span>
              ) : (
                <span className="tl-dropdown__placeholder">{placeholderText}</span>
              )}
            </span>
            {multiselect && current.length > 0 && (
              <span
                role="button"
                tabIndex={0}
                className="tl-dropdown__clear"
                aria-label="Clear selection"
                onClick={(event) => {
                  event.stopPropagation();
                  commit([]);
                  clear(current.join(','));
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.stopPropagation();
                    event.preventDefault();
                    commit([]);
                    clear(current.join(','));
                  }
                }}
              >
                <svg viewBox="0 0 33 32" aria-hidden="true">
                  <path d="M4.793 4.293a1 1 0 0 1 1.414 0L16.5 14.586 26.793 4.293a1 1 0 1 1 1.414 1.414L17.914 16l10.293 10.293a1 1 0 0 1-1.414 1.414L16.5 17.414 6.207 27.707a1 1 0 0 1-1.414-1.414L15.086 16 4.793 5.707a1 1 0 0 1 0-1.414Z" />
                </svg>
              </span>
            )}
            <svg className="tl-dropdown__chevron" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M4.273 9.783a1 1 0 0 1 1.415 0l9.888 9.888a.6.6 0 0 0 .848 0l9.888-9.888a1 1 0 1 1 1.415 1.414l-9.889 9.889a2.6 2.6 0 0 1-3.677 0l-9.888-9.889a1 1 0 0 1 0-1.414Z" />
            </svg>
          </button>
        )}
        <div
          ref={(list) => {
            if (!list) return;
            list.inert = !open;
            const labels = [];
            options(list).forEach((option) => {
              const isSelected = current.includes(optionValue(option));
              option.querySelector('[role="option"]').setAttribute('aria-selected', String(isSelected));
              option.querySelector('input').checked = isSelected;
              if (isSelected) labels.push(optionLabel(option));
            });
            if (labels.join(', ') !== display) setDisplay(labels.join(', '));
          }}
          id={`${id}-list`}
          className="tl-dropdown__list"
          role="listbox"
          aria-label={tdsAriaLabel}
          aria-orientation="vertical"
          aria-multiselectable={multiselect}
          onMouseDown={(event) => {
            if (filter) event.preventDefault();
          }}
          onClick={(event) => {
            const option = event.target.closest('[role="option"]');
            if (multiselect || !option || option.disabled) return;
            commit([option.value]);
            setOpen(false);
            setQuery('');
          }}
          onChange={(event) => {
            if (!multiselect || event.target.type !== 'checkbox') return;
            commit(
              event.target.checked
                ? [...current, event.target.value]
                : current.filter((selectedValue) => selectedValue !== event.target.value),
            );
            event.target.checked = !event.target.checked;
          }}
        >
          {children}
          {filter && results === 0 && noResultText !== '' && (
            <div className="tl-dropdown__no-result">{noResultText}</div>
          )}
          {multiselect && showSelectionActions && (
            <div className="tl-dropdown__actions">
              <button
                type="button"
                className="tl-dropdown__action"
                disabled={
                  !query && enabledValues.every((enabledValue) => current.includes(enabledValue))
                }
                onClick={(event) => {
                  const visible = options(listOf(event.currentTarget))
                    .filter((option) => !option.hidden && !optionDisabled(option))
                    .map(optionValue);
                  commit(Array.from(new Set([...visible, ...(query ? current : [])])));
                }}
              >
                {query ? selectFilteredText : selectAllText}
              </button>
              <button
                type="button"
                className="tl-dropdown__action"
                disabled={current.length === 0}
                onClick={() => commit([])}
              >
                {clearAllText}
              </button>
            </div>
          )}
        </div>
      </div>
      {name && <input type="hidden" name={name} value={current.join(',')} disabled={disabled} readOnly />}
      {helper && (
        <div id={`${id}-helper`} className="tl-dropdown__helper">
          {error && (
            <svg className="tl-dropdown__helper-icon" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4zM2 16C2 8.3 8.3 2 16 2s14 6.3 14 14-6.3 14-14 14S2 23.7 2 16zm12.8-1.5V10h2.4v4.5l-.4 4.3h-1.7l-.3-4.3zm0 5.6h2.5v2.4h-2.5v-2.4z" />
            </svg>
          )}
          {helper}
        </div>
      )}
    </div>
  );
}
