import { Link } from '@remix-run/react';
import { Button } from '../../../shared/ui/button';

export default function DemoSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        🎯 Explore & Learn
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🔄 RTK Query Demo
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Explore the RTK Query integration with Feature-Sliced Design architecture.
            See CRUD operations, caching, and real-time updates in action.
          </p>
          <Link to="/rtk-example">
            <Button className="w-full">View RTK Query Demo</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            🛍️ Products List Demo
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            An example of displaying a list of products using the{' '}
            <a
              href="https://dummyjson.com/docs/products"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              dummyjson.com
            </a>{' '}
            API.
          </p>
          <Link to="/products">
            <Button className="w-full">View Products Demo</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            📊 Complex Example
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            See a complete production-ready project built using this template -
            ProjectLearn Manager with 30+ components and 8 feature slices.
          </p>
          <div className="bg-gray-50 rounded p-2 text-xs font-mono mb-4">
            git checkout examples/cursor-generated-project
          </div>
          <p className="text-xs text-gray-500">
            100% AI-generated following FSD patterns
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            📖 Documentation
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            Each feature maintains comprehensive documentation with human-readable
            instructions and AI-readable metadata.
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <div>• Feature-Sliced Design guides</div>
            <div>• API specifications</div>
            <div>• Testing guidelines</div>
            <div>• Architecture decisions</div>
          </div>
        </div>
      </div>
    </section>
  );
}
