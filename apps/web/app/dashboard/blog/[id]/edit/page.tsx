import { PostForm } from "../../post-form"
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">ویرایش نوشته</h2>
      </div>
      <PostForm initialData={post} postId={id} />
    </div>
  )
}
