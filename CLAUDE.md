# CLAUDE.md — bob-mock-package

A test bed for the brand-orchestration-backbone (BOB) pipeline. Tegel components go in as
publish payloads, the real pipeline generates React cells, and this repo packages those
cells and measures them against Tegel. It is for testing, not a product.

Terms (cell, bootstrap, blessing, golden reference, ratchet) follow the backbone register:

@../brand-orchestration-backbone/GLOSSARY.md

## Scope

- Brand: `scania` only. Target: `react` only. Angular comes later by adding `"angular"` to
  a payload's `targets`, so keep payloads and packaging target-agnostic.
- Components, in order: button, badge, link, spinner, card.
- Tegel is final. It replaces the Figma step, so there is no design iteration. A
  difference between a generated cell and Tegel is a **finding** about the pipeline.

## Workspace (`~/Desktop/Projects/`)

| Folder | Role | Access |
|---|---|---|
| `bob-mock-package/` | this repo | the only repo you write to |
| `../brand-orchestration-backbone/` | the pipeline, and the reference for rules and flow | read-only |
| `../tegel/` | Tegel source: the **spec** for each component | read-only |

Read-only covers git state too: leave `../tegel` on its current branch. `.env` files stay
in their own repo.

## Tegel: spec and comparison

The source and the compare package are pinned to the same version: **1.66.1**.

- **Spec — Tegel source at tag `@scania/tegel@1.66.1`.** Read it without a checkout:
  `git -C ../tegel show '@scania/tegel@1.66.1:packages/core/src/components/<name>/<file>'`.
  Each component folder has the Stencil `.tsx` (props, events, slots), the `.scss` and
  `-vars.scss` (token and mixin usage) and `.stories.tsx` (every variant and state).
  Build payloads from this source, never from compiled output.
- **Comparison — npm `@scania/tegel@1.66.1`** (devDependency). It ships compiled JS, CSS
  and `.d.ts` only. Tests check our props against its `.d.ts` and render both side by
  side.
- When the pin moves, move both together, and confirm the matching tag exists first.

## Pipeline flow

1. **Payload.** Write `payloads/<component>.json` in the backbone publish-request shape
   (reference: `../brand-orchestration-backbone/pipeline/testdata/publish_*_request.json`).
   `brands: ["scania"]`, `targets: ["react"]`; Tegel props become `surface.properties`;
   Tegel's Scania token values become `variables` with a `scania` mode only.
2. **Run.** The user runs the stack. From the backbone folder, after `make up`:
   `docker compose run --rm -v ~/Desktop/Projects/bob-mock-package/payloads:/app/mock:ro worker publish mock/<component>.json`.
   The mount keeps payloads in this repo; the worker only mounts its own `testdata/`.
3. **Collect.** The cell lands in backbone `pipeline/output/react/<component>/scania/v<n>/`
   (component source, token source, `metadata.json`). Copy it into this repo byte-for-byte.
4. **Compare.** Run the comparison tests and record each finding.

Only `button` has a blessed template (`pipeline/contracts/registry.v1.json`); the other
four go through **bootstrap**, so their output is an LLM draft.

## Rules

Borrowed from the backbone repo and adapted. Each names its source.

1. **ADR first** (backbone `harness/agents/AGENTS.md` §2). Write `docs/adr/NNNN-short-title.md`
   before any new feature, dependency or structural change, as its own step. Sections:
   Title (`ADR NNNN: …`), Status (`Proposed` | `Accepted` | `Superseded`), Scope
   (`package` | `payload` | `harness`), Context, Decision, Consequences. An ADR that
   changes a rule in this file updates this file in the same change.
2. **Every commit builds** (backbone CLAUDE.md Rule 2). Hard rule: each commit typechecks,
   lints and passes tests on its own. Advisory: ≤100 LoC per commit, ≤300 LoC of feature
   code per PR; tests ship with their feature and do not count. Flag an oversize change
   for the user rather than reslicing it. The user makes every commit: stage the files
   and draft a Conventional Commits message.
3. **Testing discipline** (backbone AGENTS.md §4). Every hand-written function (payload
   builders, compare harness) gets a table-driven test (`it.each`), with network and file
   access stubbed. Every generated cell gets comparison tests against `@scania/tegel`.
4. **Generated cells stay as delivered** (backbone ADR 0189 D3, ADR 0055 D6). A copied
   cell matches the pipeline output byte-for-byte. A defect becomes a finding; when the
   payload misrepresents Tegel, fix the payload and regenerate. Hand-edits to a cell are
   out of bounds.
5. **Minimal diff** (backbone CLAUDE.md "Scope discipline"). Change only what the request
   needs, and propose adjacent improvements separately.
6. **ASD-STE100 for human-facing writing** (backbone AGENTS.md §6). Applies to `README.md`,
   commit messages, PR bodies and anything said to the user: active voice, one
   instruction per sentence, ≤20 words for a procedure and ≤25 for a description,
   articles kept, one term per meaning. Exempt: this file, ADRs and code comments.
7. **One vocabulary.** Use the glossary's terms exactly; add a new term to an ADR before
   using it.

## Publishing

- The package uses our own scope, e.g. `@umain-mock/<name>`; confirm the name with the
  user. Public npm and the `@scania` scope are off-limits.
- Fast checks: `npm pack` and a tarball install, or a `file:` dependency.
- Full flow: Verdaccio (`npx verdaccio`, then `npm publish --registry http://localhost:4873`).
- If npm fails with EPERM on `~/.npm`, use `--cache "$TMPDIR/npmcache"` and ask the user
  to run `sudo chown -R 502:20 ~/.npm`.
