import type { MetaFunction } from '@remix-run/node';
import { UserList } from '~/features/example-api';
import { baseApi } from '~/shared/lib/store/api';
import { useAppSelector } from '~/shared/lib/hooks/redux';

// Test API slice to verify RTK Query setup
const testApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTest: builder.query({
      query: () => '/test',
      providesTags: ['Project'],
    }),
  }),
});

export const { useGetTestQuery } = testApi;

export const meta: MetaFunction = () => {
  return [
    { title: 'RTK Query Example | Remix Template' },
    {
      name: 'description',
      content: 'Demonstration of RTK Query integration with FSD architecture',
    },
  ];
};

export default function RTKExamplePage() {
  const { data, error, isLoading } = useGetTestQuery(undefined);

  // Test Redux store access
  const storeState = useAppSelector((state) => state);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            RTK Query Example
          </h1>
          <p className="text-gray-600">
            This page demonstrates RTK Query integration with Feature-Sliced
            Design architecture. The UserList component shows CRUD operations
            with automatic caching and real-time updates.
          </p>
        </header>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              User Management Demo
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Features: Pagination, Search, Delete operations with optimistic
              updates
            </p>
          </div>

          <UserList />
        </section>

        <section className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Architecture Pattern
          </h3>
          <div className="space-y-3 text-sm">
            <div className="bg-white p-3 rounded border">
              <strong className="text-blue-800">API Layer:</strong>
              <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                app/features/example-api/api.ts
              </code>
              <p className="text-gray-600 mt-1">
                RTK Query endpoints with cache tags
              </p>
            </div>
            <div className="bg-white p-3 rounded border">
              <strong className="text-blue-800">Hooks Layer:</strong>
              <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                app/features/example-api/hooks.ts
              </code>
              <p className="text-gray-600 mt-1">
                Business logic using RTK Query hooks
              </p>
            </div>
            <div className="bg-white p-3 rounded border">
              <strong className="text-blue-800">UI Layer:</strong>
              <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                app/features/example-api/ui/UserList.tsx
              </code>
              <p className="text-gray-600 mt-1">
                React component using business logic hooks
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Benefits Demonstrated
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <strong>Automatic Caching:</strong> Requests are cached and
              deduplicated
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <strong>Real-time Updates:</strong> Cache invalidation updates UI
              automatically
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <strong>Loading States:</strong> Built-in loading and error
              handling
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <strong>TypeScript:</strong> Fully typed API requests and
              responses
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <strong>Clean Architecture:</strong> Proper separation of concerns
            </li>
          </ul>
        </section>

        <section className="mt-8 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">RTK Query Setup Test</h2>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Store State</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(storeState, null, 2)}
              </pre>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Test Query</h3>
              <div>
                <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
                <p><strong>Error:</strong> {error ? JSON.stringify(error) : 'None'}</p>
                <p><strong>Data:</strong> {data ? JSON.stringify(data) : 'None'}</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">RTK Query Setup Status</h3>
              <div className="space-y-2">
                <p>✅ Redux store configured</p>
                <p>✅ RTK Query middleware installed</p>
                <p>✅ Base API slice created</p>
                <p>✅ Redux Provider integrated</p>
                <p>✅ Typed hooks available</p>
                <p>✅ Project & Task tags configured</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
