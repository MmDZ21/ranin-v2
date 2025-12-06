'use server'

import { authFetch } from '@/lib/authFetch'
import { API_URL } from '@/lib/constants'
import { revalidatePath } from 'next/cache'
import { PostFormValues } from '@/app/dashboard/blog/schema'

// Get All
export async function getPosts() {
  try {
    const res = await authFetch(`${API_URL}/blog/admin/all`)
    if (!res.ok) throw new Error('Failed to fetch posts')
    return await res.json()
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

// Get One
export async function getPost(id: string) {
  try {
    const res = await authFetch(`${API_URL}/blog/admin/${id}`)
    if (!res.ok) throw new Error('Failed to fetch post')
    return await res.json()
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error)
    return null
  }
}

// Create
export async function createPost(data: PostFormValues) {
  try {
    const res = await authFetch(`${API_URL}/blog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to create post')
    }
    revalidatePath('/dashboard/blog')
    return { success: true }
  } catch (error: unknown) {
    console.error("Error creating post:", error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

// Update
export async function updatePost(id: string, data: PostFormValues) {
  try {
    const res = await authFetch(`${API_URL}/blog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to update post')
    }
    revalidatePath('/dashboard/blog')
    return { success: true }
  } catch (error: unknown) {
    console.error(`Error updating post ${id}:`, error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

// Delete
export async function deletePost(id: string) {
  try {
    const res = await authFetch(`${API_URL}/blog/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete post')
    revalidatePath('/dashboard/blog')
    return { success: true }
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error)
    return { success: false, error: 'Failed to delete post' }
  }
}

