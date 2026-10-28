import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Accordion, AccordionItem, type AccordionItemProps } from '../src';

// Expected behaviour is Tegel's tds-accordion and tds-accordion-item at
// @scania/tegel@1.66.1 (packages/core/src/components/accordion/). The item keeps its
// expanded state in the button's aria-expanded: the expanded prop sets it, and a click
// sets it in the DOM.

function renderItem(props: AccordionItemProps) {
  const { container } = render(
    <Accordion>
      <AccordionItem header="Details" {...props}>
        Panel text
      </AccordionItem>
    </Accordion>,
  );
  return {
    accordion: container.firstElementChild as HTMLElement,
    item: container.querySelector('.tl-accordion-item') as HTMLElement,
    button: screen.getByRole('button', { name: 'Details' }),
    panel: screen.getByRole('region', { hidden: true }),
  };
}

describe('Accordion matches tds-accordion', () => {
  it.each([
    ['a last border by default', {}, 'tl-accordion--hide-last-border-false'],
    ['no last border when asked', { hideLastBorder: true }, 'tl-accordion--hide-last-border-true'],
  ])('has %s', (_name, props, want) => {
    const { container } = render(<Accordion {...props} />);
    expect(container.firstElementChild).toHaveClass('tl-accordion', want);
  });
});

describe('AccordionItem matches tds-accordion-item', () => {
  it.each<[string, AccordionItemProps, string[]]>([
    [
      'end, enabled and padded by default',
      {},
      [
        'tl-accordion-item--end',
        'tl-accordion-item--disabled-false',
        'tl-accordion-item--padding-reset-false',
      ],
    ],
    ['start', { expandIconPosition: 'start' }, ['tl-accordion-item--start']],
    ['disabled', { disabled: true }, ['tl-accordion-item--disabled-true']],
  ])('is %s', (_name, props, wantClasses) => {
    expect(renderItem(props).item).toHaveClass('tl-accordion-item', ...wantClasses);
  });

  it('is a heading at the given level around the button', () => {
    const { button } = renderItem({ ariaLevelValue: '3' });
    expect(button.parentElement).toHaveAttribute('role', 'heading');
    expect(button.parentElement).toHaveAttribute('aria-level', '3');
  });

  it('links the button and the panel by id', () => {
    const { button, panel } = renderItem({});
    expect(button).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', button.id);
  });

  it.each<[string, AccordionItemProps, string]>([
    ['collapsed by default', {}, 'false'],
    ['expanded when asked', { expanded: true }, 'true'],
  ])('starts %s', (_name, props, want) => {
    expect(renderItem(props).button).toHaveAttribute('aria-expanded', want);
  });

  it('toggles on click and sends tdsToggle with the new state', () => {
    const onTdsToggle = vi.fn();
    const { button } = renderItem({ onTdsToggle });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    const event = onTdsToggle.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe('tdsToggle');
    expect(event.detail).toEqual({ expanded: true });
  });

  it('stays collapsed when the listener prevents tdsToggle', () => {
    const { button } = renderItem({ onTdsToggle: (event) => event.preventDefault() });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not toggle when disabled', () => {
    const { button } = renderItem({ disabled: true });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('follows a change of expanded after a click', () => {
    const { rerender } = render(<AccordionItem header="Details" />);
    const button = screen.getByRole('button', { name: 'Details' });
    fireEvent.click(button);
    rerender(<AccordionItem header="Details" expanded />);
    rerender(<AccordionItem header="Details" expanded={false} />);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps its generated ids across renders', () => {
    const { rerender } = render(<AccordionItem header="Details" />);
    const button = screen.getByRole('button', { name: 'Details' });
    const id = button.id;
    rerender(<AccordionItem header="Details" disabled={false} />);
    expect(button.id).toBe(id);
    expect(id).toMatch(/^tl-accordion-item-.+-header$/);
  });
});
