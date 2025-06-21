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
    requiresAuth: true,
    allowedRoles: ['admin', 'member'],
  },
  {
    id: 'tasks',
    label: 'Tasks',
    href: '/tasks',
    icon: 'check-circle',
    description: 'Task management and tracking',
    requiresAuth: true,
    allowedRoles: ['admin', 'member'],
  },
  {
    id: 'kanban',
    label: 'Kanban Board',
    href: '/kanban',
    icon: 'columns',
    description: 'Visual task management',
    requiresAuth: true,
    allowedRoles: ['admin', 'member'],
  },
  {
    id: 'calendar',
    label: 'Calendar',
    href: '/calendar',
    icon: 'calendar',
    description: 'Schedule and deadlines',
    requiresAuth: true,
    allowedRoles: ['admin', 'member'],
  },
  {
    id: 'teams',
    label: 'Teams',
    href: '/teams',
    icon: 'users',
    description: 'Team management and collaboration',
    requiresAuth: true,
    allowedRoles: ['admin'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: 'bar-chart',
    description: 'Performance insights and reports',
    requiresAuth: true,
    allowedRoles: ['admin', 'member'],
  },
];

export const docsNavigation: NavigationItem[] = [
  {
    id: 'docs-overview',
    label: 'Documentation',
    href: '/docs',
    icon: 'book',
    description: 'Architecture and development guides',
  },
  {
    id: 'srp',
    label: 'Single Responsibility',
    href: '/docs/srp',
    icon: 'target',
    description: 'Single Responsibility Principle',
  },
  {
    id: 'fsd',
    label: 'Feature-Sliced Design',
    href: '/docs/fsd',
    icon: 'layers',
    description: 'FSD Architecture methodology',
  },
  {
    id: 'design-tokens',
    label: 'Design Tokens',
    href: '/docs/design-tokens',
    icon: 'palette',
    description: 'Design system and tokens',
  },
  {
    id: 'layered-separation',
    label: 'Layered Separation',
    href: '/docs/layered-separation',
    icon: 'stack',
    description: 'Architecture layer boundaries',
  },
  {
    id: 'dependency-injection',
    label: 'Dependency Injection',
    href: '/docs/dependency-injection',
    icon: 'link',
    description: 'Dependency management patterns',
  },
  {
    id: 'auto-updatable-docs',
    label: 'Auto-Updatable Docs',
    href: '/docs/auto-updatable-docs',
    icon: 'refresh-cw',
    description: 'Dynamic documentation system',
  },
  {
    id: 'test-first-patterns',
    label: 'Test-First Patterns',
    href: '/docs/test-first-patterns',
    icon: 'shield',
    description: 'Testing methodologies',
  },
];

export const playgroundNavigation: NavigationItem[] = [
  {
    id: 'playground',
    label: 'Playground',
    href: '/playground',
    icon: 'play',
    description: 'Interactive code playground',
  },
  {
    id: 'api-test',
    label: 'API Testing',
    href: '/api-test',
    icon: 'terminal',
    description: 'API endpoint testing',
  },
  {
    id: 'rtk-example',
    label: 'RTK Query Demo',
    href: '/rtk-example',
    icon: 'database',
    description: 'RTK Query examples',
  },
];

export const navigationSections: NavigationSection[] = [
  {
    id: 'main',
    label: 'Main Features',
    items: mainNavigation,
  },
  {
    id: 'docs',
    label: 'Documentation',
    items: docsNavigation,
  },
  {
    id: 'playground',
    label: 'Development Tools',
    items: playgroundNavigation,
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
