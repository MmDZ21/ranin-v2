import { ProductForm } from "../../product-form"
import { PageHeader } from "@/components/dashboard/page-header"
import { getProduct } from "@/actions/dashboard/products"
import { getCategories } from "@/actions/dashboard/categories"
import { notFound } from "next/navigation"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)
  const categories = await getCategories()

  if (!product) {
    notFound()
  }

  // Transform array fields to comma-separated strings for form
  const formattedProduct = {
    ...product,
    tags: product.tags ? product.tags.join(", ") : "",
    features: product.features ? product.features.join(", ") : "",
    image: product.images && product.images.length > 0 ? product.images[0].url : "",
  }

  return (
    <div className="space-y-6">
      <PageHeader title="ویرایش محصول" description="اطلاعات این محصول را به‌روزرسانی کنید" />
      <ProductForm initialData={formattedProduct} productId={id} categories={categories} />
    </div>
  )
}
