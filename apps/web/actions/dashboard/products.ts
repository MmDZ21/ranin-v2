'use server'

import { unstable_rethrow } from 'next/navigation'
import { authFetch } from '@/lib/authFetch'
import { API_URL } from '@/lib/constants'
import { requireAdminSession } from '@/lib/requireAdmin'
import { revalidatePath } from 'next/cache'
import { ProductFormValues } from '@/app/dashboard/products/schema'

// Get All
export async function getProducts() {
  try {
    await requireAdminSession()
    const res = await authFetch(`${API_URL}/products`)
    if (!res.ok) throw new Error('Failed to fetch products')
    return await res.json()
  } catch (error) {
    unstable_rethrow(error)
    console.error("Error fetching products:", error)
    return []
  }
}

// Get One
export async function getProduct(id: string) {
  try {
    await requireAdminSession()
    const res = await authFetch(`${API_URL}/products/admin/${id}`)
    if (!res.ok) throw new Error('Failed to fetch product')
    return await res.json()
  } catch (error) {
    unstable_rethrow(error)
    console.error(`Error fetching product ${id}:`, error)
    return null
  }
}

// Create
export async function createProduct(data: ProductFormValues) {
  try {
    await requireAdminSession()
    // Convert comma-separated string to array for tags and features
    const processedData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      features: data.features ? data.features.split(',').map(f => f.trim()).filter(Boolean) : [],
      categoryId: data.categoryId || null,
    }

    const res = await authFetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(processedData)
    })
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create product')
    }
    
    revalidatePath('/dashboard/products')
    return { success: true, data: await res.json() }
  } catch (error: unknown) {
    unstable_rethrow(error)
    console.error("Error creating product:", error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

// Update
export async function updateProduct(id: string, data: ProductFormValues) {
  try {
    await requireAdminSession()
    // Convert comma-separated string to array for tags and features
    const processedData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      features: data.features ? data.features.split(',').map(f => f.trim()).filter(Boolean) : [],
      categoryId: data.categoryId || null,
    }

    const res = await authFetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(processedData)
    })
    
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to update product')
    }
    
    revalidatePath('/dashboard/products')
    return { success: true, data: await res.json() }
  } catch (error: unknown) {
    unstable_rethrow(error)
    console.error(`Error updating product ${id}:`, error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

// Delete
export async function deleteProduct(id: string) {
  try {
    await requireAdminSession()
    const res = await authFetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) throw new Error('Failed to delete product')

    revalidatePath('/dashboard/products')
    return { success: true }
  } catch (error: unknown) {
    unstable_rethrow(error)
    console.error(`Error deleting product ${id}:`, error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

