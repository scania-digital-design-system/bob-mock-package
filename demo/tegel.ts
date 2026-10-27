import '@scania/tegel/dist/tegel/tegel.css';
import { defineCustomElements } from '@scania/tegel/loader';
import { type DemoCase, ICON_PATH, SECTIONS, THUMBNAIL_SRC } from './cases';

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

function element(tag: string, { props }: DemoCase): HTMLElement {
  const { icon, href, target, children, thumbnail, body, actions, ...rest } = props;
  const el = Object.assign(document.createElement(tag), rest);
  if (icon) {
    el.append(slottedIcon());
  }
  if (tag === 'tds-link') {
    el.append(slottedAnchor(href, target, children));
  }
  if (tag === 'tds-card') {
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
