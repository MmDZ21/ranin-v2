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
import { deleteUser } from "@/actions/dashboard/users"
import { useTransition } from "react"

export type User = {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
  createdAt: string
}

const ActionsCell = ({ user }: { user: User }) => {
  const [isPending, startTransition] = useTransition()

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
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">باز کردن منو</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>عملیات</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/users/${user.id}/edit`} className="cursor-pointer">
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
          <ArrowUpDown className="size-4" />
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
    cell: ({ row }) =>
      row.getValue("role") === "ADMIN" ? (
        <StatusBadge tone="brand">مدیر</StatusBadge>
      ) : (
        <StatusBadge tone="muted">کاربر</StatusBadge>
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
