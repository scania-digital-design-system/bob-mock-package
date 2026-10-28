import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox, type CheckboxProps } from '../src';

// Expected behaviour is Tegel's tds-checkbox at @scania/tegel@1.66.1
// (packages/core/src/components/checkbox/checkbox.tsx), with the label slot as a prop.

function renderCheckbox(props: CheckboxProps) {
  render(<Checkbox label="Accept" {...props} />);
  return screen.getByRole('checkbox');
}

describe('Checkbox matches tds-checkbox', () => {
  it('is labelled by its label', () => {
    expect(renderCheckbox({})).toBe(screen.getByLabelText('Accept'));
  });

  it.each<[string, CheckboxProps, boolean, boolean, boolean]>([
    ['unchecked by default', {}, false, false, false],
    ['checked', { checked: true }, true, false, false],
    ['indeterminate', { indeterminate: true }, false, true, false],
    ['disabled', { disabled: true }, false, false, true],
  ])('is %s', (_name, props, checked, indeterminate, disabled) => {
    const input = renderCheckbox(props) as HTMLInputElement;
    expect(input.checked).toBe(checked);
    expect(input.indeterminate).toBe(indeterminate);
    expect(input.disabled).toBe(disabled);
  });

  it('passes the form attributes through', () => {
    const input = renderCheckbox({
      name: 'terms',
      value: 'yes',
      required: true,
      checkboxId: 'c1',
      tdsAriaDescribedby: 'hint',
    });
    expect(input).toHaveAttribute('name', 'terms');
    expect(input).toHaveAttribute('value', 'yes');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('id', 'c1');
    expect(input).toHaveAttribute('aria-describedby', 'hint');
  });

  it('sends tdsChange with the new state and clears indeterminate', () => {
    const onTdsChange = vi.fn();
    const input = renderCheckbox({
      checkboxId: 'c1',
      value: 'yes',
      indeterminate: true,
      onTdsChange,
    }) as HTMLInputElement;
    fireEvent.click(input);
    const event = onTdsChange.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe('tdsChange');
    expect(event.detail).toEqual({
      checkboxId: 'c1',
      checked: true,
      indeterminate: false,
      value: 'yes',
    });
    expect(input.indeterminate).toBe(false);
  });

  it.each([
    ['focus', 'onTdsFocus', 'tdsFocus'],
    ['blur', 'onTdsBlur', 'tdsBlur'],
  ] as const)('sends %s as a CustomEvent around the FocusEvent', (kind, prop, type) => {
    const handler = vi.fn();
    const input = renderCheckbox({ [prop]: handler });
    if (kind === 'focus') {
      fireEvent.focus(input);
    } else {
      fireEvent.blur(input);
    }
    const event = handler.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe(type);
    expect(event.detail).toBeInstanceOf(FocusEvent);
  });
});
