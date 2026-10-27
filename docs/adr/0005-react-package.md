# ADR 0005: The React Package

**Status:** Accepted. **Supersedes ADR 0002 D1 (name) and D7 (packaging).** ADR 0001 D6
(Node 22) stands and is now enforced.
**Scope:** package

## Context

All five cells pass the gate, but `src/index.ts` exports nothing and the package ships
no CSS and no prop types. ADR 0002 D7 named the parts (an export plugin, a `scania.css`
bundle, generated prop types) without deciding the entry points or the type source.

Tegel ships one package per target (`@scania/tegel-react`, `@scania/tegel-angular`) on
top of a core package that holds the CSS. We want the same split once a second target
exists, so the package is named for its target now. Until then, a separate CSS package
would have one consumer, so the CSS ships inside the React package.

The cells are plain JSX with no types (ADR 0002 D2). Each payload's `surface.properties`
gives every prop a BOB type, except the two props that only the cell declares: `onClick`
(button) and `onTdsClick` (card).

How the team gets the package is not decided here.

## Decision

**D1 — Name.** `@umain-mock/bob-mock-react`. The registry guard from ADR 0001 D1 stays:
`publishConfig.registry` is `http://localhost:4873`. An Angular package will be
`@umain-mock/bob-mock-angular`; adding it moves the CSS into its own package, under a new
ADR.

**D2 — Entry points.** Two exports, ESM only, and `dist/` is the only folder shipped:

```ts
import { Badge, Button, Card, Link, Spinner } from '@umain-mock/bob-mock-react';
import '@umain-mock/bob-mock-react/scania.css';
```

Each component is exported under the PascalCase name of its folder in `cells/react/`.
`react`, `react-dom` and `react/jsx-runtime` stay external. The ADR 0002 D7 export
plugin stays as it is.

**D3 — One CSS file.** `dist/scania.css` is `tokens/scania.css` followed by each cell's
`component.css`, in the component order of ADR 0001 D7. The files are concatenated
unchanged (no minification, no reordering), so the shipped CSS is the CSS the gate
checked. The consumer imports it once; no component imports CSS.

**D4 — Prop types are generated from the payloads.** A script in `build/` writes one
props type per cell into a committed file, and a test fails when that file is stale.

| Payload type | TypeScript |
|---|---|
| `VARIANT` | union of the `values` as string literals |
| `BOOLEAN` | `boolean` |
| `TEXT` | `string` |
| `INSTANCE_SWAP` | `ReactNode` |

- A prop in `api.json` with no payload property takes its type from an override map in
  the script: `onClick` is `MouseEventHandler<HTMLButtonElement>`, `onTdsClick` is
  `(event: CustomEvent<{ cardId: string }>) => void`. A test fails when a prop in
  `api.json` has neither.
- Every prop is optional. A default value in the cell's destructuring is copied into a
  `@default` doc comment.
- `src/index.ts` gives each cell its props type. Tests import cells from `src/`, so they
  check the generated types too; the loose `*/component.jsx` declaration is used only
  inside `src/`.

**D5 — Runtime.** Node 22, as ADR 0001 D6 says. `engines.node` is `>=22.12`, the
lowest Node 22 release that Vite 8 supports.

**D6 — Check before sharing.** `npm pack` makes the tarball. A consumer app in `$TMPDIR`
installs it, builds with Vite and typechecks against the shipped types. The user then
publishes to a local Verdaccio (the sandbox cannot bind a port). Sharing with the team
gets its own ADR.

## Consequences

- Positive: consumers install one package and import CSS once, as with Tegel.
- Positive: the types say what BOB knows about each prop, not what Tegel's types say, so
  the gap between them stays visible in `tests/api-parity.test.ts`.
- Positive: the shipped CSS is byte for byte the gated CSS.
- Negative: when Angular arrives, the import path `@umain-mock/bob-mock-react/scania.css`
  changes unless the React package keeps re-exporting it. The version is 0.x, so the
  break is cheap.
- Negative: `TEXT` maps to `string`, so link `children` is typed narrower than React's
  usual `ReactNode`.
- Negative: the override map is hand-written. It holds two entries and a test guards it.
- Negative: consumers load the CSS of all five components even when they use one.
