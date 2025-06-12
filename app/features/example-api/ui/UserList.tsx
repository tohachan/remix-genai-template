import { useState } from 'react';
import { useUsersList, useDeleteUser } from '../hooks';

/**
 * Example UI component demonstrating RTK Query usage
 * Shows proper layer separation: UI -> Hooks -> API
 */
export default function UserList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  // Use custom hook that wraps RTK Query
  const { users, pagination, isLoading, isError, error, refetch } = useUsersList({
    page,
    limit: 10,
    search,
  });
  
  const { deleteUser, isLoading: isDeleting } = useDeleteUser();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        // RTK Query will automatically refetch the list due to cache invalidation
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Loading users...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="text-red-800 font-medium">Error loading users</h3>
        <p className="text-red-600 text-sm mt-1">
          {error && 'data' in error ? (error.data as any)?.message : 'Unknown error'}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={handleSearch}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Users List */}
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(user.id)}
                disabled={isDeleting}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-600">
            Showing {users.length} of {pagination.total} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-gray-100 rounded">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 