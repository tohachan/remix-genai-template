import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RunRulesButton from './RunRulesButton';

describe('RunRulesButton', () => {
  it('renders without crashing', () => {
    render(<RunRulesButton />);
  });

  it('displays "Run Rules" text by default', () => {
    render(<RunRulesButton />);
    expect(screen.getByRole('button', { name: /run rules/i })).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    render(<RunRulesButton loading />);
    expect(screen.getByText('Running...')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<RunRulesButton disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<RunRulesButton onClick={mockOnClick} />);
    const button = screen.getByRole('button');
    button.click();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  // TODO: Add component-specific tests based on functionality
  // Examples:
  // - User interactions (clicks, form submissions)
  // - Data loading states
  // - Error handling
  // - Props validation
});
