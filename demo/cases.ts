// The cases both preview pages render: one section per component, one row per case.
// They follow the component's tests. `icon: true` asks each page for its own icon;
// `dark` puts the row on a dark background (for inverted variants).
export type DemoCase = { label: string; props: Record<string, unknown>; dark?: boolean };
export type DemoSection = { component: string; tag: string; cases: DemoCase[] };

const BODY = 'Body text that wraps across a few lines to show the body typography.';
export const THUMBNAIL_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#c4c8cf"/></svg>',
)}`;
const IMAGE_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120"><rect width="320" height="120" fill="#c4c8cf"/></svg>',
)}`;

export const SECTIONS: DemoSection[] = [
  {
    component: 'badge',
    tag: 'tds-badge',
    cases: [
      { label: 'value "5"', props: { value: '5' } },
      { label: 'value "42" (pill)', props: { value: '42' } },
      { label: 'value "123" (99+)', props: { value: '123' } },
      { label: 'value "05"', props: { value: '05' } },
      { label: 'value "-5"', props: { value: '-5' } },
      { label: 'value "new" (no text)', props: { value: 'new' } },
      { label: 'no value (dot)', props: {} },
      { label: 'size sm, value "5"', props: { size: 'sm', value: '5' } },
      { label: 'isHidden (nothing visible)', props: { value: '5', isHidden: true } },
    ],
  },
  {
    component: 'button',
    tag: 'tds-button',
    cases: [
      { label: 'primary lg', props: { text: 'Button' } },
      { label: 'secondary lg', props: { text: 'Button', variant: 'secondary' } },
      { label: 'ghost lg', props: { text: 'Button', variant: 'ghost' } },
      { label: 'danger lg', props: { text: 'Button', variant: 'danger' } },
      { label: 'primary md', props: { text: 'Button', size: 'md' } },
      { label: 'primary sm', props: { text: 'Button', size: 'sm' } },
      { label: 'primary xs', props: { text: 'Button', size: 'xs' } },
      { label: 'text and icon lg', props: { text: 'Button', icon: true } },
      { label: 'text and icon sm', props: { text: 'Button', size: 'sm', icon: true } },
      { label: 'icon only lg', props: { icon: true, tdsAriaLabel: 'Add' } },
      { label: 'icon only sm', props: { icon: true, size: 'sm', tdsAriaLabel: 'Add' } },
      { label: 'disabled primary', props: { text: 'Button', disabled: true } },
      {
        label: 'disabled secondary',
        props: { text: 'Button', variant: 'secondary', disabled: true },
      },
      { label: 'fullbleed', props: { text: 'Button', fullbleed: true } },
    ],
  },
  {
    component: 'link',
    tag: 'tds-link',
    cases: [
      { label: 'default', props: { href: '#link', children: 'Link text' } },
      { label: 'no underline', props: { href: '#link', children: 'Link text', underline: false } },
      { label: 'standalone', props: { href: '#link', children: 'Link text', standalone: true } },
      { label: 'disabled', props: { href: '#link', children: 'Link text', disabled: true } },
      { label: 'visited (same page)', props: { href: '', children: 'Link text' } },
    ],
  },
  {
    component: 'spinner',
    tag: 'tds-spinner',
    cases: [
      { label: 'lg standard', props: {} },
      { label: 'md standard', props: { size: 'md' } },
      { label: 'sm standard', props: { size: 'sm' } },
      { label: 'xs standard', props: { size: 'xs' } },
      { label: 'lg inverted', props: { variant: 'inverted' }, dark: true },
      { label: 'sm inverted', props: { size: 'sm', variant: 'inverted' }, dark: true },
    ],
  },
  {
    // thumbnail, body and actions are slots in Tegel and props in our cell; each page
    // builds its own (`thumbnail: true`, `actions: true`, `body: '<text>'`).
    component: 'card',
    tag: 'tds-card',
    cases: [
      { label: 'header and body', props: { header: 'Header', subheader: 'Subheader', body: BODY } },
      {
        label: 'thumbnail, divider, actions',
        props: {
          header: 'Header',
          subheader: 'Subheader',
          thumbnail: true,
          bodyDivider: true,
          body: BODY,
          actions: true,
        },
      },
      {
        label: 'image below header',
        props: { header: 'Header', bodyImg: IMAGE_SRC, bodyImgAlt: 'Placeholder', body: BODY },
      },
      {
        label: 'image above header',
        props: {
          header: 'Header',
          imagePlacement: 'above-header',
          bodyImg: IMAGE_SRC,
          bodyImgAlt: 'Placeholder',
          body: BODY,
        },
      },
      {
        label: 'clickable',
        props: { header: 'Header', body: BODY, clickable: true, cardId: 'c1' },
      },
      { label: 'expandable (closed)', props: { header: 'Header', body: BODY, expandable: true } },
      {
        label: 'expandable (open)',
        props: { header: 'Header', body: BODY, expandable: true, expanded: true },
      },
    ],
  },
];

// The same plus icon on both pages, so only the component differs.
export const ICON_PATH = 'M9 3h2v6h6v2h-6v6H9v-6H3V9h6z';
