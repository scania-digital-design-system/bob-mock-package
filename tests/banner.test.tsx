import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Banner, type BannerProps } from '../src';

// Expected behaviour is Tegel's tds-banner at @scania/tegel@1.66.1
// (packages/core/src/components/banner/banner.tsx). The hidden state is the hidden
// attribute: isHidden sets it, and the close button sets it in the DOM.

function renderBanner(props: BannerProps) {
  const { container } = render(<Banner header="Maintenance" {...props} />);
  const banner = container.firstElementChild as HTMLElement;
  return { banner, find: (selector: string) => banner.querySelector(selector) };
}

describe('Banner matches tds-banner', () => {
  it.each<[string, BannerProps, string, string]>([
    ['a polite banner by default', {}, 'banner', 'polite'],
    ['an assertive alert', { roleType: 'alert' }, 'alert', 'assertive'],
    ['a polite region', { roleType: 'region' }, 'region', 'polite'],
  ])('is %s', (_name, props, role, live) => {
    const { banner } = renderBanner(props);
    expect(banner).toHaveAttribute('role', role);
    expect(banner).toHaveAttribute('aria-live', live);
  });

  it.each<[string, BannerProps, boolean]>([
    ['no icon on the default variant', {}, false],
    ['an icon on error', { variant: 'error' }, true],
    ['an icon on information', { variant: 'information' }, true],
    ['a named icon', { icon: 'warning' }, true],
    ['no icon for a name the cell does not carry', { icon: 'truck' }, false],
  ])('shows %s', (_name, props, want) => {
    expect(renderBanner(props).find('.tl-banner__icon') !== null).toBe(want);
  });

  it('renders the header, subheader and actions', () => {
    const { find } = renderBanner({ subheader: 'Tonight', actions: <a href="/more">More</a> });
    expect(find('.tl-banner__header')).toHaveTextContent('Maintenance');
    expect(find('.tl-banner__subheader')).toHaveTextContent('Tonight');
    expect(find('.tl-banner__actions')).toHaveTextContent('More');
  });

  it('hides on close and sends tdsClose with the banner id', () => {
    const onTdsClose = vi.fn();
    const { banner } = renderBanner({ bannerId: 'b1', onTdsClose });
    fireEvent.click(screen.getByRole('button', { name: 'Close banner' }));
    expect(banner).not.toBeVisible();
    expect(banner).toHaveAttribute('aria-hidden', 'true');
    const event = onTdsClose.mock.calls[0]?.[0] as CustomEvent;
    expect(event.detail).toEqual({ bannerId: 'b1' });
  });

  it('stays visible when the listener prevents tdsClose', () => {
    const { banner } = renderBanner({ onTdsClose: (event) => event.preventDefault() });
    fireEvent.click(screen.getByRole('button', { name: 'Close banner' }));
    expect(banner).toHaveAttribute('aria-hidden', 'false');
  });

  it('starts hidden with isHidden', () => {
    expect(renderBanner({ isHidden: true }).banner).toHaveAttribute('hidden');
  });

  it('shows again when isHidden changes after a close', () => {
    const { container, rerender } = render(<Banner header="Maintenance" />);
    fireEvent.click(screen.getByRole('button', { name: 'Close banner' }));
    rerender(<Banner header="Maintenance" isHidden />);
    rerender(<Banner header="Maintenance" isHidden={false} />);
    expect(container.firstElementChild).not.toHaveAttribute('hidden');
  });
});
