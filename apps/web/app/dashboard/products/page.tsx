import { Metadata } from "next"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/Button"
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">محصولات</h2>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="ml-2 h-4 w-4" /> افزودن محصول
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  )
}
