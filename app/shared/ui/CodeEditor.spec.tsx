import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CodeEditor from './CodeEditor';

// Mock the dynamic import to prevent it from running in tests
jest.mock('@monaco-editor/react', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="monaco-editor">Mocked Monaco Editor</div>,
  };
});

// Mock the dynamic import function to prevent async state updates in tests
Object.defineProperty(global, 'import', {
  value: jest.fn().mockRejectedValue(new Error('Dynamic import mocked in tests')),
  writable: true,
});

describe('CodeEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<CodeEditor />);
    expect(screen.getByText('Loading editor...')).toBeInTheDocument();
  });

  it('shows loading state initially on server-side render', () => {
    render(<CodeEditor />);
    expect(screen.getByText('Loading editor...')).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    const { container } = render(<CodeEditor height="300px" />);
    const editorContainer = container.querySelector('[style*="height"]');
    expect(editorContainer).toBeInTheDocument();
  });

  it('renders with custom language prop', () => {
    render(<CodeEditor language="javascript" />);
    expect(screen.getByText('Loading editor...')).toBeInTheDocument();
  });

  it('can be marked as readonly', () => {
    render(<CodeEditor readOnly />);
    expect(screen.getByText('Loading editor...')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-editor-class';
    const { container } = render(<CodeEditor className={customClass} />);
    const editorContainer = container.querySelector(`.${customClass}`);
    expect(editorContainer).toBeInTheDocument();
  });

  it('handles props correctly', () => {
    const onChange = jest.fn();
    render(
      <CodeEditor
        value="test code"
        onChange={onChange}
        language="typescript"
        theme="dark"
      />,
    );
    expect(screen.getByText('Loading editor...')).toBeInTheDocument();
  });
});
