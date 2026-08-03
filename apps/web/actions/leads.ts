'use server'

import { API_URL } from '@/lib/constants'
import type { CreateLeadInput } from '@/types/lead.types'

export type CreateLeadResult =
  | { success: true }
  | { success: false; error: string }

const GENERIC_ERROR =
  'ارسال پیام با خطا مواجه شد. لطفاً دوباره تلاش کنید یا با ما تماس بگیرید.'
const RATE_LIMIT_ERROR =
  'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.'
const VALIDATION_ERROR =
  'اطلاعات ارسال‌شده نامعتبر است. لطفاً فیلدها را بررسی کرده و دوباره تلاش کنید.'

/**
 * Submits the public contact form to the API's unauthenticated POST /leads
 * endpoint. No auth header is sent — this endpoint is intentionally public
 * (and rate-limited server-side).
 */
export async function createLead(
  input: CreateLeadInput,
): Promise<CreateLeadResult> {
  try {
    const response = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if (response.ok) {
      return { success: true }
    }

    if (response.status === 429) {
      return { success: false, error: RATE_LIMIT_ERROR }
    }

    if (response.status === 400) {
      return { success: false, error: VALIDATION_ERROR }
    }

    return { success: false, error: GENERIC_ERROR }
  } catch (error) {
    console.error('Error creating lead:', error)
    return { success: false, error: GENERIC_ERROR }
  }
}
