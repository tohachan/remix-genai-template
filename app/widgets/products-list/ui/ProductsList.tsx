import * as React from 'react';
import type { Product } from '~/entities/product';
import { theme } from '~/shared/design-system/theme';

interface ProductsListProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  onProductClick?: (product: Product) => void;
  className?: string;
}

const ProductCard = ({ product, onClick }: { product: Product; onClick?: (() => void) | undefined }) => {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div
      style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.sm,
        padding: theme.spacing[4],
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = theme.shadows.md;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = theme.shadows.sm;
        }
      }}
    >
      {/* Product Image */}
      <div
        style={{
          width: '100%',
          height: '200px',
          borderRadius: theme.borderRadius.md,
          overflow: 'hidden',
          marginBottom: theme.spacing[3],
          backgroundColor: theme.colors.gray[100],
        }}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div>
        {/* Category */}
        <div
          style={{
            fontSize: theme.typography.fontSize.sm[0],
            color: theme.colors.gray[500],
            marginBottom: theme.spacing[1],
            textTransform: 'capitalize',
          }}
        >
          {product.category}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: theme.typography.fontSize.lg[0],
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.gray[900],
            marginBottom: theme.spacing[2],
            lineHeight: theme.typography.fontSize.lg[1].lineHeight,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.title}
        </h3>

        {/* Rating */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[1],
            marginBottom: theme.spacing[2],
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[1],
            }}
          >
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                style={{
                  color: i < Math.floor(product.rating) ? theme.colors.warning[500] : theme.colors.gray[300],
                  fontSize: theme.typography.fontSize.sm[0],
                }}
              >
                ★
              </span>
            ))}
          </div>
          <span
            style={{
              fontSize: theme.typography.fontSize.sm[0],
              color: theme.colors.gray[600],
            }}
          >
            ({product.rating})
          </span>
        </div>

        {/* Price */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
            marginBottom: theme.spacing[2],
          }}
        >
          <span
            style={{
              fontSize: theme.typography.fontSize.xl[0],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.gray[900],
            }}
          >
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <>
              <span
                style={{
                  fontSize: theme.typography.fontSize.sm[0],
                  color: theme.colors.gray[500],
                  textDecoration: 'line-through',
                }}
              >
                ${product.price.toFixed(2)}
              </span>
              <span
                style={{
                  fontSize: theme.typography.fontSize.sm[0],
                  color: theme.colors.success[600],
                  backgroundColor: theme.colors.success[50],
                  padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                  borderRadius: theme.borderRadius.md,
                  fontWeight: theme.typography.fontWeight.medium,
                }}
              >
                {product.discountPercentage.toFixed(0)}% off
              </span>
            </>
          )}
        </div>

        {/* Stock Status */}
        <div
          style={{
            fontSize: theme.typography.fontSize.sm[0],
            color: product.stock > 0 ? theme.colors.success[600] : theme.colors.error[600],
            fontWeight: theme.typography.fontWeight.medium,
          }}
        >
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div
    style={{
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.sm,
      padding: theme.spacing[4],
    }}
  >
    {/* Image skeleton */}
    <div
      style={{
        width: '100%',
        height: '200px',
        backgroundColor: theme.colors.gray[200],
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing[3],
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    />

    {/* Text skeletons */}
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        style={{
          height: theme.spacing[4],
          backgroundColor: theme.colors.gray[200],
          borderRadius: theme.borderRadius.sm,
          marginBottom: theme.spacing[2],
          width: i === 0 ? '60%' : i === 1 ? '80%' : i === 2 ? '40%' : '50%',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
    ))}
  </div>
);

const ProductsList = React.forwardRef<HTMLDivElement, ProductsListProps>(
  ({ products, isLoading = false, error, onProductClick, className, ...props }, ref) => {
    // Error state
    if (error) {
      return (
        <div
          ref={ref}
          style={{
            textAlign: 'center',
            padding: theme.spacing[8],
          }}
          {...props}
        >
          <div
            style={{
              fontSize: theme.typography.fontSize.lg[0],
              color: theme.colors.error[600],
              marginBottom: theme.spacing[2],
            }}
          >
             ⚠️ Error loading products
          </div>
          <div
            style={{
              fontSize: theme.typography.fontSize.base[0],
              color: theme.colors.gray[600],
            }}
          >
            {error}
          </div>
        </div>
      );
    }

    // Loading state
    if (isLoading) {
      return (
        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: theme.spacing[6],
            padding: theme.spacing[4],
          }}
          {...props}
        >
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      );
    }

    // Empty state
    if (products.length === 0) {
      return (
        <div
          ref={ref}
          style={{
            textAlign: 'center',
            padding: theme.spacing[8],
          }}
          {...props}
        >
          <div
            style={{
              fontSize: theme.typography.fontSize.lg[0],
              color: theme.colors.gray[600],
              marginBottom: theme.spacing[2],
            }}
          >
            No products found
          </div>
          <div
            style={{
              fontSize: theme.typography.fontSize.base[0],
              color: theme.colors.gray[500],
            }}
          >
            Try adjusting your search or filters
          </div>
        </div>
      );
    }

    // Products grid
    return (
      <div
        ref={ref}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: theme.spacing[6],
          padding: theme.spacing[4],
        }}
        {...props}
      >
        {products.map((product) => {
          const handleClick = onProductClick ? () => onProductClick(product) : undefined;
          return (
            <ProductCard
              key={product.id}
              product={product}
              onClick={handleClick}
            />
          );
        })}
      </div>
    );
  },
);

ProductsList.displayName = 'ProductsList';

export { ProductsList };
