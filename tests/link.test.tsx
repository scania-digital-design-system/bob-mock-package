import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Link, type LinkProps } from '../src';

// Expected behaviour is Tegel's tds-link at @scania/tegel@1.66.1
// (packages/core/src/components/link/link.tsx), with the slotted <a> rendered by the cell.

function renderLink(props: LinkProps) {
  render(<Link href="/next" {...props} />);
  return screen.getByText('Next page');
}

describe('Link matches tds-link', () => {
  it('renders one anchor with the href and content', () => {
    const link = renderLink({ children: 'Next page' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/next');
  });

  it('passes target through', () => {
    expect(renderLink({ children: 'Next page', target: '_blank' })).toHaveAttribute(
      'target',
      '_blank',
    );
  });

  it.each([
    [
      'underlined and inline by default',
      {},
      ['tl-link--underline-true', 'tl-link--standalone-false'],
    ],
    ['without underline', { underline: false }, ['tl-link--underline-false']],
    ['standalone', { standalone: true }, ['tl-link--standalone-true']],
  ])('is %s', (_name, props, wantClasses) => {
    expect(renderLink({ children: 'Next page', ...props })).toHaveClass('tl-link', ...wantClasses);
  });

  it.each([
    ['enabled', false, null, null],
    ['disabled', true, 'true', '-1'],
  ])('sets focus and state attributes when %s', (_name, disabled, ariaDisabled, tabIndex) => {
    const link = renderLink({ children: 'Next page', disabled });
    expect(link.getAttribute('aria-disabled')).toBe(ariaDisabled);
    expect(link.getAttribute('tabindex')).toBe(tabIndex);
  });
});
