/**
 * ProtectedRoute Component
 * Provides role-based access control for route protection
 */

import * as React from 'react';
import { Navigate, useLocation } from '@remix-run/react';
import { useAuth, useUserRole } from '~/features/authentication/hooks';
import type { UserRole } from '~/entities/user';
import { cn } from '~/shared/lib/utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Required role to access the route */
  requiredRole?: UserRole;
  /** Redirect path for unauthenticated users */
  redirectTo?: string;
  /** Whether to show loading state while checking auth */
  showLoader?: boolean;
  /** Custom className for the wrapper */
  className?: string;
}

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication and/or specific roles
 */
const ProtectedRoute = React.forwardRef<HTMLDivElement, ProtectedRouteProps>(
  ({
    children,
    requiredRole,
    redirectTo = '/login',
    showLoader = true,
    className,
    ...props
  }, ref) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const { isAdmin, isMember, role } = useUserRole();
    const location = useLocation();

    // Show loading state while checking authentication
    if (isLoading && showLoader) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center justify-center min-h-screen',
            className,
          )}
          {...props}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
      return (
        <Navigate
          to={`${redirectTo}?redirect=${encodeURIComponent(location.pathname)}`}
          replace
        />
      );
    }

    // Check role-based access if required role is specified
    if (requiredRole) {
      const hasRequiredRole =
        (requiredRole === 'admin' && isAdmin) ||
        (requiredRole === 'member' && (isMember || isAdmin)); // Admins have member access too

      if (!hasRequiredRole) {
        return (
          <div
            ref={ref}
            className={cn(
              'flex items-center justify-center min-h-screen',
              className,
            )}
            {...props}
          >
            <div className="text-center max-w-md mx-auto">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.598 0L3.196 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
              <p className="text-gray-600 mb-4">
                You don't have permission to access this page. Required role: {requiredRole}
              </p>
              <p className="text-sm text-gray-500">
                Your current role: {role}
              </p>
            </div>
          </div>
        );
      }
    }

    // User is authenticated and has required permissions
    return (
      <div
        ref={ref}
        className={cn('min-h-screen', className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ProtectedRoute.displayName = 'ProtectedRoute';

export { ProtectedRoute };

// Additional utility component for admin-only routes
export const AdminRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRole'>> = (props) => (
  <ProtectedRoute {...props} requiredRole="admin" />
);

// Additional utility component for member-level routes (includes admin access)
export const MemberRoute: React.FC<Omit<ProtectedRouteProps, 'requiredRole'>> = (props) => (
  <ProtectedRoute {...props} requiredRole="member" />
);
