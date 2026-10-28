import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Textarea, type TextareaProps } from '../src';

// Expected behaviour is Tegel's tds-textarea at @scania/tegel@1.66.1
// (packages/core/src/components/textarea/textarea.tsx). The counter's live length and
// the ids use useState and useId (relaxation react-hooks, docs/findings/README.md).

function renderTextarea(props: TextareaProps) {
  const { container } = render(<Textarea label="Notes" {...props} />);
  return {
    root: container.firstElementChild as HTMLElement,
    field: screen.getByRole('textbox'),
    find: (selector: string) => container.querySelector(selector),
  };
}

describe('Textarea matches tds-textarea', () => {
  it.each<[string, TextareaProps, string[]]>([
    [
      'no-label, default and enabled by default',
      {},
      ['tl-textarea--label-no-label', 'tl-textarea--default', 'tl-textarea--disabled-false'],
    ],
    ['label inside', { labelPosition: 'inside' }, ['tl-textarea--label-inside']],
    ['an error', { state: 'error' }, ['tl-textarea--error']],
    ['read-only', { readOnly: true }, ['tl-textarea--read-only-true']],
  ])('is %s', (_name, props, wantClasses) => {
    expect(renderTextarea(props).root).toHaveClass('tl-textarea', ...wantClasses);
  });

  it.each<[string, TextareaProps, boolean]>([
    ['no visible label by default', {}, false],
    ['a visible label outside', { labelPosition: 'outside' }, true],
  ])('has %s', (_name, props, want) => {
    expect(renderTextarea(props).find('.tl-textarea__label') !== null).toBe(want);
  });

  it('links the visible label and the helper by id', () => {
    const { field } = renderTextarea({ labelPosition: 'outside', helper: 'Max 200' });
    expect(screen.getByText('Notes')).toHaveAttribute('for', field.id);
    expect(screen.getByText('Max 200').id).toBe(field.getAttribute('aria-describedby'));
  });

  it.each<[string, TextareaProps, string, string]>([
    ['valid and editable by default', {}, 'false', 'false'],
    ['invalid in the error state', { state: 'error' }, 'true', 'false'],
    ['read-only', { readOnly: true }, 'false', 'true'],
  ])('is %s', (_name, props, invalid, readonly) => {
    const { field } = renderTextarea(props);
    expect(field).toHaveAttribute('aria-invalid', invalid);
    expect(field).toHaveAttribute('aria-readonly', readonly);
  });

  it('counts characters as the user types', () => {
    const { field, find } = renderTextarea({ maxLength: '10', value: 'ab' });
    expect(find('.tl-textarea__counter')).toHaveTextContent('2 / 10');
    fireEvent.input(field, { target: { value: 'abcd' } });
    expect(find('.tl-textarea__counter')).toHaveTextContent('4 / 10');
  });

  it.each<[string, TextareaProps]>([
    ['without maxLength', {}],
    ['with hideMaxLength', { maxLength: '10', hideMaxLength: true }],
  ])('has no counter %s', (_name, props) => {
    expect(renderTextarea(props).find('.tl-textarea__counter')).toBeNull();
  });

  it.each<[string, TextareaProps, boolean]>([
    ['an error icon with an error helper', { state: 'error', helper: 'Required' }, true],
    ['no icon on a read-only error', { state: 'error', helper: 'Required', readOnly: true }, false],
  ])('shows %s', (_name, props, want) => {
    expect(renderTextarea(props).find('.tl-textarea__helper-icon') !== null).toBe(want);
  });

  it.each<[string, TextareaProps, boolean]>([
    ['a read-only icon', { readOnly: true }, true],
    ['no read-only icon when hidden', { readOnly: true, hideReadOnlyIcon: true }, false],
    ['no read-only icon when disabled', { readOnly: true, disabled: true }, false],
  ])('shows %s', (_name, props, want) => {
    expect(renderTextarea(props).find('.tl-textarea__readonly-icon') !== null).toBe(want);
  });

  it('sends tdsInput around the native event', () => {
    const onTdsInput = vi.fn();
    const { field } = renderTextarea({ onTdsInput });
    fireEvent.input(field, { target: { value: 'x' } });
    const event = onTdsInput.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe('tdsInput');
  });

  it('sends no focus event when read-only', () => {
    const onTdsFocus = vi.fn();
    const { field } = renderTextarea({ readOnly: true, onTdsFocus });
    fireEvent.focus(field);
    expect(onTdsFocus).not.toHaveBeenCalled();
  });
});
