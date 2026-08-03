import { Settings2 } from "lucide-react"
import { Card, CardBody } from "@/components/ui/Card"
import { PageHeader } from "@/components/dashboard/page-header"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="تنظیمات" description="پیکربندی عمومی پنل و سایت" />
      <Card>
        <CardBody className="flex min-h-[360px] flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Settings2 className="size-6" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">تنظیمات هنوز در دسترس نیست</p>
            <p className="text-sm text-muted-foreground">
              گزینه‌های پیکربندی سیستم به‌زودی در این بخش اضافه می‌شود.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
