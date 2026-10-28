import { fireEvent, render } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { Tooltip, type TooltipProps } from '../src';

// Expected behaviour is Tegel's tds-tooltip at @scania/tegel@1.66.1
// (packages/core/src/components/tooltip/). The cell is a native popover. jsdom has no
// popover API and never matches :popover-open, so both are stubbed here.

const shown = new WeakSet<Element>();

beforeAll(() => {
  HTMLElement.prototype.showPopover = function showPopover(this: HTMLElement) {
    shown.add(this);
  };
  HTMLElement.prototype.hidePopover = function hidePopover(this: HTMLElement) {
    shown.delete(this);
  };
  const matches = Element.prototype.matches;
  Element.prototype.matches = function match(this: Element, selector: string) {
    return selector === ':popover-open' ? shown.has(this) : matches.call(this, selector);
  } as typeof matches;
});

let reference: HTMLButtonElement;

afterEach(() => reference?.remove());

function renderTooltip(props: TooltipProps) {
  reference = document.body.appendChild(
    Object.assign(document.createElement('button'), { id: 'reference' }),
  );
  const { container } = render(<Tooltip selector="#reference" text="Help text" {...props} />);
  return container.firstElementChild as HTMLElement;
}

describe('Tooltip matches tds-tooltip', () => {
  it.each<[string, TooltipProps, string, string]>([
    ['below, on hover, by default', {}, 'tl-tooltip--bottom', 'manual'],
    ['left-start', { placement: 'left-start' }, 'tl-tooltip--left-start', 'manual'],
    ['light-dismissed on click', { trigger: 'click' }, 'tl-tooltip--bottom', 'auto'],
  ])('is %s', (_name, props, className, popover) => {
    const tooltip = renderTooltip(props);
    expect(tooltip).toHaveClass('tl-tooltip', className);
    expect(tooltip).toHaveAttribute('popover', popover);
  });

  it('shows the text, labels itself with it and takes aria-describedby', () => {
    const tooltip = renderTooltip({ tdsAriaDescribedby: 'help' });
    expect(tooltip).toHaveAttribute('role', 'tooltip');
    expect(tooltip).toHaveTextContent('Help text');
    expect(tooltip).toHaveAttribute('aria-label', 'Help text');
    expect(tooltip).toHaveAttribute('aria-describedby', 'help');
  });

  it.each<[string, (element: HTMLElement) => void, (element: HTMLElement) => void]>([
    ['the mouse', fireEvent.mouseEnter, fireEvent.mouseLeave],
    ['focus', fireEvent.focusIn, fireEvent.focusOut],
  ])('opens on hover with %s and closes when it leaves', (_name, enter, leave) => {
    const tooltip = renderTooltip({});
    enter(reference);
    expect(shown.has(tooltip)).toBe(true);
    leave(reference);
    expect(shown.has(tooltip)).toBe(false);
  });

  it('opens and closes on a click with the click trigger', () => {
    const tooltip = renderTooltip({ trigger: 'click' });
    fireEvent.mouseEnter(reference);
    expect(shown.has(tooltip)).toBe(false);
    fireEvent.click(reference);
    expect(shown.has(tooltip)).toBe(true);
    fireEvent.click(reference);
    expect(shown.has(tooltip)).toBe(false);
  });

  it('stays closed when light dismiss closes it before the second click', () => {
    const tooltip = renderTooltip({ trigger: 'click' });
    fireEvent.click(reference);
    fireEvent.pointerDown(reference);
    tooltip.hidePopover();
    fireEvent.click(reference);
    expect(shown.has(tooltip)).toBe(false);
  });

  it.each<[string, TooltipProps, boolean]>([
    ['stays open with mouseOverTooltip', { mouseOverTooltip: true }, true],
    ['does not react without it', {}, false],
  ])('over the tooltip itself, %s', (_name, props, want) => {
    const tooltip = renderTooltip(props);
    fireEvent.mouseEnter(tooltip);
    expect(shown.has(tooltip)).toBe(want);
  });

  it('follows show and defaultShow, and closes on Escape', () => {
    const tooltip = renderTooltip({ defaultShow: true });
    expect(shown.has(tooltip)).toBe(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(shown.has(tooltip)).toBe(false);
  });
});
