import React, { useState } from 'react';
import { ProductsList } from '~/widgets/products-list';
import { useProducts, useProductSearch, useCategories } from '~/features/products/hooks';
import type { Product } from '~/entities/product';
import { theme } from '~/shared/design-system/theme';

interface ProductsProps {
  className?: string;
}

export default function Products({ className }: ProductsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'rating'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const itemsPerPage = 12;

  // Fetch all products with pagination and sorting
  const {
    products: allProducts,
    total,
    isLoading: isLoadingProducts,
    error: productsError,
    refetch,
  } = useProducts({
    limit: itemsPerPage,
    skip: currentPage * itemsPerPage,
    sortBy,
    order: sortOrder,
  });

  // Search functionality
  const {
    products: searchResults,
    isLoading: isSearching,
    error: searchError,
    search,
    clearSearch,
  } = useProductSearch();

  // Categories for filtering
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  // Determine which products to display
  const displayProducts = isSearchMode ? searchResults : allProducts;
  const displayError = isSearchMode ? searchError : productsError;
  const displayLoading = isSearchMode ? isSearching : isLoadingProducts;

  // Handle search
  const handleSearch = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearchMode(false);
      clearSearch();
      return;
    }

    setIsSearchMode(true);
    await search({ q: searchQuery.trim(), limit: 50 });
  };

  // Clear search and return to browse mode
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    clearSearch();
    setCurrentPage(0);
  };

  // Handle product selection
  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product.title);
    // TODO: Navigate to product detail page or open modal
  };

  // Handle pagination
  const totalPages = Math.ceil(total / itemsPerPage);
  const canGoNext = currentPage < totalPages - 1;
  const canGoPrev = currentPage > 0;

  const goToNextPage = () => {
    if (canGoNext) setCurrentPage(prev => prev + 1);
  };

  const goToPrevPage = () => {
    if (canGoPrev) setCurrentPage(prev => prev - 1);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: theme.colors.gray[50],
        padding: theme.spacing[6],
      }}
      className={className}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: theme.spacing[8] }}>
          <h1
            style={{
              fontSize: theme.typography.fontSize['3xl'][0],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.gray[900],
              marginBottom: theme.spacing[2],
            }}
          >
            Products
          </h1>
          <p
            style={{
              fontSize: theme.typography.fontSize.lg[0],
              color: theme.colors.gray[600],
            }}
          >
            Discover amazing products from our collection
          </p>
        </div>

        {/* Search and Filters */}
        <div
          style={{
            backgroundColor: theme.colors.white,
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.sm,
            padding: theme.spacing[6],
            marginBottom: theme.spacing[8],
          }}
        >
          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            style={{
              display: 'flex',
              gap: theme.spacing[3],
              marginBottom: theme.spacing[6],
            }}
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: theme.spacing[3],
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.gray[300]}`,
                fontSize: theme.typography.fontSize.base[0],
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: theme.colors.primary[600],
                color: theme.colors.white,
                padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
                borderRadius: theme.borderRadius.md,
                border: 'none',
                fontSize: theme.typography.fontSize.base[0],
                fontWeight: theme.typography.fontWeight.medium,
                cursor: 'pointer',
              }}
            >
              Search
            </button>
            {isSearchMode && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  backgroundColor: theme.colors.gray[200],
                  color: theme.colors.gray[700],
                  padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
                  borderRadius: theme.borderRadius.md,
                  border: 'none',
                  fontSize: theme.typography.fontSize.base[0],
                  fontWeight: theme.typography.fontWeight.medium,
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </form>

          {/* Filters and Sort (only show in browse mode) */}
          {!isSearchMode && (
            <div
              style={{
                display: 'flex',
                gap: theme.spacing[4],
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {/* Categories */}
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                <label
                  style={{
                    fontSize: theme.typography.fontSize.sm[0],
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.gray[700],
                  }}
                >
                  Category:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={isLoadingCategories}
                  style={{
                    padding: theme.spacing[2],
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.gray[300]}`,
                    fontSize: theme.typography.fontSize.sm[0],
                    backgroundColor: theme.colors.white,
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                <label
                  style={{
                    fontSize: theme.typography.fontSize.sm[0],
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.gray[700],
                  }}
                >
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'title' | 'price' | 'rating')}
                  style={{
                    padding: theme.spacing[2],
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.gray[300]}`,
                    fontSize: theme.typography.fontSize.sm[0],
                    backgroundColor: theme.colors.white,
                  }}
                >
                  <option value="title">Title</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* Sort Order */}
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                <label
                  style={{
                    fontSize: theme.typography.fontSize.sm[0],
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.gray[700],
                  }}
                >
                  Order:
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                  style={{
                    padding: theme.spacing[2],
                    borderRadius: theme.borderRadius.md,
                    border: `1px solid ${theme.colors.gray[300]}`,
                    fontSize: theme.typography.fontSize.sm[0],
                    backgroundColor: theme.colors.white,
                  }}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        {!displayLoading && (
          <div
            style={{
              marginBottom: theme.spacing[6],
              padding: theme.spacing[4],
              backgroundColor: theme.colors.primary[50],
              borderRadius: theme.borderRadius.md,
              border: `1px solid ${theme.colors.primary[200]}`,
            }}
          >
            {isSearchMode ? (
              <p
                style={{
                  fontSize: theme.typography.fontSize.base[0],
                  color: theme.colors.primary[700],
                  margin: 0,
                }}
              >
                Found {displayProducts.length} products for "{searchQuery}"
              </p>
            ) : (
              <p
                style={{
                  fontSize: theme.typography.fontSize.base[0],
                  color: theme.colors.primary[700],
                  margin: 0,
                }}
              >
                Showing {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, total)} of {total} products
              </p>
            )}
          </div>
        )}

        {/* Products List */}
        <ProductsList
          products={displayProducts}
          isLoading={displayLoading}
          error={displayError}
          onProductClick={handleProductClick}
        />

        {/* Pagination (only show in browse mode) */}
        {!isSearchMode && !displayLoading && !displayError && totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: theme.spacing[4],
              marginTop: theme.spacing[8],
              padding: theme.spacing[6],
              backgroundColor: theme.colors.white,
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadows.sm,
            }}
          >
            <button
              onClick={goToPrevPage}
              disabled={!canGoPrev}
              style={{
                backgroundColor: canGoPrev ? theme.colors.primary[600] : theme.colors.gray[300],
                color: canGoPrev ? theme.colors.white : theme.colors.gray[500],
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                borderRadius: theme.borderRadius.md,
                border: 'none',
                fontSize: theme.typography.fontSize.sm[0],
                fontWeight: theme.typography.fontWeight.medium,
                cursor: canGoPrev ? 'pointer' : 'not-allowed',
              }}
            >
              Previous
            </button>

            <span
              style={{
                fontSize: theme.typography.fontSize.base[0],
                color: theme.colors.gray[600],
                fontWeight: theme.typography.fontWeight.medium,
              }}
            >
              Page {currentPage + 1} of {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={!canGoNext}
              style={{
                backgroundColor: canGoNext ? theme.colors.primary[600] : theme.colors.gray[300],
                color: canGoNext ? theme.colors.white : theme.colors.gray[500],
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                borderRadius: theme.borderRadius.md,
                border: 'none',
                fontSize: theme.typography.fontSize.sm[0],
                fontWeight: theme.typography.fontWeight.medium,
                cursor: canGoNext ? 'pointer' : 'not-allowed',
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
