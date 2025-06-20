import { Link } from '@remix-run/react';
import { Button } from '~/shared/ui/button';

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Remix + Gen AI Template
          </h1>
          <p className="text-lg text-gray-600">
            A comprehensive starter kit for building scalable Remix applications
            using Feature-Sliced Design architecture with RTK Query integration.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              🔄 RTK Query Demo
            </h2>
            <p className="text-gray-600 mb-4">
              Explore the RTK Query integration with Feature-Sliced Design
              architecture. See CRUD operations, caching, and real-time updates
              in action.
            </p>
            <Link to="/rtk-example">
              <Button className="w-full">View RTK Query Demo</Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              🏗️ Architecture
            </h2>
            <p className="text-gray-600 mb-4">
              Built with Feature-Sliced Design principles for scalable and
              maintainable code organization.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Clean layer separation</li>
              <li>• TypeScript strict mode</li>
              <li>• Automated testing</li>
              <li>• AI-optimized structure</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            🚀 Quick Start
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-blue-800">
              <strong>Development:</strong>{' '}
              <code className="bg-white px-2 py-1 rounded">npm run dev</code>
            </p>
            <p className="text-blue-800">
              <strong>Testing:</strong>{' '}
              <code className="bg-white px-2 py-1 rounded">npm test</code>
            </p>
            <p className="text-blue-800">
              <strong>Generate Feature:</strong>{' '}
              <code className="bg-white px-2 py-1 rounded">
                npm run generate:component
              </code>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
