import { Link } from '@remix-run/react';
import { theme } from '~/shared/design-system/theme';
import { useNavigationState } from '~/shared/lib/hooks/navigation';
import { mainNavigation, hasAccess } from '~/shared/config/navigation';
import { useAuth } from '~/features/authentication';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Avatar } from './avatar';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const {
    user,
    toggleMobileMenu,
    isMobileMenuOpen,
    isItemActive,
  } = useNavigationState();

  const visibleNavItems = mainNavigation.filter(item => hasAccess(item, user));

  return (
    <header
      className={`bg-white shadow-sm border-b ${className}`}
      style={{
        borderColor: theme.colors.gray[200],
        boxShadow: theme.shadows.sm,
      }}
    >
      <div
        className="max-w-7xl mx-auto"
        style={{
          paddingLeft: theme.spacing[4],
          paddingRight: theme.spacing[4],
          paddingTop: theme.spacing[4],
          paddingBottom: theme.spacing[4],
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center"
              style={{
                gap: theme.spacing[2],
              }}
            >
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: theme.spacing[8],
                  height: theme.spacing[8],
                  backgroundColor: theme.colors.primary[500],
                  color: theme.colors.white,
                  fontSize: theme.typography.fontSize.lg[0],
                  fontWeight: theme.typography.fontWeight.bold,
                }}
              >
                PM
              </div>
              <span
                className="hidden sm:block"
                style={{
                  fontSize: theme.typography.fontSize.xl[0],
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.gray[900],
                }}
              >
                Project Manager
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div
              className="flex items-center"
              style={{
                gap: theme.spacing[1],
              }}
            >
              {visibleNavItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isItemActive(item)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  style={{
                    paddingLeft: theme.spacing[3],
                    paddingRight: theme.spacing[3],
                    paddingTop: theme.spacing[2],
                    paddingBottom: theme.spacing[2],
                    borderRadius: theme.borderRadius.md,
                    fontSize: theme.typography.fontSize.sm[0],
                    fontWeight: theme.typography.fontWeight.medium,
                    backgroundColor: isItemActive(item)
                      ? theme.colors.primary[50]
                      : 'transparent',
                    color: isItemActive(item)
                      ? theme.colors.primary[700]
                      : theme.colors.gray[700],
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center" style={{ gap: theme.spacing[4] }}>
            {/* User Menu or Auth Buttons */}
            {user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center" style={{ gap: theme.spacing[2] }}>
                <Button variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className="hidden sm:inline-flex">
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
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
              ) : (
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

interface UserMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    avatar?: string;
  };
}

function UserMenu({ user }: UserMenuProps) {
  const { logout } = useAuth();

  const handleLogout = async() => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative flex items-center"
          style={{
            gap: theme.spacing[2],
          }}
        >
          <Avatar
            className="h-6 w-6"
            style={{
              width: theme.spacing[6],
              height: theme.spacing[6],
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
                className="flex items-center justify-center h-full w-full rounded-full"
                style={{
                  backgroundColor: theme.colors.primary[500],
                  color: theme.colors.white,
                  fontSize: theme.typography.fontSize.xs[0],
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                {user.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()}
              </span>
            )}
          </Avatar>
          <span
            className="hidden sm:block"
            style={{
              fontSize: theme.typography.fontSize.sm[0],
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.gray[700],
            }}
          >
            {user.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link to="/profile" className="flex items-center w-full">
            <svg
              className="mr-2 h-4 w-4"
              style={{
                marginRight: theme.spacing[2],
                width: theme.spacing[4],
                height: theme.spacing[4],
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/settings" className="flex items-center w-full">
            <svg
              className="mr-2 h-4 w-4"
              style={{
                marginRight: theme.spacing[2],
                width: theme.spacing[4],
                height: theme.spacing[4],
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </Link>
        </DropdownMenuItem>
        {user.role === 'admin' && (
          <DropdownMenuItem>
            <Link to="/admin" className="flex items-center w-full">
              <svg
                className="mr-2 h-4 w-4"
                style={{
                  marginRight: theme.spacing[2],
                  width: theme.spacing[4],
                  height: theme.spacing[4],
                }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <svg
            className="mr-2 h-4 w-4"
            style={{
              marginRight: theme.spacing[2],
              width: theme.spacing[4],
              height: theme.spacing[4],
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
