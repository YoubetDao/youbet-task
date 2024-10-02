import { useState } from 'react'
import { SkeletonCard } from '@/components/skeleton-card'
import { Link } from 'react-router-dom'
import { TaskItem } from './task-item'
import { EmptyTasks } from './empty-task'
import PaginationFast from '@/components/pagination-fast'
import { useQuery } from '@tanstack/react-query'
import { fetchMyTasks } from '@/service'

function SkeletonTasks() {
  return (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  )
}

export default function MyTask() {
  // const [username] = useAtom(usernameAtom)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { data, isLoading: loading } = useQuery({
    queryKey: ['my-tasks', page],
    queryFn: () =>
      fetchMyTasks({
        offset: (page - 1) * pageSize,
        limit: pageSize,
      }),
    // enabled: !!username,
  })
  const tasks = data?.data || []
  const totalPages = Math.ceil((data?.pagination.totalCount || 0) / pageSize)

  return (
    <div className="px-4 py-4 mx-auto lg:px-12 max-w-7xl">
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <SkeletonTasks />
        ) : tasks.length ? (
          // TODO: key should not be htmlUrl; but title is not unique.
          tasks.map((item, id) => (
            <Link key={id} to={`/task/${item.githubId}`}>
              <TaskItem item={item} />
            </Link>
          ))
        ) : (
          <EmptyTasks />
        )}
      </div>
      <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
