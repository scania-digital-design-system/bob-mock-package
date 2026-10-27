import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Card from '../cells/react/card/scania/v1/component.jsx';

// Expected behaviour is Tegel's tds-card at @scania/tegel@1.66.1
// (packages/core/src/components/card/card.tsx), with slots as props.

function renderCard(props: Record<string, unknown>) {
  const { container } = render(<Card header="Header" {...props} />);
  const card = container.firstElementChild as HTMLElement;
  return { card, find: (selector: string) => card.querySelector(selector) };
}

function precedes(a: Element | null, b: Element | null): boolean {
  if (a === null || b === null) {
    return false;
  }
  return Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
}

describe('Card matches tds-card', () => {
  it.each([
    ['a div by default', {}, 'DIV'],
    ['a button when clickable', { clickable: true }, 'BUTTON'],
  ])('is %s', (_name, props, tag) => {
    expect(renderCard(props).card.tagName).toBe(tag);
  });

  it.each([
    ['the header', { header: 'Fleet' }, 'Fleet'],
    ['the card id without a header', { header: undefined, cardId: 'c1' }, 'Card c1'],
    ['a plain fallback without either', { header: undefined }, 'Card'],
  ])('labels a clickable card with %s', (_name, props, want) => {
    expect(renderCard({ clickable: true, ...props }).card).toHaveAttribute('aria-label', want);
  });

  it('sends tdsClick with the card id', () => {
    const onTdsClick = vi.fn();
    const { card } = renderCard({ clickable: true, cardId: 'c1', onTdsClick });
    fireEvent.click(card);
    expect(onTdsClick).toHaveBeenCalledTimes(1);
    const event = onTdsClick.mock.calls[0]?.[0] as CustomEvent<{ cardId: string }>;
    expect(event.type).toBe('tdsClick');
    expect(event.detail.cardId).toBe('c1');
  });

  it.each([
    ['header', { header: 'Fleet' }, '.tl-card__title', 'Fleet'],
    ['subheader', { subheader: 'Overview' }, '.tl-card__subtitle', 'Overview'],
    ['body', { body: 'Body text' }, '.tl-card__body-text', 'Body text'],
    ['actions', { actions: 'Act' }, '.tl-card__actions', 'Act'],
    ['thumbnail', { thumbnail: 'T' }, '.tl-card__thumbnail', 'T'],
    ['body image', { bodyImage: 'I' }, '.tl-card__body-image', 'I'],
  ])('renders the %s', (_name, props, selector, want) => {
    expect(renderCard(props).find(selector)).toHaveTextContent(want);
  });

  it.each([
    ['absent by default', {}, false],
    ['present with bodyDivider', { bodyDivider: true }, true],
  ])('has a divider %s', (_name, props, want) => {
    expect(renderCard(props).find('.tl-card__divider') !== null).toBe(want);
  });

  it('renders bodyImg with its alt text', () => {
    const img = renderCard({ bodyImg: '/a.png', bodyImgAlt: 'Truck' }).find('img');
    expect(img).toHaveAttribute('src', '/a.png');
    expect(img).toHaveAttribute('alt', 'Truck');
  });

  it.each([
    ['below-header puts the header first', 'below-header', true],
    ['above-header puts the image first', 'above-header', false],
  ])('%s', (_name, imagePlacement, headerFirst) => {
    const { find } = renderCard({ imagePlacement, bodyImg: '/a.png' });
    expect(precedes(find('.tl-card__header'), find('img'))).toBe(headerFirst);
  });

  it.each([
    ['not stretched by default', {}, 'tl-card--stretch-false'],
    ['stretched', { stretch: true }, 'tl-card--stretch-true'],
  ])('is %s', (_name, props, wantClass) => {
    expect(renderCard(props).card).toHaveClass('tl-card', wantClass);
  });

  it.each([
    ['ids from the card id', { cardId: 'c1', body: 'B' }, 'header-c1', 'body-c1'],
    ['no ids without a card id', { body: 'B' }, null, null],
  ])('sets %s', (_name, props, headerId, bodyId) => {
    const { find } = renderCard(props);
    expect(find('.tl-card__titles')?.getAttribute('id') ?? null).toBe(headerId);
    expect(find('.tl-card__body')?.getAttribute('id') ?? null).toBe(bodyId);
  });

  it.each([
    ['not expandable by default', {}, false, null],
    ['expandable and closed', { expandable: true }, true, false],
    ['expandable and open', { expandable: true, expanded: true }, true, true],
  ])('is %s', (_name, props, wantDetails, wantOpen) => {
    const details = renderCard({ body: 'B', ...props }).find('details');
    expect(details !== null).toBe(wantDetails);
    if (details !== null) {
      expect((details as HTMLDetailsElement).open).toBe(wantOpen);
      expect(details.querySelector('summary .tl-card__title')).toHaveTextContent('Header');
      expect(details.querySelector('.tl-card__body-text')).toHaveTextContent('B');
    }
  });
});
