/**
 * Login Route
 * Provides authentication interface for users
 */

import type { MetaFunction } from '@remix-run/node';
import { useSearchParams, useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import LoginForm from '~/features/authentication/ui/LoginForm';
import { useAuth } from '~/features/authentication/hooks';

export const meta: MetaFunction = () => {
  return [
    { title: 'Login - Project Management' },
    { name: 'description', content: 'Sign in to your project management account' },
  ];
};

export default function LoginRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  // Redirect to projects or the requested page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/projects';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  const handleLoginSuccess = () => {
    const redirectTo = searchParams.get('redirect') || '/projects';
    navigate(redirectTo, { replace: true });
  };

  // Don't render the form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
