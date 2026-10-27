# Findings: link

Reference: Tegel `tds-link` at `@scania/tegel@1.66.1`
(`packages/core/src/components/link/`). Cell: `cells/react/link/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | `disabled`, `underline`, `standalone`; `href`, `target`, `children` added |
| Behaviour (DOM tests) | One `<a>`, `href`/`target`, underline and standalone modifiers, `aria-disabled` + `tabindex="-1"` when disabled |
| Tokens added | 3 |

## Departures from Tegel

1. **The cell renders the `<a>`.** Tegel wraps one consumer-supplied `<a>` in its default
   slot and styles it with `::slotted(*)`. A bootstrap cell cannot import anything
   (prompt L12), so it cannot use `React.cloneElement` to add classes or attributes to a
   child it was given. The cell renders the anchor itself; `href`, `target` and
   `children` take the slot's place. Other anchor attributes (`rel`, `download`, …) are
   not exposed.
2. **Disabled is reactive.** Tegel sets `tabindex` and `aria-disabled` once, in
   `componentWillLoad`, so toggling `disabled` later does nothing. The cell sets them on
   every render.
3. **No multiple-anchor warning.** Tegel warns when more than one `<a>` is slotted; the
   cell always renders exactly one.
4. **No context overrides.** Tegel recolours links inside `tds-toast` and `tds-banner`,
   and pads a `tds-icon` inside a link. Neither component is in scope.

## Findings about BOB

1. **No imports means no React APIs.** The prompt forbids every `import` (L12). JSX still
   works through the automatic runtime, but hooks, state, context and `cloneElement` are
   unreachable. This is why the link cannot style a passed-in anchor and why the button
   has no keyboard `.active` state.
2. **An attribute selector carries a state.** `disabled` has no modifier class; the
   stylesheet uses `.tl-link[aria-disabled='true']`, as BOB's own link fixture does. The
   gate does not inspect attribute selectors, so this state is outside class closure.
3. **Boolean modifiers again need a rule for `false`.** `tl-link--standalone-false`
   carries `font: inherit` and `tl-link--underline-true` repeats the base underline, only
   so the gate finds a rule for every renderable class.

## Open for visual comparison (Phase 7)

- `all: unset` on the anchor matches Tegel's `::slotted(*) { all: unset }`; check that
  inline links inherit the surrounding font the same way.
- The demo's "visited" row uses `href=""` (the current page) to trigger `:visited`;
  browsers limit which `:visited` styles they apply, so compare carefully.
