/**
 * Authentication Feature Hooks
 * React hooks specific to authentication feature
 * Orchestrates authentication API calls and manages authentication state
 */

import { useState, useCallback, useEffect } from 'react';
import type { User, LoginCredentials, RegisterData } from '~/entities/user';
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
} from './api';

// Helper function for safe localStorage access
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Handle localStorage errors silently
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Handle localStorage errors silently
    }
  },
};

// Auth state management (simple state for demo - in production would use Redux slice)
interface AuthHookReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  clearError: () => void;
}

/**
 * Main authentication hook
 * Provides complete authentication functionality and state management
 */
export const useAuth = (): AuthHookReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // RTK Query mutations and queries
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();

  // Skip current user query if no token
  const { data: currentUserData } = useGetCurrentUserQuery(
    undefined,
    { skip: !token },
  );

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = safeLocalStorage.getItem('auth_token');
    const storedUser = safeLocalStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // Clear invalid stored data
        safeLocalStorage.removeItem('auth_token');
        safeLocalStorage.removeItem('auth_user');
      }
    }
    setIsInitialized(true);
  }, []);

  // Update user when current user data changes
  useEffect(() => {
    if (currentUserData?.user) {
      setUser(currentUserData.user);
      safeLocalStorage.setItem('auth_user', JSON.stringify(currentUserData.user));
    }
  }, [currentUserData]);

  const login = useCallback(async(credentials: LoginCredentials) => {
    try {
      setError(null);
      const result = await loginMutation(credentials).unwrap();

      setUser(result.user);
      setToken(result.token);

      // Store in localStorage for persistence
      safeLocalStorage.setItem('auth_token', result.token);
      safeLocalStorage.setItem('auth_refresh_token', result.refreshToken);
      safeLocalStorage.setItem('auth_user', JSON.stringify(result.user));

    } catch (err: unknown) {
      const errorMessage = (err as any)?.data?.error || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [loginMutation]);

  const logout = useCallback(async() => {
    try {
      setError(null);

      // Call logout endpoint if we have a token
      if (token) {
        await logoutMutation().unwrap();
      }
    } catch {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed, continuing with local logout');
    } finally {
      // Clear local state and storage
      setUser(null);
      setToken(null);
      safeLocalStorage.removeItem('auth_token');
      safeLocalStorage.removeItem('auth_refresh_token');
      safeLocalStorage.removeItem('auth_user');

      // Redirect to login page (client-side only)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [logoutMutation, token]);

  const register = useCallback(async(data: RegisterData) => {
    try {
      setError(null);
      const result = await registerMutation(data).unwrap();

      setUser(result.user);
      setToken(result.token);

      // Store in localStorage for persistence
      safeLocalStorage.setItem('auth_token', result.token);
      safeLocalStorage.setItem('auth_refresh_token', result.refreshToken);
      safeLocalStorage.setItem('auth_user', JSON.stringify(result.user));

    } catch (err: unknown) {
      const errorMessage = (err as any)?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [registerMutation]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isLoading = isLoginLoading || isLogoutLoading || isRegisterLoading || !isInitialized;
  // Ensure SSR-safe authentication state
  const isAuthenticated = typeof window !== 'undefined' && isInitialized && !!user && !!token;

  return {
    user: typeof window !== 'undefined' ? user : null,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
  };
};

/**
 * Hook for checking if user has specific role
 */
export const useUserRole = () => {
  const { user } = useAuth();

  return {
    isAdmin: user?.role === 'admin',
    isMember: user?.role === 'member',
    role: user?.role,
  };
};

/**
 * Hook for getting current user profile data
 */
export const useCurrentUser = () => {
  const { user, isAuthenticated } = useAuth();

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isMember: user?.role === 'member',
  };
};
