import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button, type ButtonProps } from '../src';

// Expected behaviour is Tegel's tds-button at @scania/tegel@1.66.1
// (packages/core/src/components/button/button.tsx, render).

function renderButton(props: ButtonProps) {
  render(<Button {...props} />);
  return screen.getByRole('button');
}

const icon = <svg data-testid="icon" />;

describe('Button matches tds-button', () => {
  it.each<[string, ButtonProps, string[]]>([
    ['primary lg by default', {}, ['tl-button--primary', 'tl-button--lg']],
    ['each variant', { variant: 'ghost' }, ['tl-button--ghost']],
    ['each size', { size: 'xs' }, ['tl-button--xs']],
    ['not fullbleed by default', {}, ['tl-button--fullbleed-false']],
    ['fullbleed when asked', { fullbleed: true }, ['tl-button--fullbleed-true']],
  ])('is %s', (_name, props, wantClasses) => {
    expect(renderButton({ text: 'Go', ...props })).toHaveClass('tl-button', ...wantClasses);
  });

  it.each<[string, ButtonProps, string]>([
    ['button by default', {}, 'button'],
    ['submit when asked', { type: 'submit' }, 'submit'],
    ['reset when asked', { type: 'reset' }, 'reset'],
  ])('has type %s', (_name, props, want) => {
    expect(renderButton(props)).toHaveAttribute('type', want);
  });

  it.each([
    ['name', { name: 'action' }, 'name', 'action'],
    ['value', { value: 'save' }, 'value', 'save'],
  ])('passes %s through', (_name, props, attribute, want) => {
    expect(renderButton(props)).toHaveAttribute(attribute, want);
  });

  it.each([
    ['no name', {}, 'name'],
    ['an empty name', { name: '' }, 'name'],
    ['an empty value', { value: '' }, 'value'],
  ])('omits the attribute for %s', (_name, props, attribute) => {
    expect(renderButton(props)).not.toHaveAttribute(attribute);
  });

  it.each([
    ['text only', { text: 'Go' }, 'Go', false],
    ['text and icon', { text: 'Go', icon }, 'Go', true],
    ['icon only', { icon }, '', true],
  ])('renders %s', (_name, props, wantLabel, wantIcon) => {
    const button = renderButton(props);
    const label = button.querySelector('.tl-button__label');
    expect(label?.textContent ?? '').toBe(wantLabel);
    expect(button.querySelector('.tl-button__icon') !== null).toBe(wantIcon);
  });

  it.each([
    ['icon only with a label', { icon, tdsAriaLabel: 'Send' }, 'Send'],
    ['text with a label', { text: 'Go', tdsAriaLabel: 'Send' }, null],
    ['icon only without a label', { icon }, null],
  ])('sets aria-label for %s', (_name, props, want) => {
    const button = renderButton(props);
    if (want === null) {
      expect(button).not.toHaveAttribute('aria-label');
    } else {
      expect(button).toHaveAttribute('aria-label', want);
    }
  });

  it.each([
    ['fires when enabled', false, 1],
    ['does not fire when disabled', true, 0],
  ])('click %s', (_name, disabled, wantCalls) => {
    const onClick = vi.fn();
    const button = renderButton({ text: 'Go', disabled, onClick });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(wantCalls);
    expect(button.hasAttribute('disabled')).toBe(disabled);
  });
});
