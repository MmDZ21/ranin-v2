import Link from "next/link";
import Logo from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-muted/30 px-4 py-12">
      <Link href="/" className="flex items-center" aria-label="بازگشت به صفحه اصلی">
        <Logo width={150} height={40} color="hsl(var(--brand))" />
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
