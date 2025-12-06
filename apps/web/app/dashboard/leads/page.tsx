import { Metadata } from "next"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { getLeads } from "@/actions/dashboard/leads"

export const metadata: Metadata = {
  title: "مدیریت پیام‌ها",
  description: "لیست پیام‌های تماس با ما",
}

export default async function LeadsPage() {
  const data = await getLeads()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">پیام‌های دریافتی</h2>
      </div>
      <DataTable columns={columns} data={data} searchKey="subject" />
    </div>
  )
}
