import React from 'react';

export default function DocsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ProjectLearn Manager Documentation
          </h1>
          <p className="text-lg text-gray-600">
            Interactive exploration of architectural principles and design patterns.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-3">Single Responsibility Principle</h2>
            <p className="text-gray-600 mb-4">
              Learn how to design components that do one thing well.
            </p>
            <a
              href="/docs/srp"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Explore SRP →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-3">Feature-Sliced Design</h2>
            <p className="text-gray-600 mb-4">
              Discover the FSD architecture methodology for scalable applications.
            </p>
            <a
              href="/docs/fsd"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Explore FSD →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-3">Layered Separation</h2>
            <p className="text-gray-600 mb-4">
              Understand separation of concerns in modern applications.
            </p>
            <a
              href="/docs/layered-separation"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Explore Layering →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-3">Dependency Injection</h2>
            <p className="text-gray-600 mb-4">
              Learn to build loosely coupled and testable code.
            </p>
            <a
              href="/docs/dependency-injection"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Explore DI →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-3">Design Tokens</h2>
            <p className="text-gray-600 mb-4">
              Implement consistent design systems across your application.
            </p>
            <a
              href="/docs/design-tokens"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Explore Tokens →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-3">Auto-Updatable Docs</h2>
            <p className="text-gray-600 mb-4">
              Keep documentation in sync with your codebase automatically.
            </p>
            <a
              href="/docs/auto-updatable-docs"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Explore Auto-Docs →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-3">Test-First Patterns</h2>
            <p className="text-gray-600 mb-4">
              Embrace test-driven development for reliable software.
            </p>
            <a
              href="/docs/test-first-patterns"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Explore Testing →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
