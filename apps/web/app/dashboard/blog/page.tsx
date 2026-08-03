import { Metadata } from "next"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/page-header"
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
      <PageHeader
        title="وبلاگ"
        description="مدیریت نوشته‌های وبلاگ"
        action={
          <Button asChild>
            <Link href="/dashboard/blog/new">
              <Plus className="size-4" /> افزودن نوشته
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={data} searchKey="title" />
    </div>
  )
}
