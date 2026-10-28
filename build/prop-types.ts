import { pascalCase } from '../rules/prompt-rules';

// Prop types for the package, generated from what BOB knows about each cell (ADR 0005 D4):
// the payload's surface properties, the surface in api.json, and the defaults in the
// cell's destructuring. tests/prop-types.test.ts writes the result to src/props.gen.ts.

export type SurfaceProperty = { name: string; type: string; values: string[] };

export type CellSource = {
  component: string;
  properties: SurfaceProperty[];
  surface: string[];
  jsx: string;
};

// Props that only the cell declares, so no payload property types them.
export const OVERRIDES: Record<string, Record<string, string>> = {
  button: { onClick: 'MouseEventHandler<HTMLButtonElement>' },
  card: { onTdsClick: '(event: CustomEvent<{ cardId: string }>) => void' },
  checkbox: {
    onTdsChange:
      '(event: CustomEvent<{ checkboxId: string; checked: boolean; indeterminate: boolean; value?: string }>) => void',
    onTdsFocus: '(event: CustomEvent<FocusEvent>) => void',
    onTdsBlur: '(event: CustomEvent<FocusEvent>) => void',
  },
  'radio-button': {
    onTdsChange: '(event: CustomEvent<{ radioId: string; value: string | undefined }>) => void',
  },
  toggle: { onTdsToggle: '(event: CustomEvent<{ toggleId: string; checked: boolean }>) => void' },
  chip: {
    onTdsChange:
      '(event: CustomEvent<{ chipId: string; value: string | undefined; checked?: boolean }>) => void',
    onTdsClick: '(event: CustomEvent<{ chipId: string }>) => void',
  },
  'accordion-item': { onTdsToggle: '(event: CustomEvent<{ expanded: boolean }>) => void' },
  banner: { onTdsClose: '(event: CustomEvent<{ bannerId: string }>) => void' },
  toast: { onTdsClose: '(event: CustomEvent<{ toastId: string }>) => void' },
  'text-field': {
    onTdsChange: '(event: CustomEvent<Event>) => void',
    onTdsInput: '(event: CustomEvent<InputEvent>) => void',
    onTdsFocus: '(event: CustomEvent<FocusEvent>) => void',
    onTdsBlur: '(event: CustomEvent<FocusEvent>) => void',
    onTdsError:
      "(event: CustomEvent<{ originalValue: string; clampedValue: string; reason: 'min' | 'max' }>) => void",
  },
  textarea: {
    onTdsChange: '(event: CustomEvent<Event>) => void',
    onTdsBlur: '(event: CustomEvent<FocusEvent>) => void',
    onTdsInput: '(event: CustomEvent<InputEvent>) => void',
    onTdsFocus: '(event: CustomEvent<FocusEvent>) => void',
  },
  datetime: {
    customValidator: '(value: string) => boolean',
    onTdsChange: '(event: CustomEvent<Event>) => void',
    onTdsBlur: '(event: CustomEvent<FocusEvent>) => void',
    onTdsFocus: '(event: CustomEvent<MouseEvent>) => void',
    onTdsInput: '(event: CustomEvent<InputEvent>) => void',
  },
  dropdown: {
    onTdsChange: '(event: CustomEvent<{ name: string | undefined; value: string | null }>) => void',
    onTdsFocus: '(event: CustomEvent<FocusEvent>) => void',
    onTdsBlur: '(event: CustomEvent<FocusEvent>) => void',
    onTdsInput: '(event: CustomEvent<InputEvent>) => void',
    onTdsClear: '(event: CustomEvent<{ clearedValue: string }>) => void',
  },
  'dropdown-option': {
    onTdsSelect: '(event: CustomEvent<{ selected: boolean; value: string }>) => void',
  },
  slider: {
    onTdsChange: '(event: CustomEvent<{ value: string }>) => void',
    onTdsInput: '(event: CustomEvent<{ value: string }>) => void',
  },
  modal: {
    referenceEl: 'HTMLElement | null',
    onTdsClose: '(event: CustomEvent<Event>) => void',
    onTdsOpen: '(event: CustomEvent<void>) => void',
  },
  'folder-tabs': { onTdsChange: '(event: CustomEvent<{ selectedTabIndex: number }>) => void' },
  'inline-tabs': { onTdsChange: '(event: CustomEvent<{ selectedTabIndex: number }>) => void' },
  'navigation-tabs': {
    onTdsChange: '(event: CustomEvent<{ selectedTabIndex: number }>) => void',
  },
};

const REACT_TYPES = ['MouseEventHandler', 'ReactNode'];

function bobType({ name, type, values }: SurfaceProperty): string {
  switch (type) {
    case 'VARIANT':
      if (values.length === 0) {
        throw new Error(`${name}: VARIANT property has no values`);
      }
      return values.map((value) => `'${value}'`).join(' | ');
    case 'BOOLEAN':
      return 'boolean';
    case 'TEXT':
      return 'string';
    case 'INSTANCE_SWAP':
      return 'ReactNode';
    default:
      throw new Error(`${name}: unknown property type ${type}`);
  }
}

export function propType(
  component: string,
  name: string,
  property: SurfaceProperty | undefined,
): string {
  if (property !== undefined) {
    return bobType(property);
  }
  const override = OVERRIDES[component]?.[name];
  if (override === undefined) {
    throw new Error(`${component}.${name}: no payload property and no override`);
  }
  return override;
}

// Found on the first line that starts with the function, after any relaxed imports.
const PARAMETER = /^function\s+\w+\s*\(\s*\{([^}]*)\}\s*\)/m;

// Prop name → default value as written in the cell, e.g. size → 'lg'. A renamed prop
// (`state: initialState = 'none'`) keeps its key, as the surface does.
export function cellDefaults(jsx: string): Record<string, string> {
  const pattern = PARAMETER.exec(jsx)?.[1];
  if (pattern === undefined) {
    throw new Error('cell component.jsx must start with "function <Name>({ … })"');
  }
  return Object.fromEntries(
    pattern
      .split(',')
      .map((entry) => entry.split('='))
      .filter((parts) => parts.length > 1)
      .map(([name = '', ...value]) => [name.split(':')[0]?.trim(), value.join('=').trim()]),
  );
}

export function propsSource(cell: CellSource): string {
  const properties = new Map(cell.properties.map((property) => [property.name, property]));
  const defaults = cellDefaults(cell.jsx);
  const lines = cell.surface.map((name) => {
    const doc = name in defaults ? `  /** @default ${defaults[name]} */\n` : '';
    return `${doc}  ${name}?: ${propType(cell.component, name, properties.get(name))};`;
  });
  return `export type ${pascalCase(cell.component)}Props = {\n${lines.join('\n')}\n};\n`;
}

export function propsFile(cells: CellSource[]): string {
  const body = cells.map(propsSource).join('\n');
  const used = REACT_TYPES.filter((type) => body.includes(type));
  const header = '// Generated by `npm run types` (ADR 0005 D4). Do not edit.\n';
  const imports = used.length > 0 ? `import type { ${used.join(', ')} } from 'react';\n\n` : '\n';
  return `${header}${imports}${body}`;
}
