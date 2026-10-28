# Findings: text field

Reference: Tegel `tds-text-field` at `@scania/tegel@1.66.1`
(`packages/core/src/components/text-field/`). Cell: `cells/react/text-field/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | Relaxed: `react-hooks` (`useState`, `useId`) |
| Public API vs `@scania/tegel` types | All props and events except `modeVariant` (out of scope); `prefix`, `suffix` added; `focusElement` dropped |
| Behaviour (DOM tests) | Modifier classes, label positions, ids, prefix and suffix, live counter, number clamping with `tdsError`, click-to-focus, error icon |
| Tokens added | 19 |

## Departures from Tegel

The textarea's departures apply here too (`textarea.md`): CSS state selectors for focus
and filled, the browser holds the value, `tdsChange` fires on every input, a native
`title` for the read-only tooltip, and number props as strings (`min`, `max`, `step`,
`maxLength`). In addition:

1. **Slots are props.** `prefix` and `suffix` render in wrapper `<div>`s.
2. **Click-to-focus without a ref.** The container's click handler finds its own input
   with `event.currentTarget.querySelector('input')`.
3. **Number clamping writes the DOM value.** On blur, a number out of `min`/`max` is set
   on the input element and reported with `tdsError`, as in Tegel. If `min` is greater
   than `max`, the cell warns and skips `tdsBlur`, as Tegel does.
4. **Read-only and success/error combine with `:not()`.** Tegel's read-only class applies
   only when not disabled, and its state borders only when not read-only. The cell
   expresses both with selectors on its modifiers, for example
   `:not(.tl-text-field--read-only-true.tl-text-field--disabled-false)`.

## Findings about BOB

1. **The third user of `react-hooks`** (`useState` for the counter, `useId` for the ids).
   Source: structural.
2. **Event handlers can reach the DOM without refs.** `event.target` and
   `event.currentTarget` cover blur clamping and click-to-focus. Source: structural.
