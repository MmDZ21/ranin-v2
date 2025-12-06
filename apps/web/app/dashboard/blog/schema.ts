"use client"

import { z } from "zod"

export const postSchema = z.object({
  title: z.string().min(2, { message: "عنوان باید حداقل ۲ کاراکتر باشد" }),
  slug: z.string().min(2, { message: "نامک باید حداقل ۲ کاراکتر باشد" }),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  authorId: z.string().min(1, { message: "نویسنده الزامی است" }),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  featured: z.boolean(),
})

export type PostFormValues = z.infer<typeof postSchema>
