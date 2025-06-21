import React from 'react';
import { Link } from '@remix-run/react';
import { cn } from '~/shared/lib/utils';

interface HomePageProps {
  className?: string;
}

export default function HomePage({ className }: HomePageProps) {
  return (
    <div className={cn('min-h-screen', className)}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              ProjectLearn Manager
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A unified web application combining full-featured SaaS project management
              with an embedded learning module demonstrating architectural principles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/projects"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Get Started
              </Link>
              <Link
                to="/docs"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold border border-blue-600"
              >
                Learn Architecture
              </Link>
            </div>

            {/* Key Statistics */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">5+</div>
                <div className="text-gray-600">Architecture Principles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">8+</div>
                <div className="text-gray-600">Feature Modules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <div className="text-gray-600">TypeScript Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Project Management Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage projects, teams, and tasks with powerful features designed for modern development workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kanban Board</h3>
              <p className="text-gray-600 mb-4">
                Drag-and-drop task management with customizable columns and real-time updates
              </p>
              <Link to="/kanban" className="text-blue-600 hover:text-blue-800 font-medium">
                View Kanban →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar View</h3>
              <p className="text-gray-600 mb-4">
                Schedule tasks with deadline management and calendar integration
              </p>
              <Link to="/calendar" className="text-blue-600 hover:text-blue-800 font-medium">
                View Calendar →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Management</h3>
              <p className="text-gray-600 mb-4">
                Invite members, assign roles, and collaborate effectively
              </p>
              <Link to="/teams" className="text-blue-600 hover:text-blue-800 font-medium">
                Manage Teams →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Track progress with burndown charts and team workload analysis
              </p>
              <Link to="/analytics" className="text-blue-600 hover:text-blue-800 font-medium">
                View Analytics →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Playground</h3>
              <p className="text-gray-600 mb-4">
                Interactive code editor with architectural rule checking
              </p>
              <Link to="/playground" className="text-blue-600 hover:text-blue-800 font-medium">
                Open Playground →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Principles Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learn Architecture Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore architectural patterns through interactive documentation and real examples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/docs/srp" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Single Responsibility
              </h3>
              <p className="text-gray-600 text-sm">
                Component design with clear, focused responsibilities
              </p>
            </Link>

            <Link to="/docs/fsd" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Feature-Sliced Design
              </h3>
              <p className="text-gray-600 text-sm">
                Scalable architecture with clear layer boundaries
              </p>
            </Link>

            <Link to="/docs/design-tokens" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Design Tokens
              </h3>
              <p className="text-gray-600 text-sm">
                Consistent styling with centralized design system
              </p>
            </Link>

            <Link to="/docs/test-first-patterns" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                Test-First Patterns
              </h3>
              <p className="text-gray-600 text-sm">
                Quality assurance through comprehensive testing
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Explore the application, learn architectural principles, or dive into the interactive playground
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/projects"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Start Managing Projects
            </Link>
            <Link
              to="/docs"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold"
            >
              Explore Documentation
            </Link>
            <Link
              to="/playground"
              className="bg-transparent text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold border border-white"
            >
              Try the Playground
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
