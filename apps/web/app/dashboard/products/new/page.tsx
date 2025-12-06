import { ProductForm } from "../product-form"
import { getCategories } from "@/actions/dashboard/categories"

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">افزودن محصول جدید</h2>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}

