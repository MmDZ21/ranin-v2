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
import { deleteCategory } from "@/actions/dashboard/categories"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
}

const ActionsCell = ({ category }: { category: Category }) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) {
      startTransition(async () => {
        const result = await deleteCategory(category.id)
        if (result.success) {
            // Success
        } else {
            alert("خطا در حذف دسته‌بندی")
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
            <Link href={`/dashboard/categories/${category.id}/edit`} className="flex w-full items-center cursor-pointer">
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

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          نام دسته‌بندی
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "slug",
    header: "نامک (Slug)",
  },
  {
    accessorKey: "description",
    header: "توضیحات",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell category={row.original} />,
  },
]
