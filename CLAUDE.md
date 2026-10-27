# CLAUDE.md — bob-mock-package

A test bed for the brand-orchestration-backbone (BOB) pipeline. Tegel's components are
hand-written exactly as the pipeline would deliver them (React target, scania brand),
checked by the pipeline's real hard gate, packaged as `@umain-mock/bob-mock-package`, and
measured against Tegel. The pipeline itself is not run. It is for testing, not a product.

Design: `docs/adr/0002-hand-written-cells-in-bob-shape.md`. Reference for every cell:
`docs/research/bob-pipeline.md` (what the pipeline delivers and enforces) and
`docs/research/tegel-components.md` (what each Tegel component is).

Terms (cell, bootstrap, blessing, golden reference, ratchet) follow the backbone register:

@../brand-orchestration-backbone/GLOSSARY.md

## Scope

- Brand: `scania` only. Target: `react` only. Angular comes later by adding `"angular"` to
  a payload's `targets`, so keep payloads and packaging target-agnostic.
- Components, in order: badge, button, link, spinner, card (ADR 0001 D7).
- Light mode only; dark mode, `modeVariant` and `animation` are out (ADR 0002 D8).
- Tegel is final; there is no design iteration. A difference between a cell and Tegel
  that BOB's conventions force is a **finding**, recorded in `docs/findings/<component>.md`.

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

## Cell flow

1. **Payload.** Write `payloads/<component>.json` as a valid backbone publish request
   (reference: `../brand-orchestration-backbone/pipeline/testdata/publish_*_request.json`).
   `brands: ["scania"]`, `targets: ["react"]`; Tegel props become `surface.properties`;
   variables come from `payloads/_tokens.json`.
2. **Write the bootstrap artifacts.** Hand-write `component.jsx` and `component.css` in
   `cells/react/<component>/scania/v1/`, as the bootstrap agent would.
3. **Generate the rest.** The generator writes `metadata.json`, `api.json`, `a11y.json`,
   `usage.jsx` and `tokens.dtcg.json` from the payload.
4. **Gate.** The real hard gate (`gate/`) and the prompt-rule tests
   (`rules/prompt-rules.ts`, run by `tests/prompt-rules.test.ts`) must pass.
5. **Compare.** DOM tests against Tegel behaviour; record each departure as a finding.

Layout and toolchain: ADR 0001 (D4–D7) and ADR 0002 (D6, D7).

Definition of done for any change: `npm run typecheck && npm run lint && npm test &&
npm run test:gate && npm run gate`. The gate needs Go ≥ 1.26 on `PATH`; in a sandboxed
session point `GOMODCACHE`, `GOCACHE` and `GOPATH` at `$TMPDIR`.

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
   generator, compare harness, gate harness) gets a table-driven test (`it.each`, or a Go
   table test in `gate/`), with network and file access stubbed. Every cell passes the
   real gate and gets DOM tests against Tegel's behaviour.
4. **Cells keep the delivered shape** (ADR 0002 D2, D3, D7). `component.jsx` and
   `component.css` follow `pipeline/prompts/bootstrap_system_react.txt` to the letter: bare
   function, no import or export, `className` with `tl-` classes, modifiers interpolating
   a bare prop name, no `style` attribute, every CSS value a `var(--token)`. Generated
   artifacts are edited only through the payload and the generator. Packaging needs live
   in the build, never in the cell.
5. **Minimal diff** (backbone CLAUDE.md "Scope discipline"). Change only what the request
   needs, and propose adjacent improvements separately.
6. **ASD-STE100 for human-facing writing** (backbone AGENTS.md §6). Applies to `README.md`,
   commit messages, PR bodies and anything said to the user: active voice, one
   instruction per sentence, ≤20 words for a procedure and ≤25 for a description,
   articles kept, one term per meaning. Exempt: this file, ADRs and code comments.
7. **One vocabulary.** Use the glossary's terms exactly; add a new term to an ADR before
   using it.

## Publishing

- The package is `@umain-mock/bob-mock-package`. Public npm and the `@scania` scope are
  off-limits.
- Fast checks: `npm pack` and a tarball install, or a `file:` dependency.
- Full flow: Verdaccio (`npx verdaccio`, then `npm publish --registry http://localhost:4873`).
- If npm fails with EPERM on `~/.npm`, use `--cache "$TMPDIR/npmcache"` and ask the user
  to run `sudo chown -R 502:20 ~/.npm`.
