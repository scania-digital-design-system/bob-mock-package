import type { FC } from 'react';
import BadgeCell from '../cells/react/badge/scania/v1/component.jsx';
import ButtonCell from '../cells/react/button/scania/v1/component.jsx';
import CardCell from '../cells/react/card/scania/v1/component.jsx';
import LinkCell from '../cells/react/link/scania/v1/component.jsx';
import SpinnerCell from '../cells/react/spinner/scania/v1/component.jsx';

// One export per cell, named for its folder in cells/react/ (ADR 0005 D2). Declared as
// constants so dist/index.d.ts does not point at cell files the package does not ship.
// Props are loose until the generated types land (ADR 0005 D4).
type Cell = FC<Record<string, unknown>>;

export const Badge: Cell = BadgeCell;
export const Button: Cell = ButtonCell;
export const Link: Cell = LinkCell;
export const Spinner: Cell = SpinnerCell;
export const Card: Cell = CardCell;
