# Findings: datetime

Reference: Tegel `tds-datetime` at `@scania/tegel@1.66.1`
(`packages/core/src/components/datetime/`). Cell: `cells/react/datetime/scania/v1/`.

## Result

| Check | Result |
|---|---|
| BOB hard gate (real, `npm run gate`) | PASS |
| Bootstrap prompt rules | Relaxed: `react-hooks` (`useState`, `useId`) |
| Public API vs `@scania/tegel` types | All props and events except `modeVariant` (out of scope); `reset`, `setValue`, `focusElement` dropped |
| Behaviour (DOM tests) | Modifier classes, input types and icons, default value per type, labels, aria-label, validation on blur and input, error and helper text, events, disabled |
| Tokens added | 12 |

## Departures from Tegel

1. **The validation state uses `useState`** (relaxation `react-hooks`). The `state` prop is
   the initial state. The state variable has the prop's name and values, so one modifier,
   `tl-datetime--${state}`, shows both (finding 1 below).
2. **Stable ids from `useId`.** Tegel uses `name` as the input id and makes a random
   `name` when none is given. The cell sets `name` only when it is given.
3. **`aria-invalid` is set in the error state.** Tegel sets no ARIA state.
4. **One icon by type.** Tegel renders the calendar and clock icons and hides one with
   CSS. The cell renders the clock for `time` and the calendar for every other type.
5. **No iPhone padding.** Tegel reads the user agent while it renders and adds an
   `iphone` class that removes the input padding. A cell cannot derive a class (L11).
6. **The focus ring uses `:focus`.** Tegel adds a focus class from `focusin` and
   `focusout` listeners.
7. **`value` is the initial value.** The input holds the value; a later prop change is
   ignored. Tegel's `value` is mutable and reflected.
8. **No methods** (`reset`, `setValue`, `focusElement`), so no `tdsChange` from a reset.
9. **`customValidator` is typed through the override map,** as events are. No surface
   type describes a function.

Visual checks for Phase 7: the inside label position for `lg` and `md`, the placeholder
colour of the date parts in Chrome and Safari, and the icon position in Firefox.

## Findings about BOB

1. **The checks cannot tell a prop from a state variable with the same name.** The cell
   renames the prop (`state: initialState`) and names its state variable `state`. The
   variable holds only the prop's declared values, so the modifier passes L11 and class
   closure. It is the only way to put a changing state into a class. Source: structural.
2. **A function prop has no surface type** (`customValidator`). Source: structural.
3. **Browser checks stay in handlers.** The Chrome check before `showPicker()` runs in a
   key handler. The iPhone check cannot become a class. Source: structural.
