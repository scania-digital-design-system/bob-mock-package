import type { FC } from 'react';
import BadgeCell from '../cells/react/badge/scania/v1/component.jsx';
import BlockCell from '../cells/react/block/scania/v1/component.jsx';
import BreadcrumbCell from '../cells/react/breadcrumb/scania/v1/component.jsx';
import BreadcrumbsCell from '../cells/react/breadcrumbs/scania/v1/component.jsx';
import ButtonCell from '../cells/react/button/scania/v1/component.jsx';
import CardCell from '../cells/react/card/scania/v1/component.jsx';
import DividerCell from '../cells/react/divider/scania/v1/component.jsx';
import FooterCell from '../cells/react/footer/scania/v1/component.jsx';
import FooterGroupCell from '../cells/react/footer-group/scania/v1/component.jsx';
import FooterItemCell from '../cells/react/footer-item/scania/v1/component.jsx';
import LinkCell from '../cells/react/link/scania/v1/component.jsx';
import MessageCell from '../cells/react/message/scania/v1/component.jsx';
import SpinnerCell from '../cells/react/spinner/scania/v1/component.jsx';
import StepCell from '../cells/react/step/scania/v1/component.jsx';
import StepperCell from '../cells/react/stepper/scania/v1/component.jsx';
import TagCell from '../cells/react/tag/scania/v1/component.jsx';
import type {
  BadgeProps,
  BlockProps,
  BreadcrumbProps,
  BreadcrumbsProps,
  ButtonProps,
  CardProps,
  DividerProps,
  FooterGroupProps,
  FooterItemProps,
  FooterProps,
  LinkProps,
  MessageProps,
  SpinnerProps,
  StepProps,
  StepperProps,
  TagProps,
} from './props.gen.js';

export type {
  BadgeProps,
  BlockProps,
  BreadcrumbProps,
  BreadcrumbsProps,
  ButtonProps,
  CardProps,
  DividerProps,
  FooterGroupProps,
  FooterItemProps,
  FooterProps,
  LinkProps,
  MessageProps,
  SpinnerProps,
  StepProps,
  StepperProps,
  TagProps,
} from './props.gen.js';

// One export per cell, named for its folder in cells/react/ (ADR 0005 D2), typed with
// the props generated from its payload (D4). Declared as constants so dist/index.d.ts
// does not point at cell files the package does not ship. The `.js` extension keeps
// dist/index.d.ts resolvable under Node's ESM resolution (nodenext).
export const Badge: FC<BadgeProps> = BadgeCell;
export const Button: FC<ButtonProps> = ButtonCell;
export const Link: FC<LinkProps> = LinkCell;
export const Spinner: FC<SpinnerProps> = SpinnerCell;
export const Card: FC<CardProps> = CardCell;
export const Divider: FC<DividerProps> = DividerCell;
export const Block: FC<BlockProps> = BlockCell;
export const Tag: FC<TagProps> = TagCell;
export const Message: FC<MessageProps> = MessageCell;
export const Breadcrumbs: FC<BreadcrumbsProps> = BreadcrumbsCell;
export const Breadcrumb: FC<BreadcrumbProps> = BreadcrumbCell;
export const Stepper: FC<StepperProps> = StepperCell;
export const Step: FC<StepProps> = StepCell;
export const Footer: FC<FooterProps> = FooterCell;
export const FooterGroup: FC<FooterGroupProps> = FooterGroupCell;
export const FooterItem: FC<FooterItemProps> = FooterItemCell;
