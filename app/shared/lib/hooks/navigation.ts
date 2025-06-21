import { useState, useEffect } from 'react';
import { useLocation } from '@remix-run/react';
import type { NavigationItem, NavigationSection } from '~/shared/config/navigation';
import {
  navigationSections,
  generateBreadcrumbs,
  findNavigationItem,
  getFilteredNavigation,
} from '~/shared/config/navigation';
import { useAuth } from '~/features/authentication';

export interface NavigationState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  activeSection: string | null;
  activeItem: NavigationItem | null;
  breadcrumbs: NavigationItem[];
}

export const useNavigationState = () => {
  const location = useLocation();
  const { user } = useAuth();

  const [state, setState] = useState<NavigationState>({
    isSidebarOpen: true,
    isMobileMenuOpen: false,
    activeSection: null,
    activeItem: null,
    breadcrumbs: [],
  });

  // Update active navigation based on current route
  useEffect(() => {
    const pathname = location.pathname;

    // Find active section and item
    let activeSection: string | null = null;
    let activeItem: NavigationItem | null = null;

    for (const section of navigationSections) {
      const item = findNavigationItem(section.items, pathname);
      if (item) {
        activeSection = section.id;
        activeItem = item;
        break;
      }
    }

    // Generate breadcrumbs
    const breadcrumbs = generateBreadcrumbs(pathname);

    setState(prev => ({
      ...prev,
      activeSection,
      activeItem,
      breadcrumbs,
      // Close mobile menu when navigating
      isMobileMenuOpen: false,
    }));
  }, [location.pathname]);

  const toggleSidebar = () => {
    setState(prev => ({
      ...prev,
      isSidebarOpen: !prev.isSidebarOpen,
    }));
  };

  const closeSidebar = () => {
    setState(prev => ({
      ...prev,
      isSidebarOpen: false,
    }));
  };

  const openSidebar = () => {
    setState(prev => ({
      ...prev,
      isSidebarOpen: true,
    }));
  };

  const toggleMobileMenu = () => {
    setState(prev => ({
      ...prev,
      isMobileMenuOpen: !prev.isMobileMenuOpen,
    }));
  };

  const closeMobileMenu = () => {
    setState(prev => ({
      ...prev,
      isMobileMenuOpen: false,
    }));
  };

  const openMobileMenu = () => {
    setState(prev => ({
      ...prev,
      isMobileMenuOpen: true,
    }));
  };

  // Get filtered navigation based on user permissions
  const getFilteredSections = (): NavigationSection[] => {
    return navigationSections.map(section => ({
      ...section,
      items: getFilteredNavigation(section.items, user),
    }));
  };

  const isItemActive = (item: NavigationItem): boolean => {
    return state.activeItem?.id === item.id;
  };

  const isSectionActive = (sectionId: string): boolean => {
    return state.activeSection === sectionId;
  };

  return {
    ...state,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    toggleMobileMenu,
    closeMobileMenu,
    openMobileMenu,
    getFilteredSections,
    isItemActive,
    isSectionActive,
    user,
  };
};

export const useResponsiveNavigation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // md breakpoint
      setIsTablet(width >= 768 && width < 1024); // lg breakpoint
    };

    // Check initially
    checkScreenSize();

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  };
};

export const useActiveNavigation = () => {
  const location = useLocation();

  const getActiveItem = (): NavigationItem | null => {
    for (const section of navigationSections) {
      const item = findNavigationItem(section.items, location.pathname);
      if (item) return item;
    }
    return null;
  };

  const getActiveSection = (): string | null => {
    for (const section of navigationSections) {
      const item = findNavigationItem(section.items, location.pathname);
      if (item) return section.id;
    }
    return null;
  };

  const getBreadcrumbs = (): NavigationItem[] => {
    return generateBreadcrumbs(location.pathname);
  };

  return {
    activeItem: getActiveItem(),
    activeSection: getActiveSection(),
    breadcrumbs: getBreadcrumbs(),
    pathname: location.pathname,
  };
};
