import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Block, type BlockProps } from '../src';

// Expected behaviour is Tegel's tds-block at @scania/tegel@1.66.1
// (packages/core/src/components/block/block.tsx), with the default slot as children.

function renderBlock(props: BlockProps) {
  render(<Block {...props}>Content</Block>);
  return screen.getByText('Content');
}

describe('Block matches tds-block', () => {
  it.each<[string, BlockProps, string]>([
    ['a div by default', {}, 'DIV'],
    ['a section when asked', { componentTag: 'section' }, 'SECTION'],
    ['a nav when asked', { componentTag: 'nav' }, 'NAV'],
  ])('is %s', (_name, props, tag) => {
    const block = renderBlock(props);
    expect(block.tagName).toBe(tag);
    expect(block).toHaveClass('tl-block');
  });

  it('marks every nested block with the same class', () => {
    render(
      <Block>
        <Block>Inner</Block>
      </Block>,
    );
    const inner = screen.getByText('Inner');
    expect(inner).toHaveClass('tl-block');
    expect(inner.parentElement).toHaveClass('tl-block');
  });
});
