import { Metadata } from "next"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/page-header"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getCategories } from "@/actions/dashboard/categories"

export const metadata: Metadata = {
  title: "مدیریت دسته‌بندی‌ها",
  description: "لیست دسته‌بندی‌های سایت",
}

export default async function CategoriesPage() {
  const data = await getCategories()

  return (
    <div className="space-y-6">
      <PageHeader
        title="دسته‌بندی‌ها"
        description="مدیریت دسته‌بندی محصولات"
        action={
          <Button asChild>
            <Link href="/dashboard/categories/new">
              <Plus className="size-4" /> افزودن دسته‌بندی
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  )
}
