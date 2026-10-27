// The cases both preview pages render: one section per component, one row per case.
// They follow the component's tests. `icon: true` asks each page for its own icon.
export type DemoCase = { label: string; props: Record<string, unknown> };
export type DemoSection = { component: string; tag: string; cases: DemoCase[] };

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
];

// The same plus icon on both pages, so only the component differs.
export const ICON_PATH = 'M9 3h2v6h6v2h-6v6H9v-6H3V9h6z';
