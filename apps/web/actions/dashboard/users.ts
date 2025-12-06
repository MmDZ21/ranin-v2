'use server'

import { authFetch } from '@/lib/authFetch'
import { API_URL } from '@/lib/constants'
import { revalidatePath } from 'next/cache'
import { UserFormValues } from '@/app/dashboard/users/schema'

// Get All
export async function getUsers() {
  try {
    const res = await authFetch(`${API_URL}/users`)
    if (!res.ok) throw new Error('Failed to fetch users')
    return await res.json()
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Get One
export async function getUser(id: string) {
  try {
    const res = await authFetch(`${API_URL}/users/${id}`)
    if (!res.ok) throw new Error('Failed to fetch user')
    return await res.json()
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error)
    return null
  }
}

// Create
export async function createUser(data: UserFormValues) {
  try {
    const res = await authFetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to create user')
    }
    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (error: unknown) {
    console.error("Error creating user:", error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

// Update
export async function updateUser(id: string, data: UserFormValues) {
  try {
    // Exclude password if it's empty
    const payload = { ...data }
    if (!payload.password) {
        delete payload.password
    }

    const res = await authFetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to update user')
    }
    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (error: unknown) {
    console.error(`Error updating user ${id}:`, error)
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' }
  }
}

// Delete
export async function deleteUser(id: string) {
  try {
    const res = await authFetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete user')
    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error)
    return { success: false, error: 'Failed to delete user' }
  }
}

