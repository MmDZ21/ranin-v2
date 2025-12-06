import { CategoryForm } from "../category-form"
import { getCategories } from "@/actions/dashboard/categories"

export default async function NewCategoryPage() {
  const categories = await getCategories()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">افزودن دسته‌بندی جدید</h2>
      </div>
      <CategoryForm categories={categories} />
    </div>
  )
}

