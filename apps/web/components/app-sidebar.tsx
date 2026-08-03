"use client"

import * as React from "react"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { sidebarItems } from "@/constants"
import type { Session } from "@/lib/types"

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: Session["user"] }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent">
              <Link href="/dashboard">
                <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-theme-sm">
                  <ShieldCheck className="size-5" />
                </div>
                <div className="grid flex-1 text-right leading-tight">
                  <span className="truncate font-bold text-sidebar-accent-foreground">
                    رانین فرایند
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    پنل مدیریت
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
