import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Chip, type ChipProps } from '../src';

// Expected behaviour is Tegel's tds-chip at @scania/tegel@1.66.1
// (packages/core/src/components/chip/chip.tsx), with the prefix, label and suffix slots
// as props.

function renderChip(props: ChipProps) {
  const { container } = render(<Chip label="Filter" {...props} />);
  return {
    root: container.firstElementChild as HTMLElement,
    input: container.querySelector('input') as HTMLInputElement,
  };
}

describe('Chip matches tds-chip', () => {
  it.each<[string, ChipProps, string]>([
    ['a button by default', {}, 'button'],
    ['a radio', { type: 'radio' }, 'radio'],
    ['a checkbox', { type: 'checkbox' }, 'checkbox'],
  ])('is %s', (_name, props, type) => {
    const { input } = renderChip(props);
    expect(input).toHaveAttribute('type', type);
    expect(input).toHaveAttribute('role', type);
  });

  it.each<[string, ChipProps, string[]]>([
    ['lg and enabled by default', {}, ['tl-chip--lg', 'tl-chip--disabled-false']],
    ['sm', { size: 'sm' }, ['tl-chip--sm']],
    ['disabled', { disabled: true }, ['tl-chip--disabled-true']],
  ])('has classes for %s', (_name, props, wantClasses) => {
    expect(renderChip(props).root).toHaveClass('tl-chip', ...wantClasses);
  });

  it('renders prefix, label and suffix in order', () => {
    const { root } = renderChip({ prefix: 'P', suffix: 'S' });
    const parts = [...(root.querySelector('.tl-chip__pill')?.children ?? [])].map(
      (part) => part.className,
    );
    expect(parts).toEqual(['tl-chip__prefix', 'tl-chip__label', 'tl-chip__suffix']);
  });

  it('sends tdsClick from a button chip', () => {
    const onTdsClick = vi.fn();
    renderChip({ chipId: 'c1', onTdsClick });
    fireEvent.click(screen.getByText('Filter'));
    const event = onTdsClick.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe('tdsClick');
    expect(event.detail).toEqual({ chipId: 'c1' });
  });

  it('sends tdsChange from a checkbox chip', () => {
    const onTdsChange = vi.fn();
    const { input } = renderChip({ type: 'checkbox', chipId: 'c2', value: 'v', onTdsChange });
    fireEvent.click(input);
    const event = onTdsChange.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe('tdsChange');
    expect(event.detail).toEqual({ chipId: 'c2', checked: true, value: 'v' });
  });

  it('keeps one radio chip checked per name, natively', () => {
    render(
      <>
        <Chip type="radio" name="g" label="A" checked />
        <Chip type="radio" name="g" label="B" />
      </>,
    );
    const [a, b] = screen.getAllByRole('radio') as HTMLInputElement[];
    fireEvent.click(b as HTMLInputElement);
    expect(a?.checked).toBe(false);
    expect(b?.checked).toBe(true);
  });

  it('sends no tdsClick when disabled', () => {
    const onTdsClick = vi.fn();
    const { input } = renderChip({ disabled: true, onTdsClick });
    fireEvent.click(input);
    expect(onTdsClick).not.toHaveBeenCalled();
  });
});
