import { useAuth } from '~/features/authentication';
import { theme } from '~/shared/design-system/theme';
import { getAvatarColor } from '~/shared/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from './button';

interface UserMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    avatar?: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
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
