import { Metadata } from "next"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/dashboard/page-header"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getUsers } from "@/actions/dashboard/users"

export const metadata: Metadata = {
  title: "مدیریت کاربران",
  description: "لیست کاربران سایت",
}

export default async function UsersPage() {
  const data = await getUsers()

  return (
    <div className="space-y-6">
      <PageHeader
        title="کاربران"
        description="مدیریت کاربران و سطوح دسترسی"
        action={
          <Button asChild>
            <Link href="/dashboard/users/new">
              <Plus className="size-4" /> افزودن کاربر
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  )
}
