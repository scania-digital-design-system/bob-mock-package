// Cells are plain JSX with no types (ADR 0002 D2); the export comes from the
// cell-export plugin. Only src/index.ts imports cells through this loose declaration,
// and gives each one its generated props type (ADR 0005 D4).
declare module '*/component.jsx' {
  import type { FC } from 'react';

  const Component: FC<Record<string, unknown>>;
  export default Component;
}
