import { describe, expect, it } from 'vitest';
import { isCellComponent, withDefaultExport } from '../build/cell-export';

describe('isCellComponent', () => {
  it.each([
    ['a cell component', '/repo/cells/react/badge/scania/v1/component.jsx', true],
    ['a Windows path', 'C:\\repo\\cells\\react\\badge\\scania\\v1\\component.jsx', true],
    ['a later version', '/repo/cells/react/card/scania/v12/component.jsx', true],
    ['the usage example', '/repo/cells/react/badge/scania/v1/usage.jsx', false],
    ['a file outside cells', '/repo/src/component.jsx', false],
    ['a path without a version', '/repo/cells/react/badge/scania/component.jsx', false],
  ])('%s', (_name, id, want) => {
    expect(isCellComponent(id)).toBe(want);
  });
});

describe('withDefaultExport', () => {
  it.each([
    [
      'appends the export',
      'function Badge({ value }) {\n  return null;\n}\n',
      'function Badge({ value }) {\n  return null;\n}\nexport default Badge;\n',
    ],
    [
      'handles no trailing newline',
      'function Card({}) {}',
      'function Card({}) {}\nexport default Card;\n',
    ],
    [
      'handles leading blank lines',
      '\nfunction Link({}) {}',
      '\nfunction Link({}) {}\nexport default Link;\n',
    ],
    [
      'handles a relaxed import before the function',
      "import { useState } from 'react';\n\nfunction Tabs({}) {}",
      "import { useState } from 'react';\n\nfunction Tabs({}) {}\nexport default Tabs;\n",
    ],
  ])('%s', (_name, code, want) => {
    expect(withDefaultExport(code)).toBe(want);
  });

  it('rejects a cell that is not a named function', () => {
    expect(() => withDefaultExport('const Badge = () => null;')).toThrow('function <Name>(');
  });
});
