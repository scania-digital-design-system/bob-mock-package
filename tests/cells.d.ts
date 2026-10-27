// Cells are plain JSX with no types (ADR 0002 D2); the export comes from the
// cell-export plugin. Tests import them through this loose shim until the package
// generates per-cell prop types (ADR 0002 D7).
declare module '*/component.jsx' {
  import type { FC } from 'react';

  const Component: FC<Record<string, unknown>>;
  export default Component;
}
