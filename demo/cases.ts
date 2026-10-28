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
  {
    component: 'divider',
    tag: 'tds-divider',
    cases: [
      { label: 'subtle (default)', props: {} },
      { label: 'discrete', props: { variant: 'discrete' } },
      { label: 'soft', props: { variant: 'soft' } },
      { label: 'defined', props: { variant: 'defined' } },
      { label: 'strong', props: { variant: 'strong' } },
      { label: 'expressive', props: { variant: 'expressive' } },
      { label: 'vertical', props: { orientation: 'vertical', variant: 'strong' } },
    ],
  },
  {
    // `nested: true` puts blocks inside the block, NESTED_BLOCKS deep.
    component: 'block',
    tag: 'tds-block',
    cases: [
      { label: 'default', props: { children: BODY } },
      { label: 'as a section', props: { componentTag: 'section', children: BODY } },
      { label: 'nested', props: { nested: true } },
    ],
  },
  {
    // `prefix: true` asks each page for its own 16px prefix icon.
    component: 'tag',
    tag: 'tds-tag',
    cases: [
      { label: 'Neutral lg (default)', props: { text: 'Label' } },
      { label: 'sm', props: { text: 'Label', size: 'sm' } },
      { label: 'success', props: { text: 'Label', variant: 'success' } },
      { label: 'warning', props: { text: 'Label', variant: 'warning' } },
      { label: 'new', props: { text: 'Label', variant: 'new' } },
      { label: 'information', props: { text: 'Label', variant: 'information' } },
      { label: 'error', props: { text: 'Label', variant: 'error' } },
      { label: 'with prefix', props: { text: 'Label', variant: 'success', prefix: true } },
    ],
  },
  {
    component: 'message',
    tag: 'tds-message',
    cases: [
      { label: 'information', props: { header: 'Information', children: BODY } },
      { label: 'success', props: { header: 'Success', variant: 'success', children: BODY } },
      { label: 'warning', props: { header: 'Warning', variant: 'warning', children: BODY } },
      { label: 'error', props: { header: 'Error', variant: 'error', children: BODY } },
      { label: 'no icon', props: { header: 'Information', noIcon: true, children: BODY } },
      { label: 'minimal', props: { header: 'Information', minimal: true } },
      { label: 'minimal error', props: { header: 'Error', variant: 'error', minimal: true } },
    ],
  },
];

// Compound components: `crumbs`, `steps` and `top`/`start`/`end` ask each page to
// build the children from the data below.
SECTIONS.push(
  {
    component: 'breadcrumbs',
    tag: 'tds-breadcrumbs',
    cases: [
      { label: 'three levels, last current', props: { tdsAriaLabel: 'Breadcrumb', crumbs: true } },
    ],
  },
  {
    component: 'stepper',
    tag: 'tds-stepper',
    cases: [
      { label: 'horizontal lg (default)', props: { steps: true } },
      { label: 'horizontal sm', props: { size: 'sm', steps: true } },
      { label: 'labels aside', props: { labelPosition: 'aside', steps: true } },
      { label: 'labels hidden', props: { hideLabels: true, steps: true } },
      { label: 'vertical lg', props: { orientation: 'vertical', steps: true } },
      { label: 'vertical sm', props: { orientation: 'vertical', size: 'sm', steps: true } },
    ],
  },
  {
    component: 'footer',
    tag: 'tds-footer',
    cases: [
      { label: 'copyright only', props: {} },
      { label: 'top, start and end', props: { top: true, start: true, end: true } },
    ],
  },
);

// Form controls. `label` is a slot in Tegel (a prop for the textarea) and a prop here;
// `prefix: true` and `suffix: true` ask each page for a 16px icon.
SECTIONS.push(
  {
    component: 'checkbox',
    tag: 'tds-checkbox',
    cases: [
      { label: 'unchecked', props: { label: 'Label' } },
      { label: 'checked', props: { label: 'Label', checked: true } },
      { label: 'indeterminate', props: { label: 'Label', indeterminate: true } },
      { label: 'disabled', props: { label: 'Label', disabled: true } },
      { label: 'disabled checked', props: { label: 'Label', disabled: true, checked: true } },
    ],
  },
  {
    component: 'radio-button',
    tag: 'tds-radio-button',
    cases: [
      { label: 'unchecked', props: { label: 'Label', name: 'demo-a' } },
      { label: 'checked', props: { label: 'Label', name: 'demo-b', checked: true } },
      { label: 'disabled', props: { label: 'Label', name: 'demo-c', disabled: true } },
    ],
  },
  {
    component: 'toggle',
    tag: 'tds-toggle',
    cases: [
      { label: 'lg off', props: { label: 'Label' } },
      {
        label: 'lg on, with headline',
        props: { label: 'Label', headline: 'Headline', checked: true },
      },
      { label: 'sm on', props: { label: 'Label', size: 'sm', checked: true } },
      { label: 'disabled', props: { label: 'Label', disabled: true } },
    ],
  },
  {
    component: 'chip',
    tag: 'tds-chip',
    cases: [
      { label: 'lg button', props: { label: 'Label' } },
      { label: 'sm button', props: { label: 'Label', size: 'sm' } },
      { label: 'prefix', props: { label: 'Label', prefix: true } },
      { label: 'suffix', props: { label: 'Label', suffix: true } },
      { label: 'checkbox checked', props: { label: 'Label', type: 'checkbox', checked: true } },
      { label: 'disabled', props: { label: 'Label', disabled: true } },
    ],
  },
  {
    component: 'textarea',
    tag: 'tds-textarea',
    cases: [
      { label: 'no label', props: { placeholder: 'Placeholder' } },
      {
        label: 'label outside, helper',
        props: { label: 'Label', labelPosition: 'outside', helper: 'Helper text' },
      },
      { label: 'label inside', props: { label: 'Label', labelPosition: 'inside' } },
      {
        label: 'counter',
        props: { label: 'Label', labelPosition: 'outside', maxLength: 50, value: 'Some text' },
      },
      {
        label: 'error',
        props: { label: 'Label', labelPosition: 'outside', state: 'error', helper: 'Error text' },
      },
      { label: 'read-only', props: { label: 'Label', labelPosition: 'outside', readOnly: true } },
      { label: 'disabled', props: { label: 'Label', labelPosition: 'outside', disabled: true } },
    ],
  },
);

export const NESTED_BLOCKS = 4;

export const CRUMBS = ['Home', 'Fleet', 'Truck 42'];

export const STEPS = [
  { index: '1', state: 'success', label: 'Details' },
  { index: '2', state: 'error', label: 'Payment' },
  { index: '3', state: 'current', label: 'Review' },
  { index: '4', state: 'upcoming', label: 'Done' },
];

export const FOOTER_TOP = [
  { title: 'Products', items: ['Trucks', 'Buses', 'Engines'] },
  { title: 'Services', items: ['Financing', 'Insurance', 'Parts'] },
];
export const FOOTER_START = ['Cookies', 'Privacy', 'Legal'];
export const FOOTER_END = ['LinkedIn', 'YouTube'];

export const ACCORDION: { header: string; text: string; expanded?: boolean }[] = [
  { header: 'First item', text: 'Panel text for the first item.', expanded: true },
  { header: 'Second item', text: 'Panel text for the second item.' },
  { header: 'Third item', text: 'Panel text for the third item.' },
];

// Stateful components. `items: true` builds accordion items; `actionLink: true` puts a
// link in the "actions" slot. `prefix`/`suffix` reuse the 16px icon.
SECTIONS.push(
  {
    component: 'accordion',
    tag: 'tds-accordion',
    cases: [
      { label: 'three items, first expanded', props: { items: true } },
      { label: 'no last border', props: { items: true, hideLastBorder: true } },
    ],
  },
  {
    component: 'banner',
    tag: 'tds-banner',
    cases: [
      { label: 'default', props: { header: 'Header', subheader: 'Subheader' } },
      {
        label: 'information with action',
        props: {
          header: 'Header',
          subheader: 'Subheader',
          variant: 'information',
          actionLink: true,
        },
      },
      { label: 'error', props: { header: 'Header', variant: 'error' } },
    ],
  },
  {
    component: 'toast',
    tag: 'tds-toast',
    cases: [
      {
        label: 'information',
        props: { header: 'Header', subheader: 'Subheader', tdsCloseAriaLabel: 'Close' },
      },
      {
        label: 'success',
        props: { header: 'Header', variant: 'success', tdsCloseAriaLabel: 'Close' },
      },
      {
        label: 'warning with action',
        props: {
          header: 'Header',
          variant: 'warning',
          actionLink: true,
          tdsCloseAriaLabel: 'Close',
        },
      },
      {
        label: 'error, not closable',
        props: { header: 'Header', variant: 'error', closable: false },
      },
    ],
  },
  {
    component: 'text-field',
    tag: 'tds-text-field',
    cases: [
      { label: 'lg, no label', props: { placeholder: 'Placeholder' } },
      { label: 'label inside', props: { label: 'Label', labelPosition: 'inside' } },
      {
        label: 'label outside, helper, counter',
        props: { label: 'Label', labelPosition: 'outside', helper: 'Helper', maxLength: 20 },
      },
      { label: 'md with prefix', props: { size: 'md', placeholder: 'Placeholder', prefix: true } },
      { label: 'sm with suffix', props: { size: 'sm', placeholder: 'Placeholder', suffix: true } },
      {
        label: 'error',
        props: { label: 'Label', labelPosition: 'outside', state: 'error', helper: 'Error' },
      },
      {
        label: 'read-only',
        props: { label: 'Label', labelPosition: 'outside', readOnly: true, value: 'Value' },
      },
      { label: 'disabled', props: { label: 'Label', labelPosition: 'outside', disabled: true } },
    ],
  },
);

// The tabs from Tegel's stories. `tabs: '<family>'` builds them as that family's tabs.
export const TABS: { label: string; disabled?: boolean }[] = [
  { label: 'First tab' },
  { label: 'Second tab is much longer' },
  { label: 'Third tab' },
  { label: 'Fourth tab', disabled: true },
];

SECTIONS.push(
  {
    component: 'folder-tabs',
    tag: 'tds-folder-tabs',
    cases: [
      { label: 'first tab selected', props: { tabs: 'folder' } },
      { label: 'default selected index 1', props: { tabs: 'folder', defaultSelectedIndex: '1' } },
    ],
  },
  {
    component: 'inline-tabs',
    tag: 'tds-inline-tabs',
    cases: [
      { label: 'left padding 32 (default)', props: { tabs: 'inline' } },
      { label: 'left padding 0', props: { tabs: 'inline', leftPadding: '0' } },
    ],
  },
  {
    component: 'navigation-tabs',
    tag: 'tds-navigation-tabs',
    cases: [
      { label: 'left padding 32 (default)', props: { tabs: 'navigation' } },
      { label: 'left padding 0', props: { tabs: 'navigation', leftPadding: '0' } },
    ],
  },
);

SECTIONS.push({
  component: 'datetime',
  tag: 'tds-datetime',
  cases: [
    { label: 'datetime-local, lg', props: {} },
    {
      label: 'date, label outside, helper',
      props: { type: 'date', label: 'Label', labelPosition: 'outside', helper: 'Helper' },
    },
    {
      label: 'time, md, label inside',
      props: { type: 'time', size: 'md', label: 'Label', labelPosition: 'inside' },
    },
    {
      label: 'date with value, error',
      props: { type: 'date', defaultValue: '2023-01-31', state: 'error', helperError: 'Error' },
    },
    { label: 'month, sm, disabled', props: { type: 'month', size: 'sm', disabled: true } },
  ],
});

SECTIONS.push({
  component: 'slider',
  tag: 'tds-slider',
  cases: [
    { label: 'lg, value 40', props: { label: 'Label', value: '40' } },
    {
      label: 'tooltip, 3 ticks with numbers',
      props: { label: 'Label', value: '50', tooltip: true, ticks: '3', showTickNumbers: true },
    },
    {
      label: 'sm, controls',
      props: { label: 'Label', value: '20', thumbSize: 'sm', controls: true },
    },
    { label: 'number field', props: { label: 'Label', value: '60', input: true } },
    { label: 'disabled', props: { label: 'Label', value: '30', disabled: true } },
  ],
});

// `options: true` builds the dropdown options on both pages.
export const DROPDOWN_OPTIONS: { value: string; label: string; disabled?: boolean }[] = [
  { value: 'truck', label: 'Truck' },
  { value: 'bus', label: 'Bus' },
  { value: 'engine', label: 'Engine' },
  { value: 'boat', label: 'Boat', disabled: true },
];

SECTIONS.push({
  component: 'dropdown',
  tag: 'tds-dropdown',
  cases: [
    {
      label: 'lg, label outside, helper',
      props: {
        options: true,
        label: 'Label',
        labelPosition: 'outside',
        placeholder: 'Placeholder',
        helper: 'Helper',
      },
    },
    {
      label: 'md, label inside, default value',
      props: {
        options: true,
        size: 'md',
        label: 'Label',
        labelPosition: 'inside',
        defaultValue: 'bus',
      },
    },
    {
      label: 'sm, multiselect, selection actions',
      props: {
        options: true,
        size: 'sm',
        placeholder: 'Placeholder',
        multiselect: true,
        showSelectionActions: true,
      },
    },
    { label: 'filter', props: { options: true, placeholder: 'Placeholder', filter: true } },
    {
      label: 'xs, error',
      props: {
        options: true,
        size: 'xs',
        placeholder: 'Placeholder',
        error: true,
        helper: 'Error',
      },
    },
  ],
});

// A modal case opens from the "Open" button its `selector` names.
SECTIONS.push({
  component: 'modal',
  tag: 'tds-modal',
  cases: [
    {
      label: 'md, static actions',
      props: { selector: '#modal-md', header: 'Header', body: BODY, actionLink: true },
    },
    {
      label: 'xs, prevent (close with the button only)',
      props: { selector: '#modal-xs', size: 'xs', header: 'Header', body: BODY, prevent: true },
    },
    {
      label: 'lg, sticky actions',
      props: {
        selector: '#modal-lg',
        size: 'lg',
        header: 'Header',
        body: BODY.repeat(30),
        actionsPosition: 'sticky',
        actionLink: true,
      },
    },
  ],
});

SECTIONS.push({
  component: 'icon',
  tag: 'tds-icon',
  cases: [
    { label: 'truck, 16px (default)', props: {} },
    { label: 'chevron_down, 32px', props: { name: 'chevron_down', size: '32px' } },
    { label: 'warning, 48px (evenodd fill)', props: { name: 'warning', size: '48px' } },
    {
      label: 'settings, 24px, with a title',
      props: { name: 'settings', size: '24px', svgTitle: 'Settings' },
    },
  ],
});

// `menuItems: true` builds the popover menu items on both pages.
export const MENU_ITEMS: { label: string; disabled?: boolean }[] = [
  { label: 'Edit' },
  { label: 'Copy' },
  { label: 'Delete', disabled: true },
];

// Each popover opens from the "Open" button its `selector` names.
SECTIONS.push(
  {
    component: 'popover-core',
    tag: 'tds-popover-core',
    cases: [
      { label: 'click, unstyled', props: { selector: '#core-click', children: 'Popover core' } },
    ],
  },
  {
    component: 'popover-canvas',
    tag: 'tds-popover-canvas',
    cases: [
      { label: 'auto', props: { selector: '#canvas-auto', children: BODY } },
      {
        label: 'right-start',
        props: { selector: '#canvas-right', placement: 'right-start', children: BODY },
      },
      {
        label: 'shown (defaultShow), top',
        props: { selector: '#canvas-top', placement: 'top', defaultShow: true, children: BODY },
      },
    ],
  },
  {
    component: 'popover-menu',
    tag: 'tds-popover-menu',
    cases: [
      {
        label: '160px, bottom-start',
        props: { selector: '#menu-fixed', placement: 'bottom-start', menuItems: true },
      },
      {
        label: 'fluid width',
        props: { selector: '#menu-fluid', fluidWidth: true, menuItems: true },
      },
    ],
  },
  {
    component: 'tooltip',
    tag: 'tds-tooltip',
    cases: [
      { label: 'hover, bottom', props: { selector: '#tooltip-hover', text: 'Tooltip text' } },
      {
        label: 'hover, bottom-start (square corner)',
        props: {
          selector: '#tooltip-start',
          placement: 'bottom-start',
          text: 'Tooltip text that wraps onto a second line',
        },
      },
      {
        label: 'click, right',
        props: {
          selector: '#tooltip-click',
          trigger: 'click',
          placement: 'right',
          text: 'Tooltip text',
        },
      },
    ],
  },
);

// The same plus icon on both pages, so only the component differs.
export const ICON_PATH = 'M9 3h2v6h6v2h-6v6H9v-6H3V9h6z';
