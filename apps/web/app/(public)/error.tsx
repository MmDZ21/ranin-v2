"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the console (and any attached monitoring) without leaking to UI.
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-2xl font-semibold">مشکلی پیش آمد</h1>
      <p className="text-muted-foreground max-w-md">
        در بارگذاری این صفحه خطایی رخ داد. لطفاً دوباره تلاش کنید.
      </p>
      <Button onClick={reset}>تلاش مجدد</Button>
    </main>
  );
}
