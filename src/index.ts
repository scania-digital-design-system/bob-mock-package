import type { FC } from 'react';
import AccordionCell from '../cells/react/accordion/scania/v1/component.jsx';
import AccordionItemCell from '../cells/react/accordion-item/scania/v1/component.jsx';
import BadgeCell from '../cells/react/badge/scania/v1/component.jsx';
import BannerCell from '../cells/react/banner/scania/v1/component.jsx';
import BlockCell from '../cells/react/block/scania/v1/component.jsx';
import BodyCellCell from '../cells/react/body-cell/scania/v1/component.jsx';
import BreadcrumbCell from '../cells/react/breadcrumb/scania/v1/component.jsx';
import BreadcrumbsCell from '../cells/react/breadcrumbs/scania/v1/component.jsx';
import ButtonCell from '../cells/react/button/scania/v1/component.jsx';
import CardCell from '../cells/react/card/scania/v1/component.jsx';
import CheckboxCell from '../cells/react/checkbox/scania/v1/component.jsx';
import ChipCell from '../cells/react/chip/scania/v1/component.jsx';
import DatetimeCell from '../cells/react/datetime/scania/v1/component.jsx';
import DividerCell from '../cells/react/divider/scania/v1/component.jsx';
import DropdownCell from '../cells/react/dropdown/scania/v1/component.jsx';
import DropdownOptionCell from '../cells/react/dropdown-option/scania/v1/component.jsx';
import FolderTabCell from '../cells/react/folder-tab/scania/v1/component.jsx';
import FolderTabsCell from '../cells/react/folder-tabs/scania/v1/component.jsx';
import FooterCell from '../cells/react/footer/scania/v1/component.jsx';
import FooterGroupCell from '../cells/react/footer-group/scania/v1/component.jsx';
import FooterItemCell from '../cells/react/footer-item/scania/v1/component.jsx';
import HeaderCellCell from '../cells/react/header-cell/scania/v1/component.jsx';
import IconCell from '../cells/react/icon/scania/v1/component.jsx';
import InlineTabCell from '../cells/react/inline-tab/scania/v1/component.jsx';
import InlineTabsCell from '../cells/react/inline-tabs/scania/v1/component.jsx';
import LinkCell from '../cells/react/link/scania/v1/component.jsx';
import MessageCell from '../cells/react/message/scania/v1/component.jsx';
import ModalCell from '../cells/react/modal/scania/v1/component.jsx';
import NavigationTabCell from '../cells/react/navigation-tab/scania/v1/component.jsx';
import NavigationTabsCell from '../cells/react/navigation-tabs/scania/v1/component.jsx';
import PopoverCanvasCell from '../cells/react/popover-canvas/scania/v1/component.jsx';
import PopoverCoreCell from '../cells/react/popover-core/scania/v1/component.jsx';
import PopoverMenuCell from '../cells/react/popover-menu/scania/v1/component.jsx';
import PopoverMenuItemCell from '../cells/react/popover-menu-item/scania/v1/component.jsx';
import RadioButtonCell from '../cells/react/radio-button/scania/v1/component.jsx';
import SliderCell from '../cells/react/slider/scania/v1/component.jsx';
import SpinnerCell from '../cells/react/spinner/scania/v1/component.jsx';
import StepCell from '../cells/react/step/scania/v1/component.jsx';
import StepperCell from '../cells/react/stepper/scania/v1/component.jsx';
import TableCell from '../cells/react/table/scania/v1/component.jsx';
import TableBodyCell from '../cells/react/table-body/scania/v1/component.jsx';
import TableBodyInputWrapperCell from '../cells/react/table-body-input-wrapper/scania/v1/component.jsx';
import TableBodyRowCell from '../cells/react/table-body-row/scania/v1/component.jsx';
import TableBodyRowExpandableCell from '../cells/react/table-body-row-expandable/scania/v1/component.jsx';
import TableFooterCell from '../cells/react/table-footer/scania/v1/component.jsx';
import TableHeaderCell from '../cells/react/table-header/scania/v1/component.jsx';
import TableHeaderInputWrapperCell from '../cells/react/table-header-input-wrapper/scania/v1/component.jsx';
import TableToolbarCell from '../cells/react/table-toolbar/scania/v1/component.jsx';
import TagCell from '../cells/react/tag/scania/v1/component.jsx';
import TextFieldCell from '../cells/react/text-field/scania/v1/component.jsx';
import TextareaCell from '../cells/react/textarea/scania/v1/component.jsx';
import ToastCell from '../cells/react/toast/scania/v1/component.jsx';
import ToggleCell from '../cells/react/toggle/scania/v1/component.jsx';
import TooltipCell from '../cells/react/tooltip/scania/v1/component.jsx';
import type {
  AccordionItemProps,
  AccordionProps,
  BadgeProps,
  BannerProps,
  BlockProps,
  BodyCellProps,
  BreadcrumbProps,
  BreadcrumbsProps,
  ButtonProps,
  CardProps,
  CheckboxProps,
  ChipProps,
  DatetimeProps,
  DividerProps,
  DropdownOptionProps,
  DropdownProps,
  FolderTabProps,
  FolderTabsProps,
  FooterGroupProps,
  FooterItemProps,
  FooterProps,
  HeaderCellProps,
  IconProps,
  InlineTabProps,
  InlineTabsProps,
  LinkProps,
  MessageProps,
  ModalProps,
  NavigationTabProps,
  NavigationTabsProps,
  PopoverCanvasProps,
  PopoverCoreProps,
  PopoverMenuItemProps,
  PopoverMenuProps,
  RadioButtonProps,
  SliderProps,
  SpinnerProps,
  StepProps,
  StepperProps,
  TableBodyInputWrapperProps,
  TableBodyProps,
  TableBodyRowExpandableProps,
  TableBodyRowProps,
  TableFooterProps,
  TableHeaderInputWrapperProps,
  TableHeaderProps,
  TableProps,
  TableToolbarProps,
  TagProps,
  TextareaProps,
  TextFieldProps,
  ToastProps,
  ToggleProps,
  TooltipProps,
} from './props.gen.js';

export type {
  AccordionItemProps,
  AccordionProps,
  BadgeProps,
  BannerProps,
  BlockProps,
  BodyCellProps,
  BreadcrumbProps,
  BreadcrumbsProps,
  ButtonProps,
  CardProps,
  CheckboxProps,
  ChipProps,
  DatetimeProps,
  DividerProps,
  DropdownOptionProps,
  DropdownProps,
  FolderTabProps,
  FolderTabsProps,
  FooterGroupProps,
  FooterItemProps,
  FooterProps,
  HeaderCellProps,
  IconProps,
  InlineTabProps,
  InlineTabsProps,
  LinkProps,
  MessageProps,
  ModalProps,
  NavigationTabProps,
  NavigationTabsProps,
  PopoverCanvasProps,
  PopoverCoreProps,
  PopoverMenuItemProps,
  PopoverMenuProps,
  RadioButtonProps,
  SliderProps,
  SpinnerProps,
  StepProps,
  StepperProps,
  TableBodyInputWrapperProps,
  TableBodyProps,
  TableBodyRowExpandableProps,
  TableBodyRowProps,
  TableFooterProps,
  TableHeaderInputWrapperProps,
  TableHeaderProps,
  TableProps,
  TableToolbarProps,
  TagProps,
  TextareaProps,
  TextFieldProps,
  ToastProps,
  ToggleProps,
  TooltipProps,
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
export const Checkbox: FC<CheckboxProps> = CheckboxCell;
export const RadioButton: FC<RadioButtonProps> = RadioButtonCell;
export const Toggle: FC<ToggleProps> = ToggleCell;
export const Chip: FC<ChipProps> = ChipCell;
export const Textarea: FC<TextareaProps> = TextareaCell;
export const Accordion: FC<AccordionProps> = AccordionCell;
export const AccordionItem: FC<AccordionItemProps> = AccordionItemCell;
export const Banner: FC<BannerProps> = BannerCell;
export const Toast: FC<ToastProps> = ToastCell;
export const TextField: FC<TextFieldProps> = TextFieldCell;
export const FolderTabs: FC<FolderTabsProps> = FolderTabsCell;
export const FolderTab: FC<FolderTabProps> = FolderTabCell;
export const InlineTabs: FC<InlineTabsProps> = InlineTabsCell;
export const InlineTab: FC<InlineTabProps> = InlineTabCell;
export const NavigationTabs: FC<NavigationTabsProps> = NavigationTabsCell;
export const NavigationTab: FC<NavigationTabProps> = NavigationTabCell;
export const Datetime: FC<DatetimeProps> = DatetimeCell;
export const Modal: FC<ModalProps> = ModalCell;
export const Slider: FC<SliderProps> = SliderCell;
export const Dropdown: FC<DropdownProps> = DropdownCell;
export const DropdownOption: FC<DropdownOptionProps> = DropdownOptionCell;
export const Icon: FC<IconProps> = IconCell;
export const PopoverCore: FC<PopoverCoreProps> = PopoverCoreCell;
export const PopoverCanvas: FC<PopoverCanvasProps> = PopoverCanvasCell;
export const PopoverMenu: FC<PopoverMenuProps> = PopoverMenuCell;
export const PopoverMenuItem: FC<PopoverMenuItemProps> = PopoverMenuItemCell;
export const Tooltip: FC<TooltipProps> = TooltipCell;
export const Table: FC<TableProps> = TableCell;
export const TableToolbar: FC<TableToolbarProps> = TableToolbarCell;
export const TableHeader: FC<TableHeaderProps> = TableHeaderCell;
export const HeaderCell: FC<HeaderCellProps> = HeaderCellCell;
export const TableHeaderInputWrapper: FC<TableHeaderInputWrapperProps> =
  TableHeaderInputWrapperCell;
export const TableBody: FC<TableBodyProps> = TableBodyCell;
export const TableBodyRow: FC<TableBodyRowProps> = TableBodyRowCell;
export const TableBodyRowExpandable: FC<TableBodyRowExpandableProps> = TableBodyRowExpandableCell;
export const BodyCell: FC<BodyCellProps> = BodyCellCell;
export const TableBodyInputWrapper: FC<TableBodyInputWrapperProps> = TableBodyInputWrapperCell;
export const TableFooter: FC<TableFooterProps> = TableFooterCell;
