# ProductsList Widget

A reusable widget component for displaying lists of products with modern UI design.

## Purpose

The ProductsList widget provides:
- Grid-based product display layout
- Product card components with images and details
- Responsive design for different screen sizes
- Loading and error states
- Integration with product data from features layer

## Structure

- `ui/ProductsList.tsx` - Main widget component
- `ui/ProductsList.spec.tsx` - Component tests
- `index.ts` - Widget public API

## Usage

```typescript
import { ProductsList } from '~/widgets/products-list';

// In a page or layout component
<ProductsList products={products} isLoading={isLoading} />
```

## Props

- `products` - Array of Product objects
- `isLoading` - Loading state boolean
- `error` - Error message string (optional)
- `onProductClick` - Handler for product selection (optional)

## Dependencies

This widget depends on:
- Product entity types (`~/entities/product`)
- Shared UI components (`~/shared/ui`)
- Design system theme (`~/shared/design-system/theme`)

## Features

- Product card layout with image, title, price, rating
- Grid responsive layout
- Loading skeleton states
- Error boundary handling
- Accessibility support (ARIA labels, keyboard navigation) 