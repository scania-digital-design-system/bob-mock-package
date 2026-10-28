import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TextField, type TextFieldProps } from '../src';

// Expected behaviour is Tegel's tds-text-field at @scania/tegel@1.66.1
// (packages/core/src/components/text-field/text-field.tsx). The counter and the ids use
// useState and useId (relaxation react-hooks, docs/findings/README.md).

function renderField(props: TextFieldProps) {
  const { container } = render(<TextField label="Name" {...props} />);
  return {
    root: container.firstElementChild as HTMLElement,
    input: container.querySelector('input') as HTMLInputElement,
    find: (selector: string) => container.querySelector(selector),
  };
}

describe('TextField matches tds-text-field', () => {
  it.each<[string, TextFieldProps, string[]]>([
    [
      'lg, no-label and default by default',
      {},
      ['tl-text-field--lg', 'tl-text-field--label-no-label', 'tl-text-field--default'],
    ],
    ['sm', { size: 'sm' }, ['tl-text-field--sm']],
    ['an error', { state: 'error' }, ['tl-text-field--error']],
    ['read-only', { readOnly: true }, ['tl-text-field--read-only-true']],
  ])('is %s', (_name, props, wantClasses) => {
    expect(renderField(props).root).toHaveClass('tl-text-field', ...wantClasses);
  });

  it.each<[string, TextFieldProps, boolean, boolean]>([
    ['no visible label by default', {}, false, false],
    ['a label outside', { labelPosition: 'outside' }, true, false],
    ['a label inside', { labelPosition: 'inside' }, false, true],
    ['no inside label at sm', { labelPosition: 'inside', size: 'sm' }, false, false],
  ])('has %s', (_name, props, outside, inside) => {
    const { find } = renderField(props);
    expect(find('.tl-text-field__label-outside') !== null).toBe(outside);
    expect(find('.tl-text-field__label-inside') !== null).toBe(inside);
  });

  it('links the visible label and the helper by id', () => {
    const { input } = renderField({ labelPosition: 'outside', helper: 'Your full name' });
    expect(screen.getByText('Name')).toHaveAttribute('for', input.id);
    expect(screen.getByText('Your full name').id).toBe(input.getAttribute('aria-describedby'));
  });

  it('renders prefix and suffix, and hides the suffix when read-only', () => {
    const { find } = renderField({ prefix: '$', suffix: 'kg', readOnly: true });
    expect(find('.tl-text-field__prefix')).toHaveTextContent('$');
    expect(find('.tl-text-field__suffix')).toHaveTextContent('kg');
    expect(find('.tl-text-field__readonly-icon')).not.toBeNull();
  });

  it('counts characters as the user types', () => {
    const { input, find } = renderField({ maxLength: '20', value: 'Ann' });
    expect(find('.tl-text-field__counter')).toHaveTextContent('3 / 20');
    fireEvent.input(input, { target: { value: 'Annika' } });
    expect(find('.tl-text-field__counter')).toHaveTextContent('6 / 20');
  });

  it.each<[string, string, string, 'min' | 'max']>([
    ['below min', '-5', '0', 'min'],
    ['above max', '50', '10', 'max'],
  ])('clamps a number %s on blur and sends tdsError', (_name, typed, clamped, reason) => {
    const onTdsError = vi.fn();
    const { input } = renderField({ type: 'number', min: '0', max: '10', onTdsError });
    fireEvent.input(input, { target: { value: typed } });
    fireEvent.blur(input);
    expect(input.value).toBe(clamped);
    const event = onTdsError.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail).toEqual({
      originalValue: typed,
      clampedValue: clamped,
      reason,
    });
  });

  it('focuses the input when the container is clicked', () => {
    const { input, find } = renderField({});
    fireEvent.click(find('.tl-text-field__container') as HTMLElement);
    expect(input).toHaveFocus();
  });

  it('shows an error icon in the helper on error', () => {
    const { find } = renderField({ state: 'error', helper: 'Required' });
    expect(find('.tl-text-field__helper-icon')).not.toBeNull();
  });
});
