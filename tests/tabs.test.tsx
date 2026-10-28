import { fireEvent, render, screen } from '@testing-library/react';
import type { FC, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FolderTab,
  FolderTabs,
  type FolderTabsProps,
  InlineTab,
  InlineTabs,
  NavigationTab,
  NavigationTabs,
} from '../src';

// Expected behaviour is Tegel's tds-folder-tabs, tds-inline-tabs and tds-navigation-tabs
// with their tab elements at @scania/tegel@1.66.1 (packages/core/src/components/tabs/).
// The three families share their behaviour, so each test runs once per family. The
// parent marks the selected tab with aria-selected on the tab's button, as Tegel's
// setSelected marks its tab element.

type ParentProps = FolderTabsProps & { leftPadding?: '0' | '8' | '16' | '24' | '32' | '40' | '48' };

type TabComponent = FC<{ disabled?: boolean; children?: ReactNode }>;

const FAMILIES: [string, FC<ParentProps>, TabComponent][] = [
  ['folder-tabs', FolderTabs, FolderTab],
  ['inline-tabs', InlineTabs, InlineTab],
  ['navigation-tabs', NavigationTabs, NavigationTab],
];

function renderTabs(Tabs: FC<ParentProps>, Tab: TabComponent, props: ParentProps) {
  const result = render(
    <Tabs {...props}>
      <Tab>
        <button type="button" role="tab">
          First
        </button>
      </Tab>
      <Tab>
        <button type="button" role="tab">
          Second
        </button>
      </Tab>
      <Tab disabled>
        <button type="button" role="tab">
          Third
        </button>
      </Tab>
    </Tabs>,
  );
  return {
    ...result,
    root: result.container.firstElementChild as HTMLElement,
    tabs: screen.getAllByRole('tab'),
  };
}

function selected(tabs: HTMLElement[]) {
  return tabs.map((tab) => tab.getAttribute('aria-selected'));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe.each(FAMILIES)('%s matches Tegel', (name, Tabs, Tab) => {
  it('is a tablist', () => {
    const { root } = renderTabs(Tabs, Tab, {});
    expect(root).toHaveClass(`tl-${name}`);
    expect(root).toHaveAttribute('role', 'tablist');
  });

  it.each<[string, ParentProps, string[]]>([
    ['the first tab by default', {}, ['true', 'false', 'false']],
    ['the default selected index', { defaultSelectedIndex: '1' }, ['false', 'true', 'false']],
    ['the selected index', { selectedIndex: '1' }, ['false', 'true', 'false']],
  ])('selects %s', (_case, props, want) => {
    expect(selected(renderTabs(Tabs, Tab, props).tabs)).toEqual(want);
  });

  it('selects a clicked tab and sends a cancelable tdsChange', () => {
    const onTdsChange = vi.fn();
    const { tabs } = renderTabs(Tabs, Tab, { onTdsChange });
    fireEvent.click(tabs[1] as HTMLElement);
    expect(selected(tabs)).toEqual(['false', 'true', 'false']);
    const event = onTdsChange.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe('tdsChange');
    expect(event.cancelable).toBe(true);
    expect(event.detail).toEqual({ selectedTabIndex: 1 });
  });

  it('keeps the selection when the listener prevents tdsChange', () => {
    const { tabs } = renderTabs(Tabs, Tab, { onTdsChange: (event) => event.preventDefault() });
    fireEvent.click(tabs[1] as HTMLElement);
    expect(selected(tabs)).toEqual(['true', 'false', 'false']);
  });

  it('marks a disabled tab and ignores clicks on it', () => {
    const onTdsChange = vi.fn();
    const { tabs } = renderTabs(Tabs, Tab, { onTdsChange });
    expect(tabs[2]).toHaveAttribute('aria-disabled', 'true');
    expect(tabs[2]?.parentElement).toHaveClass(`tl-${name.replace(/s$/, '')}--disabled-true`);
    fireEvent.click(tabs[2] as HTMLElement);
    expect(onTdsChange).not.toHaveBeenCalled();
    expect(selected(tabs)).toEqual(['true', 'false', 'false']);
  });

  it('follows the selected index when it is set', () => {
    const onTdsChange = vi.fn();
    const { tabs, rerender } = renderTabs(Tabs, Tab, { selectedIndex: '0', onTdsChange });
    fireEvent.click(tabs[1] as HTMLElement);
    expect(onTdsChange).toHaveBeenCalledOnce();
    expect(selected(tabs)).toEqual(['true', 'false', 'false']);
    rerender(
      <Tabs selectedIndex="1">
        <Tab>
          <button type="button" role="tab">
            First
          </button>
        </Tab>
        <Tab>
          <button type="button" role="tab">
            Second
          </button>
        </Tab>
        <Tab disabled>
          <button type="button" role="tab">
            Third
          </button>
        </Tab>
      </Tabs>,
    );
    expect(selected(tabs)).toEqual(['false', 'true', 'false']);
  });

  it.each<[string, ParentProps, string[]]>([
    ['default', {}, ['Scroll left', 'Scroll right']],
    [
      'custom',
      { tdsScrollLeftAriaLabel: 'Previous', tdsScrollRightAriaLabel: 'Next' },
      ['Previous', 'Next'],
    ],
  ])('labels the scroll buttons (%s)', (_case, props, want) => {
    renderTabs(Tabs, Tab, props);
    const buttons = screen.getAllByRole('button', { hidden: true });
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual(want);
  });

  it('disables both scroll buttons when the tabs fit', () => {
    renderTabs(Tabs, Tab, {});
    for (const button of screen.getAllByRole('button', { hidden: true })) {
      expect(button).toBeDisabled();
    }
  });

  it('shows the scroll buttons that can move an overflowing row', () => {
    const scrollLeft = new WeakMap<Element, number>();
    const wrapper = (element: Element) => element.classList.contains(`tl-${name}__wrapper`);
    vi.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(function (this: Element) {
      return wrapper(this) ? 600 : 0;
    });
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(function (this: Element) {
      return wrapper(this) ? 200 : 0;
    });
    vi.spyOn(Element.prototype, 'scrollLeft', 'get').mockImplementation(function (this: Element) {
      return scrollLeft.get(this) ?? 0;
    });
    vi.spyOn(Element.prototype, 'scrollLeft', 'set').mockImplementation(function (
      this: Element,
      value: number,
    ) {
      scrollLeft.set(this, value);
    });
    renderTabs(Tabs, Tab, {});
    const [left, right] = screen.getAllByRole('button', { hidden: true }) as HTMLButtonElement[];
    expect([left?.disabled, right?.disabled]).toEqual([true, false]);
    fireEvent.click(right as HTMLElement);
    expect(scrollLeft.get(right?.parentElement as Element)).toBe(100);
    expect([left?.disabled, right?.disabled]).toEqual([false, false]);
  });
});

describe.each(FAMILIES.slice(1))('%s left padding matches Tegel', (name, Tabs, Tab) => {
  it.each<[string, ParentProps, string]>([
    ['32 by default', {}, `tl-${name}--left-padding-32`],
    ['the given value', { leftPadding: '0' }, `tl-${name}--left-padding-0`],
  ])('is %s', (_case, props, want) => {
    expect(renderTabs(Tabs, Tab, props).root).toHaveClass(want);
  });
});
