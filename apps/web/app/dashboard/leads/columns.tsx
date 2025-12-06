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
import { deleteLead } from "@/actions/dashboard/leads"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

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
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>عملیات</DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer">
           <Eye className="ml-2 h-4 w-4" /> مشاهده جزئیات
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

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: "نام فرستنده",
  },
  {
    accessorKey: "email",
    header: "ایمیل",
    cell: ({ row }) => (
        <a href={`mailto:${row.getValue("email")}`} className="flex items-center hover:underline">
            <Mail className="mr-2 h-4 w-4" /> {row.getValue("email")}
        </a>
    )
  },
  {
    accessorKey: "subject",
    header: "موضوع",
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
        const status = row.getValue("status") as string
        const color = status === "NEW" ? "text-blue-600 font-bold" : status === "REPLIED" ? "text-green-600" : "text-gray-500"
        const label = status === "NEW" ? "جدید" : status === "REPLIED" ? "پاسخ داده شده" : "خوانده شده"
        return <div className={color}>{label}</div>
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell lead={row.original} />,
  },
]
