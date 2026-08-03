"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/Button"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
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
import { ImageUpload } from "@/components/ui/image-upload"
import { ProductFormValues, productSchema } from "./schema"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createProduct, updateProduct } from "@/actions/dashboard/products"
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

interface ProductFormProps {
  initialData?: ProductFormValues
  productId?: string
  categories: { id: string; name: string }[]
}

export function ProductForm({ initialData, productId, categories }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      sku: initialData?.sku || "",
      shortDesc: initialData?.shortDesc || "",
      longDesc: initialData?.longDesc || "",
      brand: initialData?.brand || "",
      modelNumber: initialData?.modelNumber || "",
      categoryId: initialData?.categoryId || "",
      published: initialData?.published || false,
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      features: initialData?.features || "",
      tags: initialData?.tags || "",
      image: initialData?.image || "",
    },
  })

  async function onSubmit(values: ProductFormValues) {
    setLoading(true)
    setError(null)

    try {
      let result
      if (productId) {
        result = await updateProduct(productId, values)
      } else {
        result = await createProduct(values)
      }

      if (!result.success) {
        setError(result.error || "خطایی رخ داد")
        return
      }

      router.push("/dashboard/products")
    } catch (err) {
      setError("مشکلی پیش آمد. دوباره تلاش کنید.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
        {error && (
          <div
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-foreground">اطلاعات اصلی</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تصویر محصول</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                      label="آپلود تصویر محصول"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام محصول</FormLabel>
                    <FormControl>
                      <Input placeholder="نام محصول را وارد کنید" {...field} />
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
                      <Input placeholder="product-slug" {...field} />
                    </FormControl>
                    <FormDescription>نامک در آدرس URL استفاده می‌شود.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU (کد محصول)</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>شماره مدل</FormLabel>
                    <FormControl>
                      <Input placeholder="Model-X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>برند</FormLabel>
                    <FormControl>
                      <Input placeholder="نام برند" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>دسته‌بندی</FormLabel>
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
                              : "انتخاب دسته‌بندی"}
                            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[220px] p-0">
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
                                    form.setValue("categoryId", category.id)
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
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-foreground">توضیحات</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            <FormField
              control={form.control}
              name="shortDesc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات کوتاه</FormLabel>
                  <FormControl>
                    <Textarea placeholder="توضیحات مختصر محصول..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longDesc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات کامل</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[150px]"
                      placeholder="توضیحات کامل محصول..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-foreground">ویژگی‌ها و تگ‌ها</h3>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ویژگی‌ها (با ویرگول جدا کنید)</FormLabel>
                  <FormControl>
                    <Input placeholder="ویژگی ۱, ویژگی ۲, ..." {...field} />
                  </FormControl>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {field.value && typeof field.value === "string" &&
                      field.value.split(",").map((feature, index) => {
                        const trimmed = feature.trim()
                        if (!trimmed) return null
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                          >
                            {trimmed}
                          </span>
                        )
                      })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تگ‌ها (با ویرگول جدا کنید)</FormLabel>
                  <FormControl>
                    <Input placeholder="تگ ۱, تگ ۲, ..." {...field} />
                  </FormControl>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {field.value && typeof field.value === "string" &&
                      field.value.split(",").map((tag, index) => {
                        const trimmed = tag.trim()
                        if (!trimmed) return null
                        return (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border"
                          >
                            {trimmed}
                          </span>
                        )
                      })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold text-foreground">بهینه‌سازی برای موتور جستجو (سئو)</h3>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان سئو (Meta Title)</FormLabel>
                  <FormControl>
                    <Input placeholder="عنوان سئو" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>توضیحات سئو (Meta Description)</FormLabel>
                  <FormControl>
                    <Input placeholder="توضیحات سئو" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardBody>
        </Card>

        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-xl border bg-card p-4 shadow-theme-sm">
              <div className="space-y-0.5">
                <FormLabel className="text-base">انتشار</FormLabel>
                <FormDescription>آیا این محصول در سایت نمایش داده شود؟</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            انصراف
          </Button>
        </div>
      </form>
    </Form>
  )
}
