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

export function publicApiSurface(dir: string): string[] {
  const api = JSON.parse(readCellFile(dir, 'api.json') || '{}') as { publicApiSurface?: string[] };
  return api.publicApiSurface ?? [];
}
