# ADR 0004: The Public API Surface Is Derived from the Destructured Props

**Status:** Accepted
**Scope:** package

## Context

A bootstrap answer has three fields: `renderedMarkup`, `styles` and `publicApiSurface`
(backbone `pipeline/prompts/bootstrap_system_react.txt` L15). We hand-write the first two
as `component.jsx` and `component.css`. The third feeds `api.json`
(`domain.BuildAPIReferenceJSON`) and the gate's `api-surface-form` check, but a delivered
cell has no file of its own for it. The prompt defines it as "every externally-visible
prop/slot your markup exposes", and L10 requires the props to be "a destructured
parameter".

## Decision

**D1 —** `bob cell` derives `publicApiSurface` from the destructuring pattern of the
component's parameter: each entry's key, in source order, with defaults and renames
ignored and a rest element (`...rest`) skipped.

**D2 —** No extra file is added to the cell. `api.json` is the only record of the surface,
and the gate reads it from there.

## Consequences

- Positive: the surface cannot disagree with the code, and the cell keeps BOB's file set.
- Negative: this is our logic, not BOB's. A model could list a surface that differs from
  its own destructuring; ours never will, so a class of real bootstrap error is not
  reproduced here.
- Negative: a prop read through `...rest` (for example a forwarded `aria-*`) is not in
  the surface.
