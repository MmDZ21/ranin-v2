import { ProductForm } from "../product-form"
import { PageHeader } from "@/components/dashboard/page-header"
import { getCategories } from "@/actions/dashboard/categories"

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <PageHeader title="افزودن محصول جدید" description="یک محصول تازه به فروشگاه اضافه کنید" />
      <ProductForm categories={categories} />
    </div>
  )
}

