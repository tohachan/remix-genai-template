import * as React from 'react';
import { Outlet } from '@remix-run/react';
import { theme } from '~/shared/design-system/theme';
import { useNavigationState, useResponsiveNavigation } from '~/shared/lib/hooks/navigation';
import { navigationSections } from '~/shared/config/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import Breadcrumbs from './Breadcrumbs';

interface AppLayoutProps {
  children?: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
  showSidebar?: boolean;
}

export default function AppLayout({
  children,
  className,
  showBreadcrumbs = true,
  showSidebar = true,
}: AppLayoutProps) {
  const { isSidebarOpen, isMobileMenuOpen } = useNavigationState();
  const { isMobile } = useResponsiveNavigation();

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
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
      {isMobileMenuOpen && <MobileMenu />}

      <div className="flex h-[calc(100vh-64px)]"> {/* Subtract header height */}
        {/* Sidebar - desktop only */}
        {showSidebar && !isMobile && (
          <Sidebar
            sections={navigationSections}
            className={`transition-all duration-300 ${
              isSidebarOpen ? 'w-64' : 'w-16'
            }`}
          />
        )}

        {/* Main Content Area */}
        <main
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            marginLeft: showSidebar && !isMobile ?
              (isSidebarOpen ? theme.spacing[64] : theme.spacing[16]) :
              '0',
            transition: 'margin-left 300ms ease-in-out',
          }}
        >
          {/* Breadcrumbs */}
          {showBreadcrumbs && (
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

          {/* Page Content */}
          <div
            className="flex-1 overflow-auto"
            style={{
              padding: theme.spacing[6],
              backgroundColor: theme.colors.gray[50],
            }}
          >
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
