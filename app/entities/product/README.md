# Product Entity

This entity defines the core Product model and types used throughout the application.

## Purpose

The Product entity provides:
- Type definitions for product data structure
- Interfaces for API responses
- Query parameter types for product operations

## Structure

- `model/types.ts` - Core Product interfaces and types
- `model/index.ts` - Model exports
- `index.ts` - Entity public API

## Types

### Product
Main product interface based on DummyJSON API structure.

### ProductsResponse
Response format for paginated product lists.

### ProductCategory
Category information for product filtering.

### ProductsQueryParams
Query parameters for product API requests.

## Usage

```typescript
import type { Product, ProductsResponse } from '~/entities/product';

const product: Product = {
  id: 1,
  title: 'Example Product',
  // ... other properties
};
```

## API Integration

This entity is designed to work with the DummyJSON products API:
- Base URL: `https://dummyjson.com/products`
- Supports pagination, search, sorting, and filtering 