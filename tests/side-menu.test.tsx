import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  SideMenu,
  SideMenuCloseButton,
  SideMenuCollapseButton,
  type SideMenuCollapseButtonProps,
  SideMenuDropdown,
  SideMenuDropdownList,
  SideMenuDropdownListItem,
  type SideMenuDropdownProps,
  SideMenuItem,
  SideMenuOverlay,
  type SideMenuProps,
  SideMenuUser,
  SideMenuUserImage,
  SideMenuUserLabel,
} from '../src';

// Expected behaviour is Tegel's side menu family at @scania/tegel@1.66.1
// (packages/core/src/components/side-menu/). The menu keeps its open and collapsed state
// in data-open and data-collapsed on its root; the children's stylesheets read them. The
// dropdowns keep their open state in aria-expanded.

function firstDetail(handler: ReturnType<typeof vi.fn>) {
  const event = handler.mock.calls[0]?.[0] as CustomEvent | undefined;
  return event?.detail;
}

// jsdom has no matchMedia, so the cell treats the viewport as mobile. A stub that matches
// (min-width: 992px) makes it a desktop.
function desktop() {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: query === '(min-width: 992px)' }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderMenu(menu: SideMenuProps = {}, collapse: SideMenuCollapseButtonProps = {}) {
  const result = render(
    <SideMenu
      overlay={<SideMenuOverlay />}
      closeButton={<SideMenuCloseButton />}
      end={
        <SideMenuItem>
          <a href="#settings">Settings</a>
        </SideMenuItem>
      }
      stickyEnd={<SideMenuCollapseButton {...collapse}>Collapse</SideMenuCollapseButton>}
      {...menu}
    >
      <SideMenuItem>
        <button type="button">About us</button>
      </SideMenuItem>
      <SideMenuItem>
        <button type="button">Values</button>
      </SideMenuItem>
    </SideMenu>,
  );
  return { ...result, root: result.container.firstElementChild as HTMLElement };
}

const collapseButton = () => screen.getByRole('button', { name: /side menu/ });

describe('SideMenu matches tds-side-menu', () => {
  it.each<[string, SideMenuProps, string, string, string]>([
    [
      'closed, not persistent, expanded by default',
      {},
      'false',
      'false',
      'tl-side-menu--persistent-false',
    ],
    [
      'open, persistent, collapsed',
      { open: true, persistent: true, collapsed: true },
      'true',
      'true',
      'tl-side-menu--persistent-true',
    ],
  ])('%s', (_, props, open, collapsed, modifier) => {
    const { root } = renderMenu(props);
    expect(root.dataset.open).toBe(open);
    expect(root.dataset.collapsed).toBe(collapsed);
    expect(root).toHaveClass('tl-side-menu', modifier);
  });

  it('renders the overlay, close button, items, end items and sticky end in that order', () => {
    const { root } = renderMenu();
    const order = [
      '.tl-side-menu-overlay',
      '.tl-side-menu-close-button',
      '.tl-side-menu__upper .tl-side-menu-item',
      '.tl-side-menu__end .tl-side-menu-item',
      '.tl-side-menu-collapse-button',
    ].map((selector) => root.querySelector(selector) as Element);
    for (const [index, element] of order.slice(1).entries()) {
      const previous = order[index] as Element;
      expect(previous.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }
    expect(root.querySelector('nav')).not.toBeNull();
  });

  it('leaves the upper list empty when there are no items', () => {
    const { container } = render(<SideMenu end={<SideMenuItem>End</SideMenuItem>} />);
    expect(
      container.querySelector('.tl-side-menu__upper > .tl-side-menu__slot'),
    ).toBeEmptyDOMElement();
  });

  it('closes on Escape on mobile', () => {
    const { root } = renderMenu({ open: true });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(root.dataset.open).toBe('false');
  });

  it('keeps a desktop menu as it is on Escape', () => {
    desktop();
    const { root } = renderMenu({ open: true, persistent: true });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(root.dataset.open).toBe('true');
  });

  it('applies a new open prop after an Escape', () => {
    const { root, rerender } = renderMenu({ open: true });
    fireEvent.keyDown(window, { key: 'Escape' });
    rerender(<SideMenu open={false} />);
    rerender(<SideMenu open />);
    expect(root.dataset.open).toBe('true');
  });

  it('moves focus into the menu when it opens on mobile', () => {
    renderMenu({ open: true });
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  it('traps Tab inside the open mobile menu', () => {
    renderMenu({ open: true });
    const close = screen.getByRole('button', { name: 'Close' });
    collapseButton().focus();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(close).toHaveFocus();
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(collapseButton()).toHaveFocus();
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveFocus();
  });

  it('does not trap Tab when the menu is closed', () => {
    renderMenu();
    collapseButton().focus();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(collapseButton()).toHaveFocus();
  });

  it('removes its window listener on unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderMenu();
    unmount();
    expect(remove).toHaveBeenCalledWith('keydown', expect.any(Function), true);
    remove.mockRestore();
  });
});

describe('SideMenuCollapseButton matches tds-side-menu-collapse-button', () => {
  it('collapses and expands the menu and sends tdsCollapse from both', () => {
    const onButton = vi.fn();
    const onMenu = vi.fn();
    const { root } = renderMenu(
      { persistent: true, onTdsCollapse: onMenu },
      { onTdsCollapse: onButton },
    );
    expect(collapseButton()).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(collapseButton());
    expect(root.dataset.collapsed).toBe('true');
    expect(collapseButton()).toHaveAttribute('aria-expanded', 'false');
    expect(firstDetail(onButton)).toEqual({ collapsed: true });
    expect(firstDetail(onMenu)).toEqual({ collapsed: true });
    fireEvent.click(collapseButton());
    expect(root.dataset.collapsed).toBe('false');
    expect((onMenu.mock.calls[1]?.[0] as CustomEvent | undefined)?.detail).toEqual({
      collapsed: false,
    });
  });

  it.each<[string, 'button' | 'menu']>([
    ['the button', 'button'],
    ['the menu', 'menu'],
  ])('keeps the menu expanded when %s event is prevented', (_, where) => {
    const prevent = (event: CustomEvent) => event.preventDefault();
    const onMenu = vi.fn(where === 'menu' ? prevent : undefined);
    const { root } = renderMenu(
      { onTdsCollapse: onMenu },
      { onTdsCollapse: where === 'button' ? prevent : undefined },
    );
    fireEvent.click(collapseButton());
    expect(root.dataset.collapsed).toBe('false');
    expect(collapseButton()).toHaveAttribute('aria-expanded', 'true');
    expect(onMenu).toHaveBeenCalledTimes(where === 'menu' ? 1 : 0);
  });

  it('follows the collapsed prop', () => {
    const { root, rerender } = renderMenu({ collapsed: true });
    expect(collapseButton()).toHaveAttribute('aria-expanded', 'false');
    rerender(
      <SideMenu
        stickyEnd={<SideMenuCollapseButton>Collapse</SideMenuCollapseButton>}
        collapsed={false}
      />,
    );
    expect(root.dataset.collapsed).toBe('false');
    expect(collapseButton()).toHaveAttribute('aria-expanded', 'true');
  });

  it('names its icon by the state, and shows its label', () => {
    renderMenu();
    expect(screen.getByRole('img', { name: 'Collapse the side menu' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Expand the side menu' })).toBeInTheDocument();
    expect(collapseButton()).toHaveTextContent('Collapse');
  });
});

describe('SideMenuItem matches tds-side-menu-item', () => {
  it.each<[string, { selected?: boolean; active?: boolean }, string[]]>([
    [
      'plain by default',
      {},
      ['tl-side-menu-item--selected-false', 'tl-side-menu-item--active-false'],
    ],
    [
      'selected and active',
      { selected: true, active: true },
      ['tl-side-menu-item--selected-true', 'tl-side-menu-item--active-true'],
    ],
  ])('%s', (_, props, classes) => {
    const { container } = render(
      <SideMenuItem {...props}>
        <a href="#home">Home</a>
      </SideMenuItem>,
    );
    expect(container.firstElementChild).toHaveClass('tl-side-menu-item', ...classes);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });
});

function renderDropdowns(first: SideMenuDropdownProps = {}, second: SideMenuDropdownProps = {}) {
  return render(
    <SideMenu persistent>
      <SideMenuDropdown buttonLabel="Wheel types" {...first}>
        <SideMenuDropdownList>
          <SideMenuDropdownListItem selected>
            <a href="#hub">Hub-centric wheel</a>
          </SideMenuDropdownListItem>
        </SideMenuDropdownList>
      </SideMenuDropdown>
      <SideMenuDropdown buttonLabel="Truck types" {...second}>
        <SideMenuDropdownList>
          <SideMenuDropdownListItem>
            <a href="#big">Big truck</a>
          </SideMenuDropdownListItem>
        </SideMenuDropdownList>
      </SideMenuDropdown>
    </SideMenu>,
  );
}

const dropdownButton = (name: string) =>
  screen.getByRole('button', { name: new RegExp(`^${name}`) });

describe('SideMenuDropdown matches tds-side-menu-dropdown', () => {
  it('starts closed and toggles on click', () => {
    renderDropdowns();
    const wheels = dropdownButton('Wheel types');
    expect(wheels).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(wheels);
    expect(wheels).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(wheels);
    expect(wheels).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens from defaultOpen once', () => {
    const { rerender } = renderDropdowns({ defaultOpen: true });
    const wheels = dropdownButton('Wheel types');
    expect(wheels).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(wheels);
    rerender(
      <SideMenu persistent>
        <SideMenuDropdown buttonLabel="Wheel types" defaultOpen />
      </SideMenu>,
    );
    expect(wheels).toHaveAttribute('aria-expanded', 'false');
  });

  it('follows the open prop', () => {
    const { rerender } = render(<SideMenuDropdown buttonLabel="Wheel types" />);
    rerender(<SideMenuDropdown buttonLabel="Wheel types" open />);
    expect(dropdownButton('Wheel types')).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the other dropdowns when one opens', () => {
    renderDropdowns({ defaultOpen: true });
    fireEvent.click(dropdownButton('Truck types'));
    expect(dropdownButton('Truck types')).toHaveAttribute('aria-expanded', 'true');
    expect(dropdownButton('Wheel types')).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the selected modifier, the icon and the label', () => {
    const { container } = render(
      <SideMenuDropdown
        selected
        icon={<svg data-testid="icon" />}
        label={<SideMenuUserLabel heading="Name Namesson" subheading="Company name" />}
      />,
    );
    expect(container.firstElementChild).toHaveClass('tl-side-menu-dropdown--selected-true');
    expect(screen.getByTestId('icon').parentElement).toHaveClass('tl-side-menu-dropdown__icon');
    expect(screen.getByRole('button')).toHaveTextContent('Name NamessonCompany name');
    expect(screen.getByRole('img', { name: 'Chevron Down' })).toBeInTheDocument();
  });

  it('repeats the label as the heading of the collapsed list', () => {
    const { container } = render(<SideMenuDropdown buttonLabel="Wheel types" />);
    expect(container.querySelector('.tl-side-menu-dropdown__heading')).toHaveTextContent(
      'Wheel types',
    );
  });
});

describe('SideMenuDropdownList and SideMenuDropdownListItem match their Tegel tags', () => {
  it('render a list of items, with the selected modifier', () => {
    renderDropdowns();
    const lists = screen.getAllByRole('list', { hidden: true });
    expect(lists.some((list) => list.classList.contains('tl-side-menu-dropdown-list'))).toBe(true);
    const item = screen.getByRole('link', {
      name: 'Hub-centric wheel',
      hidden: true,
    }).parentElement;
    expect(item).toHaveClass('tl-side-menu-dropdown-list-item--selected-true');
    expect(item?.tagName).toBe('LI');
  });
});

describe('SideMenuCloseButton and SideMenuOverlay match their Tegel tags', () => {
  it('the close button has the name Close and calls onClick', () => {
    const onClick = vi.fn();
    render(<SideMenuCloseButton onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('the overlay calls onClick', () => {
    const onClick = vi.fn();
    const { container } = render(<SideMenuOverlay onClick={onClick} />);
    fireEvent.click(container.firstElementChild as Element);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('SideMenuUser, SideMenuUserImage and SideMenuUserLabel match their Tegel tags', () => {
  it('the user shows the image, heading and subheading', () => {
    render(
      <SideMenuUser
        heading="Name Namesson"
        subheading="Company name"
        imgSrc="a.svg"
        imgAlt="Avatar"
      />,
    );
    expect(screen.getByRole('img', { name: 'Avatar' })).toHaveAttribute('src', 'a.svg');
    expect(screen.getByText('Company name')).toHaveClass('tl-side-menu-user__subheading');
  });

  it('the user leaves out the image and subheading when not given', () => {
    const { container } = render(
      <SideMenuUser heading="Name Namesson" icon={<svg data-testid="icon" />} />,
    );
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('.tl-side-menu-user__subheading')).toBeNull();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('the image shows its src and its children', () => {
    render(
      <SideMenuUserImage src="a.svg" alt="Avatar">
        <svg data-testid="child" />
      </SideMenuUserImage>,
    );
    expect(screen.getByRole('img', { name: 'Avatar' })).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('the label shows the heading and the subheading', () => {
    const { container } = render(
      <SideMenuUserLabel heading="Name Namesson" subheading="Company name" />,
    );
    expect(container.firstElementChild).toHaveTextContent('Name NamessonCompany name');
    expect(screen.getByText('Company name')).toHaveClass('tl-side-menu-user-label__subheading');
  });
});
