import { Metadata } from "next"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/Button"
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">دسته‌بندی‌ها</h2>
        <Button asChild>
            <Link href="/dashboard/categories/new">
                <Plus className="ml-2 h-4 w-4" /> افزودن دسته‌بندی
            </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  )
}
