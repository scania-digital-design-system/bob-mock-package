# Findings: stepper

Reference: Tegel `tds-stepper` and `tds-step` at `@scania/tegel@1.66.1`
(`packages/core/src/components/stepper/`). Cells: `cells/react/stepper/scania/v1/` and
`cells/react/step/scania/v1/`.

## Result

| Check | stepper | step |
|---|---|---|
| BOB hard gate (real, `npm run gate`) | PASS | PASS |
| Bootstrap prompt rules | PASS | Relaxed: `parent-modifier-selectors` |
| Public API vs `@scania/tegel` types | All Tegel props; `children` added | All Tegel props; `label` added |
| Behaviour (DOM tests) | Modifier classes, default `aria-label` | State classes, `aria-disabled`, `aria-label`, index or icon, label, `aria-current` |
| Tokens added | 2 | 17 |

## Departures from Tegel

1. **Elements.** Tegel renders `<tds-stepper>` and `<tds-step>` hosts (shadow DOM) around
   the `list` and the `listitem`. The cells render the `list` and the `listitem`.
2. **Steps read the stepper through CSS.** Tegel copies the stepper's `size`,
   `orientation`, `labelPosition` and `hideLabels` into each step's state, and updates
   them through an internal event. The step's stylesheet reads the stepper's modifier
   classes instead (relaxation `parent-modifier-selectors`, `README.md`). A change on the
   stepper always reaches the steps, with no event.
3. **Vertical ignores the label position.** Tegel sets `labelPosition` to `aside` when it
   loads vertical. The cell keeps the class it was given; the vertical rules simply do
   not read it.
4. **Hidden labels stay in the DOM.** Tegel does not render the label when `hideLabels` is
   set. The cell hides it with `display: none`. The label is `aria-hidden` in both.
5. **`stepperId` has no effect.** Tegel uses it to address its internal event, and makes a
   random one by default. The cell needs no event, so the prop is accepted and unused.
6. **Icons are inline SVG.** The success tick and the error warning are Tegel's paths, at
   20px (`lg`) or 16px (`sm`), as in the message.
7. **Slots are props.** The `label` slot is `label`; the stepper's default slot is
   `children`.

## Findings about BOB

1. **Compound components need a relaxation.** A child cell cannot read its parent's props
   and cannot style itself under the parent's classes without breaking L7. This is the
   first relaxation (`parent-modifier-selectors`). Source: structural.
2. **Literal geometry becomes value-named tokens.** Tegel positions the connecting lines
   with literals (`calc(50% + 16px + 16px)`, `top: 13px`). BOB needs a token for each, and
   the values have no meaning to name them by, so they are `size/stepper/<value>` (13
   tokens). Source: structural rule, Tegel-specific trigger.
3. **A parent's modifiers need filler rules.** `tl-stepper--lg`, `--sm`, `--below` and
   `--hide-labels-*` change only the steps, so the stepper's own stylesheet has nothing
   for them. The gate still needs a rule for each, so each repeats a base value. Source:
   structural.

## Open for visual comparison (Phase 7)

- The connecting lines in every demo row, especially `aside` and hidden labels.
