import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RadioButton } from '../src';

// Expected behaviour is Tegel's tds-radio-button at @scania/tegel@1.66.1
// (packages/core/src/components/radio-button/radio-button.tsx), with the label slot as
// a prop.

describe('RadioButton matches tds-radio-button', () => {
  it('is a labelled radio with its form attributes', () => {
    render(
      <RadioButton label="Truck" name="v" value="truck" radioId="r1" required tdsTabIndex="0" />,
    );
    const radio = screen.getByRole('radio', { name: 'Truck' });
    expect(radio).toHaveAttribute('name', 'v');
    expect(radio).toHaveAttribute('value', 'truck');
    expect(radio).toHaveAttribute('id', 'r1');
    expect(radio).toHaveAttribute('tabindex', '0');
    expect(radio).toBeRequired();
  });

  it('checks one radio in a group at a time, natively', () => {
    render(
      <>
        <RadioButton label="Truck" name="v" value="truck" checked />
        <RadioButton label="Bus" name="v" value="bus" />
      </>,
    );
    const truck = screen.getByRole('radio', { name: 'Truck' }) as HTMLInputElement;
    const bus = screen.getByRole('radio', { name: 'Bus' }) as HTMLInputElement;
    expect(truck.checked).toBe(true);
    fireEvent.click(bus);
    expect(bus.checked).toBe(true);
    expect(truck.checked).toBe(false);
  });

  it('sends tdsChange with the radio id and value', () => {
    const onTdsChange = vi.fn();
    render(<RadioButton label="Bus" radioId="r2" value="bus" onTdsChange={onTdsChange} />);
    fireEvent.click(screen.getByRole('radio'));
    const event = onTdsChange.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe('tdsChange');
    expect(event.detail).toEqual({ radioId: 'r2', value: 'bus' });
  });

  it('is disabled when asked', () => {
    render(<RadioButton label="Bus" disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });
});
