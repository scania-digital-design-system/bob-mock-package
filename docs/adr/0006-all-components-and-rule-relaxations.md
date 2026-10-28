# ADR 0006: All Tegel Components, with Registered Rule Relaxations

**Status:** Accepted. **Supersedes ADR 0001 D7 (five components) and amends ADR 0002 D2**
(cells keep the bootstrap shape, except where this ADR registers a relaxation).
**Scope:** package

## Context

The first five cells (badge, button, link, spinner, card) fit BOB's rules with
conforming patterns: a second `return` branch, `:has()`, native `<details>`, attribute
selectors, values written out per variant (`docs/findings/README.md`). The scope now
grows to every Tegel component. Many of them need behaviour no conforming pattern gives:
state (tabs, dropdown, modal, toast), effects (outside click, focus trap), shared state
between parent and child cells (tabs, accordion), positioning (tooltip, popover), and
cells that use other cells (card with button).

BOB's rules come from two places, and they are checked differently:

| Source | Checked by | Rule IDs | Can we change it? |
|---|---|---|---|
| Bootstrap prompt (`bootstrap_system_react.txt`) | our `rules/prompt-rules.ts` | `function-shape`, `no-module`, `no-style-attribute`, `class-name-only`, `no-tokens-object`, `class-prefix`, `no-extra-rules`, `no-literal-value` | Yes: our code |
| Hard gate (`DefaultGateChecks`) | BOB's own code, through `bob/` | `token-set`, `token-reference-form`, `markup-form`, `api-surface-form`, `class-closure`, `token-usage` | No: the backbone is read-only |

"No imports" (L12) is a prompt rule. The hard gate does not check imports, so allowing
React hooks keeps the real gate green.

A later pipeline run from Figma takes prop names from Figma component properties and
token names from Figma variables, verbatim (backbone `figma/src/main/component_surface.ts`,
`variables.ts`). Findings about naming are then Tegel-specific; findings about the prompt,
the gate and the token types (Figma variables are only `COLOR`, `FLOAT` and `STRING`,
with no aliases) stay true.

## Decision

**D1 — Scope.** Every component in `@scania/tegel@1.66.1`: the 33 component folders plus
the navigation pattern (`header` and `side-menu`), 35 folders in all. A folder is the
unit of work, of findings and of review. Each element a consumer writes in markup is its
own cell and export (for example `Accordion` and `AccordionItem`). Elements that only
the component uses internally fold into their parent cell. Light mode, the `scania`
brand and the `react` target stay as before (ADR 0002 D8).

**D2 — A relaxation is admitted only when no conforming pattern exists.** Before adding
one, the cell's findings name the conforming patterns tried and why each fails. A
relaxation is narrow: it allows one named construct, not a whole rule switched off.

**D3 — The register is light.** The record of a relaxation is its entry in the
"Relaxations" section of `docs/findings/README.md`: what it breaks, what it allows, why,
which cells use it, its gate result, its **source** (D5) and the BOB change that would make
it unnecessary. `rules/relaxations.json` only maps a cell ID to the relaxation IDs it
uses:

```json
{ "react/tabs/scania/v1": ["react-hooks"] }
```

A test fails when the JSON names an unknown cell or a relaxation with no README entry.
The first cell that needs a relaxation writes its entry, in the same change.

A machine-checked register (each relaxation widening one rule by one construct, and a
ratchet of expected gate failures) was considered and rejected. It is tooling for this
test bed only: in the pipeline, a rule change is made in BOB's prompt and gate, not as a
per-cell exception, so the README entries are what carries over.

**D4 — Checks.**

- The prompt-rule check skips every cell listed in `rules/relaxations.json`. Every other
  cell is checked strictly.
- `npm run gate` runs BOB's checks unchanged on every cell, relaxed or not. We prefer
  relaxations that keep the real gate green. "No imports" is not a gate check, so
  allowing React hooks does. A relaxation that would make the gate fail needs a decision
  from the user before it is added.

**D5 — Every finding and relaxation has a source.**

- `structural`: comes from the prompt, the gate or the token model, so it stays true
  when the pipeline runs from Figma. These are the ones to tune BOB with.
- `tegel-specific`: comes from Tegel's names or markup (prop names, the `tegel` token
  vocabulary, slot names), so a Figma run may make it irrelevant.

The table of findings in `docs/findings/README.md` gets a Source column.

**D6 — Existing cells stay as they are.** The five cells keep their strict shape. They
are the evidence of what the rules allow. A later step may move one onto a relaxation
(for example card onto `react-hooks`), recorded as its own finding.

**D7 — A relaxation that adds a runtime dependency** (for example a positioning library
for tooltip and popover) also needs its own ADR, under CLAUDE.md Rule 1.

## Consequences

- Positive: the Relaxations section becomes the list of what BOB must change, with each
  entry backed by the components that need it.
- Positive: a cell that needs no relaxation is still checked strictly.
- Positive: the real gate stays authoritative for every cell.
- Negative: a relaxed cell skips every prompt rule, not only the one it breaks, so it
  can break another rule without a test failing.
- Negative: cells with relaxations are not what BOB would deliver today. Each one is a
  departure from the pipeline, not only from Tegel.
- Negative: 35 folders and about 60 cells is a long run. Header, side menu and table are
  each larger than the first five components together.
