import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './index';

// Mock router for Link components
const MockRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('HomePage', () => {
  const renderHomePage = (props = {}) => {
    return render(
      <MockRouter>
        <HomePage {...props} />
      </MockRouter>,
    );
  };

  it('renders without crashing', () => {
    renderHomePage();
    expect(screen.getByText('ProjectLearn Manager')).toBeInTheDocument();
  });

  it('displays hero section with main title and description', () => {
    renderHomePage();

    // Check main title
    expect(screen.getByText('ProjectLearn Manager')).toBeInTheDocument();

    // Check description
    expect(screen.getByText(/A unified web application combining full-featured SaaS project management/)).toBeInTheDocument();

    // Check CTA buttons
    expect(screen.getByRole('link', { name: 'Get Started' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn Architecture' })).toBeInTheDocument();
  });

  it('displays key statistics in hero section', () => {
    renderHomePage();

    expect(screen.getByText('5+')).toBeInTheDocument();
    expect(screen.getByText('Architecture Principles')).toBeInTheDocument();
    expect(screen.getByText('8+')).toBeInTheDocument();
    expect(screen.getByText('Feature Modules')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('TypeScript Coverage')).toBeInTheDocument();
  });

  it('displays features section with all feature cards', () => {
    renderHomePage();

    // Check section title
    expect(screen.getByText('Complete Project Management Suite')).toBeInTheDocument();

    // Check all feature cards
    expect(screen.getByText('Kanban Board')).toBeInTheDocument();
    expect(screen.getByText('Calendar View')).toBeInTheDocument();
    expect(screen.getByText('Team Management')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Playground')).toBeInTheDocument();

    // Check feature links
    expect(screen.getByRole('link', { name: /View Kanban/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Calendar/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Manage Teams/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Analytics/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Playground/ })).toBeInTheDocument();
  });

  it('displays architecture principles section', () => {
    renderHomePage();

    // Check section title
    expect(screen.getByText('Learn Architecture Principles')).toBeInTheDocument();

    // Check principle cards
    expect(screen.getByText('Single Responsibility')).toBeInTheDocument();
    expect(screen.getByText('Feature-Sliced Design')).toBeInTheDocument();
    expect(screen.getByText('Design Tokens')).toBeInTheDocument();
    expect(screen.getByText('Test-First Patterns')).toBeInTheDocument();

    // Check that they are links to docs
    expect(screen.getByRole('link', { name: /Single Responsibility/ })).toHaveAttribute('href', '/docs/srp');
    expect(screen.getByRole('link', { name: /Feature-Sliced Design/ })).toHaveAttribute('href', '/docs/fsd');
    expect(screen.getByRole('link', { name: /Design Tokens/ })).toHaveAttribute('href', '/docs/design-tokens');
    expect(screen.getByRole('link', { name: /Test-First Patterns/ })).toHaveAttribute('href', '/docs/test-first-patterns');
  });

  it('displays getting started section with action buttons', () => {
    renderHomePage();

    // Check section title
    expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();

    // Check action buttons
    expect(screen.getByRole('link', { name: 'Start Managing Projects' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore Documentation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Try the Playground' })).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <MockRouter>
        <HomePage className="custom-class" />
      </MockRouter>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper responsive layout classes', () => {
    const { container } = renderHomePage();

    // Check main container has responsive classes
    expect(container.firstChild).toHaveClass('min-h-screen');

    // Check that responsive grid classes are present
    expect(screen.getByText('Kanban Board').closest('.grid')).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  it('has accessible navigation links', () => {
    renderHomePage();

    // Check all links have proper href attributes
    const getStartedLinks = screen.getAllByRole('link', { name: /Get Started/ });
    expect(getStartedLinks[0]).toHaveAttribute('href', '/projects');

    const learnArchLinks = screen.getAllByRole('link', { name: /Learn Architecture/ });
    expect(learnArchLinks[0]).toHaveAttribute('href', '/docs');

    // Check feature navigation links
    expect(screen.getByRole('link', { name: /View Kanban/ })).toHaveAttribute('href', '/kanban');
    expect(screen.getByRole('link', { name: /View Calendar/ })).toHaveAttribute('href', '/calendar');
    expect(screen.getByRole('link', { name: /Manage Teams/ })).toHaveAttribute('href', '/teams');
    expect(screen.getByRole('link', { name: /View Analytics/ })).toHaveAttribute('href', '/analytics');
    expect(screen.getByRole('link', { name: /Open Playground/ })).toHaveAttribute('href', '/playground');
  });
});
