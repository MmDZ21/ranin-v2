"use client"

import { z } from "zod"

export const categorySchema = z.object({
  name: z.string().min(2, { message: "نام دسته‌بندی باید حداقل ۲ کاراکتر باشد" }),
  slug: z.string().min(2, { message: "نامک باید حداقل ۲ کاراکتر باشد" }),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
