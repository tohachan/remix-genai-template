import * as React from 'react';
import { cn } from '~/shared/lib/utils';

interface NavigationProps {
  children?: React.ReactNode;
  className?: string;
}

const Navigation = React.forwardRef<
  HTMLDivElement,
  NavigationProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'p-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Navigation.displayName = 'Navigation';

export { Navigation };
