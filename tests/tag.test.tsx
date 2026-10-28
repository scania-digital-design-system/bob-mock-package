import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tag, type TagProps } from '../src';

// Expected behaviour is Tegel's tds-tag at @scania/tegel@1.66.1
// (packages/core/src/components/tag/tag.tsx), with the prefix slot as a prop.

function renderTag(props: TagProps) {
  const { container } = render(<Tag text="Label" {...props} />);
  return container.firstElementChild as HTMLElement;
}

describe('Tag matches tds-tag', () => {
  it.each<[string, TagProps, string[]]>([
    ['lg and Neutral by default', {}, ['tl-tag--lg', 'tl-tag--Neutral']],
    ['sm when asked', { size: 'sm' }, ['tl-tag--sm']],
    ['a lowercase variant', { variant: 'success' }, ['tl-tag--success']],
    ['a capitalised variant', { variant: 'Error' }, ['tl-tag--Error']],
  ])('is %s', (_name, props, wantClasses) => {
    expect(renderTag(props)).toHaveClass('tl-tag', ...wantClasses);
  });

  it('renders the text', () => {
    expect(renderTag({}).querySelector('.tl-tag__content')).toHaveTextContent('Label');
  });

  it('renders the prefix before the text', () => {
    renderTag({ prefix: <svg data-testid="prefix" /> });
    const prefix = screen.getByTestId('prefix');
    expect(prefix.nextElementSibling).toHaveTextContent('Label');
  });

  it('renders only the text without a prefix', () => {
    expect(renderTag({}).querySelector('.tl-tag__content')?.children).toHaveLength(1);
  });
});
