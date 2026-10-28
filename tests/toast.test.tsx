import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Toast, type ToastProps } from '../src';

// Expected behaviour is Tegel's tds-toast at @scania/tegel@1.66.1
// (packages/core/src/components/toast/toast.tsx). The hidden state uses useState
// (relaxation react-hooks, docs/findings/README.md).

function renderToast(props: ToastProps) {
  const { container } = render(
    <Toast header="Saved" tdsCloseAriaLabel="Close message" {...props} />,
  );
  const toast = container.firstElementChild as HTMLElement;
  return { toast, find: (selector: string) => toast.querySelector(selector) };
}

describe('Toast matches tds-toast', () => {
  it.each<[string, ToastProps, string, string, string]>([
    ['a polite information alert by default', {}, 'alert', 'polite', 'tl-toast--information'],
    ['a status', { toastRole: 'status' }, 'status', 'polite', 'tl-toast--information'],
    ['assertive', { tdsAriaLive: 'assertive' }, 'alert', 'assertive', 'tl-toast--information'],
    ['an error', { variant: 'error' }, 'alert', 'polite', 'tl-toast--error'],
  ])('is %s', (_name, props, role, live, wantClass) => {
    const { toast } = renderToast(props);
    expect(toast).toHaveAttribute('role', role);
    expect(toast).toHaveAttribute('aria-live', live);
    expect(toast).toHaveClass('tl-toast', wantClass);
  });

  it('draws a different icon for each variant', () => {
    const variants = ['information', 'error', 'warning', 'success'] as const;
    const paths = variants.map((variant) =>
      renderToast({ variant }).find('.tl-toast__icon path')?.getAttribute('d'),
    );
    expect(new Set(paths).size).toBe(variants.length);
  });

  it.each<[string, ToastProps, boolean]>([
    ['a close button by default', {}, true],
    ['no close button when not closable', { closable: false }, false],
  ])('has %s', (_name, props, want) => {
    renderToast(props);
    expect(screen.queryByRole('button', { name: 'Close message' }) !== null).toBe(want);
  });

  it('hides on close and sends tdsClose with the toast id', () => {
    const onTdsClose = vi.fn();
    const { toast } = renderToast({ toastId: 't1', onTdsClose });
    fireEvent.click(screen.getByRole('button', { name: 'Close message' }));
    expect(toast).toHaveAttribute('hidden');
    const event = onTdsClose.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail).toEqual({ toastId: 't1' });
  });

  it('stays visible when the listener prevents tdsClose', () => {
    const { toast } = renderToast({ onTdsClose: (event) => event.preventDefault() });
    fireEvent.click(screen.getByRole('button', { name: 'Close message' }));
    expect(toast).not.toHaveAttribute('hidden');
  });
});
