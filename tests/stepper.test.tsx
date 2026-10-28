import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Step, type StepProps, Stepper, type StepperProps } from '../src';

// Expected behaviour is Tegel's tds-stepper and tds-step at @scania/tegel@1.66.1
// (packages/core/src/components/stepper/), with the label slot as a prop. Steps read
// the stepper's settings through its modifier classes (relaxation
// parent-modifier-selectors, docs/findings/README.md).

describe('Stepper matches tds-stepper', () => {
  function renderStepper(props: StepperProps) {
    render(
      <Stepper {...props}>
        <Step index="1" />
      </Stepper>,
    );
    return screen.getByRole('list');
  }

  it.each<[string, StepperProps, string[]]>([
    [
      'horizontal, below, lg and labelled by default',
      {},
      [
        'tl-stepper--horizontal',
        'tl-stepper--below',
        'tl-stepper--lg',
        'tl-stepper--hide-labels-false',
      ],
    ],
    ['vertical', { orientation: 'vertical' }, ['tl-stepper--vertical']],
    ['aside', { labelPosition: 'aside' }, ['tl-stepper--aside']],
    ['sm', { size: 'sm' }, ['tl-stepper--sm']],
    ['without labels', { hideLabels: true }, ['tl-stepper--hide-labels-true']],
  ])('is %s', (_name, props, wantClasses) => {
    expect(renderStepper(props)).toHaveClass('tl-stepper', ...wantClasses);
  });

  it.each<[string, StepperProps, string]>([
    ['a default label', {}, 'Progress steps'],
    ['the given label', { tdsAriaLabel: 'Order' }, 'Order'],
  ])('has %s', (_name, props, want) => {
    expect(renderStepper(props)).toHaveAttribute('aria-label', want);
  });
});

describe('Step matches tds-step', () => {
  function renderStep(props: StepProps) {
    render(<Step index="2" label="Payment" {...props} />);
    const step = screen.getByRole('listitem');
    return { step, find: (selector: string) => step.querySelector(selector) };
  }

  it.each<[string, StepProps, string, string]>([
    ['upcoming by default', {}, 'tl-step--upcoming', 'true'],
    ['current', { state: 'current' }, 'tl-step--current', 'false'],
    ['success', { state: 'success' }, 'tl-step--success', 'false'],
    ['error', { state: 'error' }, 'tl-step--error', 'false'],
  ])('is %s', (_name, props, wantClass, wantDisabled) => {
    const { step } = renderStep(props);
    expect(step).toHaveClass('tl-step', wantClass);
    expect(step).toHaveAttribute('aria-disabled', wantDisabled);
  });

  it('is labelled with its index and state', () => {
    expect(renderStep({ state: 'current' }).step).toHaveAttribute('aria-label', 'Step 2: current');
  });

  it.each<[string, StepProps, boolean, string]>([
    ['the index while upcoming', {}, false, '2'],
    ['the index while current', { state: 'current' }, false, '2'],
    ['an icon on success', { state: 'success' }, true, ''],
    ['an icon on error', { state: 'error' }, true, ''],
  ])('shows %s', (_name, props, wantIcon, wantText) => {
    const { find } = renderStep(props);
    expect(find('.tl-step__icon') !== null).toBe(wantIcon);
    expect(find('.tl-step__marker')?.textContent).toBe(wantText);
  });

  it('renders the label', () => {
    expect(renderStep({}).find('.tl-step__label')).toHaveTextContent('Payment');
  });

  it('passes tdsAriaCurrent through', () => {
    expect(renderStep({ tdsAriaCurrent: 'step' }).step).toHaveAttribute('aria-current', 'step');
  });
});
