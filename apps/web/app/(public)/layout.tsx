import { Footer } from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { TopBar } from "@/components/layout/Topbar";
import { FOOTER_CONFIG, TOPBAR_CONFIG } from "@/constants";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="from-muted to-muted/40 min-h-screen bg-gradient-to-b">
      <TopBar {...TOPBAR_CONFIG} />
      {/* Header/Navbar manages its own sticky positioning. */}
      <Header />
      <main className="p-0 m-0 min-h-screen">{children}</main>
      <Footer {...FOOTER_CONFIG} />
    </div>
  );
}
