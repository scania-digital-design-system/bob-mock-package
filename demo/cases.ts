// The cases both preview pages render, one row each. They follow tests/badge.test.tsx.
export type DemoCase = { label: string; props: Record<string, unknown> };

export const BADGE_CASES: DemoCase[] = [
  { label: 'value "5"', props: { value: '5' } },
  { label: 'value "42" (pill)', props: { value: '42' } },
  { label: 'value "123" (99+)', props: { value: '123' } },
  { label: 'value "05"', props: { value: '05' } },
  { label: 'value "-5"', props: { value: '-5' } },
  { label: 'value "new" (no text)', props: { value: 'new' } },
  { label: 'no value (dot)', props: {} },
  { label: 'size sm, value "5"', props: { size: 'sm', value: '5' } },
  { label: 'isHidden (nothing visible)', props: { value: '5', isHidden: true } },
];
