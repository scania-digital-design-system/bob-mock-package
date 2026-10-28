import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

// The package ships one stylesheet: the brand tokens, then every cell's component.css,
// joined without changes so the shipped CSS is the CSS the gate checked (ADR 0005 D3).

// Package order: build order (ADR 0001 D7, ADR 0006 D1).
export const COMPONENTS = [
  'badge',
  'button',
  'link',
  'spinner',
  'card',
  'divider',
  'block',
  'tag',
  'message',
] as const;

export function cssSources(components: readonly string[]): string[] {
  return [
    'tokens/scania.css',
    ...components.map((component) => `cells/react/${component}/scania/v1/component.css`),
  ];
}

export function bundleCss(sources: string[], read: (path: string) => string): string {
  return sources
    .map((path) => {
      const css = read(path);
      return `/* ${path} */\n${css}${css.endsWith('\n') ? '' : '\n'}`;
    })
    .join('\n');
}

export function cssBundle(root: string): Plugin {
  return {
    name: 'bob-css-bundle',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'scania.css',
        source: bundleCss(cssSources(COMPONENTS), (path) => readFileSync(join(root, path), 'utf8')),
      });
    },
  };
}
