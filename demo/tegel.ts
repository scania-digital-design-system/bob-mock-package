import '@scania/tegel/dist/tegel/tegel.css';
import { defineCustomElements } from '@scania/tegel/loader';
import { BADGE_CASES } from './cases';

// The reference: Tegel's own <tds-badge> web component, rendered with Tegel's CSS.
async function preview(root: HTMLElement) {
  await defineCustomElements();
  await customElements.whenDefined('tds-badge');
  const list = document.createElement('dl');
  list.className = 'cases';
  for (const { label, props } of BADGE_CASES) {
    const row = document.createElement('div');
    row.className = 'case';
    const term = document.createElement('dt');
    term.textContent = label;
    const badge = Object.assign(document.createElement('tds-badge'), props);
    const detail = document.createElement('dd');
    detail.append(badge);
    row.append(term, detail);
    list.append(row);
  }
  root.append(list);
}

const root = document.getElementById('root');
if (root === null) {
  throw new Error('demo: #root is missing');
}
void preview(root);
