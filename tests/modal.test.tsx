import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { Modal, type ModalProps } from '../src';

// Expected behaviour is Tegel's tds-modal at @scania/tegel@1.66.1
// (packages/core/src/components/modal/). The cell is a native <dialog>, which holds the
// open state. jsdom has no showModal() or close(), so they are stubbed here.

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
});

function renderModal(props: ModalProps) {
  const result = render(<Modal header="Title" body="Body text" {...props} />);
  return {
    ...result,
    dialog: result.container.querySelector('dialog') as HTMLDialogElement,
  };
}

describe('Modal matches tds-modal', () => {
  it.each<[string, ModalProps, string[]]>([
    ['md and static by default', {}, ['tl-modal--md', 'tl-modal--actions-static']],
    ['lg', { size: 'lg' }, ['tl-modal--lg']],
    ['sticky', { actionsPosition: 'sticky' }, ['tl-modal--actions-sticky']],
  ])('is %s', (_name, props, want) => {
    expect(renderModal(props).dialog).toHaveClass('tl-modal', ...want);
  });

  it.each<[string, ModalProps, string]>([
    ['a dialog by default', {}, 'dialog'],
    ['an alert dialog when asked', { tdsAlertDialog: 'alertdialog' }, 'alertdialog'],
  ])('is %s', (_name, props, want) => {
    const { dialog } = renderModal(props);
    expect(dialog).toHaveAttribute('role', want);
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('names the dialog and renders a text header as a heading', () => {
    const { dialog } = renderModal({});
    expect(dialog).toHaveAttribute('aria-label', 'Title');
    expect(screen.getByRole('heading', { level: 1, hidden: true })).toHaveTextContent('Title');
  });

  it('renders a header node as it is', () => {
    renderModal({ header: <h2>Node title</h2> });
    expect(screen.getByRole('heading', { level: 2, hidden: true })).toHaveTextContent('Node title');
  });

  it.each<[string, ModalProps, boolean]>([
    ['with actions', { actions: <button type="button">Save</button> }, true],
    ['without actions', {}, false],
  ])('renders the actions part only %s', (_name, props, want) => {
    const { container } = renderModal(props);
    expect(container.querySelector('.tl-modal__actions') !== null).toBe(want);
  });

  it.each<[string, ModalProps, boolean]>([
    ['by default', {}, true],
    ['not when closable is false', { closable: false }, false],
  ])('has a close button %s', (_name, props, want) => {
    renderModal(props);
    expect(screen.queryByRole('button', { name: 'close', hidden: true }) !== null).toBe(want);
  });

  it('follows the show prop', () => {
    const { dialog, rerender } = renderModal({});
    expect(dialog.open).toBe(false);
    rerender(<Modal header="Title" show />);
    expect(dialog.open).toBe(true);
    rerender(<Modal header="Title" show={false} />);
    expect(dialog.open).toBe(false);
  });

  it('closes from the close button and sends a cancelable tdsClose', () => {
    const onTdsClose = vi.fn();
    const { dialog } = renderModal({ show: true, onTdsClose });
    fireEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(dialog.open).toBe(false);
    const event = onTdsClose.mock.calls[0]?.[0] as CustomEvent;
    expect(event.type).toBe('tdsClose');
    expect(event.cancelable).toBe(true);
  });

  it('stays open when the listener prevents tdsClose', () => {
    const { dialog } = renderModal({ show: true, onTdsClose: (event) => event.preventDefault() });
    fireEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(dialog.open).toBe(true);
  });

  it.each<[string, ModalProps, boolean]>([
    ['closes', {}, false],
    ['stays open when prevent is set', { prevent: true }, true],
  ])('on a backdrop click, %s', (_name, props, want) => {
    const { dialog, container } = renderModal({ show: true, ...props });
    fireEvent.click(container.querySelector('.tl-modal__backdrop') as HTMLElement);
    expect(dialog.open).toBe(want);
  });

  it.each<[string, ModalProps, boolean]>([
    ['closes', {}, false],
    ['stays open when prevent is set', { prevent: true }, true],
  ])('on Escape, %s', (_name, props, want) => {
    const { dialog } = renderModal({ show: true, ...props });
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(dialog, cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(dialog.open).toBe(want);
  });

  it('closes from a data-dismiss-modal element', () => {
    const { dialog } = renderModal({
      show: true,
      actions: (
        <button type="button" data-dismiss-modal>
          Cancel
        </button>
      ),
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(dialog.open).toBe(false);
  });

  it.each<[string, (button: HTMLElement) => ModalProps]>([
    ['selector', () => ({ selector: '#open-modal' })],
    ['referenceEl', (button) => ({ referenceEl: button })],
  ])('opens and closes from the %s element, with a cancelable tdsOpen', (_name, reference) => {
    const button = document.body.appendChild(
      Object.assign(document.createElement('button'), { id: 'open-modal' }),
    );
    const onTdsOpen = vi.fn();
    const { dialog, unmount } = renderModal({ ...reference(button), onTdsOpen });
    fireEvent.click(button);
    expect(dialog.open).toBe(true);
    const event = onTdsOpen.mock.calls[0]?.[0] as CustomEvent;
    expect(event.cancelable).toBe(true);
    fireEvent.click(button);
    expect(dialog.open).toBe(false);
    unmount();
    fireEvent.click(button);
    expect(onTdsOpen).toHaveBeenCalledOnce();
    button.remove();
  });

  it('stays closed when the listener prevents tdsOpen', () => {
    const button = document.body.appendChild(
      Object.assign(document.createElement('button'), { id: 'open-modal' }),
    );
    const { dialog } = renderModal({
      selector: '#open-modal',
      onTdsOpen: (event) => event.preventDefault(),
    });
    fireEvent.click(button);
    expect(dialog.open).toBe(false);
    button.remove();
  });
});
