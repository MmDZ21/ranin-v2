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
import { deleteProduct } from "@/actions/dashboard/products"
import { useTransition } from "react"

// This type is used to define the shape of our data.
export type Product = {
  id: string
  name: string
  sku?: string | null
  brand?: string | null
  category?: { name: string } | null
  published: boolean
}

const ActionsCell = ({ product }: { product: Product }) => {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      startTransition(async () => {
        const result = await deleteProduct(product.id)
        if (!result.success) {
          alert("خطا در حذف محصول")
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
          <Link href={`/dashboard/products/${product.id}/edit`} className="cursor-pointer">
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

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          نام محصول
          <ArrowUpDown className="size-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "sku",
    header: "کد محصول (SKU)",
    cell: ({ row }) => row.getValue("sku") || "-",
  },
  {
    accessorKey: "brand",
    header: "برند",
    cell: ({ row }) => row.getValue("brand") || "-",
  },
  {
    accessorKey: "category",
    header: "دسته‌بندی",
    cell: ({ row }) => {
      const category = row.original.category
      return category ? category.name : "-"
    },
  },
  {
    accessorKey: "published",
    header: "وضعیت",
    cell: ({ row }) =>
      row.getValue("published") ? (
        <StatusBadge tone="success">منتشر شده</StatusBadge>
      ) : (
        <StatusBadge tone="muted">پیش‌نویس</StatusBadge>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell product={row.original} />,
  },
]
