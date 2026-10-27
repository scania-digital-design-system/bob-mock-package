import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Spinner from '../cells/react/spinner/scania/v1/component.jsx';

// Expected behaviour is Tegel's tds-spinner at @scania/tegel@1.66.1
// (packages/core/src/components/spinner/spinner.tsx, render).

function renderSpinner(props: Record<string, unknown>) {
  render(<Spinner {...props} />);
  const status = screen.getByRole('status');
  return {
    status,
    svg: status.querySelector('svg'),
    circle: status.querySelector('circle'),
  };
}

describe('Spinner matches tds-spinner', () => {
  it('announces loading assertively', () => {
    const { status } = renderSpinner({});
    expect(status).toHaveAttribute('aria-live', 'assertive');
    expect(status).toHaveAttribute('aria-label', 'loading');
  });

  it('hides the drawing from assistive technology', () => {
    expect(renderSpinner({}).svg).toHaveAttribute('aria-hidden', 'true');
  });

  it.each([
    ['lg and standard by default', {}, 'tl-spinner__svg--lg', 'tl-spinner__circle--standard'],
    ['each size', { size: 'xs' }, 'tl-spinner__svg--xs', 'tl-spinner__circle--standard'],
    ['inverted', { variant: 'inverted' }, 'tl-spinner__svg--lg', 'tl-spinner__circle--inverted'],
  ])('is %s', (_name, props, svgClass, circleClass) => {
    const { svg, circle } = renderSpinner(props);
    expect(svg).toHaveClass('tl-spinner__svg', svgClass);
    expect(circle).toHaveClass('tl-spinner__circle', circleClass);
  });
});
