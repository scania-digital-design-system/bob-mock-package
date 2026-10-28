import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider, type DividerProps } from '../src';

// Expected behaviour is Tegel's tds-divider at @scania/tegel@1.66.1
// (packages/core/src/components/divider/divider.tsx, render).

function renderDivider(props: DividerProps) {
  render(<Divider {...props} />);
  return screen.getByRole('separator');
}

describe('Divider matches tds-divider', () => {
  it.each<[string, DividerProps, string[]]>([
    ['horizontal and subtle by default', {}, ['tl-divider--horizontal', 'tl-divider--subtle']],
    ['vertical', { orientation: 'vertical' }, ['tl-divider--vertical']],
    ['each variant', { variant: 'strong' }, ['tl-divider--strong']],
    ['the deprecated dark-blue', { variant: 'dark-blue' }, ['tl-divider--dark-blue']],
  ])('is %s', (_name, props, wantClasses) => {
    expect(renderDivider(props)).toHaveClass('tl-divider', ...wantClasses);
  });

  it.each<[string, DividerProps, string | null]>([
    ['omits aria-orientation when horizontal', {}, null],
    ['sets aria-orientation when vertical', { orientation: 'vertical' }, 'vertical'],
  ])('%s', (_name, props, want) => {
    expect(renderDivider(props).getAttribute('aria-orientation')).toBe(want);
  });
});
