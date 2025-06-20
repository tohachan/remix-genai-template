import { Outlet } from '@remix-run/react';
import { DocsPage } from '~/pages/docs';

export function links() {
  return [
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css',
    },
  ];
}

export default function DocsLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="/docs"
                  className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Overview
                </a>
              </li>
              <li>
                <a
                  href="/docs/srp"
                  className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Single Responsibility Principle
                </a>
              </li>
              <li>
                <a
                  href="/docs/fsd"
                  className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Feature-Sliced Design
                </a>
              </li>
              <li>
                <a
                  href="/docs/layered-separation"
                  className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Layered Separation
                </a>
              </li>
              <li>
                <a
                  href="/docs/dependency-injection"
                  className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Dependency Injection
                </a>
              </li>
              <li>
                <a
                  href="/docs/design-tokens"
                  className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Design Tokens
                </a>
              </li>
              <li>
                <a
                  href="/docs/auto-updatable-docs"
                  className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Auto-Updatable Docs
                </a>
              </li>
              <li>
                <a
                  href="/docs/test-first-patterns"
                  className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                  Test-First Patterns
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
