'use server'

import { authFetch } from '@/lib/authFetch'
import { API_URL } from '@/lib/constants'

export async function uploadFile(formData: FormData) {
  try {
    const res = await authFetch(`${API_URL}/admin/uploads/file`, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.message || 'Upload failed')
    }

    return await res.json()
  } catch (error: unknown) {
    console.error("Upload error:", error)
    return { error: error instanceof Error ? error.message : "Upload failed" }
  }
}

