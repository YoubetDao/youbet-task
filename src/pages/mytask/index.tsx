import { useState } from 'react'
import { SkeletonCard } from '@/components/skeleton-card'
import { Link } from 'react-router-dom'
import { TaskItem } from './task-item'
import { EmptyTasks } from './empty-task'
import PaginationFast from '@/components/pagination-fast'
import { useQuery } from '@tanstack/react-query'
import { fetchMyTasks } from '@/service'
import { TaskState } from '@/types'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

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

const DEFAULT_CATEGORIES = ['open', 'closed']

export default function MyTask() {
  // const [username] = useAtom(usernameAtom)
  const [selectedCategories, setSelectedCategories] = useState<TaskState[]>([])
  const [all, setAll] = useState<string>('All')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { data, isLoading: loading } = useQuery({
    queryKey: ['my-tasks', page, selectedCategories],
    queryFn: () =>
      fetchMyTasks({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        states: selectedCategories,
      }),
    // enabled: !!username,
  })
  const handleCategoryChange = (value: TaskState[]) => {
    if (value.length) {
      setAll('')
    } else {
      setAll('All')
    }
    setSelectedCategories(value)
  }

  const handleSelectAll = (value: string) => {
    if (value) {
      setSelectedCategories([])
      setAll(value)
    } else {
      setAll('')
    }
  }

  const tasks = data?.data || []
  const totalPages = Math.ceil((data?.pagination.totalCount || 0) / pageSize)

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 lg:px-12">
      <div className="flex flex-col gap-5">
        <div className="flex space-x-2">
          <ToggleGroup size="sm" type="single" value={all} onValueChange={handleSelectAll} className="items-start">
            <ToggleGroupItem value="All">All</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup size="sm" type="multiple" value={selectedCategories} onValueChange={handleCategoryChange}>
            {DEFAULT_CATEGORIES.map((category) => (
              <ToggleGroupItem key={category} value={category}>
                {category}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
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
    </div>
  )
}
