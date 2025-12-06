import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <div className="pb-6 sm:pb-6">
      {/* Category carousel header */}
      <div className="py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <Skeleton className="w-28 h-5 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-4 rounded" />
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" aria-hidden />
          </div>
        </div>
        <div className="flex gap-3 sm:gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="flex-shrink-0 w-48 h-48 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Category title and description */}
      <div className="py-4 sm:py-6">
        <Skeleton className="w-56 sm:w-72 lg:w-96 h-8 sm:h-10 rounded mb-3" />
        <Skeleton className="w-64 sm:w-80 lg:w-[28rem] h-4 rounded" />
      </div>
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className="py-4 sm:py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-4 sm:p-5">
              <Skeleton className="w-11/12 h-5 rounded mb-3" />
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-20 h-5 rounded-md" />
                <div className="w-0 h-0" />
              </div>
              <div className="pt-3 border-t border-gray-50">
                <Skeleton className="w-full h-9 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
