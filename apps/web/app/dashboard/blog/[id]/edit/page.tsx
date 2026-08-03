import { PostForm } from "../../post-form"
import { PageHeader } from "@/components/dashboard/page-header"
import { getPost } from "@/actions/dashboard/blog"
import { notFound } from "next/navigation"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="ویرایش نوشته" description="این نوشته وبلاگ را به‌روزرسانی کنید" />
      <PostForm initialData={post} postId={id} />
    </div>
  )
}
