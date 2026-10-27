import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Badge from '../cells/react/badge/scania/v1/component.jsx';

// Expected behaviour is Tegel's tds-badge at @scania/tegel@1.66.1
// (packages/core/src/components/badge/badge.tsx, checkProps and render).

function renderBadge(props: Record<string, unknown>) {
  render(<Badge {...props} />);
  const badge = screen.getByRole('status');
  return { badge, text: badge.querySelector('.tl-badge__text') };
}

describe('Badge matches tds-badge', () => {
  it.each([
    ['a single digit shows the number', { value: '5' }, '5', false],
    ['two digits become a pill', { value: '42' }, '42', true],
    ['three digits show 99+', { value: '123' }, '99+', true],
    ['a leading zero keeps the pill but drops the zero', { value: '05' }, '5', true],
    ['a negative number is counted', { value: '-5' }, '-5', true],
    ['a non-numeric value shows no text', { value: 'new' }, '', false],
    ['no value is a dot', {}, '', false],
    ['sm never shows text', { value: '5', size: 'sm' }, '', false],
    ['sm never becomes a pill', { value: '42', size: 'sm' }, '', false],
  ])('%s', (_name, props, wantText, wantPill) => {
    const { badge, text } = renderBadge(props);
    expect(text).toHaveTextContent(wantText === '' ? /^$/ : wantText);
    expect(badge.classList.contains('tl-badge--pill')).toBe(wantPill);
  });

  it.each([
    ['lg by default', {}, 'tl-badge--lg'],
    ['sm when asked', { size: 'sm' }, 'tl-badge--sm'],
    ['visible by default', {}, 'tl-badge--hidden-false'],
    ['hidden when isHidden', { isHidden: true }, 'tl-badge--hidden-true'],
  ])('is %s', (_name, props, wantClass) => {
    expect(renderBadge(props).badge).toHaveClass('tl-badge', wantClass);
  });

  it.each([
    ['polite by default', {}, 'polite'],
    ['assertive when asked', { tdsAriaLive: 'assertive' }, 'assertive'],
    ['off when asked', { tdsAriaLive: 'off' }, 'off'],
  ])('announces %s', (_name, props, want) => {
    expect(renderBadge(props).badge).toHaveAttribute('aria-live', want);
  });

  it('hides the visual text from assistive technology', () => {
    expect(renderBadge({ value: '3' }).text).toHaveAttribute('aria-hidden', 'true');
  });
});
