import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Datetime, type DatetimeProps } from '../src';

// Expected behaviour is Tegel's tds-datetime at @scania/tegel@1.66.1
// (packages/core/src/components/datetime/). The validation state uses useState
// (relaxation react-hooks, docs/findings/README.md).

function renderDatetime(props: DatetimeProps) {
  const { container } = render(<Datetime label="Date" {...props} />);
  return {
    root: container.firstElementChild as HTMLElement,
    input: container.querySelector('input') as HTMLInputElement,
    container,
  };
}

describe('Datetime matches tds-datetime', () => {
  it.each<[string, DatetimeProps, string[]]>([
    [
      'lg, no state, no label and enabled by default',
      {},
      [
        'tl-datetime--lg',
        'tl-datetime--none',
        'tl-datetime--label-no-label',
        'tl-datetime--disabled-false',
        'tl-datetime--no-min-width-false',
      ],
    ],
    ['sm', { size: 'sm' }, ['tl-datetime--sm']],
    ['in the error state', { state: 'error' }, ['tl-datetime--error']],
    ['disabled', { disabled: true }, ['tl-datetime--disabled-true']],
    ['without a minimum width', { noMinWidth: true }, ['tl-datetime--no-min-width-true']],
  ])('is %s', (_name, props, want) => {
    expect(renderDatetime(props).root).toHaveClass('tl-datetime', ...want);
  });

  it.each<[DatetimeProps['type'], string]>([
    ['datetime-local', 'M26 6h-2V3'],
    ['date', 'M26 6h-2V3'],
    ['time', 'M17 7c0-.6'],
  ])('renders a %s input with its icon', (type, path) => {
    const { input, container } = renderDatetime({ type });
    expect(input).toHaveAttribute('type', type);
    expect(container.querySelector('.tl-datetime__icon path')?.getAttribute('d')).toMatch(
      new RegExp(`^${path.replace(/[.-]/g, '\\$&')}`),
    );
  });

  it.each<[DatetimeProps['type'], string, string]>([
    ['datetime-local', '2023-01-31T10:30', '2023-01-31T10:30'],
    ['date', '2023-01-31T10:30', '2023-01-31'],
    ['month', '2023-01-31', '2023-01'],
    ['time', '15:00', '15:00'],
  ])('formats the default value for %s', (type, defaultValue, want) => {
    expect(renderDatetime({ type, defaultValue }).input.value).toBe(want);
  });

  it('formats the default value for week', () => {
    const { input } = renderDatetime({ type: 'week', defaultValue: '2023-W02' });
    expect(input.getAttribute('value')).toBe('2023-W02');
  });

  it('links the outside label to the input', () => {
    const { input } = renderDatetime({ labelPosition: 'outside' });
    expect(screen.getByText('Date')).toHaveAttribute('for', input.id);
  });

  it.each<[string, DatetimeProps, boolean]>([
    ['inside, lg', { labelPosition: 'inside' }, true],
    ['inside, sm', { labelPosition: 'inside', size: 'sm' }, false],
    ['no label', {}, false],
  ])('shows the inside label: %s', (_name, props, want) => {
    const { container } = renderDatetime(props);
    expect(container.querySelector('.tl-datetime__label-inside') !== null).toBe(want);
  });

  it.each<[string, DatetimeProps, string]>([
    ['the label', {}, 'Date'],
    ['tdsAriaLabel first', { tdsAriaLabel: 'Pick a date' }, 'Pick a date'],
  ])('takes its aria-label from %s', (_name, props, want) => {
    expect(renderDatetime(props).input).toHaveAttribute('aria-label', want);
  });

  it.each<[string, boolean, string, string]>([
    ['error', false, '2023-01-31', 'tl-datetime--error'],
    ['success', true, '2023-01-31', 'tl-datetime--success'],
    ['none for an empty value', true, '', 'tl-datetime--none'],
  ])('validates on blur to %s', (_name, valid, value, want) => {
    const { root, input } = renderDatetime({ type: 'date', customValidator: () => valid });
    fireEvent.change(input, { target: { value } });
    fireEvent.blur(input);
    expect(root).toHaveClass(want);
  });

  it('shows the error helper in the error state and the helper otherwise', () => {
    const { input } = renderDatetime({
      type: 'date',
      helper: 'Pick a weekday',
      helperError: 'Not a weekday',
      customValidator: (value) => value !== '2023-01-01',
    });
    expect(screen.getByText('Pick a weekday')).toBeInTheDocument();
    fireEvent.input(input, { target: { value: '2023-01-01' } });
    expect(screen.getByText('Not a weekday')).toBeInTheDocument();
    expect(screen.queryByText('Pick a weekday')).toBeNull();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('sends tdsInput, tdsChange, tdsBlur and tdsFocus', () => {
    const handlers = {
      onTdsInput: vi.fn(),
      onTdsChange: vi.fn(),
      onTdsBlur: vi.fn(),
      onTdsFocus: vi.fn(),
    };
    const { input, container } = renderDatetime({ type: 'date', ...handlers });
    fireEvent.click(container.querySelector('.tl-datetime__container') as HTMLElement);
    expect(input).toHaveFocus();
    fireEvent.input(input, { target: { value: '2023-01-02' } });
    fireEvent.blur(input);
    for (const [name, handler] of Object.entries(handlers)) {
      const event = handler.mock.calls[0]?.[0] as CustomEvent;
      expect(event.type).toBe(name.replace(/^on(\w)/, (_m, c: string) => c.toLowerCase()));
    }
  });

  it('disables the input', () => {
    expect(renderDatetime({ disabled: true }).input).toBeDisabled();
  });
});
