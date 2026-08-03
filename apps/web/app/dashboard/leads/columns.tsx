"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Mail, Trash, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { deleteLead } from "@/actions/dashboard/leads"
import { useTransition } from "react"

export type Lead = {
  id: string
  name: string
  email: string
  subject: string
  status: "NEW" | "READ" | "REPLIED"
  createdAt: string
}

const ActionsCell = ({ lead }: { lead: Lead }) => {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm("آیا از حذف این پیام اطمینان دارید؟")) {
      startTransition(async () => {
        const result = await deleteLead(lead.id)
        if (!result.success) {
          alert("خطا در حذف پیام")
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
        <DropdownMenuItem className="cursor-pointer">
          <Eye className="size-4" /> مشاهده جزئیات
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

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: "نام فرستنده",
  },
  {
    accessorKey: "email",
    header: "ایمیل",
    cell: ({ row }) => (
      <a
        href={`mailto:${row.getValue("email")}`}
        className="inline-flex items-center gap-2 text-primary hover:underline"
        dir="ltr"
      >
        <Mail className="size-4" /> {row.getValue("email")}
      </a>
    ),
  },
  {
    accessorKey: "subject",
    header: "موضوع",
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
      const status = row.getValue("status") as Lead["status"]
      if (status === "NEW") return <StatusBadge tone="brand">جدید</StatusBadge>
      if (status === "REPLIED") return <StatusBadge tone="success">پاسخ داده شده</StatusBadge>
      return <StatusBadge tone="muted">خوانده شده</StatusBadge>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          تاریخ ارسال
          <ArrowUpDown className="size-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell lead={row.original} />,
  },
]
