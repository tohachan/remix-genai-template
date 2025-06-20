import { useState } from 'react';
import { useGetTasksQuery } from '~/features/task-management/api';

export default function ApiTestPage() {
  const [showTasks, setShowTasks] = useState(false);
  const { data: tasksData, isLoading, error } = useGetTasksQuery(undefined, {
    skip: !showTasks,
  });

  const testFetch = async() => {
    try {
      console.log('🔍 Testing fetch to /api/tasks...');
      const response = await fetch('/api/tasks');
      console.log('📊 Response status:', response.status);
      const data = await response.json();
      console.log('📦 Response data:', data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>

      <div className="space-y-4">
        <button
          onClick={testFetch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Fetch /api/tasks
        </button>

        <button
          onClick={() => setShowTasks(!showTasks)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
        >
          {showTasks ? 'Hide RTK Query Test' : 'Test RTK Query'}
        </button>
      </div>

      {showTasks && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">RTK Query Result:</h2>

          {isLoading && <p>Loading tasks...</p>}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Error: {JSON.stringify(error)}
            </div>
          )}

          {tasksData && (
            <div className="bg-gray-100 p-4 rounded">
              <pre>{JSON.stringify(tasksData, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold">Instructions:</h3>
        <ol className="list-decimal list-inside mt-2 space-y-1">
          <li>Open browser DevTools Console</li>
          <li>Check for MSW initialization messages</li>
          <li>Click "Test Fetch" to test direct API call</li>
          <li>Click "Test RTK Query" to test through Redux</li>
        </ol>
      </div>
    </div>
  );
}
