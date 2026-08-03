"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Card, CardBody } from "@/components/ui/Card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ImageUpload } from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { categorySchema, CategoryFormValues } from "./schema"
import { createCategory, updateCategory } from "@/actions/dashboard/categories"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CategoryFormProps {
  initialData?: CategoryFormValues
  categoryId?: string
  categories: { id: string; name: string }[]
}

export function CategoryForm({ initialData, categoryId, categories }: CategoryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
      parentId: initialData?.parentId || "",
    },
  })

  async function onSubmit(values: CategoryFormValues) {
    setLoading(true)
    setError(null)
    
    try {
      let result
      if (categoryId) {
        result = await updateCategory(categoryId, values)
      } else {
        result = await createCategory(values)
      }

      if (!result.success) {
        setError(result.error || "خطایی رخ داد")
        return
      }

      router.push("/dashboard/categories")
    } catch (err) {
      setError("مشکلی پیش آمد. دوباره تلاش کنید.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام دسته‌بندی</FormLabel>
              <FormControl>
                <Input placeholder="نام دسته‌بندی را وارد کنید" {...field} />
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
                <Input placeholder="category-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تصویر دسته‌بندی</FormLabel>
              <FormControl>
                <ImageUpload 
                    value={field.value} 
                    onChange={field.onChange} 
                    disabled={loading} 
                    label="آپلود تصویر دسته‌بندی"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>دسته‌بندی والد (اختیاری)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? categories.find(
                            (category) => category.id === field.value
                          )?.name
                        : "انتخاب دسته‌بندی والد"}
                      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="جستجوی دسته‌بندی..." />
                    <CommandList>
                      <CommandEmpty>دسته‌بندی یافت نشد.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            value={category.name}
                            key={category.id}
                            onSelect={() => {
                                // Toggle logic: if selecting already selected, clear it (for optional parent)
                                if (category.id === field.value) {
                                    form.setValue("parentId", "")
                                } else {
                                    form.setValue("parentId", category.id)
                                }
                            }}
                          >
                            <Check
                              className={cn(
                                "size-4",
                                category.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {category.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>توضیحات</FormLabel>
              <FormControl>
                <Textarea placeholder="توضیحات مختصر..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          </CardBody>
        </Card>

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
