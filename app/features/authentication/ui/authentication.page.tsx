import * as React from 'react';
import { cn } from '~/shared/lib/utils';
import LoginForm from './LoginForm';

interface AuthenticationPageProps {
  children?: React.ReactNode;
  className?: string;
}

const AuthenticationPage = React.forwardRef<
  HTMLDivElement,
  AuthenticationPageProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'min-h-screen flex items-center justify-center bg-gray-50',
        className,
      )}
      {...props}
    >
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <LoginForm />
        {children}
      </div>
    </div>
  );
});

AuthenticationPage.displayName = 'AuthenticationPage';

export default AuthenticationPage;
