import { Metadata } from "next"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/page-header"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getProducts } from "@/actions/dashboard/products"

export const metadata: Metadata = {
  title: "مدیریت محصولات",
  description: "لیست محصولات سایت",
}

export default async function ProductsPage() {
  const data = await getProducts()

  return (
    <div className="space-y-6">
      <PageHeader
        title="محصولات"
        description="مدیریت محصولات فروشگاه"
        action={
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="size-4" /> افزودن محصول
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  )
}
