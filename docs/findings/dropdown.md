# Findings: dropdown

Reference: Tegel `tds-dropdown` and `tds-dropdown-option` at `@scania/tegel@1.66.1`
(`packages/core/src/components/dropdown/`). Cells: `cells/react/dropdown/scania/v1/` and
`cells/react/dropdown-option/scania/v1/`.

## Result

| Check | dropdown | dropdown-option |
|---|---|---|
| BOB hard gate (real, `npm run gate`) | PASS | PASS |
| Bootstrap prompt rules | Relaxed: `react-hooks` (`useState`, `useId`) | Relaxed: `parent-modifier-selectors` |
| Public API vs `@scania/tegel` types | All props and events; `modeVariant`, `animation` out of scope; `children` added; 7 methods dropped | `value`, `disabled`, `tdsAriaLabel`, `onTdsSelect`; `children` added; `setSelected`, `onTdsFocus`, `onTdsBlur` dropped |
| Behaviour (DOM tests) | Modifier classes, open and close, placeholder, default and set value, single and multiple selection, clear, selection actions, filter with diacritics, no result, hidden input, outside press, Escape, arrow keys, label and helper, focus and blur events | `tdsSelect`, disabled |
| Tokens added | 26 (family) | — |

## Departures from Tegel

1. **Elements.** Tegel renders hosts (shadow DOM). The dropdown renders its trigger, list,
   hidden input and helper directly; each option renders a `<div>` with its controls.
2. **The parent keeps its state with `useState`** (relaxation `react-hooks`): open,
   selection, filter text, the selected labels and the filter result count. The selected
   labels come from the options' DOM text after each render.
3. **The parent marks the options in the DOM.** It sets `aria-selected` on each option
   button and `checked` on each checkbox, and `hidden` on options the filter removes, as
   Tegel's `setSelected` and filter do. The option's stylesheet reads them.
4. **Each option renders both controls.** Tegel's option reads `multiselect` and `size`
   from its parent and renders a button or a `tds-checkbox`. A cell cannot read its
   parent, so the option renders a button and a checkbox, and its stylesheet shows one
   under the parent's `--multiselect-*` class and sizes it under the parent's size class
   (relaxation `parent-modifier-selectors`). The option content is in the DOM twice; the
   hidden copy is `display: none`.
5. **The multiselect checkbox is drawn by the option.** A cell cannot use the checkbox
   cell (L12), so the option copies its styles.
6. **A set `value` is controlled,** as in the tabs. A user change sends `tdsChange`; the
   selection follows `value`. Tegel's `value` is mutable. `value` is a string; a
   multiselect value is comma-separated (Tegel also takes an array).
7. **`openDirection="auto"` opens down, with a fixed maximum height per size.** Tegel
   measures the space above and below and sets the list height in a `style` attribute.
   A cell has no `style` attribute and no layout effect.
8. **The list is positioned against the select box,** not the whole dropdown. Tegel's
   `up` list moves when a helper is present.
9. **No animation** (out of scope, ADR 0002 D8); the list shows and hides with `display`.
10. **The multiselect filter clears the input on focus.** Tegel keeps the selected labels
    in the input until it is clicked, and strips them from what the user types.
11. **"Select filtered" is never disabled.** Tegel disables it when every filtered option
    is selected; the cell would have to read the DOM while it renders.
12. **No console warnings** for unknown values.
13. **The hidden input is rendered when `name` is set.** Tegel appends it to the host.
14. **No methods** (`setValue`, `reset`, `removeValue`, `focusElement`, `close`,
    `updateDisplay`, and the internal `appendValue`). A form reset clears the selection,
    as in Tegel.

Visual checks for Phase 7: the inside label positions, the list shadow and height, the
multiselect checkbox alignment, the filter input and the selection actions.

## Findings about BOB

1. **A child that changes its markup by the parent's props has no conforming form.** The
   option renders both forms and lets the parent's class pick one. Source: structural.
2. **A DOM write is not a place for text React renders.** The selected labels change
   what the trigger shows. Writing them into the DOM would conflict with React's own
   text nodes, so the parent needs state (`react-hooks`) even where the tabs did not.
   Source: structural.
3. **A list that sizes itself to the viewport needs a style.** As with the slider's fill,
   a measured value has no conforming way into CSS. Source: structural.
