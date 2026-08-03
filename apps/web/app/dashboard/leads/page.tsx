import { Metadata } from "next"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { PageHeader } from "@/components/dashboard/page-header"
import { getLeads } from "@/actions/dashboard/leads"

export const metadata: Metadata = {
  title: "مدیریت پیام‌ها",
  description: "لیست پیام‌های تماس با ما",
}

export default async function LeadsPage() {
  const data = await getLeads()

  return (
    <div className="space-y-6">
      <PageHeader
        title="پیام‌های دریافتی"
        description="پیام‌های ثبت‌شده از فرم تماس با ما"
      />
      <DataTable columns={columns} data={data} searchKey="subject" />
    </div>
  )
}
