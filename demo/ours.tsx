import type { FC, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './fonts';
import '../tokens/scania.css';
import '../cells/react/badge/scania/v1/component.css';
import '../cells/react/button/scania/v1/component.css';
import '../cells/react/link/scania/v1/component.css';
import '../cells/react/spinner/scania/v1/component.css';
import '../cells/react/card/scania/v1/component.css';
import '../cells/react/divider/scania/v1/component.css';
import '../cells/react/block/scania/v1/component.css';
import '../cells/react/tag/scania/v1/component.css';
import '../cells/react/message/scania/v1/component.css';
import '../cells/react/breadcrumbs/scania/v1/component.css';
import '../cells/react/breadcrumb/scania/v1/component.css';
import '../cells/react/stepper/scania/v1/component.css';
import '../cells/react/step/scania/v1/component.css';
import '../cells/react/footer/scania/v1/component.css';
import '../cells/react/footer-group/scania/v1/component.css';
import '../cells/react/footer-item/scania/v1/component.css';
import '../cells/react/checkbox/scania/v1/component.css';
import '../cells/react/radio-button/scania/v1/component.css';
import '../cells/react/toggle/scania/v1/component.css';
import '../cells/react/chip/scania/v1/component.css';
import '../cells/react/textarea/scania/v1/component.css';
import '../cells/react/accordion/scania/v1/component.css';
import '../cells/react/accordion-item/scania/v1/component.css';
import '../cells/react/banner/scania/v1/component.css';
import '../cells/react/toast/scania/v1/component.css';
import '../cells/react/text-field/scania/v1/component.css';
import '../cells/react/folder-tabs/scania/v1/component.css';
import '../cells/react/folder-tab/scania/v1/component.css';
import '../cells/react/inline-tabs/scania/v1/component.css';
import '../cells/react/inline-tab/scania/v1/component.css';
import '../cells/react/navigation-tabs/scania/v1/component.css';
import '../cells/react/navigation-tab/scania/v1/component.css';
import '../cells/react/datetime/scania/v1/component.css';
import '../cells/react/modal/scania/v1/component.css';
import '../cells/react/slider/scania/v1/component.css';
import '../cells/react/dropdown/scania/v1/component.css';
import '../cells/react/dropdown-option/scania/v1/component.css';
import '../cells/react/icon/scania/v1/component.css';
import '../cells/react/popover-core/scania/v1/component.css';
import '../cells/react/popover-canvas/scania/v1/component.css';
import '../cells/react/popover-menu/scania/v1/component.css';
import '../cells/react/popover-menu-item/scania/v1/component.css';
import '../cells/react/tooltip/scania/v1/component.css';
import '../cells/react/table/scania/v1/component.css';
import '../cells/react/table-toolbar/scania/v1/component.css';
import '../cells/react/table-header/scania/v1/component.css';
import '../cells/react/header-cell/scania/v1/component.css';
import '../cells/react/table-body/scania/v1/component.css';
import '../cells/react/table-body-row/scania/v1/component.css';
import '../cells/react/table-body-row-expandable/scania/v1/component.css';
import '../cells/react/body-cell/scania/v1/component.css';
import '../cells/react/table-footer/scania/v1/component.css';
import '../cells/react/side-menu/scania/v1/component.css';
import '../cells/react/side-menu-overlay/scania/v1/component.css';
import '../cells/react/side-menu-close-button/scania/v1/component.css';
import '../cells/react/side-menu-item/scania/v1/component.css';
import '../cells/react/side-menu-dropdown/scania/v1/component.css';
import '../cells/react/side-menu-dropdown-list/scania/v1/component.css';
import '../cells/react/side-menu-dropdown-list-item/scania/v1/component.css';
import '../cells/react/side-menu-collapse-button/scania/v1/component.css';
import '../cells/react/side-menu-user/scania/v1/component.css';
import '../cells/react/side-menu-user-image/scania/v1/component.css';
import '../cells/react/side-menu-user-label/scania/v1/component.css';
import Accordion from '../cells/react/accordion/scania/v1/component.jsx';
import AccordionItem from '../cells/react/accordion-item/scania/v1/component.jsx';
import Badge from '../cells/react/badge/scania/v1/component.jsx';
import Banner from '../cells/react/banner/scania/v1/component.jsx';
import Block from '../cells/react/block/scania/v1/component.jsx';
import BodyCell from '../cells/react/body-cell/scania/v1/component.jsx';
import Breadcrumb from '../cells/react/breadcrumb/scania/v1/component.jsx';
import Breadcrumbs from '../cells/react/breadcrumbs/scania/v1/component.jsx';
import Button from '../cells/react/button/scania/v1/component.jsx';
import Card from '../cells/react/card/scania/v1/component.jsx';
import Checkbox from '../cells/react/checkbox/scania/v1/component.jsx';
import Chip from '../cells/react/chip/scania/v1/component.jsx';
import Datetime from '../cells/react/datetime/scania/v1/component.jsx';
import Divider from '../cells/react/divider/scania/v1/component.jsx';
import Dropdown from '../cells/react/dropdown/scania/v1/component.jsx';
import DropdownOption from '../cells/react/dropdown-option/scania/v1/component.jsx';
import FolderTab from '../cells/react/folder-tab/scania/v1/component.jsx';
import FolderTabs from '../cells/react/folder-tabs/scania/v1/component.jsx';
import Footer from '../cells/react/footer/scania/v1/component.jsx';
import FooterGroup from '../cells/react/footer-group/scania/v1/component.jsx';
import FooterItem from '../cells/react/footer-item/scania/v1/component.jsx';
import HeaderCell from '../cells/react/header-cell/scania/v1/component.jsx';
import Icon from '../cells/react/icon/scania/v1/component.jsx';
import InlineTab from '../cells/react/inline-tab/scania/v1/component.jsx';
import InlineTabs from '../cells/react/inline-tabs/scania/v1/component.jsx';
import Link from '../cells/react/link/scania/v1/component.jsx';
import Message from '../cells/react/message/scania/v1/component.jsx';
import Modal from '../cells/react/modal/scania/v1/component.jsx';
import NavigationTab from '../cells/react/navigation-tab/scania/v1/component.jsx';
import NavigationTabs from '../cells/react/navigation-tabs/scania/v1/component.jsx';
import PopoverCanvas from '../cells/react/popover-canvas/scania/v1/component.jsx';
import PopoverCore from '../cells/react/popover-core/scania/v1/component.jsx';
import PopoverMenu from '../cells/react/popover-menu/scania/v1/component.jsx';
import PopoverMenuItem from '../cells/react/popover-menu-item/scania/v1/component.jsx';
import RadioButton from '../cells/react/radio-button/scania/v1/component.jsx';
import SideMenu from '../cells/react/side-menu/scania/v1/component.jsx';
import SideMenuCloseButton from '../cells/react/side-menu-close-button/scania/v1/component.jsx';
import SideMenuCollapseButton from '../cells/react/side-menu-collapse-button/scania/v1/component.jsx';
import SideMenuDropdown from '../cells/react/side-menu-dropdown/scania/v1/component.jsx';
import SideMenuDropdownList from '../cells/react/side-menu-dropdown-list/scania/v1/component.jsx';
import SideMenuDropdownListItem from '../cells/react/side-menu-dropdown-list-item/scania/v1/component.jsx';
import SideMenuItem from '../cells/react/side-menu-item/scania/v1/component.jsx';
import SideMenuOverlay from '../cells/react/side-menu-overlay/scania/v1/component.jsx';
import SideMenuUserImage from '../cells/react/side-menu-user-image/scania/v1/component.jsx';
import SideMenuUserLabel from '../cells/react/side-menu-user-label/scania/v1/component.jsx';
import Slider from '../cells/react/slider/scania/v1/component.jsx';
import Spinner from '../cells/react/spinner/scania/v1/component.jsx';
import Step from '../cells/react/step/scania/v1/component.jsx';
import Stepper from '../cells/react/stepper/scania/v1/component.jsx';
import Table from '../cells/react/table/scania/v1/component.jsx';
import TableBody from '../cells/react/table-body/scania/v1/component.jsx';
import TableBodyRow from '../cells/react/table-body-row/scania/v1/component.jsx';
import TableBodyRowExpandable from '../cells/react/table-body-row-expandable/scania/v1/component.jsx';
import TableFooter from '../cells/react/table-footer/scania/v1/component.jsx';
import TableHeader from '../cells/react/table-header/scania/v1/component.jsx';
import TableToolbar from '../cells/react/table-toolbar/scania/v1/component.jsx';
import Tag from '../cells/react/tag/scania/v1/component.jsx';
import TextField from '../cells/react/text-field/scania/v1/component.jsx';
import Textarea from '../cells/react/textarea/scania/v1/component.jsx';
import Toast from '../cells/react/toast/scania/v1/component.jsx';
import Toggle from '../cells/react/toggle/scania/v1/component.jsx';
import Tooltip from '../cells/react/tooltip/scania/v1/component.jsx';
import {
  ACCORDION,
  CRUMBS,
  DROPDOWN_OPTIONS,
  FOOTER_END,
  FOOTER_START,
  FOOTER_TOP,
  ICON_PATH,
  MENU_ITEMS,
  NESTED_BLOCKS,
  SECTIONS,
  SIDE_MENU_ITEMS,
  SIDE_MENU_USER,
  type SideMenuParts,
  STEPS,
  TABLE_COLUMNS,
  TABLE_ROWS,
  TABS,
  type TableParts,
  THUMBNAIL_SRC,
} from './cases';

const COMPONENTS: Record<string, FC<Record<string, unknown>>> = {
  badge: Badge,
  button: Button,
  link: Link,
  spinner: Spinner,
  card: Card,
  divider: Divider,
  block: Block,
  tag: Tag,
  message: Message,
  breadcrumbs: Breadcrumbs,
  stepper: Stepper,
  footer: Footer,
  checkbox: Checkbox,
  'radio-button': RadioButton,
  toggle: Toggle,
  chip: Chip,
  textarea: Textarea,
  accordion: Accordion,
  banner: Banner,
  toast: Toast,
  'text-field': TextField,
  'folder-tabs': FolderTabs,
  'inline-tabs': InlineTabs,
  'navigation-tabs': NavigationTabs,
  datetime: Datetime,
  modal: Modal,
  slider: Slider,
  dropdown: Dropdown,
  icon: Icon,
  'popover-core': PopoverCore,
  'popover-canvas': PopoverCanvas,
  'popover-menu': PopoverMenu,
  tooltip: Tooltip,
  table: Table,
  'side-menu': SideMenu,
};

function sideMenuSlots({ dropdownOpen, collapsible }: SideMenuParts) {
  return {
    overlay: <SideMenuOverlay />,
    closeButton: <SideMenuCloseButton />,
    children: SIDE_MENU_ITEMS.map(({ label, icon, items, selected }) =>
      items ? (
        <SideMenuDropdown
          key={label}
          buttonLabel={label}
          selected={selected}
          defaultOpen={dropdownOpen && selected}
          icon={<Icon name={icon} size="24px" />}
        >
          <SideMenuDropdownList>
            {items.map((item, i) => (
              <SideMenuDropdownListItem key={item} selected={selected && i === 0}>
                <a href="#side-menu">{item}</a>
              </SideMenuDropdownListItem>
            ))}
          </SideMenuDropdownList>
        </SideMenuDropdown>
      ) : (
        <SideMenuItem key={label}>
          <button type="button">
            <Icon name={icon} size="24px" />
            {label}
          </button>
        </SideMenuItem>
      ),
    ),
    end: (
      <SideMenuDropdown
        icon={<SideMenuUserImage src={THUMBNAIL_SRC} alt="" />}
        label={
          <SideMenuUserLabel
            heading={SIDE_MENU_USER.heading}
            subheading={SIDE_MENU_USER.subheading}
          />
        }
      >
        <SideMenuDropdownList>
          {SIDE_MENU_USER.items.map((item) => (
            <SideMenuDropdownListItem key={item}>
              <a href="#side-menu">{item}</a>
            </SideMenuDropdownListItem>
          ))}
        </SideMenuDropdownList>
      </SideMenuDropdown>
    ),
    stickyEnd: collapsible && <SideMenuCollapseButton>Collapse</SideMenuCollapseButton>,
  };
}

function tableChildren({ toolbar, footer, expandable, sortable }: TableParts) {
  const Row = expandable ? TableBodyRowExpandable : TableBodyRow;
  return [
    toolbar && (
      <TableToolbar key="toolbar" tableTitle="Vehicles" filter tdsSearchAriaLabel="Search" />
    ),
    <TableHeader key="header">
      {TABLE_COLUMNS.map(({ key, title }) => (
        <HeaderCell key={key} cellKey={key} cellValue={title} sortable={sortable} />
      ))}
    </TableHeader>,
    <TableBody key="body">
      {TABLE_ROWS.map((row) => (
        <Row key={row[0]} expandRow={expandable ? 'Expanded row content' : undefined}>
          {row.map((value, i) => (
            <BodyCell key={value} cellKey={TABLE_COLUMNS[i]?.key} cellValue={value} />
          ))}
        </Row>
      ))}
    </TableBody>,
    footer && <TableFooter key="footer" pagination pages="4" />,
  ];
}

const TAB_CELLS: Record<string, FC<Record<string, unknown>>> = {
  folder: FolderTab,
  inline: InlineTab,
  navigation: NavigationTab,
};

function tabs(family: string) {
  const Tab = TAB_CELLS[family];
  return (
    Tab &&
    TABS.map(({ label, disabled }) => (
      <Tab key={label} disabled={disabled}>
        <button type="button" role="tab">
          {label}
        </button>
      </Tab>
    ))
  );
}

const crumbs = CRUMBS.map((name, i) => (
  <Breadcrumb key={name} current={i === CRUMBS.length - 1}>
    <a href="#breadcrumbs">{name}</a>
  </Breadcrumb>
));

const steps = STEPS.map(({ index, state, label }) => (
  <Step key={index} index={index} state={state} label={label} />
));

function footerGroup(label: string, items: string[], title?: string) {
  return (
    <FooterGroup key={label} tdsListAriaLabel={label} title={title && <h6>{title}</h6>}>
      {items.map((item) => (
        <FooterItem key={item}>
          <a href="#footer">{item}</a>
        </FooterItem>
      ))}
    </FooterGroup>
  );
}

const icon = (
  <svg viewBox="0 0 20 20" width="100%" height="100%" aria-hidden="true">
    <path d={ICON_PATH} />
  </svg>
);

const prefix = (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d={ICON_PATH} />
  </svg>
);

// Blocks inside blocks, NESTED_BLOCKS deep, to show the alternating backgrounds.
function nestedBlocks(depth: number): ReactNode {
  return depth === 0 ? null : (
    <Block>
      Level {NESTED_BLOCKS - depth + 1}
      {nestedBlocks(depth - 1)}
    </Block>
  );
}

const thumbnail = <img src={THUMBNAIL_SRC} alt="" width="100%" height="100%" />;

const actions = (
  <div className="actions">
    <Button size="sm" text="Primary" />
    <Button size="sm" text="Secondary" variant="secondary" />
  </div>
);

const accordionItems = ACCORDION.map(({ header, text, expanded }) => (
  <AccordionItem key={header} header={header} expanded={expanded}>
    {text}
  </AccordionItem>
));

const dropdownOptions = DROPDOWN_OPTIONS.map(({ value, label, disabled }) => (
  <DropdownOption key={value} value={value} disabled={disabled}>
    {label}
  </DropdownOption>
));

const menuItems = MENU_ITEMS.map(({ label, disabled }) => (
  <PopoverMenuItem key={label} disabled={disabled}>
    <a href="#menu">{label}</a>
  </PopoverMenuItem>
));

const actionLink = <a href="#actions">Read more</a>;

// Turns the shared case flags into the nodes our cells take as props.
function nodeProps(props: Record<string, unknown>): Record<string, unknown> {
  if (props.sideMenuParts) {
    const { sideMenuParts, ...rest } = props;
    return { ...rest, ...sideMenuSlots(sideMenuParts as SideMenuParts) };
  }
  return {
    ...props,
    icon: props.icon ? icon : undefined,
    thumbnail: props.thumbnail ? thumbnail : undefined,
    actions: props.actions ? actions : props.actionLink ? actionLink : undefined,
    prefix: props.prefix ? prefix : undefined,
    suffix: props.suffix ? prefix : undefined,
    top: props.top ? FOOTER_TOP.map((g) => footerGroup(g.title, g.items, g.title)) : undefined,
    start: props.start ? footerGroup('Legal', FOOTER_START) : undefined,
    end: props.end ? footerGroup('Social', FOOTER_END) : undefined,
    children: props.nested ? (
      <>Level 1{nestedBlocks(NESTED_BLOCKS - 1)}</>
    ) : props.crumbs ? (
      crumbs
    ) : props.steps ? (
      steps
    ) : props.items ? (
      accordionItems
    ) : props.options ? (
      dropdownOptions
    ) : props.menuItems ? (
      menuItems
    ) : props.tableParts ? (
      tableChildren(props.tableParts as TableParts)
    ) : typeof props.tabs === 'string' ? (
      tabs(props.tabs)
    ) : (
      props.children
    ),
  };
}

function Preview() {
  return SECTIONS.map(({ component, cases }) => {
    const Component = COMPONENTS[component];
    return (
      <section key={component} data-component={component}>
        <h2>{component}</h2>
        <dl className="cases">
          {cases.map(({ label, props, dark }) => (
            <div className="case" key={label}>
              <dt>{label}</dt>
              <dd className={dark ? 'dark' : undefined}>
                {typeof props.selector === 'string' && (
                  <button type="button" id={props.selector.slice(1)}>
                    Open
                  </button>
                )}
                {Component && <Component {...nodeProps(props)} />}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  });
}

const root = document.getElementById('root');
if (root === null) {
  throw new Error('demo: #root is missing');
}
createRoot(root).render(<Preview />);
