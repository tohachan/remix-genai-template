import * as React from 'react';
import { cn } from '~/shared/lib/utils';

interface ProductsProps {
  children?: React.ReactNode;
  className?: string;
}

const Products = React.forwardRef<
  HTMLDivElement,
  ProductsProps
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

Products.displayName = 'Products';

export { Products };
