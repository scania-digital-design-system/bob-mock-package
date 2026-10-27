# ADR 0003: BOB's Own Code Writes the Deterministic Artifacts

**Status:** Accepted. **Supersedes ADR 0002 D3** (a TypeScript generator) and moves ADR
0002 D5's harness from `gate/` to `bob/`. D4 is refined by D3 and D4 below.
**Scope:** package

## Context

ADR 0002 D3 planned a TypeScript script that writes `metadata.json`, `api.json`,
`a11y.json`, `usage.jsx` and `tokens.dtcg.json` "the way" the pipeline does. Building the
gate harness showed that the pipeline's writers are exported Go functions and need no
Temporal: `resolve.BindingFor(target).EmitTokenSource`, `domain.EmitDTCG`,
`domain.DraftContract`, `domain.BuildAPIReferenceJSON`, `layout.WriteCell`. A copy in
TypeScript would be a second implementation that drifts; calling them gives the exact bytes.

Reading the token path for Phase 3 also showed the limits of BOB's token model
(`domain/brand_derivation.go`, `resolve/token_source.go`):

- `COLOR` binds any string, unvalidated, and is emitted verbatim.
- `FLOAT` binds a number and the web emitter always appends `px`.
- `STRING` binds only as `<group>.fontFamily`, emitted as `--<group>`.
- `.fontSize` / `.fontWeight` typography fields are stored but never emitted as custom
  properties.

So opacity (`0.25`), durations (`2s`) and numeric font weights (`700`) have no faithful
type: as FLOAT they would emit `0.25px` and `700px`.

## Decision

**D1 — One Go module, `bob/`, with subcommands.** `gate` (ADR 0002 D5, unchanged
behaviour), `tokens` (this ADR), and later `cell`. Each calls the backbone's exported
functions through the `replace` directives; none re-implements them.

**D2 — `tokens/scania.css` is emitted by BOB's web binding** from
`payloads/_tokens.json`, byte-for-byte what the pipeline would put in
`traton-lite/tokens/scania.css`.

**D3 — `rules/ruledata.json` is generated:** BOB's current embedded `ruledata.v2.json`
plus one token set, `tegel`, holding every name in `payloads/_tokens.json` that BOB's sets
do not already contain. Thresholds and `tokenUsage` are untouched. The size of the `tegel`
set is the measured vocabulary gap.

**D4 — Token types.** Colours are `COLOR`; lengths are `FLOAT` (px); font families are
`STRING` `<group>.fontFamily`. A value with no faithful BOB type (opacity, duration) is
carried as `COLOR`, which binds and emits verbatim, and is marked as a carrier in
`docs/tokens.md`. Font weights use CSS keywords (`normal`, `bold`) instead of a token.
Where a BOB stock name means the same thing as a Tegel value, the stock name is reused.

**D5 — Foundation first.** Phase 3 adds Tegel's shared semantic layer (text, background,
border and system colours, focus ring, typography, spacing scale, radius, border width,
disabled opacity). Component tokens are added with each component, as Tegel's own
`--component-*` layer is.

## Consequences

- Positive: every deterministic byte comes from BOB; a change upstream shows up on the
  next run, not after someone ports it.
- Positive: the rule data stays in step with upstream v2 automatically.
- Negative: carried values get `$type: "color"` in `tokens.dtcg.json`, which is wrong
  metadata. This is a finding about BOB's type model, not something we can fix here.
- Negative: more of the repo depends on the Go toolchain and on the sibling checkout.
