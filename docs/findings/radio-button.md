# Findings: radio button

Reference: Tegel `tds-radio-button` at `@scania/tegel@1.66.1`
(`packages/core/src/components/radio-button/`). Cell: `cells/react/radio-button/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | All props and `onTdsChange`; `label` added; method `focusElement` dropped |
| Behaviour (DOM tests) | Label, form attributes, one checked radio per group, `tdsChange` detail, disabled |
| Tokens added | 3, plus the tokens shared with the checkbox |

## Departures from Tegel

1. **The root is a `<label>`** around the input and the text, so no id is needed
   (`checkbox.md` departure 1). `radioId` sets the id only when given.
2. **The label slot is a `label` prop.**
3. **The browser holds the checked state** (`defaultChecked`), and keeps one radio per
   `name` checked, as Tegel's light-DOM inputs do.
4. **No `role="radio"` or `aria-checked` on the input.** Both repeat what the native
   radio exposes; Tegel's `aria-checked` goes stale after a click.
5. **No `focusElement()` method** (`checkbox.md` BOB finding 2).

## Findings about BOB

1. **`tdsTabIndex` is a string.** Tegel types it as a number. The surface has no number
   type, so it is `TEXT`, and the generated prop type is `string` (`README.md`
   finding 10). Source: structural.
