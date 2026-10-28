import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  formatToken,
  type Icon,
  iconStylesheet,
  iconToken,
  parseIcons,
  type Token,
  withIconTokens,
} from '../build/icons';

const ROOT = join(__dirname, '..');
const TEGEL = join(ROOT, '..', 'tegel');

const scania = (body: string) => `/**\n * header\n */\n\n:root,\n.scania {\n${body}\n}\n`;

describe('parseIcons', () => {
  it.each<[string, string, Icon[]]>([
    [
      'one icon on one line',
      scania("  --tds-brand-name: 'scania';\n  --tds-icon-truck-d: path('M1 2h3z');"),
      [{ name: 'truck', d: 'M1 2h3z' }],
    ],
    [
      'a path broken over lines, and a name with a hyphen',
      scania("  --tds-icon-arrow-left-d: path(\n    'M4 4h2z'\n  );"),
      [{ name: 'arrow-left', d: 'M4 4h2z' }],
    ],
    [
      'an evenodd icon',
      scania(
        "  --tds-icon-wifi-d: path('M0 0z');\n  --tds-icon-wifi-clip-rule: evenodd;\n  --tds-icon-wifi-fill-rule: evenodd;",
      ),
      [{ name: 'wifi', d: 'M0 0z', fillRule: 'evenodd' }],
    ],
    [
      'the Scania block only',
      `${scania("  --tds-icon-star-d: path('M1 1z');")}\n.traton {\n  --tds-icon-bus-d: path('M2 2z');\n}\n`,
      [{ name: 'star', d: 'M1 1z' }],
    ],
    ['no Scania block', ".traton {\n  --tds-icon-bus-d: path('M2 2z');\n}\n", []],
  ])('reads %s', (_name, scss, want) => {
    expect(parseIcons(scss)).toEqual(want);
  });
});

describe('iconToken', () => {
  it('carries the path as a COLOR token named icon/<name>/d', () => {
    expect(iconToken({ name: 'truck', d: 'M1 2z' })).toEqual({
      name: 'icon/truck/d',
      type: 'COLOR',
      valuesByMode: { scania: "path('M1 2z')" },
    });
  });
});

const token = (scania: string): Token => ({
  name: 'icon/x/d',
  type: 'COLOR',
  valuesByMode: { scania },
});

describe('formatToken', () => {
  it.each<[string, Token, string]>([
    [
      'one line when it fits',
      token('short'),
      '    { "name": "icon/x/d", "type": "COLOR", "valuesByMode": { "scania": "short" } }',
    ],
    [
      'one key per line, values on one line, when only those fit',
      token('p'.repeat(60)),
      `    {\n      "name": "icon/x/d",\n      "type": "COLOR",\n      "valuesByMode": { "scania": "${'p'.repeat(60)}" }\n    }`,
    ],
    [
      'every key on its own line when the values do not fit',
      token('p'.repeat(80)),
      `    {\n      "name": "icon/x/d",\n      "type": "COLOR",\n      "valuesByMode": {\n        "scania": "${'p'.repeat(80)}"\n      }\n    }`,
    ],
  ])('prints %s', (_name, input, want) => {
    expect(formatToken(input)).toBe(want);
  });
});

const PAYLOAD_HEAD =
  '{\n  "variables": [\n    { "name": "size/a", "type": "FLOAT", "valuesByMode": { "scania": "1" } }';
const iconLine = (name: string) =>
  `    { "name": "icon/${name}/d", "type": "COLOR", "valuesByMode": { "scania": "path('M1z')" } }`;

describe('withIconTokens', () => {
  it.each<[string, string, Icon[], string]>([
    [
      'adds the icons after the last variable',
      `${PAYLOAD_HEAD}\n  ]\n}\n`,
      [{ name: 'a', d: 'M1z' }],
      `${PAYLOAD_HEAD},\n${iconLine('a')}\n  ]\n}\n`,
    ],
    [
      'replaces the icons that are there',
      `${PAYLOAD_HEAD},\n${iconLine('old')}\n  ]\n}\n`,
      [
        { name: 'a', d: 'M1z' },
        { name: 'b', d: 'M1z' },
      ],
      `${PAYLOAD_HEAD},\n${iconLine('a')},\n${iconLine('b')}\n  ]\n}\n`,
    ],
  ])('%s', (_name, payload, icons, want) => {
    expect(withIconTokens(payload, icons)).toBe(want);
  });

  it('gives the same text when run twice', () => {
    const once = withIconTokens(`${PAYLOAD_HEAD}\n  ]\n}\n`, [{ name: 'a', d: 'M1z' }]);
    expect(withIconTokens(once, [{ name: 'a', d: 'M1z' }])).toBe(once);
  });

  it('rejects a payload with no variables list', () => {
    expect(() => withIconTokens('{}', [])).toThrow('no closing');
  });
});

describe('iconStylesheet', () => {
  it.each<[string, Icon, string]>([
    [
      'a path',
      { name: 'truck', d: 'M1z' },
      '.tl-icon--truck .tl-icon__path {\n  d: var(--icon-truck-d);\n}\n',
    ],
    [
      'a path with evenodd rules',
      { name: 'wifi', d: 'M1z', fillRule: 'evenodd' },
      '.tl-icon--wifi .tl-icon__path {\n  d: var(--icon-wifi-d);\n  fill-rule: evenodd;\n  clip-rule: evenodd;\n}\n',
    ],
  ])('writes one rule for %s, after the base rules', (_name, icon, want) => {
    const css = iconStylesheet([icon]);
    expect(css.startsWith('.tl-icon {\n')).toBe(true);
    expect(css.endsWith(want)).toBe(true);
  });
});

// The committed files must equal what Tegel's pinned icon tokens give. `npm run icons`
// rewrites them. Needs the Tegel source next to this repo (CLAUDE.md, Workspace).
describe.skipIf(!existsSync(TEGEL))('the icon data', () => {
  const version = (
    JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as {
      devDependencies: Record<string, string>;
    }
  ).devDependencies['@scania/tegel'];
  const icons = parseIcons(
    execFileSync(
      'git',
      ['-C', TEGEL, 'show', `@scania/tegel@${version}:tokens/scss/component/icon.scss`],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 },
    ),
  );

  it('payloads/_tokens.json has the current icon tokens', async () => {
    const payload = readFileSync(join(ROOT, 'payloads', '_tokens.json'), 'utf8');
    await expect(withIconTokens(payload, icons)).toMatchFileSnapshot('../payloads/_tokens.json');
  });

  it("the icon cell's stylesheet has the current rules", async () => {
    await expect(iconStylesheet(icons)).toMatchFileSnapshot(
      '../cells/react/icon/scania/v1/component.css',
    );
  });
});
