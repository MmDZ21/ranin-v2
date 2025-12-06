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
import { deleteUser } from "@/actions/dashboard/users"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export type User = {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
  createdAt: string
}

const ActionsCell = ({ user }: { user: User }) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (confirm("آیا از حذف این کاربر اطمینان دارید؟")) {
      startTransition(async () => {
        const result = await deleteUser(user.id)
        if (!result.success) {
            alert("خطا در حذف کاربر")
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
            <Link href={`/dashboard/users/${user.id}/edit`} className="flex w-full items-center cursor-pointer">
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

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          نام کاربر
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "ایمیل",
  },
  {
    accessorKey: "role",
    header: "نقش",
    cell: ({ row }) => (
      <div className={row.getValue("role") === "ADMIN" ? "font-bold text-primary" : ""}>
        {row.getValue("role") === "ADMIN" ? "مدیر" : "کاربر"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "تاریخ عضویت",
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
]
