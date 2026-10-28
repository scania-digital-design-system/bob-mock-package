import { describe, expect, it } from 'vitest';
import {
  checkPromptRules,
  type Declaration,
  definedClasses,
  expandClassToken,
  literalIn,
  type PromptRuleInput,
} from '../rules/prompt-rules';
import {
  cellDirs,
  documentedRelaxations,
  readCellFile,
  relaxedCells,
  surfaceProperties,
} from './support/cells';

const conforming: PromptRuleInput = {
  component: 'badge',
  markup:
    'function Badge({ value, size }) {\n  return (\n    <div className={`tl-badge tl-badge--${size}`}>\n      <span className="tl-badge__text">{value}</span>\n    </div>\n  );\n}',
  styles: `.tl-badge { background-color: var(--color-badge-background); border-radius: var(--radius-pill); }
.tl-badge--lg { min-width: var(--size-badge-lg); }
.tl-badge--sm { min-width: var(--size-badge-sm); }
.tl-badge__text { font-size: var(--font-size-caption); line-height: var(--font-line-height-badge); }
.tl-context-mes .tl-badge { min-width: var(--size-badge-lg); }
`,
  properties: { size: ['lg', 'sm'] },
};

const withMarkup = (from: string, to: string): PromptRuleInput => ({
  ...conforming,
  markup: conforming.markup.replace(from, to),
});
const withStyles = (extra: string): PromptRuleInput => ({
  ...conforming,
  styles: conforming.styles + extra,
});

describe('checkPromptRules', () => {
  it.each([
    ['a conforming cell', conforming, []],
    ['a wrong function name', withMarkup('function Badge', 'function Pill'), ['function-shape']],
    [
      'props not destructured',
      withMarkup('Badge({ value, size })', 'Badge(props)'),
      ['function-shape'],
    ],
    [
      'an export',
      withMarkup('function Badge', 'export default function Badge'),
      ['function-shape', 'no-module'],
    ],
    [
      'an import',
      { ...conforming, markup: `import x from 'y';\n${conforming.markup}` },
      ['function-shape', 'no-module'],
    ],
    [
      'a style attribute',
      withMarkup('<span ', '<span style={{ color: x }} '),
      ['no-style-attribute'],
    ],
    [
      'class instead of className',
      withMarkup('className="tl-badge__text"', 'class="tl-badge__text"'),
      // React ignores class=, so the element's rule can no longer render either.
      ['class-name-only', 'no-extra-rules'],
    ],
    [
      'a tokens object reference',
      withMarkup('{value}', '{tokens.colorPrimary}'),
      ['no-tokens-object'],
    ],
    [
      'a foreign class prefix',
      withMarkup('tl-badge__text', 'badge-text'),
      ['class-prefix', 'no-extra-rules'],
    ],
    [
      'a rule the markup cannot render',
      withStyles('.tl-badge--xl { min-width: var(--size-badge-lg); }\n'),
      ['no-extra-rules'],
    ],
    ['a hex colour', withStyles('.tl-badge { color: #fff; }\n'), ['no-literal-value']],
    ['a pixel size', withStyles('.tl-badge { padding: 8px; }\n'), ['no-literal-value']],
  ])('%s', (_name, cell, wantRules) => {
    expect(checkPromptRules(cell).map((f) => f.rule)).toEqual(wantRules);
  });
});

describe('expandClassToken', () => {
  it.each([
    ['a plain class', 'tl-badge', { size: ['lg'] }, ['tl-badge']],
    [
      'one interpolation',
      'tl-badge--${size}',
      { size: ['lg', 'sm'] },
      ['tl-badge--lg', 'tl-badge--sm'],
    ],
    [
      'a case-insensitive name',
      'tl-button--${variant}',
      { Variant: ['primary'] },
      ['tl-button--primary'],
    ],
    [
      'a prefixed boolean',
      'tl-button--fullbleed-${fullbleed}',
      { fullbleed: ['true', 'false'] },
      ['tl-button--fullbleed-true', 'tl-button--fullbleed-false'],
    ],
    ['an undeclared name', 'tl-badge--${tone}', { size: ['lg'] }, []],
  ])('%s', (_name, token, properties, want) => {
    expect(expandClassToken(token, properties)).toEqual(want);
  });
});

describe('definedClasses', () => {
  it.each([
    ['simple rules', '.tl-a { x: y; } .tl-a--b { x: y; }', ['tl-a', 'tl-a--b']],
    [
      'pseudo and compound selectors',
      '.tl-a:hover, .tl-a.tl-a--b > .tl-a__c { x: y; }',
      ['tl-a', 'tl-a--b', 'tl-a__c'],
    ],
    ['context scope', '.tl-context-mes .tl-a { x: y; }', ['tl-context-mes', 'tl-a']],
    [
      'keyframes and media are skipped',
      '@keyframes spin { 0% { x: y; } 33.3% { x: y; } } @media (min-width: 1px) { .tl-a { x: y; } }',
      ['tl-a'],
    ],
    ['comments are ignored', '/* .tl-ghost */ .tl-a { x: y; }', ['tl-a']],
  ])('%s', (_name, styles, want) => {
    expect([...definedClasses(styles)]).toEqual(want);
  });
});

describe('literalIn', () => {
  it.each<[string, Declaration, string | undefined]>([
    ['a token', { property: 'color', value: 'var(--color-text-strong)' }, undefined],
    [
      'a token with a literal fallback',
      { property: 'color', value: 'var(--color-text-strong, #000)' },
      undefined,
    ],
    ['a keyword', { property: 'display', value: 'inline-flex' }, undefined],
    ['zero', { property: 'margin', value: '0' }, undefined],
    ['a percentage', { property: 'width', value: '100%' }, undefined],
    ['an angle', { property: 'transform', value: 'scale(-1, 1) rotate(-90deg)' }, undefined],
    [
      'a calc multiplier',
      { property: 'width', value: 'calc(var(--size-spinner-radius) * 2)' },
      undefined,
    ],
    ['transparent', { property: 'background-color', value: 'transparent' }, undefined],
    ['a hex colour', { property: 'color', value: '#0a1f33' }, '#0a1f33'],
    ['an rgb colour', { property: 'box-shadow', value: '0 3px 3px rgb(0 0 0 / 15%)' }, 'rgb('],
    ['a named colour', { property: 'outline-color', value: 'white' }, 'white'],
    ['a pixel size', { property: 'padding', value: 'var(--space-inset-sm) 8px' }, '8px'],
    ['a duration', { property: 'transition', value: 'color 150ms ease' }, '150ms'],
    ['a unitless line height', { property: 'line-height', value: '1.4' }, '1.4'],
    ['an opacity', { property: 'opacity', value: '0.25' }, '0.25'],
    ['a unitless z-index', { property: 'z-index', value: '1' }, undefined],
  ])('%s', (_name, decl, want) => {
    expect(literalIn(decl)).toBe(want);
  });
});

// Every cell in the repo must pass every prompt rule.
function readCell(dir: string, component: string): PromptRuleInput {
  return {
    component,
    markup: readCellFile(dir, 'component.jsx'),
    styles: readCellFile(dir, 'component.css'),
    properties: surfaceProperties(component),
  };
}

// A cell listed in rules/relaxations.json breaks a rule on purpose and is not checked
// here (ADR 0006 D4); its entry in docs/findings/README.md says which rule and why.
describe('cells follow the bootstrap prompt', () => {
  const relaxed = relaxedCells();
  const cells = cellDirs().filter(({ id }) => relaxed[id] === undefined);
  if (cells.length === 0) {
    it.todo('no strict cells under cells/ yet');
    return;
  }
  it.each(cells)('$id', ({ dir, component }) => {
    expect(checkPromptRules(readCell(dir, component))).toEqual([]);
  });
});

describe('rules/relaxations.json', () => {
  const cellIds = cellDirs().map(({ id }) => id);
  const documented = documentedRelaxations();
  const entries = Object.entries(relaxedCells());
  if (entries.length === 0) {
    it.todo('no relaxations yet');
    return;
  }
  it.each(entries)('%s names a cell and documented relaxations', (cellId, ids) => {
    expect(cellIds).toContain(cellId);
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      expect(documented).toContain(id);
    }
  });
});
