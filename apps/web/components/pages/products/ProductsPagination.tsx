import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProductsPaginationProps {
  categorySlug: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

function pageHref(categorySlug: string, page: number) {
  const params = new URLSearchParams({ category: categorySlug });
  if (page > 1) params.set("page", String(page));
  return `/products?${params.toString()}`;
}

function visiblePages(currentPage: number, totalPages: number) {
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function ProductsPagination({
  categorySlug,
  currentPage,
  pageSize,
  totalItems,
  totalPages,
}: ProductsPaginationProps) {
  if (totalItems === 0) return null;

  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);
  const pages = visiblePages(currentPage, totalPages);

  return (
    <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        نمایش {firstItem.toLocaleString("fa-IR")} تا {lastItem.toLocaleString("fa-IR")} از {totalItems.toLocaleString("fa-IR")} محصول
      </p>

      {totalPages > 1 ? (
        <nav aria-label="صفحه‌بندی محصولات" className="flex flex-wrap items-center gap-2">
          <Link
            href={pageHref(categorySlug, currentPage - 1)}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
            className={cn(
              "inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              currentPage === 1
                ? "pointer-events-none text-muted-foreground/50"
                : "bg-background text-foreground hover:border-primary hover:text-primary",
            )}
          >
            صفحه قبل
          </Link>

          {pages.map((page) => (
            <Link
              key={page}
              href={pageHref(categorySlug, page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "inline-flex size-11 items-center justify-center rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                page === currentPage
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary hover:text-primary",
              )}
            >
              {page.toLocaleString("fa-IR")}
            </Link>
          ))}

          <Link
            href={pageHref(categorySlug, currentPage + 1)}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : undefined}
            className={cn(
              "inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              currentPage === totalPages
                ? "pointer-events-none text-muted-foreground/50"
                : "bg-background text-foreground hover:border-primary hover:text-primary",
            )}
          >
            صفحه بعد
          </Link>
        </nav>
      ) : null}
    </div>
  );
}
