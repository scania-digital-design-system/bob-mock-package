# Findings: chip

Reference: Tegel `tds-chip` at `@scania/tegel@1.66.1`
(`packages/core/src/components/chip/`). Cell: `cells/react/chip/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | All props and events; `prefix`, `label`, `suffix` added |
| Behaviour (DOM tests) | Input type and role, size and disabled classes, part order, `tdsClick`, `tdsChange`, one radio chip per name, no click when disabled |
| Tokens added | 7 |

## Departures from Tegel

1. **The root is a `<label>`** around the hidden input and the pill, so no id is needed.
   `chipId` sets the id only when given.
2. **Slots are props.** `prefix`, `label` and `suffix` each render in a wrapper span.
3. **Padding follows the parts through `:has()`.** Tegel adds `prefix` and `suffix`
   classes when those slots are used. The cell checks for the wrapper spans with `:has()`,
   as the button does for its icon.
4. **Radio chips use native grouping.** Tegel sends an internal event to uncheck the other
   chips with the same `name`. The cell's radios share a `name`, so the browser does it.
5. **The browser holds the checked state** (`defaultChecked`); a later `checked` change is
   ignored. No `aria-checked`.

## Findings about BOB

1. **Slot presence is a derived class, again** (`button.md` finding 1). `:has()` keeps it
   inside the rules. Source: structural.
