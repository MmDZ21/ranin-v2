'use server'

import { fetchClient } from '@/lib/fetchClient'
import type { PaginatedProducts, Product } from '@/types/product.types'
import { Category } from '@/types/category.types'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Fetch all product categories from the API
 */
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const categories = await fetchClient('/categories/with-counts')
    return { 
      success: true, 
      data: categories 
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { 
      success: false, 
      error: 'Failed to fetch categories' 
    }
  }
}

/**
 * Fetch products by category slug from the API
 */
export async function getProductsByCategory(
  categoryId: string,
  page = 1,
  limit = 12,
): Promise<ApiResponse<PaginatedProducts>> {
  try {
    const offset = (page - 1) * limit
    const products = await fetchClient(
      `/products/category/${categoryId}?limit=${limit}&offset=${offset}`,
    )
    return { 
      success: true, 
      data: products 
    }
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error)
    return { 
      success: false, 
      error: `Failed to fetch products for category: ${categoryId}` 
    }
  }
}

/**
 * Fetch a single product by slug from the API
 */
export async function getProduct(slug: string): Promise<ApiResponse<Product>> {
  try {
    const product = await fetchClient(`/products/slug/${slug}`)
    return { 
      success: true, 
      data: product 
    }
  } catch (error) {
    console.error(`Error fetching product ${slug}:`, error)
    return { 
      success: false, 
      error: `Failed to fetch product: ${slug}` 
    }
  }
}

/**
 * Fetch all products across all categories from the API
 */
export async function getAllProducts(): Promise<ApiResponse<Product[]>> {
  try {
    const products = await fetchClient('/products')
    return { 
      success: true, 
      data: products 
    }
  } catch (error) {
    console.error('Error fetching all products:', error)
    return { 
      success: false, 
      error: 'Failed to fetch products' 
    }
  }
}

/**
 * Search products by query string
 */
export async function searchProducts(query: string): Promise<ApiResponse<Product[]>> {
  try {
    const products = await fetchClient(`/products/search?q=${encodeURIComponent(query)}`)
    return { 
      success: true, 
      data: products 
    }
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error)
    return { 
      success: false, 
      error: `Failed to search products: ${query}` 
    }
  }
}
