import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Toggle, type ToggleProps } from '../src';

// Expected behaviour is Tegel's tds-toggle at @scania/tegel@1.66.1
// (packages/core/src/components/toggle/toggle.tsx), with the label slot as a prop.

function renderToggle(props: ToggleProps) {
  const { container } = render(<Toggle {...props} />);
  return { root: container.firstElementChild as HTMLElement, input: screen.getByRole('switch') };
}

describe('Toggle matches tds-toggle', () => {
  it.each<[string, ToggleProps, string[]]>([
    ['lg and enabled by default', {}, ['tl-toggle--lg', 'tl-toggle--disabled-false']],
    ['sm', { size: 'sm' }, ['tl-toggle--sm']],
    ['disabled', { disabled: true }, ['tl-toggle--disabled-true']],
  ])('is %s', (_name, props, wantClasses) => {
    expect(renderToggle(props).root).toHaveClass('tl-toggle', ...wantClasses);
  });

  it.each<[string, ToggleProps, boolean, boolean]>([
    ['the headline and the label', { headline: 'Alerts', label: 'Email' }, true, true],
    ['neither by default', {}, false, false],
  ])('renders %s', (_name, props, wantHeadline, wantLabel) => {
    const { root } = renderToggle(props);
    expect(root.querySelector('.tl-toggle__headline') !== null).toBe(wantHeadline);
    expect(root.querySelector('.tl-toggle__label') !== null).toBe(wantLabel);
  });

  it('is a switch named by its label', () => {
    renderToggle({ label: 'Email' });
    expect(screen.getByRole('switch', { name: 'Email' })).toBeInTheDocument();
  });

  it('sends tdsToggle with the new state', () => {
    const onTdsToggle = vi.fn();
    const { input } = renderToggle({ toggleId: 't1', onTdsToggle });
    fireEvent.click(input);
    const event = onTdsToggle.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe('tdsToggle');
    expect(event.detail).toEqual({ toggleId: 't1', checked: true });
  });

  it.each<[string, ToggleProps, boolean]>([
    ['off by default', {}, false],
    ['on when checked', { checked: true }, true],
  ])('is %s', (_name, props, want) => {
    expect((renderToggle(props).input as HTMLInputElement).checked).toBe(want);
  });
});
