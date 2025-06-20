import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RuleResultsDisplay from './RuleResultsDisplay';

const mockResults = {
  violations: [
    {
      id: 'violation-1',
      rule: 'enforce-design-tokens',
      severity: 'error' as const,
      message: 'Replace literal color with theme token',
      file: 'Example.tsx',
      line: 12,
      column: 25,
      code: 'backgroundColor: \'#3b82f6\'',
      suggestion: 'backgroundColor: theme.colors.primary[500]',
      description: 'Hard-coded color values should use design tokens',
    },
    {
      id: 'violation-2',
      rule: 'enforce-layer-boundaries',
      severity: 'warning' as const,
      message: 'Component exceeds line limit',
      file: 'Example.tsx',
      line: 1,
      column: 1,
      code: 'export default function LargeComponent() {',
      suggestion: 'Split into smaller components',
      description: 'Component should be split for maintainability',
    },
  ],
  summary: {
    totalViolations: 2,
    errors: 1,
    warnings: 1,
    rules: ['enforce-design-tokens', 'enforce-layer-boundaries'],
    executionTime: '0.8s',
    timestamp: '2024-01-15T10:30:45.123Z',
  },
};

describe('RuleResultsDisplay', () => {
  it('renders loading state correctly', () => {
    render(<RuleResultsDisplay isLoading={true} />);

    expect(screen.getByText('Analyzing code...')).toBeInTheDocument();
  });

  it('renders empty state when no results', () => {
    render(<RuleResultsDisplay />);

    expect(screen.getByText('Run rules to see results here')).toBeInTheDocument();
  });

  it('renders results summary correctly', () => {
    render(<RuleResultsDisplay results={mockResults} />);

    expect(screen.getByText('2 violations found')).toBeInTheDocument();
    expect(screen.getByText('1 errors, 1 warnings')).toBeInTheDocument();
    expect(screen.getByText('0.8s')).toBeInTheDocument();
  });

  it('renders violations list correctly', () => {
    render(<RuleResultsDisplay results={mockResults} />);

    // Check that both violations are rendered
    expect(screen.getByText('Replace literal color with theme token')).toBeInTheDocument();
    expect(screen.getByText('Component exceeds line limit')).toBeInTheDocument();

    // Check severity badges
    expect(screen.getByText('error')).toBeInTheDocument();
    expect(screen.getByText('warning')).toBeInTheDocument();

    // Check rule names
    expect(screen.getByText('enforce-design-tokens')).toBeInTheDocument();
    expect(screen.getByText('enforce-layer-boundaries')).toBeInTheDocument();

    // Check line numbers
    expect(screen.getByText('Line 12:25')).toBeInTheDocument();
    expect(screen.getByText('Line 1:1')).toBeInTheDocument();
  });

  it('renders code diff correctly', () => {
    render(<RuleResultsDisplay results={mockResults} />);

    // Check code snippets
    expect(screen.getByText('- backgroundColor: \'#3b82f6\'')).toBeInTheDocument();
    expect(screen.getByText('+ backgroundColor: theme.colors.primary[500]')).toBeInTheDocument();
  });

  it('calls onViolationClick when violation is clicked', () => {
    const mockOnClick = jest.fn();
    render(<RuleResultsDisplay results={mockResults} onViolationClick={mockOnClick} />);

    const firstViolation = screen.getByText('Replace literal color with theme token').closest('div');
    fireEvent.click(firstViolation!);

    expect(mockOnClick).toHaveBeenCalledWith(mockResults.violations[0]);
  });

  it('applies correct styling for error severity', () => {
    render(<RuleResultsDisplay results={mockResults} />);

    const errorViolation = screen.getByText('Replace literal color with theme token').closest('div');
    expect(errorViolation).toHaveClass('hover:bg-red-50');
  });

  it('applies correct styling for warning severity', () => {
    render(<RuleResultsDisplay results={mockResults} />);

    const warningViolation = screen.getByText('Component exceeds line limit').closest('div');
    expect(warningViolation).toHaveClass('hover:bg-yellow-50');
  });
});
