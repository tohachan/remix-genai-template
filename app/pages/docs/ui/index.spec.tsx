import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocsPage from './index';

describe('DocsPage', () => {
  it('renders without crashing', () => {
    render(<DocsPage />);

    // Verify the main heading is rendered
    expect(screen.getByText('ProjectLearn Manager Documentation')).toBeInTheDocument();
  });

  it('renders all documentation cards', () => {
    render(<DocsPage />);

    // Check that all architectural principle cards are present
    expect(screen.getByText('Single Responsibility Principle')).toBeInTheDocument();
    expect(screen.getByText('Feature-Sliced Design')).toBeInTheDocument();
    expect(screen.getByText('Layered Separation')).toBeInTheDocument();
    expect(screen.getByText('Dependency Injection')).toBeInTheDocument();
    expect(screen.getByText('Design Tokens')).toBeInTheDocument();
    expect(screen.getByText('Auto-Updatable Docs')).toBeInTheDocument();
    expect(screen.getByText('Test-First Patterns')).toBeInTheDocument();
  });

  it('renders navigation links to documentation pages', () => {
    render(<DocsPage />);

    // Check that links to documentation pages are present
    expect(screen.getByText('Explore SRP →')).toBeInTheDocument();
    expect(screen.getByText('Explore FSD →')).toBeInTheDocument();
    expect(screen.getByText('Explore Layering →')).toBeInTheDocument();
    expect(screen.getByText('Explore DI →')).toBeInTheDocument();
    expect(screen.getByText('Explore Tokens →')).toBeInTheDocument();
    expect(screen.getByText('Explore Auto-Docs →')).toBeInTheDocument();
    expect(screen.getByText('Explore Testing →')).toBeInTheDocument();
  });
});
