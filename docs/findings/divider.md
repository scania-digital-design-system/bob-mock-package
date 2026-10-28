# Findings: divider

Reference: Tegel `tds-divider` at `@scania/tegel@1.66.1`
(`packages/core/src/components/divider/`). Cell: `cells/react/divider/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | PASS |
| Public API vs `@scania/tegel` types | Exact: `orientation`, `variant` |
| Behaviour (DOM tests) | `role="separator"`, `aria-orientation` only when vertical, orientation and variant classes |
| Tokens added | 5 |

## Departures from Tegel

1. **Element.** Tegel renders a `<tds-divider>` host (shadow DOM) with the role, around a
   styled `<div>`. The cell renders one `<div>` with the role and the classes.
2. **`dark-blue` has its own class.** Tegel maps the deprecated `dark-blue` to the
   `expressive` class in code. The cell renders `tl-divider--dark-blue`, and the
   stylesheet gives it the `expressive` rule through a selector list.

## Findings about BOB

1. **A value alias needs its own modifier.** `className` takes only the bare prop name
   (L11), so an alias value cannot be mapped to another class. Each alias needs its own
   rule (here, a selector list). Source: structural rule, Tegel-specific trigger.

## Open for visual comparison (Phase 7)

- Tegel's vertical divider is `height: 100%` inside an inline custom element. Compare the
  vertical row: the cell's `<div>` takes 100% of its parent directly.
