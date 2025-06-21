import * as React from 'react';
import { Link } from '@remix-run/react';
import { theme } from '~/shared/design-system/theme';
import type { NavigationItem, NavigationSection } from '~/shared/config/navigation';
import { useNavigationState } from '~/shared/lib/hooks/navigation';
import { navigationSections, hasAccess } from '~/shared/config/navigation';
import { Button } from './button';

interface MobileMenuProps {
  className?: string;
}

export default function MobileMenu({ className }: MobileMenuProps) {
  const {
    isMobileMenuOpen,
    closeMobileMenu,
    user,
    isItemActive,
  } = useNavigationState();

  // Close menu when clicking outside
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  // Close menu on escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  if (!isMobileMenuOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        style={{
          backgroundColor: theme.colors.black,
          opacity: 0.5,
        }}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${className}`}
        style={{
          backgroundColor: theme.colors.white,
          boxShadow: theme.shadows.xl,
          maxWidth: '20rem', // 320px equivalent
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="flex items-center justify-between border-b"
            style={{
              padding: theme.spacing[4],
              borderColor: theme.colors.gray[200],
            }}
          >
            <h2
              className="text-lg font-semibold"
              style={{
                fontSize: theme.typography.fontSize.lg[0],
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.gray[900],
              }}
            >
              Menu
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <svg
                className="h-5 w-5"
                style={{
                  width: theme.spacing[5],
                  height: theme.spacing[5],
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {/* User Section */}
          {user && (
            <div
              className="border-b"
              style={{
                padding: theme.spacing[4],
                borderColor: theme.colors.gray[200],
              }}
            >
              <MobileUserSection user={user} onClose={closeMobileMenu} />
            </div>
          )}

          {/* Navigation Sections */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              padding: theme.spacing[4],
            }}
          >
            <nav className="space-y-6">
              {navigationSections.map((section) => {
                const visibleItems = section.items.filter(item => hasAccess(item, user));

                if (visibleItems.length === 0) {
                  return null;
                }

                return (
                  <MobileMenuSection
                    key={section.id}
                    section={{ ...section, items: visibleItems }}
                    isItemActive={isItemActive}
                    onItemClick={closeMobileMenu}
                  />
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          {!user && (
            <div
              className="border-t"
              style={{
                padding: theme.spacing[4],
                borderColor: theme.colors.gray[200],
              }}
            >
              <div
                className="space-y-2"
                style={{
                  gap: theme.spacing[2],
                }}
              >
                <Button
                  asChild
                  className="w-full"
                  onClick={closeMobileMenu}
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full"
                  onClick={closeMobileMenu}
                >
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface MobileUserSectionProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    avatar?: string;
  };
  onClose: () => void;
}

function MobileUserSection({ user, onClose }: MobileUserSectionProps) {
  return (
    <div className="flex items-center" style={{ gap: theme.spacing[3] }}>
      {/* Avatar */}
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: theme.spacing[12],
          height: theme.spacing[12],
          backgroundColor: user.avatar ? 'transparent' : theme.colors.primary[500],
        }}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span
            className="text-lg font-medium"
            style={{
              fontSize: theme.typography.fontSize.lg[0],
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.white,
            }}
          >
            {user.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()}
          </span>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1">
        <p
          className="font-medium"
          style={{
            fontSize: theme.typography.fontSize.base[0],
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.gray[900],
          }}
        >
          {user.name}
        </p>
        <p
          className="text-sm"
          style={{
            fontSize: theme.typography.fontSize.sm[0],
            color: theme.colors.gray[600],
          }}
        >
          {user.email}
        </p>
        <p
          className="text-xs"
          style={{
            fontSize: theme.typography.fontSize.xs[0],
            color: theme.colors.gray[500],
            textTransform: 'capitalize',
          }}
        >
          {user.role}
        </p>
      </div>
    </div>
  );
}

interface MobileMenuSectionProps {
  section: NavigationSection;
  isItemActive: (item: NavigationItem) => boolean;
  onItemClick: () => void;
}

function MobileMenuSection({ section, isItemActive, onItemClick }: MobileMenuSectionProps) {
  return (
    <div>
      <h3
        className="mb-3 text-xs font-medium uppercase tracking-wide"
        style={{
          marginBottom: theme.spacing[3],
          fontSize: theme.typography.fontSize.xs[0],
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.gray[500],
          letterSpacing: '0.05em',
        }}
      >
        {section.label}
      </h3>

      <div className="space-y-1">
        {section.items.map((item) => (
          <MobileMenuItem
            key={item.id}
            item={item}
            isActive={isItemActive(item)}
            onClick={onItemClick}
          />
        ))}
      </div>
    </div>
  );
}

interface MobileMenuItemProps {
  item: NavigationItem;
  isActive: boolean;
  onClick: () => void;
}

function MobileMenuItem({ item, isActive, onClick }: MobileMenuItemProps) {
  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors ${
        isActive
          ? 'bg-primary-50 text-primary-700'
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
      }`}
      style={{
        paddingLeft: theme.spacing[3],
        paddingRight: theme.spacing[3],
        paddingTop: theme.spacing[3],
        paddingBottom: theme.spacing[3],
        borderRadius: theme.borderRadius.lg,
        fontSize: theme.typography.fontSize.base[0],
        fontWeight: theme.typography.fontWeight.medium,
        backgroundColor: isActive
          ? theme.colors.primary[50]
          : 'transparent',
        color: isActive
          ? theme.colors.primary[700]
          : theme.colors.gray[700],
      }}
    >
      {/* Icon */}
      {item.icon && (
        <div
          className="mr-3"
          style={{
            marginRight: theme.spacing[3],
          }}
        >
          <MobileMenuIcon name={item.icon} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span>{item.label}</span>
          {item.badge && (
            <span
              className="ml-2 px-2 py-1 text-xs rounded-full"
              style={{
                marginLeft: theme.spacing[2],
                paddingLeft: theme.spacing[2],
                paddingRight: theme.spacing[2],
                paddingTop: theme.spacing[1],
                paddingBottom: theme.spacing[1],
                fontSize: theme.typography.fontSize.xs[0],
                borderRadius: theme.borderRadius.full,
                backgroundColor: theme.colors.primary[100],
                color: theme.colors.primary[700],
              }}
            >
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p
            className="text-sm mt-1"
            style={{
              fontSize: theme.typography.fontSize.sm[0],
              color: theme.colors.gray[500],
              marginTop: theme.spacing[1],
            }}
          >
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
}

interface MobileMenuIconProps {
  name: string;
}

function MobileMenuIcon({ name }: MobileMenuIconProps) {
  const iconStyle = {
    width: theme.spacing[6],
    height: theme.spacing[6],
  };

  // Simple icon mapping - matches other components
  const icons: Record<string, React.ReactElement> = {
    home: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    folder: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    'check-circle': (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    columns: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    calendar: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    users: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    'bar-chart': (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    book: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    play: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a1 1 0 001 1h4M9 10V9a1 1 0 011-1h4a1 1 0 011 1v1M9 10H8a1 1 0 00-1 1v3a1 1 0 001 1h1m0-5h4" />
      </svg>
    ),
    terminal: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    database: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
  };

  return icons[name] || icons.home;
}
