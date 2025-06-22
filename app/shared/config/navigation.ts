import type { User } from '~/entities/user';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  description?: string;
  children?: NavigationItem[];
  requiresAuth?: boolean;
  allowedRoles?: User['role'][];
  isExternal?: boolean;
  badge?: string;
}

export interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
}

export const mainNavigation: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: 'home',
    description: 'Project overview and getting started',
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '/projects',
    icon: 'folder',
    description: 'Manage your projects',
  },
  {
    id: 'tasks',
    label: 'Tasks',
    href: '/tasks',
    icon: 'check-circle',
    description: 'Task management and tracking',
  },
  {
    id: 'kanban',
    label: 'Kanban',
    href: '/kanban',
    icon: 'columns',
    description: 'Visual task management',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    href: '/calendar',
    icon: 'calendar',
    description: 'Schedule and deadlines',
  },
  {
    id: 'teams',
    label: 'Teams',
    href: '/teams',
    icon: 'users',
    description: 'Team management and collaboration',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: 'bar-chart',
    description: 'Performance insights and reports',
  },
  {
    id: 'docs',
    label: 'Docs',
    href: '/docs',
    icon: 'book',
    description: 'Documentation and guides',
  },
  {
    id: 'playground',
    label: 'Playground',
    href: '/playground',
    icon: 'play',
    description: 'Interactive playground',
  },
  {
    id: 'login',
    label: 'Login',
    href: '/login',
    icon: 'log-in',
    description: 'User authentication',
  },
];

// Legacy navigation sections - kept for backward compatibility if needed
export const navigationSections: NavigationSection[] = [
  {
    id: 'main',
    label: 'Main Navigation',
    items: mainNavigation,
  },
];

export const footerNavigation: NavigationItem[] = [
  {
    id: 'privacy',
    label: 'Privacy Policy',
    href: '/privacy',
    icon: 'shield',
  },
  {
    id: 'terms',
    label: 'Terms of Service',
    href: '/terms',
    icon: 'file-text',
  },
  {
    id: 'support',
    label: 'Support',
    href: '/support',
    icon: 'help-circle',
  },
];

// Utility functions for navigation
export const hasAccess = (item: NavigationItem, user: User | null): boolean => {
  if (!item.requiresAuth) return true;
  if (!user) return false;
  if (!item.allowedRoles) return true;
  return item.allowedRoles.includes(user.role);
};

export const getFilteredNavigation = (
  items: NavigationItem[],
  user: User | null,
): NavigationItem[] => {
  return items
    .filter(item => hasAccess(item, user))
    .map(item => {
      const filteredItem = { ...item };
      if (item.children) {
        filteredItem.children = getFilteredNavigation(item.children, user);
      } else {
        delete filteredItem.children;
      }
      return filteredItem;
    });
};

export const findNavigationItem = (
  items: NavigationItem[],
  href: string,
): NavigationItem | null => {
  for (const item of items) {
    if (item.href === href) return item;
    if (item.children) {
      const found = findNavigationItem(item.children, href);
      if (found) return found;
    }
  }
  return null;
};

export const generateBreadcrumbs = (
  pathname: string,
  sections: NavigationSection[] = navigationSections,
): NavigationItem[] => {
  const breadcrumbs: NavigationItem[] = [];

  // Always start with home
  if (pathname !== '/') {
    breadcrumbs.push({
      id: 'home',
      label: 'Home',
      href: '/',
      icon: 'home',
    });
  }

  // Find the current page in navigation
  for (const section of sections) {
    const item = findNavigationItem(section.items, pathname);
    if (item) {
      // Add parent items if any
      const pathParts = pathname.split('/').filter(Boolean);
      for (let i = 1; i < pathParts.length; i++) {
        const parentPath = '/' + pathParts.slice(0, i).join('/');
        const parentItem = findNavigationItem(section.items, parentPath);
        if (parentItem && !breadcrumbs.some(b => b.href === parentPath)) {
          breadcrumbs.push(parentItem);
        }
      }

      // Add current item
      if (!breadcrumbs.some(b => b.href === item.href)) {
        breadcrumbs.push(item);
      }
      break;
    }
  }

  return breadcrumbs;
};
