import { UserForm } from "../../user-form"
import { PageHeader } from "@/components/dashboard/page-header"
import { getUser } from "@/actions/dashboard/users"
import { notFound } from "next/navigation"

interface EditUserPageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params
  const user = await getUser(id)

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="ویرایش کاربر" description="اطلاعات این کاربر را به‌روزرسانی کنید" />
      <UserForm initialData={user} userId={id} />
    </div>
  )
}
