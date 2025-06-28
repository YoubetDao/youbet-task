import { Skeleton } from '@/components/ui/skeleton'

function SkeletonCard() {
  return (
    <>
      <Skeleton className="h-[125px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[500px]" />
        <Skeleton className="h-4 w-[400px]" />
      </div>
    </>
  )
}

export function LoadingCards({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col space-y-3 pt-4 lg:pl-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <SkeletonCard key={i} />
        ))}
    </div>
  )
}
