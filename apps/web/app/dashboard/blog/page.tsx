import { Metadata } from "next"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getPosts } from "@/actions/dashboard/blog"

export const metadata: Metadata = {
  title: "مدیریت وبلاگ",
  description: "لیست مقالات وبلاگ",
}

export default async function BlogPage() {
  const data = await getPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">وبلاگ</h2>
        <Button asChild>
            <Link href="/dashboard/blog/new">
                <Plus className="ml-2 h-4 w-4" /> افزودن نوشته
            </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="title" />
    </div>
  )
}
