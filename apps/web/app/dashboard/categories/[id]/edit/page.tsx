import { CategoryForm } from "../../category-form"
import { PageHeader } from "@/components/dashboard/page-header"
import { getCategory, getCategories } from "@/actions/dashboard/categories"
import { notFound } from "next/navigation"
import type { Category } from "@/types/category.types"

interface EditCategoryPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params
  const category = await getCategory(id)
  const categories = await getCategories()

  if (!category) {
    notFound()
  }

  // Filter out the current category to avoid selecting itself as parent (prevent cycles)
  const availableCategories = categories.filter((c: Category) => c.id !== id)

  return (
    <div className="space-y-6">
      <PageHeader title="ویرایش دسته‌بندی" description="اطلاعات این دسته‌بندی را به‌روزرسانی کنید" />
      <CategoryForm initialData={category} categoryId={id} categories={availableCategories} />
    </div>
  )
}
