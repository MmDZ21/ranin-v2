import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-6xl font-bold text-primary">۴۰۴</p>
      <h1 className="text-2xl font-semibold">صفحه مورد نظر یافت نشد</h1>
      <p className="text-muted-foreground max-w-md">
        ممکن است صفحه حذف شده باشد یا آدرس آن تغییر کرده باشد.
      </p>
      <Button asChild>
        <Link href="/">بازگشت به صفحه اصلی</Link>
      </Button>
    </main>
  );
}
