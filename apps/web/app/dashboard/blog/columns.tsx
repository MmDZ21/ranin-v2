"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { deletePost } from "@/actions/dashboard/blog"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export type Post = {
  id: string
  title: string
  author: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  publishedAt?: string
}

const ActionsCell = ({ post }: { post: Post }) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (confirm("آیا از حذف این نوشته اطمینان دارید؟")) {
      startTransition(async () => {
        const result = await deletePost(post.id)
        if (!result.success) {
            alert("خطا در حذف نوشته")
        }
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>عملیات</DropdownMenuLabel>
        <DropdownMenuItem asChild>
            <Link href={`/dashboard/blog/${post.id}/edit`} className="flex w-full items-center cursor-pointer">
                <Pencil className="ml-2 h-4 w-4" /> ویرایش
            </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
            onClick={handleDelete}
            disabled={isPending}
        >
          <Trash className="ml-2 h-4 w-4" /> {isPending ? "در حال حذف..." : "حذف"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          عنوان
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "author",
    header: "نویسنده",
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
        const status = row.getValue("status") as string
        const color = status === "PUBLISHED" ? "text-green-600" : status === "DRAFT" ? "text-gray-500" : "text-red-500"
        const label = status === "PUBLISHED" ? "منتشر شده" : status === "DRAFT" ? "پیش‌نویس" : "آرشیو"
        
        return <div className={color}>{label}</div>
    },
  },
  {
    accessorKey: "publishedAt",
    header: "تاریخ انتشار",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell post={row.original} />,
  },
]
