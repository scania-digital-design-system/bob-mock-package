import type { Plugin } from 'vite';

// A delivered bootstrap cell is a bare function with no export (backbone
// bootstrap_system_react.txt L12), so neither BOB's own usage.jsx nor our package can
// import it. This plugin adds the default export at build and test time; the cell file
// on disk keeps the delivered shape (ADR 0002 D7).

const CELL_COMPONENT = /\/cells\/[^/]+\/[^/]+\/[^/]+\/v\d+\/component\.jsx$/;
const COMPONENT_NAME = /^\s*function\s+([A-Z]\w*)\s*\(/;

export function isCellComponent(id: string): boolean {
  return CELL_COMPONENT.test(id.replaceAll('\\', '/'));
}

export function withDefaultExport(code: string): string {
  const name = COMPONENT_NAME.exec(code)?.[1];
  if (name === undefined) {
    throw new Error('cell component.jsx must start with "function <Name>("');
  }
  return `${code.trimEnd()}\nexport default ${name};\n`;
}

export function cellExport(): Plugin {
  return {
    name: 'bob-cell-export',
    enforce: 'pre',
    transform(code, id) {
      return isCellComponent(id) ? { code: withDefaultExport(code), map: null } : null;
    },
  };
}
