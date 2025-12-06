"use client"

import { z } from "zod"

export const userSchema = z.object({
  name: z.string().min(2, { message: "نام کاربر باید حداقل ۲ کاراکتر باشد" }),
  email: z.string().email({ message: "ایمیل معتبر نیست" }),
  password: z.string().min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد" }).optional(),
  role: z.enum(["ADMIN", "USER"]),
})

export type UserFormValues = z.infer<typeof userSchema>

