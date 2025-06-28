# Products Page

The main page for browsing and viewing products from the DummyJSON API.

## Purpose

The Products page provides:
- Complete product browsing experience
- Integration with products feature for data fetching
- ProductsList widget integration for display
- Search and filtering capabilities
- Pagination support
- Responsive layout for all device sizes

## Structure

- `ui/index.tsx` - Main page component
- `ui/index.spec.tsx` - Page tests  
- `index.ts` - Page public API

## Features

- **Product Display**: Grid layout of product cards
- **Search**: Search products by title/description
- **Filtering**: Filter by category, price range, rating
- **Sorting**: Sort by price, rating, title
- **Pagination**: Navigate through product pages
- **Loading States**: Skeleton UI during data loading
- **Error Handling**: User-friendly error messages

## Dependencies

This page depends on:
- Products feature (`~/features/products`) - Data fetching and state management
- ProductsList widget (`~/widgets/products-list`) - Product display UI
- Product entity (`~/entities/product`) - Type definitions
- Shared UI components (`~/shared/ui`) - Common components

## Usage

This page is accessed via the `/products` route and is automatically integrated with Remix routing.

## API Integration

Connects to DummyJSON products API through the products feature:
- Fetches paginated product lists
- Supports search queries
- Handles API loading and error states

## SEO & Performance

- Server-side rendering with Remix
- Meta tags for product listing page
- Optimized images with lazy loading
- Responsive design for mobile-first experience 