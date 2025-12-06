import { CategoryForm } from "../../category-form"
import { getCategory, getCategories } from "@/actions/dashboard/categories"
import { notFound } from "next/navigation"

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
  const availableCategories = categories.filter((c: any) => c.id !== id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">ویرایش دسته‌بندی</h2>
      </div>
      <CategoryForm initialData={category} categoryId={id} categories={availableCategories} />
    </div>
  )
}
