import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Slider, type SliderProps } from '../src';

// Expected behaviour is Tegel's tds-slider at @scania/tegel@1.66.1
// (packages/core/src/components/slider/). The cell is a native range input; the
// tooltip, the number field and aria-valuetext follow it through the DOM.

// The detail of the first event a handler received.
function firstDetail(handler: ReturnType<typeof vi.fn>) {
  const event = handler.mock.calls[0]?.[0] as CustomEvent | undefined;
  return event?.detail;
}

function renderSlider(props: SliderProps) {
  const { container } = render(<Slider label="Volume" value="40" {...props} />);
  return {
    root: container.firstElementChild as HTMLElement,
    range: container.querySelector('input[type="range"]') as HTMLInputElement,
    container,
  };
}

describe('Slider matches tds-slider', () => {
  it.each<[string, SliderProps, string[]]>([
    [
      'lg, enabled, editable and without tick numbers by default',
      {},
      [
        'tl-slider--lg',
        'tl-slider--disabled-false',
        'tl-slider--read-only-false',
        'tl-slider--show-tick-numbers-false',
      ],
    ],
    ['sm', { thumbSize: 'sm' }, ['tl-slider--sm']],
    ['disabled', { disabled: true }, ['tl-slider--disabled-true']],
    ['read-only', { readOnly: true }, ['tl-slider--read-only-true']],
  ])('is %s', (_name, props, want) => {
    expect(renderSlider(props).root).toHaveClass('tl-slider', ...want);
  });

  it('passes min, max, step, value and name to the range', () => {
    const { range } = renderSlider({ min: '10', max: '50', step: '5', name: 'volume' });
    expect(range).toHaveAttribute('min', '10');
    expect(range).toHaveAttribute('max', '50');
    expect(range).toHaveAttribute('step', '5');
    expect(range).toHaveAttribute('name', 'volume');
    expect(range.value).toBe('40');
    expect(range).toHaveAttribute('aria-valuetext', '40 of 50');
  });

  it.each<[string, SliderProps, string]>([
    ['the label', {}, 'Volume'],
    ['tdsAriaLabel without a label', { label: '', tdsAriaLabel: 'Level' }, 'Level'],
    [
      'the read-only label when read-only',
      { readOnly: true, tdsReadOnlyAriaLabel: 'Fixed' },
      'Fixed',
    ],
  ])('takes its aria-label from %s', (_name, props, want) => {
    expect(renderSlider(props).range).toHaveAttribute('aria-label', want);
  });

  it('places min, max and the ticks between them', () => {
    const { container } = renderSlider({ ticks: '3', showTickNumbers: true });
    const ticks = [...container.querySelectorAll('.tl-slider__tick')].map((t) => t.textContent);
    expect(ticks).toEqual(['0', '25', '50', '75', '100']);
  });

  it('snaps to the ticks when asked', () => {
    expect(renderSlider({ ticks: '3', snap: true }).range).toHaveAttribute('step', '25');
  });

  it('sends tdsInput while moving and updates the tooltip and aria-valuetext', () => {
    const onTdsInput = vi.fn();
    const { range, container } = renderSlider({ tooltip: true, onTdsInput });
    fireEvent.input(range, { target: { value: '60' } });
    expect(container.querySelector('output')).toHaveTextContent('60');
    expect(range).toHaveAttribute('aria-valuetext', '60 of 100');
    expect(firstDetail(onTdsInput)).toEqual({ value: '60' });
  });

  it('draws the fill from min to the value and moves it with the range', () => {
    const { range, container } = renderSlider({ min: '20', max: '60' });
    const fill = container.querySelector('progress') as HTMLProgressElement;
    expect(fill).toHaveAttribute('aria-hidden', 'true');
    expect(fill.max).toBe(40);
    expect(fill.value).toBe(20);
    fireEvent.input(range, { target: { value: '50' } });
    expect(fill.value).toBe(30);
  });

  it('sends tdsChange when the value is committed', () => {
    const onTdsChange = vi.fn();
    const { range } = renderSlider({ onTdsChange });
    fireEvent.change(range, { target: { value: '70' } });
    expect(firstDetail(onTdsChange)).toEqual({ value: '70' });
  });

  it.each<[string, string]>([
    ['Increase value', '41'],
    ['Decrease value', '39'],
  ])('steps with the %s control', (name, want) => {
    const onTdsChange = vi.fn();
    const { range } = renderSlider({ controls: true, onTdsChange });
    fireEvent.click(screen.getByRole('button', { name }));
    expect(range.value).toBe(want);
    expect(firstDetail(onTdsChange)).toEqual({ value: want });
  });

  it('disables the controls when disabled', () => {
    renderSlider({ controls: true, disabled: true });
    expect(screen.getByRole('button', { name: 'Increase value' })).toBeDisabled();
  });

  it('shows min and max and a number field that follows the range', () => {
    const { range, container } = renderSlider({ input: true });
    const values = [...container.querySelectorAll('.tl-slider__input-value')];
    expect(values.map((v) => v.textContent)).toEqual(['0', '100']);
    const field = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(field.value).toBe('40');
    fireEvent.input(range, { target: { value: '55' } });
    expect(field.value).toBe('55');
  });

  it('moves the range to a clamped value from the number field on Enter', () => {
    const onTdsChange = vi.fn();
    const { range } = renderSlider({ input: true, onTdsChange });
    const field = screen.getByRole('spinbutton') as HTMLInputElement;
    fireEvent.change(field, { target: { value: '150' } });
    fireEvent.keyDown(field, { key: 'Enter' });
    expect(range.value).toBe('100');
    expect(firstDetail(onTdsChange)).toEqual({ value: '100' });
  });

  it('ignores keys when read-only', () => {
    const { range } = renderSlider({ readOnly: true });
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });
    range.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('warns and disables the range when min is greater than max', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(renderSlider({ min: '100', max: '0' }).range).toBeDisabled();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
