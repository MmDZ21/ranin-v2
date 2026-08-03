import { PostForm } from "../post-form"
import { PageHeader } from "@/components/dashboard/page-header"

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="افزودن نوشته جدید" description="یک نوشته تازه برای وبلاگ بنویسید" />
      <PostForm />
    </div>
  )
}
