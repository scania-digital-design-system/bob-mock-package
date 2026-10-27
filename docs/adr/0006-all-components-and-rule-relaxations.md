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

**D3 — The register.** `rules/relaxations.json` is the machine record:

```json
{
  "relaxations": {
    "react-hooks": {
      "relaxes": "no-module",
      "allows": "import { useState, useEffect, useRef, useId } from 'react'"
    }
  },
  "cells": { "react/tabs/scania/v1": ["react-hooks"] },
  "expectedGateFailures": {}
}
```

- `relaxations` names each relaxation, the rule it relaxes and the exact construct it
  allows. The first cell that needs a relaxation adds it, in the same change.
- `cells` opts a cell in, by ID. A cell that is not listed gets the full strict check.
- `expectedGateFailures` lists, per cell, the real-gate rule IDs that a relaxation makes
  fail. It starts empty. We prefer relaxations that keep it empty.

`docs/findings/README.md` gets a "Relaxations" section with one entry per ID: what it
allows, why, which cells use it, its **source** (D5) and the BOB change that would make
it unnecessary. A test fails when an ID in the JSON has no entry there.

**D4 — Checks honour the register.**

- `checkPromptRules` takes the cell's relaxation IDs and widens only the named rule, by
  only the named construct. Every other import, every export and every other rule still
  fail.
- `npm run gate` still runs BOB's checks unchanged. A failure listed in
  `expectedGateFailures` reports `KNOWN`, not `FAIL`. A failure not listed fails the run,
  and so does a listed failure that no longer occurs, so the list can only shrink (a
  ratchet).

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

- Positive: the register becomes the list of what BOB must change, with each entry
  backed by the components that need it.
- Positive: a cell that needs no relaxation is still checked strictly, so relaxations
  cannot spread silently.
- Positive: the real gate stays authoritative; expected failures are explicit and can
  only shrink.
- Negative: cells with relaxations are not what BOB would deliver today. Each one is a
  departure from the pipeline, not only from Tegel.
- Negative: 35 folders and about 60 cells is a long run. Header, side menu and table are
  each larger than the first five components together.
- Negative: `prompt-rules.ts` grows a mechanism for allowances, which is more of our
  logic around BOB's rules.
