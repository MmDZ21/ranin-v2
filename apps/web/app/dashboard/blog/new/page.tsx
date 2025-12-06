import { PostForm } from "../post-form"

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">افزودن نوشته جدید</h2>
      </div>
      <PostForm />
    </div>
  )
}

