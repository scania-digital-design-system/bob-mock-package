import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { COMPONENTS } from '../build/css-bundle';
import {
  type CellSource,
  cellDefaults,
  propsFile,
  propsSource,
  propType,
  type SurfaceProperty,
} from '../build/prop-types';
import { publicApiSurface, readCellFile } from './support/cells';

// The generator (ADR 0005 D4), and the committed src/props.gen.ts it must match.
// `npm run types` rewrites that file.

const ROOT = join(__dirname, '..');

describe('propType', () => {
  it.each<[string, SurfaceProperty, string]>([
    [
      'a variant is a union',
      { name: 'size', type: 'VARIANT', values: ['sm', 'lg'] },
      "'sm' | 'lg'",
    ],
    ['a boolean', { name: 'disabled', type: 'BOOLEAN', values: ['true', 'false'] }, 'boolean'],
    ['text is a string', { name: 'text', type: 'TEXT', values: [] }, 'string'],
    [
      'an instance swap is a node',
      { name: 'icon', type: 'INSTANCE_SWAP', values: [] },
      'ReactNode',
    ],
  ])('maps %s', (_name, property, want) => {
    expect(propType('badge', property.name, property)).toBe(want);
  });

  it.each([
    ['button', 'onClick', 'MouseEventHandler<HTMLButtonElement>'],
    ['card', 'onTdsClick', '(event: CustomEvent<{ cardId: string }>) => void'],
  ])('takes %s %s from the overrides', (component, name, want) => {
    expect(propType(component, name, undefined)).toBe(want);
  });

  it.each<[string, string, SurfaceProperty | undefined, string]>([
    ['a prop with no type', 'badge', undefined, 'badge.onClick: no payload property'],
    [
      'a variant with no values',
      'badge',
      { name: 'onClick', type: 'VARIANT', values: [] },
      'has no values',
    ],
    [
      'an unknown type',
      'badge',
      { name: 'onClick', type: 'FLOAT', values: [] },
      'unknown property type FLOAT',
    ],
  ])('rejects %s', (_name, component, property, want) => {
    expect(() => propType(component, 'onClick', property)).toThrow(want);
  });
});

describe('cellDefaults', () => {
  it.each([
    ['one line', "function Spinner({ size = 'lg', variant }) {", { size: "'lg'" }],
    [
      'several lines',
      'function Link({\n  href,\n  disabled = false,\n  underline = true,\n}) {',
      { disabled: 'false', underline: 'true' },
    ],
    ['no defaults', 'function Badge({ value }) {', {}],
    ['a rest element', "function Badge({ size = 'sm', ...rest }) {", { size: "'sm'" }],
    [
      'a relaxed import first',
      "import { useState } from 'react';\n\nfunction Tabs({ size = 'lg' }) {",
      { size: "'lg'" },
    ],
    [
      'a renamed prop',
      "function Datetime({ state: initialState = 'none' }) {",
      { state: "'none'" },
    ],
    [
      'braces and commas inside a string',
      "function TableFooter({\n  label = 'of {pages} pages',\n  values = '10,25,50',\n}) {",
      { label: "'of {pages} pages'", values: "'10,25,50'" },
    ],
  ])('reads %s', (_name, jsx, want) => {
    expect(cellDefaults(jsx)).toEqual(want);
  });

  it('rejects a cell without a destructured parameter', () => {
    expect(() => cellDefaults('function Badge(props) {')).toThrow('function <Name>({');
  });
});

describe('propsSource', () => {
  it('writes the surface in order, with defaults as doc comments', () => {
    const cell: CellSource = {
      component: 'badge',
      properties: [
        { name: 'value', type: 'TEXT', values: [] },
        { name: 'size', type: 'VARIANT', values: ['lg', 'sm'] },
      ],
      surface: ['value', 'size'],
      jsx: "function Badge({ value, size = 'lg' }) {",
    };
    expect(propsSource(cell)).toBe(
      "export type BadgeProps = {\n  value?: string;\n  /** @default 'lg' */\n  size?: 'lg' | 'sm';\n};\n",
    );
  });
});

describe('propsFile', () => {
  it.each([
    ['no React import without React types', 'TEXT', ''],
    [
      'imports only the React types it uses',
      'INSTANCE_SWAP',
      "import type { ReactNode } from 'react';\n",
    ],
  ])('has %s', (_name, type, wantImport) => {
    const cell: CellSource = {
      component: 'badge',
      properties: [{ name: 'value', type, values: [] }],
      surface: ['value'],
      jsx: 'function Badge({ value }) {',
    };
    expect(propsFile([cell])).toContain(`Do not edit.\n${wantImport}\n`);
  });
});

describe('src/props.gen.ts', () => {
  it('is current', async () => {
    const cells = COMPONENTS.map((component): CellSource => {
      const dir = join(ROOT, 'cells', 'react', component, 'scania', 'v1');
      const payload = JSON.parse(
        readFileSync(join(ROOT, 'payloads', `${component}.json`), 'utf8'),
      ) as { surface: { properties: SurfaceProperty[] } };
      return {
        component,
        properties: payload.surface.properties,
        surface: publicApiSurface(dir),
        jsx: readCellFile(dir, 'component.jsx'),
      };
    });
    await expect(propsFile(cells)).toMatchFileSnapshot('../src/props.gen.ts');
  });
});
