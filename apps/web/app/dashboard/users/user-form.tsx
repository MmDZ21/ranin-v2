"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UserFormValues, userSchema } from "./schema"
import { createUser, updateUser } from "@/actions/dashboard/users"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserFormProps {
  initialData?: UserFormValues
  userId?: string
}

export function UserForm({ initialData, userId }: UserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role || "USER",
    },
  })

  async function onSubmit(values: UserFormValues) {
    setLoading(true)
    setError(null)
    
    try {
      let result
      if (userId) {
        result = await updateUser(userId, values)
      } else {
        result = await createUser(values)
      }

      if (!result.success) {
        setError(result.error || "An error occurred")
        return
      }

      router.push("/dashboard/users")
    } catch (err) {
      setError("Something went wrong")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام کاربر</FormLabel>
              <FormControl>
                <Input placeholder="نام کاربر را وارد کنید" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ایمیل</FormLabel>
              <FormControl>
                <Input placeholder="example@email.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رمز عبور {initialData && "(برای عدم تغییر خالی بگذارید)"}</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
                <FormItem>
                <FormLabel>نقش کاربر</FormLabel>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                >
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="انتخاب نقش" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="USER">کاربر عادی</SelectItem>
                        <SelectItem value="ADMIN">مدیر</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        
        <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>انصراف</Button>
        </div>
      </form>
    </Form>
  )
}
