import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { bundleCss, COMPONENTS, cssSources } from '../build/css-bundle';
import { pascalCase } from '../rules/prompt-rules';
import * as pkg from '../src';
import { cellDirs } from './support/cells';

// The package surface (ADR 0005 D2, D3): one export per cell and one stylesheet.

const ROOT = join(__dirname, '..');
const read = (path: string) => readFileSync(join(ROOT, path), 'utf8');

describe('bundleCss', () => {
  it.each([
    ['labels one file', { 'a.css': '.a {}\n' }, '/* a.css */\n.a {}\n'],
    ['adds a missing final newline', { 'a.css': '.a {}' }, '/* a.css */\n.a {}\n'],
    [
      'keeps the source order',
      { 'b.css': '.b {}\n', 'a.css': '.a {}\n' },
      '/* b.css */\n.b {}\n\n/* a.css */\n.a {}\n',
    ],
    ['keeps an empty file', { 'a.css': '' }, '/* a.css */\n\n'],
  ])('%s', (_name, files: Record<string, string>, want) => {
    expect(bundleCss(Object.keys(files), (path) => files[path] ?? '')).toBe(want);
  });
});

describe('cssSources', () => {
  it('puts the tokens first, then each component in order', () => {
    expect(cssSources(['badge', 'card'])).toEqual([
      'tokens/scania.css',
      'cells/react/badge/scania/v1/component.css',
      'cells/react/card/scania/v1/component.css',
    ]);
  });
});

describe('package', () => {
  const reactCells = cellDirs()
    .filter((cell) => cell.id.startsWith('react/'))
    .map((cell) => cell.component);

  it('lists every React cell once', () => {
    expect([...COMPONENTS].sort()).toEqual([...reactCells].sort());
  });

  it('exports one component per cell, named in PascalCase', () => {
    expect(Object.keys(pkg).sort()).toEqual(COMPONENTS.map(pascalCase).sort());
    for (const component of Object.values(pkg)) {
      expect(typeof component).toBe('function');
    }
  });

  it('ships the tokens and every component.css unchanged', () => {
    const bundle = bundleCss(cssSources(COMPONENTS), read);
    for (const path of cssSources(COMPONENTS)) {
      expect(bundle).toContain(read(path));
    }
  });
});
