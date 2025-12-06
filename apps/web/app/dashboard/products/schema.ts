"use client"

import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(2, { message: "نام محصول باید حداقل ۲ کاراکتر باشد" }),
  slug: z.string().min(2, { message: "نامک باید حداقل ۲ کاراکتر باشد" }),
  sku: z.string().optional(),
  shortDesc: z.string().optional(),
  longDesc: z.string().optional(),
  brand: z.string().optional(),
  modelNumber: z.string().optional(),
  categoryId: z.string().optional(),
  published: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  // features and tags are arrays of strings in Prisma, here simplified or need array management
  features: z.string().optional(), // Simplified to comma separated string for form input
  tags: z.string().optional(), // Simplified to comma separated string for form input
  image: z.string().optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
