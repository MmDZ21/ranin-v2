"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { sidebarItems } from "@/constants"

type Crumb = { title: string; href: string }

/** Derives a breadcrumb trail (داشبورد › section › page) from the current path. */
function buildTrail(pathname: string): Crumb[] {
  const trail: Crumb[] = [{ title: "داشبورد", href: "/dashboard" }]
  if (pathname === "/dashboard") return trail

  const section = sidebarItems.find(
    (item) =>
      item.url !== "/dashboard" &&
      (pathname === item.url || pathname.startsWith(item.url + "/")),
  )
  if (!section) return trail

  trail.push({ title: section.title, href: section.url })

  const sub = section.items?.find(
    (s) => s.url === pathname && s.url !== section.url,
  )
  if (sub) {
    trail.push({ title: sub.title, href: sub.url })
  } else if (pathname !== section.url) {
    if (pathname.endsWith("/new")) trail.push({ title: "افزودن", href: pathname })
    else if (pathname.endsWith("/edit")) trail.push({ title: "ویرایش", href: pathname })
  }

  return trail
}

export function DashboardBreadcrumb() {
  const pathname = usePathname()
  const trail = buildTrail(pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1
          const hideOnMobile = index === 0 && trail.length > 1
          return (
            <Fragment key={`${crumb.href}-${index}`}>
              <BreadcrumbItem className={hideOnMobile ? "hidden md:block" : undefined}>
                {isLast ? (
                  <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className={hideOnMobile ? "hidden md:block" : undefined} />
              )}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
