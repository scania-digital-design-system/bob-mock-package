import { readFileSync } from 'node:fs';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon, type IconProps } from '../src';

// Expected behaviour is Tegel's tds-icon at @scania/tegel@1.66.1
// (packages/core/src/components/icon/). The path comes from the icon's path token
// (--icon-<name>-d) through the CSS `d` property, as Tegel's --tds-icon-<name>-d.

function renderIcon(props: IconProps) {
  const { container } = render(<Icon {...props} />);
  return container.querySelector('svg') as SVGSVGElement;
}

describe('Icon matches tds-icon', () => {
  it.each<[string, IconProps, string]>([
    ['truck by default', {}, 'tl-icon--truck'],
    ['the named icon', { name: 'chevron_down' }, 'tl-icon--chevron_down'],
  ])('shows %s', (_name, props, want) => {
    expect(renderIcon(props)).toHaveClass('tl-icon', want);
  });

  it.each<[string, IconProps, string]>([
    ['16px by default', {}, '16px'],
    ['the given size', { size: '32px' }, '32px'],
  ])('is %s', (_name, props, want) => {
    const svg = renderIcon(props);
    expect(svg).toHaveAttribute('width', want);
    expect(svg).toHaveAttribute('height', want);
    expect(svg).toHaveAttribute('viewBox', '0 0 32 32');
  });

  it('names and describes the image with a title and a description', () => {
    const svg = renderIcon({ name: 'bus', svgTitle: 'Bus', svgDescription: 'A city bus' });
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAccessibleName('Bus');
    expect(svg).toHaveAccessibleDescription('A city bus');
    expect(svg).toHaveAttribute('aria-labelledby', 'title-bus');
  });

  it.each<[string, IconProps, string]>([
    ['shown to assistive technology by default', {}, 'false'],
    ['hidden when tdsAriaHidden is set', { tdsAriaHidden: true }, 'true'],
  ])('is %s', (_name, props, want) => {
    expect(renderIcon(props)).toHaveAttribute('aria-hidden', want);
  });

  it('has a path token and a rule for every icon name', () => {
    const payload = JSON.parse(readFileSync('payloads/icon.json', 'utf8'));
    const names: string[] = payload.surface.properties[0].values;
    const css = readFileSync('cells/react/icon/scania/v1/component.css', 'utf8');
    const tokens = readFileSync('tokens/scania.css', 'utf8');
    expect(names).toHaveLength(263);
    for (const name of names) {
      expect(css).toContain(`.tl-icon--${name} .tl-icon__path {\n  d: var(--icon-${name}-d);`);
      expect(tokens).toContain(`--icon-${name}-d: path('M`);
    }
  });
});
