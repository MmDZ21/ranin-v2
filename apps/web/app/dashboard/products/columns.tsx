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
import { deleteProduct } from "@/actions/dashboard/products"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

  const handleDelete = () => {
    if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      startTransition(async () => {
        const result = await deleteProduct(product.id)
        if (result.success) {
            // The server action revalidates, but we might want to refresh client side router just in case or toast
            // router.refresh() is implicit with revalidatePath usually
        } else {
            alert("خطا در حذف محصول")
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
            <Link href={`/dashboard/products/${product.id}/edit`} className="flex w-full items-center cursor-pointer">
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
    cell: ({ row }) => (
      <div className={row.getValue("published") ? "text-green-600" : "text-gray-500"}>
        {row.getValue("published") ? "منتشر شده" : "پیش‌نویس"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell product={row.original} />,
  },
]
