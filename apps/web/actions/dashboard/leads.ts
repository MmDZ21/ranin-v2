'use server'

import { unstable_rethrow } from 'next/navigation'
import { authFetch } from '@/lib/authFetch'
import { API_URL } from '@/lib/constants'
import { requireAdminSession } from '@/lib/requireAdmin'
import { revalidatePath } from 'next/cache'

// Get All
export async function getLeads() {
  try {
    await requireAdminSession()
    const res = await authFetch(`${API_URL}/leads`) // Assuming endpoint is /leads or similar
    if (!res.ok) throw new Error('Failed to fetch leads')
    return await res.json()
  } catch (error) {
    unstable_rethrow(error)
    console.error("Error fetching leads:", error)
    return []
  }
}

// Get One (if needed for viewing details)
export async function getLead(id: string) {
  try {
    await requireAdminSession()
    const res = await authFetch(`${API_URL}/leads/${id}`)
    if (!res.ok) throw new Error('Failed to fetch lead')
    return await res.json()
  } catch (error) {
    unstable_rethrow(error)
    console.error(`Error fetching lead ${id}:`, error)
    return null
  }
}

// Delete (optional)
export async function deleteLead(id: string) {
  try {
    await requireAdminSession()
    const res = await authFetch(`${API_URL}/leads/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete lead')
    revalidatePath('/dashboard/leads')
    return { success: true }
  } catch (error) {
    unstable_rethrow(error)
    console.error(`Error deleting lead ${id}:`, error)
    return { success: false, error: 'Failed to delete lead' }
  }
}

