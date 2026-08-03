import { UserForm } from "../user-form"
import { PageHeader } from "@/components/dashboard/page-header"

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="افزودن کاربر جدید" description="یک حساب کاربری تازه بسازید" />
      <UserForm />
    </div>
  )
}
