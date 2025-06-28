/**
 * Products Feature Hooks
 * Provides React hooks for interacting with products from DummyJSON API
 */

import { useState, useEffect } from 'react';
import type { Product, ProductCategory } from '~/entities/product';
import {
  fetchProducts,
  fetchProductById,
  searchProducts,
  fetchCategories,
  fetchProductsByCategory,
  type GetProductsApiRequest,
  type SearchProductsApiRequest,
  type GetProductsByCategoryApiRequest,
} from './api';

// Hook state interfaces
interface UseProductsState {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
}

interface UseProductState {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

interface UseCategoriesState {
  categories: ProductCategory[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for fetching and managing products list with pagination
 */
export const useProducts = (params: GetProductsApiRequest = {}) => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    total: 0,
    skip: 0,
    limit: 30,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const loadProducts = async() => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetchProducts(params);

        if (!isCancelled) {
          setState({
            products: response.products,
            total: response.total,
            skip: response.skip,
            limit: response.limit,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch products',
          }));
        }
      }
    };

    loadProducts();

    return () => {
      isCancelled = true;
    };
  }, [JSON.stringify(params)]); // Re-run when params change

  const refetch = () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    // Effect will re-run due to dependency change
  };

  return {
    ...state,
    refetch,
  };
};

/**
 * Hook for fetching a single product by ID
 */
export const useProduct = (id: number | null) => {
  const [state, setState] = useState<UseProductState>({
    product: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (id === null) {
      setState({ product: null, isLoading: false, error: null });
      return;
    }

    let isCancelled = false;

    const loadProduct = async() => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const product = await fetchProductById({ id });

        if (!isCancelled) {
          setState({
            product,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch product',
          }));
        }
      }
    };

    loadProduct();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  return state;
};

/**
 * Hook for searching products
 */
export const useProductSearch = () => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    total: 0,
    skip: 0,
    limit: 30,
    isLoading: false,
    error: null,
  });

  const search = async(params: SearchProductsApiRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await searchProducts(params);

      setState({
        products: response.products,
        total: response.total,
        skip: response.skip,
        limit: response.limit,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to search products',
      }));
    }
  };

  const clearSearch = () => {
    setState({
      products: [],
      total: 0,
      skip: 0,
      limit: 30,
      isLoading: false,
      error: null,
    });
  };

  return {
    ...state,
    search,
    clearSearch,
  };
};

/**
 * Hook for fetching product categories
 */
export const useCategories = () => {
  const [state, setState] = useState<UseCategoriesState>({
    categories: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isCancelled = false;

    const loadCategories = async() => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const categories = await fetchCategories();

        if (!isCancelled) {
          setState({
            categories,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch categories',
          }));
        }
      }
    };

    loadCategories();

    return () => {
      isCancelled = true;
    };
  }, []);

  return state;
};

/**
 * Hook for fetching products by category
 */
export const useProductsByCategory = (category: string | null, params: Omit<GetProductsByCategoryApiRequest, 'category'> = {}) => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    total: 0,
    skip: 0,
    limit: 30,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!category) {
      setState({ products: [], total: 0, skip: 0, limit: 30, isLoading: false, error: null });
      return;
    }

    let isCancelled = false;

    const loadProductsByCategory = async() => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetchProductsByCategory({ category, ...params });

        if (!isCancelled) {
          setState({
            products: response.products,
            total: response.total,
            skip: response.skip,
            limit: response.limit,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch products by category',
          }));
        }
      }
    };

    loadProductsByCategory();

    return () => {
      isCancelled = true;
    };
  }, [category, JSON.stringify(params)]);

  return state;
};
