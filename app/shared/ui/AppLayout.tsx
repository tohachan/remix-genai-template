import * as React from 'react';
import { Outlet, useLocation } from '@remix-run/react';
import { theme } from '~/shared/design-system/theme';
import { useNavigationState } from '~/shared/lib/hooks/navigation';
import Header from './Header';
import MobileMenu from './MobileMenu';
import Breadcrumbs from './Breadcrumbs';
import { BrowserOnly } from '.';

interface AppLayoutProps {
  children?: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
}

export default function AppLayout({
  children,
  className,
  showBreadcrumbs = true,
}: AppLayoutProps) {
  const { isMobileMenuOpen } = useNavigationState();
  const location = useLocation();

  // Hide breadcrumbs on home page
  const shouldShowBreadcrumbs = showBreadcrumbs && location.pathname !== '/';

  // Prevent body scroll when mobile menu is open (client-side only)
  React.useEffect(() => {
    // Only run on client side to prevent hydration issues
    if (typeof document === 'undefined') return;

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header - always visible */}
      <Header />

      {/* Mobile Menu - only on mobile */}
      <BrowserOnly fallback={null}>
        {isMobileMenuOpen && <MobileMenu />}
      </BrowserOnly>

      {/* Main Content Area - full width without sidebar */}
      <main className="flex flex-col min-h-[calc(100vh-64px)]">
        {/* Breadcrumbs */}
        <BrowserOnly fallback={null}>
          {shouldShowBreadcrumbs && (
            <div
              className="bg-white border-b"
              style={{
                padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
                borderColor: theme.colors.gray[200],
              }}
            >
              <Breadcrumbs />
            </div>
          )}
        </BrowserOnly>

        {/* Page Content */}
        <div
          className="flex-1"
          style={{
            padding: theme.spacing[6],
            backgroundColor: theme.colors.gray[50],
          }}
        >
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
