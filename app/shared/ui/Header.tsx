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
  DropdownMenuTrigger,
} from './dropdown-menu';

// Teams-style avatar colors based on name hash
const avatarColors = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
  '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % avatarColors.length;
  return avatarColors[colorIndex] as string;
}

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
            {/* User Menu - only show if authenticated */}
            {user && <UserMenu user={user} />}

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
          data-testid="user-menu"
          style={{
            gap: theme.spacing[2],
          }}
        >
          <div
            className="flex items-center justify-center rounded-full border-2 border-white shadow-sm"
            data-testid="user-avatar"
            style={{
              width: theme.spacing[8],
              height: theme.spacing[8],
              backgroundColor: getAvatarColor(user.name || 'User'),
              fontSize: theme.typography.fontSize.sm[0],
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.white,
            }}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span>
                {user.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </div>
          <span
            className="hidden sm:block"
            data-testid="user-name"
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
