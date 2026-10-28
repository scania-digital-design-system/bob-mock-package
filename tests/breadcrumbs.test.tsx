import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Breadcrumb, type BreadcrumbProps, Breadcrumbs } from '../src';

// Expected behaviour is Tegel's tds-breadcrumbs and tds-breadcrumb at @scania/tegel@1.66.1
// (packages/core/src/components/breadcrumbs/), with the default slots as children.

describe('Breadcrumbs matches tds-breadcrumbs', () => {
  it('is a labelled navigation around a list', () => {
    render(
      <Breadcrumbs tdsAriaLabel="Breadcrumb">
        <Breadcrumb>
          <a href="/">Home</a>
        </Breadcrumb>
      </Breadcrumbs>,
    );
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toHaveClass('tl-breadcrumbs');
    expect(screen.getByRole('list')).toHaveClass('tl-breadcrumbs__list');
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});

describe('Breadcrumb matches tds-breadcrumb', () => {
  function renderBreadcrumb(props: BreadcrumbProps) {
    render(
      <Breadcrumb {...props}>
        <a href="/fleet">Fleet</a>
      </Breadcrumb>,
    );
    const item = screen.getByRole('listitem');
    return { item, inner: item.querySelector('.tl-breadcrumb__item') };
  }

  it.each<[string, BreadcrumbProps, string, string | null]>([
    ['a link by default', {}, 'tl-breadcrumb--current-false', null],
    ['the current page', { current: true }, 'tl-breadcrumb--current-true', 'page'],
  ])('is %s', (_name, props, wantClass, wantCurrent) => {
    const { item, inner } = renderBreadcrumb(props);
    expect(item).toHaveClass('tl-breadcrumb', wantClass);
    expect(inner?.getAttribute('aria-current') ?? null).toBe(wantCurrent);
  });

  it('keeps the consumer link as a direct child', () => {
    const { inner } = renderBreadcrumb({});
    expect(screen.getByRole('link', { name: 'Fleet' }).parentElement).toBe(inner);
  });
});
