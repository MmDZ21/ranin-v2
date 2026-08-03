"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Card, CardBody } from "@/components/ui/Card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PostFormValues, postSchema } from "./schema"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createPost, updatePost } from "@/actions/dashboard/blog"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PostFormProps {
  initialData?: PostFormValues
  postId?: string
}

export function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      status: initialData?.status || "DRAFT",
      authorId: initialData?.authorId || "",
      metaTitle: initialData?.metaTitle || "",
      metaDesc: initialData?.metaDesc || "",
      featured: initialData?.featured || false,
    },
  })

  async function onSubmit(values: PostFormValues) {
    setLoading(true)
    setError(null)
    
    try {
      let result
      if (postId) {
        result = await updatePost(postId, values)
      } else {
        result = await createPost(values)
      }

      if (!result.success) {
        setError(result.error || "خطایی رخ داد")
        return
      }

      router.push("/dashboard/blog")
    } catch (err) {
      setError("مشکلی پیش آمد. دوباره تلاش کنید.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        {error && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}
        <Card>
          <CardBody className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>عنوان نوشته</FormLabel>
                <FormControl>
                    <Input placeholder="عنوان را وارد کنید" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
                <FormItem>
                <FormLabel>نامک (Slug)</FormLabel>
                <FormControl>
                    <Input placeholder="post-slug" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>خلاصه</FormLabel>
              <FormControl>
                <Textarea placeholder="خلاصه کوتاه..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>محتوا</FormLabel>
              <FormControl>
                <Textarea 
                    className="min-h-[200px]"
                    placeholder="محتوای مقاله..." 
                    {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>وضعیت</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب وضعیت انتشار" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DRAFT">پیش‌نویس</SelectItem>
                      <SelectItem value="PUBLISHED">منتشر شده</SelectItem>
                      <SelectItem value="ARCHIVED">بایگانی شده</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>نویسنده (ID)</FormLabel>
                <FormControl>
                    <Input placeholder="شناسه نویسنده" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
                <FormItem>
                <FormLabel>عنوان سئو</FormLabel>
                <FormControl>
                    <Input placeholder="Meta Title" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="metaDesc"
            render={({ field }) => (
                <FormItem>
                <FormLabel>توضیحات سئو</FormLabel>
                <FormControl>
                    <Input placeholder="Meta Description" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

          </CardBody>
        </Card>

        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-xl border bg-card p-4 shadow-theme-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-base">ویژه</FormLabel>
                <FormDescription>
                  آیا این مقاله به عنوان مقاله ویژه نمایش داده شود؟
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>انصراف</Button>
        </div>
      </form>
    </Form>
  )
}
