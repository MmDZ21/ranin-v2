import Link from "next/link"
import { Package, FolderTree, BookOpen, MessageSquare, Users, Inbox } from "lucide-react"
import { Card, CardBody, CardHeader } from "@/components/ui/Card"
import { PageHeader } from "@/components/dashboard/page-header"
import { getProducts } from "@/actions/dashboard/products"
import { getCategories } from "@/actions/dashboard/categories"
import { getPosts } from "@/actions/dashboard/blog"
import { getLeads } from "@/actions/dashboard/leads"
import { getUsers } from "@/actions/dashboard/users"
import type { Lead } from "@/types/lead.types"

const STAT_CARDS = [
  { key: "products", title: "محصولات", href: "/dashboard/products", icon: Package },
  { key: "categories", title: "دسته‌بندی‌ها", href: "/dashboard/categories", icon: FolderTree },
  { key: "posts", title: "نوشته‌های بلاگ", href: "/dashboard/blog", icon: BookOpen },
  { key: "leads", title: "پیام‌های دریافتی", href: "/dashboard/leads", icon: MessageSquare },
  { key: "users", title: "کاربران", href: "/dashboard/users", icon: Users },
] as const

export default async function Page() {
  const [products, categories, posts, leads, users] = await Promise.all([
    getProducts(),
    getCategories(),
    getPosts(),
    getLeads(),
    getUsers(),
  ])

  const counts: Record<(typeof STAT_CARDS)[number]["key"], number> = {
    products: Array.isArray(products) ? products.length : 0,
    categories: Array.isArray(categories) ? categories.length : 0,
    posts: Array.isArray(posts) ? posts.length : 0,
    leads: Array.isArray(leads) ? leads.length : 0,
    users: Array.isArray(users) ? users.length : 0,
  }

  const recentLeads: Lead[] = Array.isArray(leads) ? leads.slice(0, 5) : []

  return (
    <div className="space-y-6">
      <PageHeader title="داشبورد" description="نمای کلی فروشگاه و آخرین فعالیت‌ها" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STAT_CARDS.map(({ key, title, href, icon: Icon }) => (
          <Link key={key} href={href} className="group focus-visible:outline-none">
            <Card className="h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-theme-md group-focus-visible:ring-2 group-focus-visible:ring-ring">
              <CardBody className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-muted-foreground">{title}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {counts[key].toLocaleString("fa-IR")}
                  </p>
                </div>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4 text-primary" />
            <h2 className="font-semibold text-foreground">آخرین پیام‌های دریافتی</h2>
          </div>
          <Link
            href="/dashboard/leads"
            className="text-sm font-medium text-primary hover:underline"
          >
            مشاهده همه
          </Link>
        </CardHeader>
        <CardBody className="p-0">
          {recentLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
              <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Inbox className="size-5" />
              </div>
              <p className="text-sm text-muted-foreground">هنوز پیامی دریافت نشده است.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentLeads.map((lead) => (
                <li
                  key={lead.id}
                  className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {lead.name?.trim()?.charAt(0) || "؟"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{lead.name}</p>
                      <p className="truncate text-sm text-muted-foreground" dir="ltr">
                        {lead.phone}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
