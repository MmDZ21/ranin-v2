'use server'

import { unstable_rethrow } from 'next/navigation'
import { authFetch } from '@/lib/authFetch'
import { API_URL } from '@/lib/constants'
import { requireAdminSession } from '@/lib/requireAdmin'
import { revalidatePath } from 'next/cache'
import { CategoryFormValues } from '@/app/dashboard/categories/schema'

// Get All
export async function getCategories() {
  try {
    await requireAdminSession()
    const res = await authFetch(`${API_URL}/categories`)
    if (!res.ok) throw new Error('Failed to fetch categories')
    return await res.json()
  } catch (error) {
    unstable_rethrow(error)
    console.error("Error fetching categories:", error)
    return []
  }
}

// Get One
export async function getCategory(id: string) {
  try {
    await requireAdminSession()
    const res = await authFetch(`${API_URL}/categories/${id}`)
    if (!res.ok) throw new Error('Failed to fetch category')
    return await res.json()
  } catch (error) {
    unstable_rethrow(error)
    console.error(`Error fetching category ${id}:`, error)
    return null
  }
}

// Create
export async function createCategory(data: CategoryFormValues) {
  try {
    await requireAdminSession()
    const res = await authFetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to create category')
    }
    revalidatePath('/dashboard/categories')
    return { success: true }
  } catch (error: unknown) {
    unstable_rethrow(error)
    console.error("Error creating category:", error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

// Update
export async function updateCategory(id: string, data: CategoryFormValues) {
  try {
    await requireAdminSession()
    const res = await authFetch(`${API_URL}/categories/${id}`, {
      method: 'PUT', // API uses PUT for update
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to update category')
    }
    revalidatePath('/dashboard/categories')
    return { success: true }
  } catch (error: unknown) {
    unstable_rethrow(error)
    console.error(`Error updating category ${id}:`, error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

// Delete
export async function deleteCategory(id: string) {
  try {
    await requireAdminSession()
    const res = await authFetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete category')
    revalidatePath('/dashboard/categories')
    return { success: true }
  } catch (error) {
    unstable_rethrow(error)
    console.error(`Error deleting category ${id}:`, error)
    return { success: false, error: 'Failed to delete category' }
  }
}

