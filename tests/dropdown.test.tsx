import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown, DropdownOption, type DropdownProps } from '../src';

// Expected behaviour is Tegel's tds-dropdown and tds-dropdown-option at
// @scania/tegel@1.66.1 (packages/core/src/components/dropdown/). The dropdown keeps its
// open state, selection and filter text with useState (relaxation react-hooks); it marks
// the options in the DOM, as Tegel's setSelected does.

function firstDetail(handler: ReturnType<typeof vi.fn>) {
  const event = handler.mock.calls[0]?.[0] as CustomEvent | undefined;
  return event?.detail;
}

const onTdsSelect = vi.fn();

function renderDropdown(props: DropdownProps) {
  const result = render(
    <Dropdown placeholder="Choose" {...props}>
      <DropdownOption value="truck" onTdsSelect={onTdsSelect}>
        Truck
      </DropdownOption>
      <DropdownOption value="bus">Bus</DropdownOption>
      <DropdownOption value="engine">Éngine</DropdownOption>
      <DropdownOption value="boat" disabled>
        Boat
      </DropdownOption>
    </Dropdown>,
  );
  const root = result.container.firstElementChild as HTMLElement;
  return {
    ...result,
    root,
    trigger: root.querySelector('.tl-dropdown__trigger') as HTMLElement,
    list: screen.getByRole('listbox', { hidden: true }),
    option: (name: string) => screen.getByRole('option', { name, hidden: true }),
    checkbox: (name: string) => screen.getByRole('checkbox', { name, hidden: true }),
  };
}

describe('Dropdown matches tds-dropdown', () => {
  it.each<[string, DropdownProps, string[]]>([
    [
      'lg, auto, enabled, single and without filter by default',
      {},
      [
        'tl-dropdown--lg',
        'tl-dropdown--auto',
        'tl-dropdown--disabled-false',
        'tl-dropdown--error-false',
        'tl-dropdown--multiselect-false',
        'tl-dropdown--filter-false',
      ],
    ],
    [
      'xs and opening up',
      { size: 'xs', openDirection: 'up' },
      ['tl-dropdown--xs', 'tl-dropdown--up'],
    ],
    ['in the error state', { error: true }, ['tl-dropdown--error-true']],
  ])('is %s', (_name, props, want) => {
    expect(renderDropdown(props).root).toHaveClass('tl-dropdown', ...want);
  });

  it('opens and closes from the trigger', () => {
    const { trigger, list } = renderDropdown({});
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect((list as HTMLElement & { inert: boolean }).inert).toBe(true);
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect((list as HTMLElement & { inert: boolean }).inert).toBe(false);
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the placeholder until an option is selected', () => {
    const { trigger } = renderDropdown({});
    expect(trigger).toHaveTextContent('Choose');
  });

  it('selects the default value', () => {
    const { trigger, option } = renderDropdown({ defaultValue: 'bus' });
    expect(option('Bus')).toHaveAttribute('aria-selected', 'true');
    expect(option('Truck')).toHaveAttribute('aria-selected', 'false');
    expect(trigger).toHaveTextContent('Bus');
  });

  it('selects an option, closes and sends tdsChange and tdsSelect', () => {
    const onTdsChange = vi.fn();
    onTdsSelect.mockClear();
    const { trigger, option } = renderDropdown({ name: 'vehicle', onTdsChange });
    fireEvent.click(trigger);
    fireEvent.click(option('Truck'));
    expect(firstDetail(onTdsChange)).toEqual({ name: 'vehicle', value: 'truck' });
    expect(firstDetail(onTdsSelect)).toEqual({ selected: true, value: 'truck' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveTextContent('Truck');
    expect(option('Truck')).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps a set value until the value prop changes', () => {
    const onTdsChange = vi.fn();
    const { trigger, option } = renderDropdown({ value: 'bus', onTdsChange });
    fireEvent.click(trigger);
    fireEvent.click(option('Truck'));
    expect(firstDetail(onTdsChange)).toEqual({ name: undefined, value: 'truck' });
    expect(trigger).toHaveTextContent('Bus');
  });

  it('disables a disabled option', () => {
    expect(renderDropdown({}).option('Boat')).toBeDisabled();
  });

  it('selects several options with checkboxes in multiselect', () => {
    const onTdsChange = vi.fn();
    const { trigger, checkbox } = renderDropdown({ multiselect: true, onTdsChange });
    fireEvent.click(trigger);
    fireEvent.click(checkbox('Truck'));
    fireEvent.click(checkbox('Bus'));
    expect(onTdsChange.mock.calls.at(-1)?.[0].detail).toEqual({
      name: undefined,
      value: 'truck,bus',
    });
    expect(checkbox('Truck')).toBeChecked();
    expect(trigger).toHaveTextContent('Truck, Bus');
  });

  it('clears a multiselect selection and sends tdsClear', () => {
    const onTdsClear = vi.fn();
    const { trigger, checkbox } = renderDropdown({
      multiselect: true,
      defaultValue: 'truck,bus',
      onTdsClear,
    });
    fireEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(firstDetail(onTdsClear)).toEqual({ clearedValue: 'truck,bus' });
    expect(checkbox('Truck')).not.toBeChecked();
    expect(trigger).toHaveTextContent('Choose');
  });

  it('selects all enabled options and clears them with the selection actions', () => {
    const { checkbox } = renderDropdown({ multiselect: true, showSelectionActions: true });
    fireEvent.click(screen.getByRole('button', { name: 'Select all', hidden: true }));
    expect(checkbox('Truck')).toBeChecked();
    expect(checkbox('Éngine')).toBeChecked();
    expect(checkbox('Boat')).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Select all', hidden: true })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Clear all', hidden: true }));
    expect(checkbox('Truck')).not.toBeChecked();
  });

  it('filters the options, ignoring diacritics, and sends tdsInput', () => {
    const onTdsInput = vi.fn();
    const { trigger, option } = renderDropdown({ filter: true, onTdsInput });
    fireEvent.focus(trigger);
    fireEvent.change(trigger, { target: { value: 'eng' } });
    expect(option('Éngine').closest('.tl-dropdown-option')).not.toHaveAttribute('hidden');
    expect(option('Truck').closest('.tl-dropdown-option')).toHaveAttribute('hidden');
    expect(onTdsInput).toHaveBeenCalled();
  });

  it('shows the no-result text when nothing matches', () => {
    const { trigger } = renderDropdown({ filter: true });
    fireEvent.focus(trigger);
    fireEvent.change(trigger, { target: { value: 'plane' } });
    expect(screen.getByText('No result')).toBeInTheDocument();
  });

  it('puts the selection in a hidden input for forms', () => {
    const { root } = renderDropdown({
      name: 'vehicle',
      multiselect: true,
      defaultValue: 'bus,truck',
    });
    expect(root.querySelector('input[type="hidden"]')).toHaveAttribute('value', 'bus,truck');
  });

  it('closes on a press outside', () => {
    const { trigger } = renderDropdown({});
    fireEvent.click(trigger);
    fireEvent.mouseDown(document.body);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes on Escape and moves focus back to the trigger', () => {
    const { trigger, root } = renderDropdown({});
    fireEvent.click(trigger);
    fireEvent.keyDown(root, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('moves focus through the enabled options with the arrow keys', () => {
    const { trigger, root, option } = renderDropdown({});
    fireEvent.click(trigger);
    fireEvent.keyDown(root, { key: 'ArrowDown' });
    expect(option('Truck')).toHaveFocus();
    fireEvent.keyDown(root, { key: 'ArrowUp' });
    expect(option('Éngine')).toHaveFocus();
  });

  it('links the outside label and the helper', () => {
    const { trigger } = renderDropdown({
      label: 'Vehicle',
      labelPosition: 'outside',
      helper: 'Pick one',
    });
    expect(trigger).toHaveAccessibleName('Vehicle');
    expect(trigger).toHaveAccessibleDescription('Pick one');
  });

  it('sends tdsFocus and tdsBlur once for the whole dropdown', () => {
    const onTdsFocus = vi.fn();
    const onTdsBlur = vi.fn();
    const { trigger, option } = renderDropdown({ onTdsFocus, onTdsBlur });
    fireEvent.focus(trigger);
    fireEvent.blur(trigger, { relatedTarget: option('Truck') });
    fireEvent.blur(option('Truck'), { relatedTarget: document.body });
    expect(onTdsFocus).toHaveBeenCalledOnce();
    expect(onTdsBlur).toHaveBeenCalledOnce();
  });
});
