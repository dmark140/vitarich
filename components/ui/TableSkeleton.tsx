import { Skeleton } from "@/components/ui/skeleton"

export default function TableSkeleton() {
  return (
    <div className="w-full space-y-4">
      {/* Single long header */}
      <Skeleton className="h-7 w-full" />

      {/* Table rows */}
      {[...Array(3)].map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className="h-5 w-full"
            />
          ))}
        </div>
      ))}
    </div>
  )
}
