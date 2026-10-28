import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  PopoverCanvas,
  type PopoverCanvasProps,
  PopoverCore,
  type PopoverCoreProps,
  PopoverMenu,
  PopoverMenuItem,
  type PopoverMenuProps,
} from '../src';

// Expected behaviour is Tegel's tds-popover-core, tds-popover-canvas, tds-popover-menu and
// tds-popover-menu-item at @scania/tegel@1.66.1 (packages/core/src/components/popover-*).
// Each cell is a native popover. jsdom has no popover API and never matches
// :popover-open, so showPopover(), hidePopover() and that match are stubbed here.

const shown = new WeakSet<Element>();
const showPopover = vi.fn(function showPopover(this: HTMLElement) {
  shown.add(this);
});

beforeAll(() => {
  HTMLElement.prototype.showPopover = showPopover;
  HTMLElement.prototype.hidePopover = function hidePopover(this: HTMLElement) {
    shown.delete(this);
  };
  const matches = Element.prototype.matches;
  Element.prototype.matches = function match(this: Element, selector: string) {
    return selector === ':popover-open' ? shown.has(this) : matches.call(this, selector);
  } as typeof matches;
});

let reference: HTMLButtonElement;

function addReference() {
  reference = document.body.appendChild(
    Object.assign(document.createElement('button'), { id: 'reference' }),
  );
  return reference;
}

afterEach(() => {
  reference?.remove();
  showPopover.mockClear();
});

function renderCore(props: PopoverCoreProps) {
  addReference();
  const result = render(
    <PopoverCore selector="#reference" {...props}>
      <button type="button">Inside</button>
    </PopoverCore>,
  );
  return { ...result, popover: result.container.firstElementChild as HTMLElement };
}

// A click from the mouse; a click from the keyboard has detail 0.
const mouseClick = (element: HTMLElement) => fireEvent.click(element, { detail: 1 });

// A mouse click on the reference of an open auto popover, as a browser runs it: light
// dismiss hides the popover on pointerup, before the click event.
function clickThroughLightDismiss(popover: HTMLElement) {
  fireEvent.pointerDown(reference);
  popover.hidePopover();
  mouseClick(reference);
}

describe('PopoverCore matches tds-popover-core', () => {
  it.each<[string, PopoverCoreProps, string, string]>([
    ['auto, light-dismissed, by default', {}, 'tl-popover-core--auto', 'auto'],
    ['top-start', { placement: 'top-start' }, 'tl-popover-core--top-start', 'auto'],
    ['manual when show is set', { show: false }, 'tl-popover-core--auto', 'manual'],
    ['manual on hover', { trigger: 'hover' }, 'tl-popover-core--auto', 'manual'],
  ])('is %s', (_name, props, className, popover) => {
    const { popover: element } = renderCore(props);
    expect(element).toHaveClass('tl-popover-core', className);
    expect(element).toHaveAttribute('popover', popover);
  });

  it('opens and closes on a click on the reference, anchored to it', () => {
    const { popover, unmount } = renderCore({});
    mouseClick(reference);
    expect(shown.has(popover)).toBe(true);
    expect(showPopover).toHaveBeenLastCalledWith({ source: reference });
    mouseClick(reference);
    expect(shown.has(popover)).toBe(false);
    unmount();
    mouseClick(reference);
    expect(showPopover).toHaveBeenCalledOnce();
  });

  it('stays closed when light dismiss closes it before the second click', () => {
    const { popover } = renderCore({});
    mouseClick(reference);
    clickThroughLightDismiss(popover);
    expect(shown.has(popover)).toBe(false);
    mouseClick(reference);
    expect(shown.has(popover)).toBe(true);
  });

  it('takes referenceEl before selector', () => {
    const other = document.body.appendChild(document.createElement('button'));
    const { popover } = renderCore({ referenceEl: other });
    mouseClick(other);
    expect(shown.has(popover)).toBe(true);
    other.remove();
  });

  it('moves focus into the popover when the keyboard opens it', () => {
    renderCore({});
    fireEvent.click(reference, { detail: 0 });
    expect(screen.getByRole('button', { name: 'Inside', hidden: true })).toHaveFocus();
  });

  it('follows the show prop and ignores clicks on the reference', () => {
    const { popover, rerender } = renderCore({ show: true });
    expect(shown.has(popover)).toBe(true);
    mouseClick(reference);
    expect(shown.has(popover)).toBe(true);
    rerender(<PopoverCore selector="#reference" show={false} />);
    expect(shown.has(popover)).toBe(false);
  });

  it('opens once when defaultShow is set', () => {
    const { popover, rerender } = renderCore({ defaultShow: true });
    expect(shown.has(popover)).toBe(true);
    mouseClick(reference);
    rerender(<PopoverCore selector="#reference" defaultShow />);
    expect(shown.has(popover)).toBe(false);
  });

  it.each<[string, (element: HTMLElement) => void, (element: HTMLElement) => void]>([
    ['the mouse', fireEvent.mouseEnter, fireEvent.mouseLeave],
    ['focus', fireEvent.focusIn, fireEvent.focusOut],
  ])('opens on hover with %s and closes when it leaves', (_name, enter, leave) => {
    const { popover } = renderCore({ trigger: 'hover' });
    enter(reference);
    expect(shown.has(popover)).toBe(true);
    leave(reference);
    expect(shown.has(popover)).toBe(false);
  });

  it.each<[string, PopoverCoreProps, boolean]>([
    ['stays open on hover-popover', { trigger: 'hover-popover' }, true],
    ['does not react on hover', { trigger: 'hover' }, false],
  ])('over the popover itself, %s', (_name, props, want) => {
    const { popover } = renderCore(props);
    fireEvent.mouseEnter(popover);
    expect(shown.has(popover)).toBe(want);
  });

  it('closes on Escape', () => {
    const { popover } = renderCore({ show: true });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(shown.has(popover)).toBe(false);
  });
});

describe('PopoverCanvas matches tds-popover-canvas', () => {
  it.each<[string, PopoverCanvasProps, string]>([
    ['a dialog by default', {}, 'dialog'],
    ['an alert dialog when asked', { tdsAlertDialog: 'alertdialog' }, 'alertdialog'],
  ])('is %s', (_name, props, want) => {
    addReference();
    const { container } = render(<PopoverCanvas selector="#reference" {...props} />);
    const canvas = container.firstElementChild as HTMLElement;
    expect(canvas).toHaveAttribute('role', want);
    expect(canvas).toHaveClass('tl-popover-canvas', 'tl-popover-canvas--auto');
    mouseClick(reference);
    expect(shown.has(canvas)).toBe(true);
    clickThroughLightDismiss(canvas);
    expect(shown.has(canvas)).toBe(false);
  });
});

describe('PopoverMenu matches tds-popover-menu', () => {
  it.each<[string, PopoverMenuProps, string]>([
    ['160px wide by default', {}, 'tl-popover-menu--fluid-width-false'],
    ['as wide as its items when fluid', { fluidWidth: true }, 'tl-popover-menu--fluid-width-true'],
  ])('is %s', (_name, props, want) => {
    addReference();
    const { container } = render(
      <PopoverMenu selector="#reference" placement="bottom-end" {...props}>
        <PopoverMenuItem>
          <a href="#one">One</a>
        </PopoverMenuItem>
        <PopoverMenuItem disabled>
          <a href="#two">Two</a>
        </PopoverMenuItem>
      </PopoverMenu>,
    );
    const menu = container.firstElementChild as HTMLElement;
    expect(menu).toHaveClass('tl-popover-menu', 'tl-popover-menu--bottom-end', want);
    expect(screen.getAllByRole('menuitem', { hidden: true })).toHaveLength(2);
    mouseClick(reference);
    expect(shown.has(menu)).toBe(true);
    clickThroughLightDismiss(menu);
    expect(shown.has(menu)).toBe(false);
  });
});

describe('PopoverMenuItem matches tds-popover-menu-item', () => {
  it.each<[string, boolean, string]>([
    ['enabled by default', false, 'tl-popover-menu-item--disabled-false'],
    ['disabled', true, 'tl-popover-menu-item--disabled-true'],
  ])('is %s', (_name, disabled, want) => {
    render(
      <PopoverMenuItem disabled={disabled}>
        <a href="#item">Item</a>
      </PopoverMenuItem>,
    );
    const item = screen.getByRole('menuitem');
    expect(item).toHaveClass('tl-popover-menu-item', want);
    expect(item).toHaveAttribute('aria-disabled', String(disabled));
  });
});
