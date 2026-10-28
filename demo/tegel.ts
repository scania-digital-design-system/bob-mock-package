import '@scania/tegel/dist/tegel/tegel.css';
import { defineCustomElements } from '@scania/tegel/loader';
import {
  ACCORDION,
  CRUMBS,
  type DemoCase,
  DROPDOWN_OPTIONS,
  FOOTER_END,
  FOOTER_START,
  FOOTER_TOP,
  ICON_PATH,
  MENU_ITEMS,
  NESTED_BLOCKS,
  SECTIONS,
  STEPS,
  TABS,
  THUMBNAIL_SRC,
} from './cases';

// The reference: Tegel's own web components, rendered with Tegel's CSS.

const SVG_NS = 'http://www.w3.org/2000/svg';

// Tegel takes the icon through its "icon" slot, so the prop becomes a slotted child.
function slottedIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('slot', 'icon');
  svg.setAttribute('viewBox', '0 0 20 20');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', ICON_PATH);
  svg.append(path);
  return svg;
}

// Tegel's link takes a slotted <a>; our cell renders it from href, target and children.
function slottedAnchor(href: unknown, target: unknown, children: unknown): HTMLAnchorElement {
  const anchor = document.createElement('a');
  anchor.href = String(href ?? '');
  if (typeof target === 'string') {
    anchor.target = target;
  }
  anchor.textContent = String(children ?? '');
  return anchor;
}

// Tegel's card takes thumbnail, body and actions through named slots.
function cardSlots(thumbnail: unknown, body: unknown, actions: unknown): HTMLElement[] {
  const slots: HTMLElement[] = [];
  if (thumbnail) {
    const img = Object.assign(document.createElement('img'), { src: THUMBNAIL_SRC, alt: '' });
    img.slot = 'thumbnail';
    slots.push(img);
  }
  if (typeof body === 'string') {
    const div = Object.assign(document.createElement('div'), { textContent: body });
    div.slot = 'body';
    slots.push(div);
  }
  if (actions) {
    const div = document.createElement('div');
    div.slot = 'actions';
    div.className = 'actions';
    div.append(
      Object.assign(document.createElement('tds-button'), { size: 'sm', text: 'Primary' }),
      Object.assign(document.createElement('tds-button'), {
        size: 'sm',
        text: 'Secondary',
        variant: 'secondary',
      }),
    );
    slots.push(div);
  }
  return slots;
}

// Tegel's tag and chip take a 16px icon through their "prefix" (and chip "suffix") slot.
function slottedPrefix(slot = 'prefix'): SVGSVGElement {
  const svg = slottedIcon();
  svg.setAttribute('slot', slot);
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('fill', 'currentColor');
  return svg;
}

// Blocks inside blocks, as the default slot, to show the alternating backgrounds.
function nestedBlocks(level: number): HTMLElement {
  const block = document.createElement('tds-block');
  block.append(`Level ${level}`);
  if (level < NESTED_BLOCKS) {
    block.append(nestedBlocks(level + 1));
  }
  return block;
}

function child(tag: string, props: Record<string, unknown>, ...content: (Node | string)[]) {
  const el = Object.assign(document.createElement(tag), props);
  el.append(...content);
  return el;
}

function anchor(text: string, href: string): HTMLAnchorElement {
  return Object.assign(document.createElement('a'), { href, textContent: text });
}

// Tegel's footer groups go in a slotted wrapper; the title is a slotted heading.
function footerSlot(slot: string, groups: { title?: string; label: string; items: string[] }[]) {
  const wrapper = child('div', { slot });
  for (const { title, label, items } of groups) {
    const group = child('tds-footer-group', { tdsListAriaLabel: label });
    if (title) {
      group.append(child('h6', { slot: 'title' }, title));
    }
    group.append(...items.map((item) => child('tds-footer-item', {}, anchor(item, '#footer'))));
    wrapper.append(group);
  }
  return wrapper;
}

// Children for the compound components, from the same data as our page.
function compoundChildren(props: Record<string, unknown>): HTMLElement[] {
  if (props.crumbs) {
    return CRUMBS.map((name, i) =>
      child('tds-breadcrumb', { current: i === CRUMBS.length - 1 }, anchor(name, '#breadcrumbs')),
    );
  }
  if (props.steps) {
    return STEPS.map(({ index, state, label }) =>
      child('tds-step', { index, state }, child('span', { slot: 'label' }, label)),
    );
  }
  if (props.items) {
    return ACCORDION.map(({ header, text, expanded }) =>
      child('tds-accordion-item', { header, expanded: Boolean(expanded) }, text),
    );
  }
  if (props.options) {
    return DROPDOWN_OPTIONS.map(({ value, label, disabled }) =>
      child('tds-dropdown-option', { value, disabled: Boolean(disabled) }, label),
    );
  }
  if (props.menuItems) {
    return MENU_ITEMS.map(({ label, disabled }) =>
      child('tds-popover-menu-item', { disabled: Boolean(disabled) }, anchor(label, '#menu')),
    );
  }
  if (props.tabs) {
    return TABS.map(({ label, disabled }) =>
      child(
        `tds-${props.tabs}-tab`,
        { disabled: Boolean(disabled) },
        child('button', { role: 'tab' }, label),
      ),
    );
  }
  if (props.actionLink) {
    return [child('div', { slot: 'actions' }, anchor('Read more', '#actions'))];
  }
  const slots: HTMLElement[] = [];
  if (props.top) {
    slots.push(
      footerSlot(
        'top',
        FOOTER_TOP.map((g) => ({ ...g, label: g.title })),
      ),
    );
  }
  if (props.start) {
    slots.push(footerSlot('start', [{ label: 'Legal', items: FOOTER_START }]));
  }
  if (props.end) {
    slots.push(footerSlot('end', [{ label: 'Social', items: FOOTER_END }]));
  }
  return slots;
}

const LABEL_SLOT_TAGS = ['tds-checkbox', 'tds-radio-button', 'tds-toggle', 'tds-chip'];

function element(tag: string, { props }: DemoCase): HTMLElement {
  const {
    icon,
    prefix,
    nested,
    href,
    target,
    children,
    thumbnail,
    body,
    actions,
    crumbs,
    steps,
    top,
    start,
    end,
    suffix,
    items,
    actionLink,
    tabs,
    options,
    menuItems,
    ...rest
  } = props;
  // Form controls take their label through a "label" slot; the textarea's label is a prop.
  const { label, ...attributes } = rest;
  const slotsLabel = LABEL_SLOT_TAGS.includes(tag);
  const el = Object.assign(document.createElement(tag), slotsLabel ? attributes : rest);
  el.append(
    ...compoundChildren({
      crumbs,
      steps,
      top,
      start,
      end,
      items,
      actionLink,
      tabs,
      options,
      menuItems,
    }),
  );
  if (icon) {
    el.append(slottedIcon());
  }
  if (prefix) {
    el.append(slottedPrefix());
  }
  if (slotsLabel && typeof label === 'string') {
    el.append(child('span', { slot: 'label' }, label));
  }
  if (suffix) {
    el.append(slottedPrefix('suffix'));
  }
  if (tag === 'tds-link') {
    el.append(slottedAnchor(href, target, children));
  } else if (nested) {
    el.append('Level 1', nestedBlocks(2));
  } else if (typeof children === 'string') {
    el.append(children);
  }
  if (tag === 'tds-card' || tag === 'tds-modal') {
    el.append(...cardSlots(thumbnail, body, actions));
  }
  return el;
}

async function preview(root: HTMLElement) {
  await defineCustomElements();
  for (const { component, tag, cases } of SECTIONS) {
    await customElements.whenDefined(tag);
    const section = document.createElement('section');
    section.dataset.component = component;
    const heading = document.createElement('h2');
    heading.textContent = component;
    const list = document.createElement('dl');
    list.className = 'cases';
    for (const demoCase of cases) {
      const row = document.createElement('div');
      row.className = 'case';
      const term = document.createElement('dt');
      term.textContent = demoCase.label;
      const detail = document.createElement('dd');
      if (demoCase.dark) {
        detail.className = 'dark';
      }
      // A modal opens from a button that its selector names.
      const { selector } = demoCase.props;
      if (typeof selector === 'string') {
        detail.append(child('button', { id: selector.slice(1) }, 'Open'));
      }
      detail.append(element(tag, demoCase));
      row.append(term, detail);
      list.append(row);
    }
    section.append(heading, list);
    root.append(section);
  }
}

const root = document.getElementById('root');
if (root === null) {
  throw new Error('demo: #root is missing');
}
void preview(root);
