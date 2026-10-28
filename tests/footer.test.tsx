import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer, FooterGroup, FooterItem, type FooterProps } from '../src';

// Expected behaviour is Tegel's tds-footer, tds-footer-group and tds-footer-item at
// @scania/tegel@1.66.1 (packages/core/src/components/footer/), with the slots as props.
// Groups and items read their place in the footer through the footer's part classes
// (relaxation parent-modifier-selectors), and a group keeps its mobile open state with
// useState (relaxation react-hooks); see docs/findings/README.md.

describe('Footer matches tds-footer', () => {
  function renderFooter(props: FooterProps) {
    render(<Footer {...props} />);
    const footer = screen.getByRole('contentinfo');
    return { footer, find: (selector: string) => footer.querySelector(selector) };
  }

  it('is a footer element', () => {
    expect(renderFooter({}).footer).toHaveClass('tl-footer');
  });

  it.each<[string, FooterProps, string[], string[]]>([
    ['only the bottom part without slots', {}, [], ['__top', '__main-top']],
    ['the top part', { top: 'Top' }, ['__top'], ['__main-top']],
    ['start without end', { start: 'Start' }, ['__main-top', '__start'], ['__end']],
    ['end without start', { end: 'End' }, ['__main-top', '__end'], ['__start']],
  ])('renders %s', (_name, props, present, absent) => {
    const { find } = renderFooter(props);
    for (const part of present) {
      expect(find(`.tl-footer${part}`)).not.toBeNull();
    }
    for (const part of absent) {
      expect(find(`.tl-footer${part}`)).toBeNull();
    }
  });

  it.each<[string, FooterProps, RegExp]>([
    ['a default copyright with the year', {}, /^Copyright © \d{4} Scania$/],
    ['the given copyright', { copyright: 'Our text' }, /^Our text$/],
  ])('shows %s', (_name, props, want) => {
    expect(renderFooter(props).find('.tl-footer__copyright')?.textContent).toMatch(want);
  });

  it('names the brand in hidden text', () => {
    expect(renderFooter({}).find('.tl-footer__brand')).toHaveTextContent('Scania');
  });
});

describe('FooterGroup and FooterItem match tds-footer-group and tds-footer-item', () => {
  it('lists the items in a labelled navigation', () => {
    render(
      <FooterGroup tdsListAriaLabel="Links" title={<h2>Services</h2>}>
        <FooterItem>
          <a href="/a">A</a>
        </FooterItem>
        <FooterItem>
          <a href="/b">B</a>
        </FooterItem>
      </FooterGroup>,
    );
    expect(screen.getByRole('navigation', { name: 'Links' })).toBeInTheDocument();
    expect(screen.getByRole('list')).toHaveClass('tl-footer-group__list');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getAllByRole('listitem')[0]).toHaveClass('tl-footer-item');
  });

  it.each([
    ['the title slot over titleText', { title: 'Slot', titleText: 'Prop' }, 'Slot'],
    ['titleText without a title slot', { titleText: 'Prop' }, 'Prop'],
    ['no title without either', {}, null],
  ])('renders %s', (_name, props, want) => {
    const { container } = render(<FooterGroup {...props} />);
    const title = container.querySelector('.tl-footer-group__title');
    expect(title?.textContent ?? null).toBe(want);
  });

  it('toggles the list from a closed start, as Tegel does on mobile', () => {
    render(
      <FooterGroup titleText="Services">
        <FooterItem>
          <a href="/a">A</a>
        </FooterItem>
      </FooterGroup>,
    );
    const toggle = screen.getByRole('button', { name: 'Services' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps the list in the DOM next to the toggle, so CSS can hide it', () => {
    const { container } = render(<FooterGroup titleText="Services" />);
    const toggle = container.querySelector('.tl-footer-group__toggle');
    expect(toggle?.nextElementSibling?.querySelector('.tl-footer-group__list')).not.toBeNull();
  });

  it('keeps the consumer link as a direct child of the item', () => {
    render(
      <FooterItem>
        <a href="/a">A</a>
      </FooterItem>,
    );
    expect(screen.getByRole('link').parentElement).toHaveClass('tl-footer-item');
  });
});
