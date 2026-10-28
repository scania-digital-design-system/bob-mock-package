import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Shared by the suites that run over every cell in the repo.

const ROOT = join(__dirname, '..', '..');
const CELLS_DIR = join(ROOT, 'cells');

export type CellRef = { id: string; dir: string; component: string };

type SurfaceProperty = { name: string; values: string[] };
type Payload = { surface?: { properties?: SurfaceProperty[] } };

// Every cells/<target>/<component>/<brand>/<version> directory.
export function cellDirs(): CellRef[] {
  if (!existsSync(CELLS_DIR)) {
    return [];
  }
  const children = (dir: string) =>
    readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  return children(CELLS_DIR).flatMap((target) =>
    children(join(CELLS_DIR, target)).flatMap((component) =>
      children(join(CELLS_DIR, target, component)).flatMap((brand) =>
        children(join(CELLS_DIR, target, component, brand)).map((version) => ({
          id: [target, component, brand, version].join('/'),
          dir: join(CELLS_DIR, target, component, brand, version),
          component,
        })),
      ),
    ),
  );
}

export function readCellFile(dir: string, name: string): string {
  const path = join(dir, name);
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

// Surface property name → declared values, from payloads/<component>.json.
export function surfaceProperties(component: string): Record<string, string[]> {
  const payload = JSON.parse(
    readFileSync(join(ROOT, 'payloads', `${component}.json`), 'utf8'),
  ) as Payload;
  return Object.fromEntries((payload.surface?.properties ?? []).map((p) => [p.name, p.values]));
}

// Cell ID → the relaxation IDs it uses, from rules/relaxations.json (ADR 0006 D3).
export function relaxedCells(): Record<string, string[]> {
  return JSON.parse(readFileSync(join(ROOT, 'rules', 'relaxations.json'), 'utf8')) as Record<
    string,
    string[]
  >;
}

// Relaxation IDs with a "### `<id>`" entry in docs/findings/README.md.
export function documentedRelaxations(): string[] {
  const readme = readFileSync(join(ROOT, 'docs', 'findings', 'README.md'), 'utf8');
  return [...readme.matchAll(/^### `([a-z0-9-]+)`$/gm)].map((m) => m[1] ?? '');
}

export function publicApiSurface(dir: string): string[] {
  const api = JSON.parse(readCellFile(dir, 'api.json') || '{}') as { publicApiSurface?: string[] };
  return api.publicApiSurface ?? [];
}
