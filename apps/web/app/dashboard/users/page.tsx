import { Metadata } from "next"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/Button"
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">کاربران</h2>
        <Button asChild>
            <Link href="/dashboard/users/new">
                <Plus className="ml-2 h-4 w-4" /> افزودن کاربر
            </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" />
    </div>
  )
}
