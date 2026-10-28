// The icon cell's data, from Tegel's icon tokens (tokens/scss/component/icon.scss at the
// pinned tag): one `icon/<name>/d` token per icon at the end of payloads/_tokens.json,
// and one modifier rule per icon in the icon cell's stylesheet (docs/findings/icon.md).
// `npm run icons` rewrites both; then run `npm run tokens` and `npm run cell`.

export type Icon = { name: string; d: string; fillRule?: string };

export type Token = { name: string; type: string; valuesByMode: { scania: string } };

// Biome's JSON line width (biome.json).
const LINE_WIDTH = 100;

// The icons of the Scania block, in source order. The `d` value is the path in
// `path('…')`; `fill-rule` comes from the icon's own `--tds-icon-<name>-fill-rule`.
export function parseIcons(scss: string): Icon[] {
  const start = scss.indexOf(':root,\n.scania {');
  if (start === -1) {
    return [];
  }
  const block = scss.slice(start, scss.indexOf('\n}', start));
  const fillRules = new Map(
    [...block.matchAll(/--tds-icon-([\w-]+?)-fill-rule: (\w+);/g)].map((m) => [m[1], m[2]]),
  );
  return [...block.matchAll(/--tds-icon-([\w-]+?)-d: path\(\s*'([^']*)'\s*\);/g)].map(
    ([, name = '', d = '']) => {
      const fillRule = fillRules.get(name);
      return fillRule ? { name, d, fillRule } : { name, d };
    },
  );
}

// The path travels as a COLOR-carried string token (docs/tokens.md).
export function iconToken({ name, d }: Icon): Token {
  return { name: `icon/${name}/d`, type: 'COLOR', valuesByMode: { scania: `path('${d}')` } };
}

// One variable as Biome prints it at its place in the payload: on one line when it fits,
// else one key per line, with the same rule for `valuesByMode`.
export function formatToken(token: Token): string {
  const values = `{ "scania": ${JSON.stringify(token.valuesByMode.scania)} }`;
  const head = `"name": ${JSON.stringify(token.name)}, "type": ${JSON.stringify(token.type)}`;
  const line = `    { ${head}, "valuesByMode": ${values} },`;
  if (line.length <= LINE_WIDTH) {
    return line.slice(0, -1);
  }
  const valuesLine = `      "valuesByMode": ${values}`;
  const valuesBlock =
    valuesLine.length <= LINE_WIDTH
      ? valuesLine
      : `      "valuesByMode": {\n        "scania": ${JSON.stringify(token.valuesByMode.scania)}\n      }`;
  return [
    '    {',
    `      "name": ${JSON.stringify(token.name)},`,
    `      "type": ${JSON.stringify(token.type)},`,
    valuesBlock,
    '    }',
  ].join('\n');
}

// The payload text with its icon tokens replaced. The icon tokens are the last variables;
// everything before them stays as it is.
export function withIconTokens(payload: string, icons: Icon[]): string {
  const end = payload.lastIndexOf('\n  ]\n}');
  if (end === -1) {
    throw new Error('payload: no closing "]" of the variables list');
  }
  const first = /\n {4}\{\s*"name": "icon\//.exec(payload);
  const head = payload.slice(0, first && first.index < end ? first.index : end).replace(/,?$/, ',');
  const tokens = icons.map((icon) => formatToken(iconToken(icon))).join(',\n');
  return `${head}\n${tokens}${payload.slice(end)}`;
}

// The icon cell's stylesheet: base rules, then one rule per icon that reads its path
// token with the CSS `d` property. An evenodd icon also sets its fill and clip rules.
export function iconStylesheet(icons: Icon[]): string {
  const base = `.tl-icon {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  fill: currentColor;
}
.tl-icon__path {
  fill: currentColor;
}
`;
  const rules = icons.map(({ name, fillRule }) => {
    const rule = fillRule ? `\n  fill-rule: ${fillRule};\n  clip-rule: ${fillRule};` : '';
    return `.tl-icon--${name} .tl-icon__path {\n  d: var(--icon-${name}-d);${rule}\n}\n`;
  });
  return base + rules.join('');
}
