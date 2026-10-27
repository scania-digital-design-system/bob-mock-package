# ADR 0002: Hand-Written Cells in BOB Delivery Shape

**Status:** Accepted. **Supersedes ADR 0001 D1 (name), D2 (layout) and D3 (build transform
left open)**. ADR 0001 D4, D5, D6 and D7 stand.
**Scope:** package

## Context

ADR 0001 planned to run the backbone pipeline and package what it delivered. The goal
changed: we do not run the pipeline. We hand-write Tegel's components as the pipeline
would deliver them for the `react` target and the `scania` brand, check them with the
pipeline's own rules, and ship them as an npm package.

Research behind this decision is in `docs/research/bob-pipeline.md` and
`docs/research/tegel-components.md`. The facts that shape it:

- Every component except button goes through **bootstrap**. A bootstrap cell's
  `component.jsx` is a bare function with no import or export, styled only through
  `tl-` classes, with a `component.css` beside it. The rest of the cell (`metadata.json`,
  `api.json`, `a11y.json`, `usage.jsx`, `tokens.dtcg.json`) is written deterministically.
- The hard gate (`RunHardGates`, eight checks) checks token membership against the
  vocabulary in `ruledata.v2.json`, token closure against the brand's variables, token
  category against CSS property, class closure, and API-surface form. It does not check
  literal values; only the bootstrap prompt forbids them.
- BOB's stock vocabulary (~50 names) cannot express Tegel: button alone needs four
  variants × four states × four properties, plus sizes, shadows and motion. Rule data is
  designed to be injected per deployment (`RunHardGates(art, rules, …)`,
  `LoadRuleDataSetFrom(path)`).
- `hardgate` imports only `domain`, `resolve`, `contracts` and `pkg/wcag` — no Temporal —
  so a Go program outside the backbone can call it.
- A delivered bootstrap cell is not importable (`usage.jsx` imports a default export that
  `component.jsx` lacks).

## Decision

**D1 — Name.** `@umain-mock/bob-mock-package`. The registry guard from ADR 0001 D1 stays.

**D2 — Cells are hand-written in bootstrap shape, all five components.** We write the two
artifacts the LLM would write — `component.jsx` and `component.css` — following
`pipeline/prompts/bootstrap_system_react.txt` to the letter: bare function, destructured
props, `className` with `tl-<component>`, `__<part>` and `--<value>` classes, modifiers
that interpolate only a bare prop name, no `style` attribute, every CSS value a
`var(--token)`, no import or export. Button uses this shape too, not the registry
template (whose API is only `label` and `onClick`).

**D3 — Deterministic artifacts are generated, not hand-written.** A script reads each
`payloads/<component>.json` (publish-request shape) and writes `metadata.json`,
`api.json`, `a11y.json`, `usage.jsx` and `tokens.dtcg.json` the way
`pipeline/src/client/layout/layout.go` and `domain/contract_draft.go` do. Payloads stay
valid publish requests, so they can still be run through the real pipeline for
comparison.

**D4 — Vocabulary extended to what Tegel needs.** `rules/ruledata.json` is BOB's
`ruledata.v2.json` plus Tegel-derived token names, in BOB's naming style
(`<category>/<…>` in payloads, `--<category>-<…>` in CSS). BOB's `tokenUsage`
allow-lists are kept unchanged. A token that has no fitting category (size, shadow,
motion, opacity) uses a new category; a category with no usage rule is unconstrained,
as in BOB. Every addition is listed in `docs/tokens.md` with its Tegel source.

**D5 — The real gate checks every cell.** `gate/` is a small Go module that requires
`traton-design-system-poc` and `traton-contracts` through `replace` directives pointing
at `../brand-orchestration-backbone`, builds each cell's `GateArtifact` as
`pipeline_helpers.go` does, loads `rules/ruledata.json`, and runs `RunHardGates` with
`DefaultGateChecks()`. A finding fails the check. Prompt-only rules (no literals, no
import/export, no `style`) are checked separately in Vitest, since the gate does not
check them.

**D6 — Layout.**

```
payloads/_tokens.json                     # the scania `variables` block, shared
payloads/<component>.json                 # one publish request per component
cells/react/<component>/scania/v1/        # hand-written jsx + css, generated rest
tokens/scania.css                         # :root custom properties (TRATON-lite shape)
rules/ruledata.json                       # BOB v2 + Tegel additions
gate/                                     # Go harness over the real hard gate
scripts/                                  # deterministic-artifact generator
src/index.ts                              # re-exports
tests/                                    # rule checks, DOM tests vs Tegel
docs/{adr,research,findings}/, docs/tokens.md
```

**D7 — Packaging.** A Vite plugin scoped to `cells/**/component.jsx` appends
`export default <Name>;` in the build, so cell files keep their delivered shape.
`scania.css` bundles `tokens/scania.css` and every `component.css`. Prop types are
generated from each cell's `api.json` and payload values.

**D8 — Fidelity target.** Scania brand, light mode. Visual and behavioural parity with
Tegel where BOB's conventions allow; every departure is a finding in
`docs/findings/<component>.md`. Slots become props or `children`, `tdsClick` becomes
`onClick`, booleans become value modifiers, interaction states become CSS states. Dark
mode, `modeVariant` and `animation` are out of scope (BOB has no mode axis).

## Alternatives considered

- **Stock BOB vocabulary.** Shows exactly what the gate permits today, but collapses
  Tegel's variants and forces literals for sizes; parity would be lost.
- **TypeScript port of the gate.** Self-contained and fast, but drifts from the real
  rules the moment the backbone changes them.
- **Registry-template button.** Faithful to the one resolved cell, but drops almost all
  of Tegel's button API.
- **Write `export default` into the cell.** Simpler packaging, but no longer the shape
  the pipeline delivers.

## Consequences

- Positive: cells are what the pipeline would deliver, checked by the pipeline's own gate.
  Payloads remain runnable through the real pipeline for a later side-by-side.
- Negative: passing means passing *our* rule data, not stock v2. The vocabulary additions
  are the measure of that gap.
- Negative: `gate/` needs Go 1.26 on the machine and tracks whatever ref
  `../brand-orchestration-backbone` has checked out (at decision time: `main`, `bc1c001`).
  A rule change upstream can turn a passing cell red without a change here.
- Negative: dark mode and mode variants are dropped.
- Negative: the packaging layer (export plugin, CSS bundle, prop types) is ours; BOB does
  not produce it.
