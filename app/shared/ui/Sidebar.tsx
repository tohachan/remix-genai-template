import * as React from 'react';
import { Link } from '@remix-run/react';
import { theme } from '~/shared/design-system/theme';
import type { NavigationItem, NavigationSection } from '~/shared/config/navigation';
import { useNavigationState } from '~/shared/lib/hooks/navigation';
import { Button } from './button';

interface SidebarProps {
  sections: NavigationSection[];
  className?: string;
  isCollapsible?: boolean;
}

export default function Sidebar({
  sections,
  className,
  isCollapsible = true,
}: SidebarProps) {
  const {
    isSidebarOpen,
    toggleSidebar,
    isItemActive,
    isSectionActive,
  } = useNavigationState();

  return (
    <aside
      className={`bg-white border-r transition-all duration-300 ${className}`}
      style={{
        width: isSidebarOpen ? theme.spacing[64] : theme.spacing[16],
        borderColor: theme.colors.gray[200],
        minHeight: '100vh',
      }}
    >
      <div
        className="h-full flex flex-col"
        style={{
          padding: theme.spacing[4],
        }}
      >
        {/* Sidebar Header with Toggle */}
        {isCollapsible && (
          <div
            className="flex items-center justify-between mb-6"
            style={{
              marginBottom: theme.spacing[6],
            }}
          >
            {isSidebarOpen && (
              <h2
                className="font-semibold"
                style={{
                  fontSize: theme.typography.fontSize.lg[0],
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.gray[900],
                }}
              >
                Navigation
              </h2>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <svg
                className="h-4 w-4"
                style={{
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
                  d={isSidebarOpen
                    ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7'
                    : 'M13 5l7 7-7 7M5 5l7 7-7 7'
                  }
                />
              </svg>
            </Button>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="flex-1 space-y-6">
          {sections.map((section) => (
            <SidebarSection
              key={section.id}
              section={section}
              isCollapsed={!isSidebarOpen}
              isActive={isSectionActive(section.id)}
              isItemActive={isItemActive}
            />
          ))}
        </nav>

        {/* Sidebar Footer */}
        {isSidebarOpen && (
          <div
            className="pt-6 border-t"
            style={{
              paddingTop: theme.spacing[6],
              borderColor: theme.colors.gray[200],
            }}
          >
            <div
              className="text-xs text-gray-500"
              style={{
                fontSize: theme.typography.fontSize.xs[0],
                color: theme.colors.gray[500],
              }}
            >
              Project Manager v1.0
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

interface SidebarSectionProps {
  section: NavigationSection;
  isCollapsed: boolean;
  isActive: boolean;
  isItemActive: (item: NavigationItem) => boolean;
}

function SidebarSection({
  section,
  isCollapsed,
  isActive,
  isItemActive,
}: SidebarSectionProps) {
  if (isCollapsed) {
    return (
      <div
        className="space-y-2"
        style={{
          gap: theme.spacing[2],
        }}
      >
        {section.items.map((item) => (
          <SidebarItemCollapsed
            key={item.id}
            item={item}
            isActive={isItemActive(item)}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Section Header */}
      <h3
        className="mb-3 font-medium"
        style={{
          marginBottom: theme.spacing[3],
          fontSize: theme.typography.fontSize.sm[0],
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.gray[700],
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {section.label}
      </h3>

      {/* Section Items */}
      <div
        className="space-y-1"
        style={{
          gap: theme.spacing[1],
        }}
      >
        {section.items.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={isItemActive(item)}
          />
        ))}
      </div>
    </div>
  );
}

interface SidebarItemProps {
  item: NavigationItem;
  isActive: boolean;
}

function SidebarItem({ item, isActive }: SidebarItemProps) {
  return (
    <Link
      to={item.href}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors group ${
        isActive
          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
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
        backgroundColor: isActive
          ? theme.colors.primary[50]
          : 'transparent',
        color: isActive
          ? theme.colors.primary[700]
          : theme.colors.gray[700],
        borderRight: isActive
          ? `2px solid ${theme.colors.primary[500]}`
          : 'none',
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
          <SidebarIcon name={item.icon} />
        </div>
      )}

      {/* Label */}
      <span className="flex-1">{item.label}</span>

      {/* Badge */}
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
    </Link>
  );
}

function SidebarItemCollapsed({ item, isActive }: SidebarItemProps) {
  return (
    <Link
      to={item.href}
      className={`flex items-center justify-center p-2 rounded-md transition-colors group ${
        isActive
          ? 'bg-primary-50 text-primary-700'
          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
      }`}
      style={{
        padding: theme.spacing[2],
        borderRadius: theme.borderRadius.md,
        backgroundColor: isActive
          ? theme.colors.primary[50]
          : 'transparent',
        color: isActive
          ? theme.colors.primary[700]
          : theme.colors.gray[700],
      }}
      title={item.label}
    >
      {item.icon && <SidebarIcon name={item.icon} />}
    </Link>
  );
}

interface SidebarIconProps {
  name: string;
}

function SidebarIcon({ name }: SidebarIconProps) {
  const iconStyle = {
    width: theme.spacing[5],
    height: theme.spacing[5],
  };

  // Simple icon mapping - in a real app, you'd use a proper icon library
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
    palette: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h4" />
      </svg>
    ),
    stack: (
      <svg style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    // Add more icons as needed
  };

  return icons[name] || icons.home;
}
