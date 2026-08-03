import { CategoryForm } from "../category-form"
import { PageHeader } from "@/components/dashboard/page-header"
import { getCategories } from "@/actions/dashboard/categories"

export default async function NewCategoryPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <PageHeader title="افزودن دسته‌بندی جدید" description="یک دسته‌بندی تازه برای محصولات بسازید" />
      <CategoryForm categories={categories} />
    </div>
  )
}

