import { useState } from 'react';
import { useCreateUser } from '../hooks';

/**
 * Form component for creating new users
 * Demonstrates RTK Query mutations with optimistic updates
 */
export default function CreateUserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { createUser, isLoading, isError, error, isSuccess } = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      await createUser({ name: name.trim(), email: email.trim() });
      // Reset form on success
      setName('');
      setEmail('');
      setIsOpen(false);
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to create user:', err);
    }
  };

  if (!isOpen) {
    return (
      <div className="mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          + Add New User
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Create New User</h3>
        <button
          onClick={() => {
            setIsOpen(false);
            setName('');
            setEmail('');
          }}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Enter user name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Enter user email"
          />
        </div>

        {isError && error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600 text-sm">
              {error && 'data' in error ? (error.data as any)?.message || 'Failed to create user' : 'Failed to create user'}
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-600 text-sm">User created successfully!</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading || !name.trim() || !email.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setName('');
              setEmail('');
            }}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 