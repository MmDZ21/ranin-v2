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
import { StatusBadge } from "@/components/dashboard/status-badge"
import Link from "next/link"
import { deletePost } from "@/actions/dashboard/blog"
import { useTransition } from "react"

export type Post = {
  id: string
  title: string
  author: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  publishedAt?: string
}

const ActionsCell = ({ post }: { post: Post }) => {
  const [isPending, startTransition] = useTransition()

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
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">باز کردن منو</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>عملیات</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/blog/${post.id}/edit`} className="cursor-pointer">
            <Pencil className="size-4" /> ویرایش
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash className="size-4" /> {isPending ? "در حال حذف..." : "حذف"}
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
          <ArrowUpDown className="size-4" />
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
      const status = row.getValue("status") as Post["status"]
      if (status === "PUBLISHED") return <StatusBadge tone="success">منتشر شده</StatusBadge>
      if (status === "DRAFT") return <StatusBadge tone="warning">پیش‌نویس</StatusBadge>
      return <StatusBadge tone="muted">آرشیو</StatusBadge>
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
