import { Tag } from "lucide-react"
import { Card, CardBody } from "@/components/ui/Card"
import { PageHeader } from "@/components/dashboard/page-header"

export default function TagsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="تگ‌ها" description="مدیریت تگ‌های وبلاگ" />
      <Card>
        <CardBody className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Tag className="size-6" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">هنوز تگی اضافه نشده است</p>
            <p className="text-sm text-muted-foreground">
              مدیریت تگ‌های وبلاگ به‌زودی در این بخش اضافه می‌شود.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
