import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Message, type MessageProps } from '../src';

// Expected behaviour is Tegel's tds-message at @scania/tegel@1.66.1
// (packages/core/src/components/message/message.tsx), with the default slot as children.

function renderMessage(props: MessageProps) {
  const { container } = render(<Message {...props}>Extended text</Message>);
  const message = container.firstElementChild as HTMLElement;
  return { message, find: (selector: string) => message.querySelector(selector) };
}

describe('Message matches tds-message', () => {
  it.each<[string, MessageProps, string[]]>([
    [
      'information and not minimal by default',
      {},
      ['tl-message--information', 'tl-message--minimal-false'],
    ],
    ['each variant', { variant: 'error' }, ['tl-message--error']],
    ['minimal when asked', { minimal: true }, ['tl-message--minimal-true']],
  ])('is %s', (_name, props, wantClasses) => {
    expect(renderMessage(props).message).toHaveClass('tl-message', ...wantClasses);
  });

  it.each<[string, MessageProps, string]>([
    ['a dialog by default', {}, 'dialog'],
    ['an alertdialog when asked', { tdsAlertDialog: 'alertdialog' }, 'alertdialog'],
  ])('is %s', (_name, props, role) => {
    expect(renderMessage(props).message).toHaveAttribute('role', role);
  });

  it.each<[string, MessageProps, string]>([
    ['the header', { header: 'Saved', tdsAriaLabel: 'Status' }, 'Saved'],
    ['tdsAriaLabel without a header', { tdsAriaLabel: 'Status' }, 'Status'],
    ['the variant without either', { variant: 'warning' }, 'warning message'],
  ])('is labelled by %s', (_name, props, want) => {
    expect(renderMessage(props).message).toHaveAttribute('aria-label', want);
  });

  it.each<[string, MessageProps, boolean]>([
    ['shows an icon by default', {}, true],
    ['hides the icon with noIcon', { noIcon: true }, false],
  ])('%s', (_name, props, want) => {
    expect(renderMessage(props).find('.tl-message__icon') !== null).toBe(want);
  });

  it('draws a different icon for each variant', () => {
    const variants = ['information', 'error', 'warning', 'success'] as const;
    const paths = variants.map((variant) =>
      renderMessage({ variant }).find('.tl-message__icon path')?.getAttribute('d'),
    );
    expect(new Set(paths).size).toBe(variants.length);
  });

  it.each<[string, MessageProps, boolean, boolean]>([
    ['the header and the extended text', { header: 'Saved' }, true, true],
    ['no header without one', {}, false, true],
    ['no extended text when minimal', { header: 'Saved', minimal: true }, true, false],
  ])('renders %s', (_name, props, wantHeader, wantExtended) => {
    const { find } = renderMessage(props);
    expect(find('.tl-message__header') !== null).toBe(wantHeader);
    expect(find('.tl-message__extended') !== null).toBe(wantExtended);
  });

  it('puts children in the extended text', () => {
    renderMessage({});
    expect(screen.getByText('Extended text')).toHaveClass('tl-message__extended');
  });
});
