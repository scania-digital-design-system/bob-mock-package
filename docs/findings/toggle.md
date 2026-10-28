# Findings: toggle

Reference: Tegel `tds-toggle` at `@scania/tegel@1.66.1`
(`packages/core/src/components/toggle/`). Cell: `cells/react/toggle/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | All props and `onTdsToggle`; `label` added; methods `focusElement`, `toggle` dropped |
| Behaviour (DOM tests) | Size and disabled classes, headline and label, `switch` named by its label, `tdsToggle` detail, initial state |
| Tokens added | 18 |

## Departures from Tegel

1. **The input and its label are wrapped in a `<label>`**, so no id is needed.
   `toggleId` sets the id only when given.
2. **The label slot is a `label` prop.** As in Tegel, no label element renders without it.
3. **Disabled styles come from a root modifier.** Tegel adds a `disabled` class to the
   headline and the label. The cell renders `tl-toggle--disabled-<value>` on the root and
   styles both parts under it.
4. **The browser holds the checked state** (`defaultChecked`); a later `checked` change is
   ignored.
5. **No forwarded `aria-describedby` or `aria-labelledby`.** Tegel copies them from the
   host element's attributes. A React consumer would pass them as props, and the cell
   does not declare them.
6. **No `aria-checked`** (it would go stale) **and no methods**
   (`checkbox.md` BOB finding 2).

## Findings about BOB

1. **A motion easing has no type.** Tegel's `cubic-bezier(0.4, 0, 0, 1)` is carried as
   `COLOR` (`motion/easing/scania`). Source: structural.
