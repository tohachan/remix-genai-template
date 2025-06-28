/**
 * Products Feature API
 * DummyJSON products API integration for fetching product data
 */

import type {
  Product,
  ProductsResponse,
  ProductCategory,
  ProductsQueryParams,
} from '~/entities/product';

// API Contract Definitions (Required by enforce-contracts rule)
// These interfaces define the request/response contracts for DummyJSON products API

/**
 * Request contract for retrieving products with pagination and filtering
 */
export interface GetProductsApiRequest extends ProductsQueryParams {
  limit?: number;
  skip?: number;
  select?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

/**
 * Response contract for products list endpoint
 */
export interface GetProductsApiResponse extends ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Request contract for retrieving a single product
 */
export interface GetProductByIdApiRequest {
  id: number;
}

/**
 * Response contract for single product endpoint
 */
export type GetProductByIdApiResponse = Product;

/**
 * Request contract for searching products
 */
export interface SearchProductsApiRequest {
  q: string;
  limit?: number;
  skip?: number;
}

/**
 * Response contract for product search endpoint
 */
export type SearchProductsApiResponse = ProductsResponse;

/**
 * Request contract for getting product categories
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetCategoriesApiRequest {
  // No parameters needed for categories endpoint
}

/**
 * Response contract for categories endpoint
 */
export type GetCategoriesApiResponse = ProductCategory[];

/**
 * Request contract for getting products by category
 */
export interface GetProductsByCategoryApiRequest {
  category: string;
  limit?: number;
  skip?: number;
}

/**
 * Response contract for category products endpoint
 */
export type GetProductsByCategoryApiResponse = ProductsResponse;

// Direct fetch API functions (since DummyJSON is external API)
const DUMMYJSON_BASE_URL = 'https://dummyjson.com';

/**
 * Fetch products with optional query parameters
 */
export const fetchProducts = async(params: GetProductsApiRequest = {}): Promise<GetProductsApiResponse> => {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.skip) searchParams.set('skip', params.skip.toString());
  if (params.select) searchParams.set('select', params.select);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.order) searchParams.set('order', params.order);

  const queryString = searchParams.toString();
  const url = `${DUMMYJSON_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async(params: GetProductByIdApiRequest): Promise<GetProductByIdApiResponse> => {
  const response = await fetch(`${DUMMYJSON_BASE_URL}/products/${params.id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product ${params.id}: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Search products by query
 */
export const searchProducts = async(params: SearchProductsApiRequest): Promise<SearchProductsApiResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.set('q', params.q);

  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.skip) searchParams.set('skip', params.skip.toString());

  const url = `${DUMMYJSON_BASE_URL}/products/search?${searchParams.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to search products: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch all product categories
 */
export const fetchCategories = async(): Promise<GetCategoriesApiResponse> => {
  const response = await fetch(`${DUMMYJSON_BASE_URL}/products/categories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch products by category
 */
export const fetchProductsByCategory = async(params: GetProductsByCategoryApiRequest): Promise<GetProductsByCategoryApiResponse> => {
  const searchParams = new URLSearchParams();

  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.skip) searchParams.set('skip', params.skip.toString());

  const queryString = searchParams.toString();
  const url = `${DUMMYJSON_BASE_URL}/products/category/${params.category}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch products for category ${params.category}: ${response.statusText}`);
  }

  return response.json();
};
