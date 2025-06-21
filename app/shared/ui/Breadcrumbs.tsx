import * as React from 'react';
import { Link } from '@remix-run/react';
import { theme } from '~/shared/design-system/theme';
import type { NavigationItem } from '~/shared/config/navigation';
import { useActiveNavigation } from '~/shared/lib/hooks/navigation';

interface BreadcrumbsProps {
  items?: NavigationItem[];
  className?: string;
  showHome?: boolean;
}

export default function Breadcrumbs({
  items,
  className,
  showHome = true,
}: BreadcrumbsProps) {
  const { breadcrumbs: autoBreadcrumbs } = useActiveNavigation();

  // Use provided items or auto-generated breadcrumbs
  const breadcrumbItems = items || autoBreadcrumbs;

  if (!breadcrumbItems || breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex ${className}`}
      style={{
        fontSize: theme.typography.fontSize.sm[0],
        color: theme.colors.gray[600],
      }}
    >
      <ol className="flex items-center" style={{ gap: theme.spacing[2] }}>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <React.Fragment key={item.id}>
              <li className="flex items-center">
                {isLast ? (
                  <span
                    className="font-medium"
                    style={{
                      color: theme.colors.gray[900],
                      fontWeight: theme.typography.fontWeight.medium,
                    }}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <BreadcrumbLink item={item} />
                )}
              </li>

              {!isLast && (
                <li>
                  <BreadcrumbSeparator />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

interface BreadcrumbLinkProps {
  item: NavigationItem;
}

function BreadcrumbLink({ item }: BreadcrumbLinkProps) {
  return (
    <Link
      to={item.href}
      className="flex items-center hover:underline transition-colors"
      style={{
        color: theme.colors.gray[600],
        gap: theme.spacing[1],
      }}
    >
      {item.icon && (
        <BreadcrumbIcon name={item.icon} />
      )}
      <span>{item.label}</span>
    </Link>
  );
}

function BreadcrumbSeparator() {
  return (
    <svg
      className="h-4 w-4"
      style={{
        width: theme.spacing[4],
        height: theme.spacing[4],
        color: theme.colors.gray[400],
      }}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

interface BreadcrumbIconProps {
  name: string;
}

function BreadcrumbIcon({ name }: BreadcrumbIconProps) {
  const iconStyle = {
    width: theme.spacing[4],
    height: theme.spacing[4],
  };

  // Simple icon mapping - matches the sidebar icons
  const icons: Record<string, React.ReactElement> = {
    home: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    book: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    target: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    layers: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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

// Export a compact version for use in smaller spaces
export function CompactBreadcrumbs({
  items,
  className,
}: {
  items?: NavigationItem[];
  className?: string;
}) {
  const { breadcrumbs: autoBreadcrumbs } = useActiveNavigation();
  const breadcrumbItems = items || autoBreadcrumbs;

  if (!breadcrumbItems || breadcrumbItems.length === 0) {
    return null;
  }

  // Show only the last 2 items for compact version
  const compactItems = breadcrumbItems.slice(-2);

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex ${className}`}
      style={{
        fontSize: theme.typography.fontSize.xs[0],
        color: theme.colors.gray[500],
      }}
    >
      <ol className="flex items-center" style={{ gap: theme.spacing[1] }}>
        {breadcrumbItems.length > 2 && (
          <>
            <li>
              <span>...</span>
            </li>
            <li>
              <BreadcrumbSeparator />
            </li>
          </>
        )}

        {compactItems.map((item, index) => {
          const isLast = index === compactItems.length - 1;

          return (
            <React.Fragment key={item.id}>
              <li className="flex items-center">
                {isLast ? (
                  <span
                    className="font-medium"
                    style={{
                      color: theme.colors.gray[700],
                      fontWeight: theme.typography.fontWeight.medium,
                    }}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="hover:underline"
                    style={{
                      color: theme.colors.gray[500],
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>

              {!isLast && (
                <li>
                  <BreadcrumbSeparator />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
