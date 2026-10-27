import type { FC } from 'react';
import BadgeCell from '../cells/react/badge/scania/v1/component.jsx';
import ButtonCell from '../cells/react/button/scania/v1/component.jsx';
import CardCell from '../cells/react/card/scania/v1/component.jsx';
import LinkCell from '../cells/react/link/scania/v1/component.jsx';
import SpinnerCell from '../cells/react/spinner/scania/v1/component.jsx';
import type { BadgeProps, ButtonProps, CardProps, LinkProps, SpinnerProps } from './props.gen';

export type { BadgeProps, ButtonProps, CardProps, LinkProps, SpinnerProps } from './props.gen';

// One export per cell, named for its folder in cells/react/ (ADR 0005 D2), typed with
// the props generated from its payload (D4). Declared as constants so dist/index.d.ts
// does not point at cell files the package does not ship.
export const Badge: FC<BadgeProps> = BadgeCell;
export const Button: FC<ButtonProps> = ButtonCell;
export const Link: FC<LinkProps> = LinkCell;
export const Spinner: FC<SpinnerProps> = SpinnerCell;
export const Card: FC<CardProps> = CardCell;
