import { render, screen } from '@testing-library/react';

// Proves the JSX transform, jsdom and Testing Library are wired. Delete once a cell test exists.
describe('toolchain', () => {
  it('renders JSX into jsdom', () => {
    render(<span>ready</span>);
    expect(screen.getByText('ready')).toBeInTheDocument();
  });
});
