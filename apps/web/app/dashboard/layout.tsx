import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardBreadcrumb } from "@/components/dashboard-breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getSession } from "@/lib/session"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar side="right" user={session.user} />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/70 bg-background/80 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ms-1" />
            <Separator
              orientation="vertical"
              className="me-2 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumb />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          {children}
        </div>
        <footer className="border-t border-border/70 p-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} رانین فرایند — تمامی حقوق محفوظ است.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
