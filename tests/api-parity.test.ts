import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cellDirs, publicApiSurface } from './support/cells';
import {
  tegelEvents,
  tegelHasComponent,
  tegelInterfaceName,
  tegelProps,
} from './support/tegel-types';

// Each cell's public API (api.json) must equal Tegel's props and events for the same
// component in @scania/tegel@1.66.1, apart from the departures listed here. Every entry
// must also be explained in docs/findings/<component>.md.

// Out of scope for every component (ADR 0002 D8).
const OUT_OF_SCOPE = ['modeVariant', 'animation'];

const DEPARTURES: Record<string, { dropped?: string[]; added?: string[] }> = {
  // The icon slot becomes a prop; onClick is the native event Tegel's types omit.
  button: { added: ['icon', 'onClick'] },
  // The slotted <a> is rendered by the cell, so its attributes and content are props.
  link: { added: ['href', 'target', 'children'] },
  // Tegel's named slots become props.
  card: { added: ['thumbnail', 'bodyImage', 'body', 'actions'] },
  block: { added: ['children'] },
  tag: { added: ['prefix'] },
  message: { added: ['children'] },
  breadcrumbs: { added: ['children'] },
  breadcrumb: { added: ['children'] },
  stepper: { added: ['children'] },
  step: { added: ['label'] },
  footer: { added: ['top', 'start', 'end', 'copyright'] },
  'footer-group': { added: ['title', 'children'] },
  'footer-item': { added: ['children'] },
  // Element methods (@Method) need a ref handle, which a cell cannot expose.
  checkbox: { added: ['label'], dropped: ['focusElement', 'toggleCheckbox'] },
  'radio-button': { added: ['label'], dropped: ['focusElement'] },
  toggle: { added: ['label'], dropped: ['focusElement', 'toggle'] },
  chip: { added: ['prefix', 'label', 'suffix'] },
  textarea: { dropped: ['focusElement'] },
};

// Read by path: the package's "exports" map does not expose this file.
const dts = readFileSync(
  join(__dirname, '..', 'node_modules', '@scania', 'tegel', 'dist', 'types', 'components.d.ts'),
  'utf8',
);

describe('tegel-types', () => {
  const fixture = `export namespace Components {
    interface TdsThing {
        "size": 'lg' | 'sm';
        "label"?: string;
    }
}
declare namespace LocalJSX {
    interface TdsThing {
        "size"?: 'lg' | 'sm';
        "onTdsClick"?: (event: CustomEvent<{ id: string }>) => void;
        "onTdsChange"?: (event: CustomEvent<void>) => void;
    }
}`;
  it.each([
    ['props', tegelProps(fixture, 'TdsThing'), ['size', 'label']],
    ['events', tegelEvents(fixture, 'TdsThing'), ['onTdsClick', 'onTdsChange']],
    ['an unknown tag', tegelProps(fixture, 'TdsOther'), []],
  ])('reads %s', (_name, got, want) => {
    expect(got).toEqual(want);
  });

  it.each([
    ['badge', 'TdsBadge'],
    ['text-field', 'TdsTextField'],
  ])('names %s %s', (component, want) => {
    expect(tegelInterfaceName(component)).toBe(want);
  });

  it.each([
    ['a component with props', 'TdsThing', true],
    ['a component without props', 'TdsEmpty', true],
    ['an unknown tag', 'TdsOther', false],
  ])('finds %s', (_name, tag, want) => {
    const withEmpty = fixture.replace(
      'export namespace Components {',
      'export namespace Components {\n    interface TdsEmpty {\n    }',
    );
    expect(tegelHasComponent(withEmpty, tag)).toBe(want);
  });
});

describe('cells expose the Tegel API', () => {
  const cells = cellDirs();
  if (cells.length === 0) {
    it.todo('no cells under cells/ yet');
    return;
  }
  it.each(cells)('$id', ({ dir, component }) => {
    const tag = tegelInterfaceName(component);
    expect(tegelHasComponent(dts, tag), `${tag} not found in @scania/tegel`).toBe(true);
    const tegel = [...tegelProps(dts, tag), ...tegelEvents(dts, tag)];
    const { dropped = [], added = [] } = DEPARTURES[component] ?? {};
    const want = [
      ...tegel.filter((name) => !OUT_OF_SCOPE.includes(name) && !dropped.includes(name)),
      ...added,
    ];
    expect([...publicApiSurface(dir)].sort()).toEqual(want.sort());
  });
});
