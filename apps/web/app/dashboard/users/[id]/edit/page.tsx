import { UserForm } from "../../user-form"
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">ویرایش کاربر</h2>
      </div>
      <UserForm initialData={user} userId={id} />
    </div>
  )
}
