# Research: how the BOB pipeline delivers a React cell

Read from `../brand-orchestration-backbone` at branch
`docs/BOB-230-template-is-a-delivered-artifact`, commit `d292304` (2026-10-27). Its
`pipeline/` and `contracts/` are identical to `main` at `bc1c001`; ADR 0189 exists only
on that branch. Paths are relative to that repo. Re-verify a fact against the current
checkout before relying on a line number.

Gate detail found while building `gate/`: token closure reuses the membership check, so
both report findings under the rule ID `token-set`.

## Two React shapes

- **Template-fill (resolve)** — only `button` has a React registry template. A JS module
  with `import`/`export default`, inline `style={{…}}` from a `tokens` object, a delivered
  `tokens.js`, no `component.css`.
- **Bootstrap (LLM)** — every other component. A bare `function X({…}) { return <…/> }`, no
  import/export, `className` with `tl-` classes, a separate `component.css` with
  `var(--…)`, no `tokens.js`.

ADR 0002 D2 makes all five components bootstrap-shaped.

## 1. Input: the publish request

- Shape (`contracts/contracts.go:140-151`): `PublishRequest{component, brands, targets,
  variables:{variables:[{name,type,valuesByMode}]}, surface:{description,
  properties:[{name,type,values}], answers:[{property,disposition}]}}`. Example:
  `pipeline/testdata/publish_button_request.json`.
- Variables → tokens (`pipeline/src/domain/brand_derivation.go:92-149`): `COLOR` →
  `Colors[name]`; `FLOAT` → `Roundness[name]` unless named `<group>.fontSize` /
  `.fontWeight`; `STRING` accepted only as `<group>.fontFamily`. Canonical names keep slashes.
- Naming (`pipeline/src/domain/token_name.go:50-84`): `ToKebab` collapses every run of
  characters outside `isTokenNameRune` to one `-` (`color/primary/default` →
  `color-primary-default`); `ToCamel` → `colorPrimaryDefault`.
- Bindings (`pipeline/src/adapter/resolve/token_source.go:43-58`): web/angular
  `var(--<kebab>)`; react `tokens.<camel>`. Web emitter writes `:root{ --x: v; }` and
  appends `px` to FLOATs (`:104`); React emitter writes `export const tokens = {…}` with
  quoted colours and bare numbers (`:113-127`).
- Surface → props (`pipeline/src/domain/disposition.go:78-98, 159-169`): TEXT, BOOLEAN,
  INSTANCE_SWAP are always `prop`. A VARIANT axis whose values are all in
  `{default,hover,active,focus,focus-visible,pressed,disabled,visited}` is `css-state`; all
  on the context roster → `design-context`; otherwise the designer's `answers`
  (`prop|css-state|ignore`). Structure wins over an answer. An unresolved property ends the
  run (`pipeline/src/adapter/intake/assemble.go:52-56`).
- Drafted rules (`pipeline/src/domain/contract_draft.go:95-123`):
  - prop: `"%q is a component prop: the caller selects one, accepting a | b. Realise it as
    your target's own input — a component API where the target has one, and a modifier
    class per value…"`
  - css-state: `"%q is an interaction state (…): render it as a CSS state, not as a prop."`
  - IDs `prop-<name>`, `css-state-<name>`, `design-context-<name>`; kind `structure`, level MUST.
- `PropertyValues` = every property name → its values, State included
  (`assemble.go:43-46`). The class-closure gate expands over these.
- Design contexts (`contracts/contracts.go:581-592`): MES ("dense grid, hit targets at least
  48px, no hover states, high contrast, glanceable at 2 metres"), Web ("responsive, hover
  permitted, pointer and keyboard"), Mobile ("single column, thumb reach, touch only").

## 2. Fan-out and registry

- `Fanout` (`pipeline/src/usecase/fanout.go:48-68`): resolve if
  `templates[(component,target)]` exists, else bootstrap. Templates come from a blessed
  cell first, then the registry (`assemble.go:21-34`).
- React button registry entry (`pipeline/contracts/registry.v1.json:42-78`): body is
  `import { tokens } from './tokens'; export default function Button({ label, onClick })`
  with inline styles from `tokens.colorPrimaryDefault`, `tokens.colorOnPrimary`,
  `tokens.radiusControl`, `tokens.spaceInsetSm`, `tokens.fontSizeLabel`;
  `publicApiSurface ["label","onClick"]`; contract rule `accessible-label` (MUST, a11y).
- Template-fill does no substitution: `ComponentSource = t.Body`, `Styles = t.Styles`,
  `TokenSource = EmitTokenSource(tokens)` (`pipeline/src/adapter/resolve/resolve.go:44-61`).
  When the registry resolves, its contract wins over the drafted rules
  (`assemble.go:297-302`).

## 3. React bootstrap

System prompt `pipeline/prompts/bootstrap_system_react.txt`:

- L6: style through TRATON-lite classes (`tl-<component>` and modifiers); no `style`
  attribute, no literal colour or size on the markup.
- L7: define CSS for EXACTLY the classes the markup uses — `.tl-<component>`, every
  `tl-<component>__<part>`, every `tl-<component>--<variant>`, no others. Every value a
  design-token custom property, never a literal like `#0a1f33` or `8px`.
- L8: design contexts as rules scoped under `.tl-context-<context>`; never soften two
  contradicting constraints into one rule.
- L9-10: `className="tl-button"`; props as a destructured parameter.
- L11: a variant prop binds its modifier by interpolating the BARE PROP NAME
  (`` className={`tl-badge tl-badge--${tone}`} ``). Never an expression, ternary or call.
  A rule in styles for EVERY value the axis declares.
- L12: no import and no export statement.
- L15: output `{"renderedMarkup":"","styles":"","publicApiSurface":[…]}`.

User prompt (`pipeline/src/adapter/llmstage/llm_bootstrap.go:119-142`): component type,
ComponentContract JSON, DesignTokens guide, TargetProfile JSON, optional DesignContexts
section (`bootstrap_context_prompt.go:33`), then "DeclaredProperties, the only names an
interpolated modifier may use (case does not matter), each with the values that owe a
rule" (`bootstrap_properties_prompt.go:31`). The token guide is in web form even for React:
`var(--color-primary-default) = #b20018` (`bootstrap_token_prompt.go:36-64, 91`).

Post-processing (`llm_bootstrap.go:216-235`): `normalizeClassAttribute` rewrites `class=` →
`className=` for React; `validateBootstrapMarkup` rejects `\bclass\s*=` for React;
`styleMarkupRefs` canonicalises `tokens.X`; `styleStylesheetRefs` rewrites
`var(--color/primary/default)` → `var(--color-primary-default)` for defined names.

Repair loop (`bootstrap_repair.go`): runs the real `RunHardGates` with
`CSS = Markup = RenderedMarkup`; on findings re-asks up to 2 times; else keeps the attempt
with fewest findings.

Delivered `component.jsx` = `RenderedMarkup` verbatim (`pipeline/src/usecase/pipeline_cell.go:383-397`).
Nothing adds import/export or imports tokens/CSS. Bootstrap token source is empty, so no
`tokens.js` (`:208-225`).

## 4. Hard gate

`DefaultGateChecks` (`pipeline/src/adapter/hardgate/hard_gate.go:160-171`) over
`GateArtifact{CSS = Markup = RenderedMarkup, Styles, DefinedTokens, PublicAPISurface,
PropertyValues}` (`pipeline/src/usecase/pipeline_helpers.go:73-109`).
`RunHardGates(art, rules, checks...)` at `hard_gate.go:178`; rule data via
`LoadRuleDataSetFrom(path)` (`rule_data_loader.go:35`).

| Check | Reads | Fails on |
|---|---|---|
| `WithThresholds` | `Contrast`, `CornerRadius` | contrast < 4.5; radius > 8 for manufacturing_display. No-op per cell: both left zero (`pipeline_helpers.go:68-72`). |
| `WithTokenSet` | markup `tokens\.(\w+)`; styles `var\(\s*--([a-zA-Z0-9_-]+)\s*\)` | a reference outside the union of `tokenSets` |
| `WithTokenClosure` | same extraction vs `DefinedTokenNames()` | a reference the brand's variables do not define |
| `WithTokenReferenceForm` | styles | `var(--…)` name not `^[a-zA-Z0-9_-]+$` (fallback after a comma allowed) |
| `WithMarkupForm` | web only | quoted `style=` / `className=` on web |
| `WithAPISurfaceForm` | publicApiSurface | empty, > 64 chars, quote or whitespace |
| `WithClassClosure` (`hard_gate_class_closure.go:51-72`) | `tl-` classes in `class`/`className="…"` and `` className={`…${name}…`} `` expanded over declared values (case-insensitive) | a class with no stylesheet rule; an interpolation no declared property matches; ternaries / complex expressions. Non-`tl-` classes ignored. Unused rules are fine. |
| `WithTokenUsage` (`hard_gate_token_usage.go:46-108`) | styles declarations | a token whose category (first kebab segment) has a rule and the property is not on the allow-list |

`ruledata.v2.json`:

- Thresholds: `contrast-min-traton` / `-scania` 4.5; `corner-radius-max-manufacturing-display` 8.0.
- tokenSets:
  - colors: `--color-primary-{default,hover,active}`, `--color-secondary-{default,hover,active}`,
    `--color-on-primary`, `--color-on-secondary`, `--color-border-{default,focus}`,
    `--color-feedback-error`, `--color-state-disabled-surface`, `--color-surface-{page,raised}`,
    `--color-text-{primary,secondary,disabled}`, `--color-primary`, `--color-secondary`,
    `--color-success`, `--color-danger`, `--color-feedback-{success,warning,error}-{subtle,text}`.
  - spacing: `--space-inset-{sm,md,lg}`, `--space-stack-sm`, `--spacing-{xs,sm,md,lg}`.
  - typography: `--font-size-{label,body,base,large,caption}`, `--font-weight-bold`, `--font-body`.
  - radius: `--radius-control`, `--radius-sm`, `--border-control`.
- tokenUsage:
  - `color` → color, background(-color), border*, outline*, box-shadow, text-shadow, fill,
    stroke, caret-color, text-decoration-color, logical border-*-color.
  - `space` → padding*, margin*, gap / row-gap / column-gap, inset* (incl. logical).
  - `radius` → border-radius and corner / logical variants.
  - `font` → font, font-family, font-size, font-weight, font-style, line-height, letter-spacing.
  - No rule for `border` (or any other category) → unconstrained.

Contracts: `pipeline/contracts/button.v1.json` is loaded by no code. The contract comes from
the registry, a blessed cell, or `DraftContract`. No gate evaluates rule text.

## 5. Post-QA (advisory, never fails a publish)

Renderer is a stub (`pipeline/src/adapter/postqa/qa.go:64-72`). `CheckFocusOrder` looks for
positive HTML `tabindex` out of DOM order (JSX `tabIndex` does not match). `WithLabelOverflow`
is a no-op without font metrics. No contrast or class lens in post-QA. React gets no preview PNG.

## 6. Delivery format

Path `<target>/<component>/<brand>/v<contractVersion>/` (`layout.go:105-108`); CellID
`component:brand:target:n`. React extensions `.jsx` / `.js` (`layout.go:323-324`).

| File | When | Content |
|---|---|---|
| `component.jsx` | always | ComponentSource verbatim |
| `usage.jsx` | always | `import <Name> from './component';\n\nexport default function Example() {\n  return <<Name> />;\n}\n` (PascalCase from kebab, `:290`, `:307-315`) |
| `metadata.json` | always | `{"cellID","component","brand","target","contexts"?}`, 2-space indent, no trailing newline; `contexts` omitempty and never set in production |
| `a11y.json` | always | `{"componentType","annotations":[Rule…]}`, rules of kind `aria`/`a11y` (`:82-98`) |
| `component.css` | styles non-empty | verbatim |
| `tokens.js` | resolve path only | `export const tokens = {…};` |
| `tokens.dtcg.json` | brand has tokens | whole brand set nested on `/`, leaves `{"$type":"color"\|"number"\|"typography","$value":…}`, bare numbers (`pipeline/src/domain/dtcg_emit.go:53-109`) |
| `api.json` | v1 delivery | `{"componentType","contractVersion","publicApiSurface","rules"}` (`pipeline/src/domain/api_reference.go:26-31`) |

TRATON-lite (`pipeline/src/domain/tratonlite/tratonlite.go:65-104`) at `traton-lite/`:
`tokens/<brand>.css` (`:root` block), `components/<component>.css`, `components.css` and
`<brand>.css` headed `/* Generated by the TRATON pipeline (ADR 0104). Do not edit by hand. */`
with `@import "./tokens/<brand>.css";` and `@import "./components.css";`. Fed by web cells
only — React styles never reach it. No `package.json` or JS index is generated anywhere.

## 7. A real React cell (builder fixture, ADR 0164 D5)

`builder/src/client/fscatalog/testdata/published/react/link/scania/v1/component.jsx` (no
trailing newline):

```jsx
function Link({ label, size = 'md' }) {
  return (
    <a
      href="#"
      className={`tl-link tl-link--${size}`}
    >
      {label}
    </a>
  );
}
```

Its `component.css` uses `var(--color-primary-default)`, `:hover` / `:active` /
`:disabled, [aria-disabled="true"]` states, `.tl-link--sm` / `--md`, and
`.tl-context-mes .tl-link` rules — and also literals (`line-height: 1.4`, `16px`), which
the gate allows. `metadata.json`: `{"cellID": "link:scania:react:1", "component": "link",
"brand": "scania", "target": "react"}`. `a11y.json`: `{"componentType": "link",
"annotations": []}`. `api.json`: `publicApiSurface ["label","size"]` with rules `prop-size`
and `css-state-state`.

## 8. Live ADRs governing React cell shape

0048 (token binding per target), 0104 D1/D2 (TRATON-lite generated, styles reference tokens
by name), 0118 (one bootstrap prompt per target), 0123 D3 (React requires `className`),
0126 (cell = markup + stylesheet), 0131 (`component.css` for every target),
0137/0157/0161 (class closure over renderable classes; unexpandable expression is a
finding), 0143 (token category/property allow-list), 0150 (contexts as `.tl-context-<x>`),
0159 (`tokens.dtcg.json`), 0160/0171 (repair loop, DeclaredProperties), 0162 (prop rule
states the obligation), 0189 (`template.json` — accepted, not implemented).

## 9. TypeScript conventions in the backbone (`figma/`, `builder/web/`)

Biome: recommended preset, `useConst` and `useImportType` errors,
`noExcessiveCognitiveComplexity` max 15, `useExhaustiveSwitchCases` error, 2-space, LF,
line width 100. tsconfig: strict, `noImplicitAny`, `noImplicitOverride`,
`noImplicitReturns`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
`isolatedModules`. Tests: Vitest, `globals: false`, table-driven `it.each`
(`harness/agents/TESTING.md:266-273`).

## Gotchas for hand-writing cells

1. `usage.jsx` imports a default export `component.jsx` does not have.
2. No gate rejects literal values; only the prompt does. We enforce the prompt (ADR 0002 D5).
3. A `space` token on `width` / `height` / `min-height` fails `token-usage`.
4. `tokens.X` in a bootstrap JSX passes the gate but breaks at runtime (no `tokens.js`).
5. An interpolated modifier must use the declared property name. A property named "Style"
   would collide with React's `style` prop.
6. React styles never reach `traton-lite/`.
7. A blessed React cell turns the next publish into a resolve (`blessedsource.go:149-163`).
