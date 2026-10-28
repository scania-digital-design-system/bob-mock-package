import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  CoreHeaderItem,
  Header,
  HeaderBrandSymbol,
  HeaderDropdown,
  HeaderDropdownList,
  HeaderDropdownListItem,
  HeaderDropdownListUser,
  type HeaderDropdownProps,
  HeaderHamburger,
  HeaderItem,
  HeaderLauncher,
  HeaderLauncherButton,
  HeaderLauncherGrid,
  HeaderLauncherGridItem,
  HeaderLauncherGridTitle,
  HeaderLauncherList,
  HeaderLauncherListItem,
  HeaderLauncherListTitle,
  HeaderTitle,
  SideMenu,
  SideMenuCloseButton,
  SideMenuItem,
  type SideMenuProps,
} from '../src';

// Expected behaviour is Tegel's header family at @scania/tegel@1.66.1
// (packages/core/src/components/header/). Every part in the header renders an <li> of
// one list. The dropdown and launcher menus are native popovers that keep the button's
// aria-expanded in step through the popover's toggle event. jsdom has no popover API and
// never matches :popover-open, so showPopover(), hidePopover() and that match are stubbed
// here; the stubs send the toggle event, as a browser does.

const shown = new WeakSet<Element>();
const showPopover = vi.fn(function showPopover(this: HTMLElement) {
  shown.add(this);
  this.dispatchEvent(new Event('toggle'));
});
const hidePopover = vi.fn(function hidePopover(this: HTMLElement) {
  shown.delete(this);
  this.dispatchEvent(new Event('toggle'));
});

beforeAll(() => {
  HTMLElement.prototype.showPopover = showPopover;
  HTMLElement.prototype.hidePopover = hidePopover;
  const matches = Element.prototype.matches;
  Element.prototype.matches = function match(this: Element, selector: string) {
    return selector === ':popover-open' ? shown.has(this) : matches.call(this, selector);
  } as typeof matches;
});

afterEach(() => {
  showPopover.mockClear();
  hidePopover.mockClear();
});

describe('Header matches tds-header', () => {
  it('renders one list: hamburger, title, items, a spacer, then the end items', () => {
    const { container } = render(
      <Header
        hamburger={<HeaderHamburger tdsAriaLabel="Open menu" />}
        title={<HeaderTitle>My application</HeaderTitle>}
        end={
          <HeaderBrandSymbol>
            <a href="#scania">Scania website</a>
          </HeaderBrandSymbol>
        }
      >
        <HeaderItem>
          <a href="#about">About us</a>
        </HeaderItem>
      </Header>,
    );
    const list = container.querySelector('nav > ul') as HTMLElement;
    expect([...list.children].map((child) => child.className.split(' ')[0])).toEqual([
      'tl-header-hamburger',
      'tl-header-title',
      'tl-header-item',
      'tl-header__spacer',
      'tl-header-brand-symbol',
    ]);
    expect([...list.children].every((child) => child.tagName === 'LI')).toBe(true);
  });

  it('takes the hamburger and title as children too, as Tegel does', () => {
    const { container } = render(
      <Header>
        <HeaderHamburger />
        <HeaderTitle>My application</HeaderTitle>
      </Header>,
    );
    expect(container.querySelector('nav > ul > .tl-header-title')).not.toBeNull();
  });
});

describe('HeaderItem and CoreHeaderItem match their Tegel tags', () => {
  it.each<[string, { active?: boolean; selected?: boolean }, string[]]>([
    ['plain by default', {}, ['tl-header-item--active-false', 'tl-header-item--selected-false']],
    [
      'active and selected',
      { active: true, selected: true },
      ['tl-header-item--active-true', 'tl-header-item--selected-true'],
    ],
  ])('the item is %s', (_, props, classes) => {
    render(
      <HeaderItem {...props}>
        <button type="button">About us</button>
      </HeaderItem>,
    );
    const item = screen.getByRole('listitem');
    expect(item).toHaveClass('tl-header-item', ...classes);
    expect(screen.getByRole('button', { name: 'About us' }).parentElement).toBe(item);
  });

  it('the core item holds its content', () => {
    const { container } = render(<CoreHeaderItem>Content</CoreHeaderItem>);
    expect(container.firstElementChild).toHaveClass('tl-core-header-item');
    expect(container.firstElementChild).toHaveTextContent('Content');
  });
});

describe('HeaderHamburger, HeaderTitle and HeaderBrandSymbol match their Tegel tags', () => {
  it('the hamburger is a closed menu button that calls onClick', () => {
    const onClick = vi.fn();
    render(<HeaderHamburger tdsAriaLabel="Open application drawer" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Open application drawer' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-haspopup', 'true');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('the title is a level 4 heading', () => {
    render(<HeaderTitle>My application</HeaderTitle>);
    expect(screen.getByRole('heading', { level: 4, name: 'My application' })).toBeInTheDocument();
  });

  it('the brand symbol holds its link', () => {
    render(
      <HeaderBrandSymbol>
        <a href="#scania">Scania website</a>
      </HeaderBrandSymbol>,
    );
    expect(screen.getByRole('link', { name: 'Scania website' }).parentElement).toHaveClass(
      'tl-header-brand-symbol',
    );
  });
});

function renderDropdown(props: HeaderDropdownProps = {}) {
  const result = render(
    <HeaderDropdown label="Wheel types" {...props}>
      <HeaderDropdownList>
        <HeaderDropdownListItem>
          <a href="#hub">Hub-centric wheel</a>
        </HeaderDropdownListItem>
        <HeaderDropdownListItem>
          <a href="#rim">Rim wheel</a>
        </HeaderDropdownListItem>
      </HeaderDropdownList>
    </HeaderDropdown>,
  );
  const menu = result.container.querySelector('[popover]') as HTMLElement;
  return { ...result, menu, button: screen.getByRole('button', { name: /Wheel types/ }) };
}

describe('HeaderDropdown matches tds-header-dropdown', () => {
  it('is a light-dismiss popover, closed by default', () => {
    const { menu, button } = renderDropdown();
    expect(menu).toHaveAttribute('popover', 'auto');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-current', 'false');
  });

  it('opens under its button, marks the button expanded and focuses the first link', () => {
    const { menu, button } = renderDropdown();
    fireEvent.click(button);
    expect(showPopover).toHaveBeenCalledWith({ source: button });
    expect(menu.matches(':popover-open')).toBe(true);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Hub-centric wheel', hidden: true })).toHaveFocus();
  });

  it('closes on a second click', () => {
    const { menu, button } = renderDropdown();
    fireEvent.click(button);
    fireEvent.click(button);
    expect(menu.matches(':popover-open')).toBe(false);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('stays closed when light dismiss closed it before the click', () => {
    const { menu, button } = renderDropdown();
    fireEvent.click(button);
    fireEvent.pointerDown(button);
    menu.hidePopover();
    fireEvent.click(button);
    expect(menu.matches(':popover-open')).toBe(false);
  });

  it('closes when a link in the menu is clicked, and focus goes back to the button', () => {
    const { menu, button } = renderDropdown();
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('link', { name: 'Rim wheel', hidden: true }));
    expect(menu.matches(':popover-open')).toBe(false);
    expect(button).toHaveFocus();
  });

  it('removes its toggle listener on unmount', () => {
    const { menu, unmount } = renderDropdown();
    const remove = vi.spyOn(menu, 'removeEventListener');
    unmount();
    expect(remove).toHaveBeenCalledWith('toggle', expect.any(Function));
  });

  it.each<[string, HeaderDropdownProps, string[]]>([
    [
      'plain by default',
      {},
      ['tl-header-dropdown--selected-false', 'tl-header-dropdown--no-dropdown-icon-false'],
    ],
    [
      'selected, with no chevron',
      { selected: true, noDropdownIcon: true },
      ['tl-header-dropdown--selected-true', 'tl-header-dropdown--no-dropdown-icon-true'],
    ],
  ])('is %s', (_, props, classes) => {
    const { container } = renderDropdown(props);
    expect(container.firstElementChild).toHaveClass(...classes);
  });

  it('marks a selected dropdown as the current location', () => {
    const { button } = renderDropdown({ selected: true });
    expect(button).toHaveAttribute('aria-current', 'location');
  });

  it('shows the icon, the label and the chevron, and takes an aria-label', () => {
    render(
      <HeaderDropdown
        tdsAriaLabel="User menu"
        icon={<img src="a.svg" alt="" />}
        label={<span>Name</span>}
      />,
    );
    const button = screen.getByRole('button', { name: 'User menu' });
    expect(button.querySelector('.tl-header-dropdown__icon > img')).not.toBeNull();
    expect(button).toHaveTextContent('Name');
    expect(screen.getByRole('img', { name: 'Dropdown icon' })).toBeInTheDocument();
  });
});

describe('HeaderDropdownList, HeaderDropdownListItem and HeaderDropdownListUser match their Tegel tags', () => {
  it.each<['md' | 'lg' | undefined, string]>([
    [undefined, 'tl-header-dropdown-list--md'],
    ['lg', 'tl-header-dropdown-list--lg'],
  ])('the list with size %s', (size, className) => {
    render(<HeaderDropdownList size={size} />);
    expect(screen.getByRole('list')).toHaveClass('tl-header-dropdown-list', className);
  });

  it.each<[string, { selected?: boolean; size?: 'md' | 'lg' }, string[]]>([
    [
      'plain by default',
      {},
      ['tl-header-dropdown-list-item--selected-false', 'tl-header-dropdown-list-item--md'],
    ],
    [
      'selected and large',
      { selected: true, size: 'lg' },
      ['tl-header-dropdown-list-item--selected-true', 'tl-header-dropdown-list-item--lg'],
    ],
  ])('the item is %s', (_, props, classes) => {
    render(
      <HeaderDropdownListItem {...props}>
        <a href="#tasks">Task list</a>
      </HeaderDropdownListItem>,
    );
    expect(screen.getByRole('listitem')).toHaveClass(...classes);
  });

  it('the user shows the image, header and subheader', () => {
    render(
      <HeaderDropdownListUser
        imgUrl="a.svg"
        imgAlt="Avatar"
        header="Name Nameson"
        subheader="Company"
      />,
    );
    expect(screen.getByRole('img', { name: 'Avatar' })).toHaveAttribute('src', 'a.svg');
    expect(screen.getByText('Name Nameson')).toHaveClass('tl-header-dropdown-list-user__header');
    expect(screen.getByText('Company')).toHaveClass('tl-header-dropdown-list-user__subheader');
  });

  it('the user takes a thumbnail instead of an image', () => {
    const { container } = render(
      <HeaderDropdownListUser header="Name" thumbnail={<svg data-testid="thumbnail" />} />,
    );
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByTestId('thumbnail')).toBeInTheDocument();
  });
});

describe('HeaderLauncher and its parts match their Tegel tags', () => {
  function renderLauncher() {
    const result = render(
      <HeaderLauncher tdsAriaLabel="Application launcher">
        <HeaderLauncherListTitle>Cool apps</HeaderLauncherListTitle>
        <HeaderLauncherList>
          <HeaderLauncherListItem>
            <a href="#trucklyfe">Trucklyfe</a>
          </HeaderLauncherListItem>
        </HeaderLauncherList>
        <HeaderLauncherGridTitle>Operations</HeaderLauncherGridTitle>
        <HeaderLauncherGrid>
          <HeaderLauncherGridItem>
            <a href="#care">ScaniaCare</a>
          </HeaderLauncherGridItem>
        </HeaderLauncherGrid>
      </HeaderLauncher>,
    );
    const menu = result.container.querySelector('[popover]') as HTMLElement;
    return { menu, button: screen.getByRole('button', { name: 'Application launcher' }) };
  }

  it('opens and closes its menu like the dropdown', () => {
    const { menu, button } = renderLauncher();
    expect(menu).toHaveAttribute('popover', 'auto');
    fireEvent.click(button);
    expect(showPopover).toHaveBeenCalledWith({ source: button });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Trucklyfe', hidden: true })).toHaveFocus();
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('names its icon by the aria-label', () => {
    renderLauncher();
    expect(
      screen.getByRole('img', { name: 'Application launcher', hidden: true }),
    ).toBeInTheDocument();
  });

  it('renders the titles as headings, the list as a list and the grid as a list', () => {
    renderLauncher();
    expect(screen.getByRole('heading', { level: 3, name: 'Cool apps', hidden: true })).toHaveClass(
      'tl-header-launcher-list-title',
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Operations', hidden: true })).toHaveClass(
      'tl-header-launcher-grid-title',
    );
    const lists = screen.getAllByRole('list', { hidden: true });
    expect(lists.map((list) => list.className)).toEqual([
      'tl-header-launcher-list',
      'tl-header-launcher-grid',
    ]);
    expect(
      screen.getByRole('link', { name: 'ScaniaCare', hidden: true }).parentElement,
    ).toHaveAttribute('role', 'listitem');
  });

  it.each<[boolean | undefined, string]>([
    [undefined, 'tl-header-launcher-button--active-false'],
    [true, 'tl-header-launcher-button--active-true'],
  ])('the launcher button with active %s', (active, className) => {
    const { container } = render(<HeaderLauncherButton active={active} tdsAriaLabel="Apps" />);
    expect(container.firstElementChild).toHaveClass(className);
    expect(screen.getByRole('button', { name: 'Apps' })).toBeInTheDocument();
  });
});

describe('The header hamburger and the side menu work together', () => {
  function renderNavigation(menu: SideMenuProps) {
    return render(
      <>
        <Header hamburger={<HeaderHamburger tdsAriaLabel="Open menu" />} />
        <SideMenu closeButton={<SideMenuCloseButton />} {...menu}>
          <SideMenuItem>
            <button type="button">About us</button>
          </SideMenuItem>
        </SideMenu>
      </>,
    );
  }
  const hamburger = () => screen.getByRole('button', { name: 'Open menu' });

  it('the open menu marks the hamburger expanded', () => {
    renderNavigation({ open: true });
    expect(hamburger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('Escape closes the menu, marks the hamburger collapsed and focuses it', () => {
    renderNavigation({ open: true });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(hamburger()).toHaveAttribute('aria-expanded', 'false');
    expect(hamburger()).toHaveFocus();
  });

  it('the close button marks the hamburger collapsed', () => {
    renderNavigation({ open: true });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(hamburger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('closing the menu through the open prop moves focus to the hamburger', () => {
    const { rerender } = renderNavigation({ open: true });
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    rerender(
      <>
        <Header hamburger={<HeaderHamburger tdsAriaLabel="Open menu" />} />
        <SideMenu closeButton={<SideMenuCloseButton />} open={false} />
      </>,
    );
    expect(hamburger()).toHaveFocus();
    expect(hamburger()).toHaveAttribute('aria-expanded', 'false');
  });
});
