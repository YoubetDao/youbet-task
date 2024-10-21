import { TaskState } from '@/types'
import { SkeletonCardList } from '../skeleton-card'
import { TaskCard } from './task-card'
import { EmptyTasks } from './empty-tasks'
import PaginationFast from '@/components/pagination-fast'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { capitalize } from 'lodash'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMyTasks, fetchTasks } from '@/service'

const DEFAULT_CATEGORIES = ['open', 'closed']

interface ITaskCatalog {
  project?: string
}

export const TaskCatalog = ({ project }: ITaskCatalog) => {
  const [page, setPage] = useState(1)
  const [selectedCategories, setSelectedCategories] = useState<TaskState[]>(['open'])
  const [all, setAll] = useState<'All' | ''>('')
  const pageSize = 9
  let queryKey
  let queryFn

  if (!project) {
    queryKey = ['my-tasks', page, selectedCategories]
    queryFn = () =>
      fetchMyTasks({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        states: selectedCategories,
      })
  } else {
    queryKey = ['tasks', project, page, pageSize, selectedCategories]
    let assignmentStatus: string
    if (selectedCategories.length == 1 && selectedCategories.includes('open')) {
      assignmentStatus = 'unassigned'
    }
    queryFn = () =>
      fetchTasks({
        project: project || '',
        offset: (page - 1) * pageSize,
        limit: pageSize,
        states: selectedCategories,
        assignmentStatus,
      })
  }

  const { data, isLoading: loading } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
  })

  const tasks = data?.data || []
  const totalPages = Math.ceil((data?.pagination.totalCount || 0) / pageSize)

  const handleCategoryChange = async (value: TaskState[]) => {
    if (value.length) {
      setAll('')
    } else {
      setAll('All')
    }

    setSelectedCategories(value)
  }

  const handleSelectAll = async (value: 'All' | '') => {
    if (value) {
      setSelectedCategories([])
      setAll(value)
    } else {
      setAll('')
    }
  }

  const Tasks = () => {
    if (loading) return <SkeletonCardList count={3} />
    if (tasks.length) {
      return tasks.map((item) => <TaskCard key={item._id} item={item} />)
    }
    return <EmptyTasks />
  }

  return (
    <main className="flex flex-col gap-5">
      <header className="flex space-x-2" aria-label="Filter Controls">
        <ToggleGroup
          size="sm"
          type="single"
          value={all}
          onValueChange={handleSelectAll}
          className="items-start"
          aria-label="Select All"
        >
          <ToggleGroupItem value="All">All</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          size="sm"
          type="multiple"
          value={selectedCategories}
          onValueChange={handleCategoryChange}
          aria-label="Select Categories"
        >
          {DEFAULT_CATEGORIES.map((category) => (
            <ToggleGroupItem key={category} value={category}>
              {capitalize(category)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </header>
      <section className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" aria-labelledby="tasks-heading">
        <h2 id="tasks-heading" className="sr-only">
          Tasks
        </h2>
        <Tasks />
      </section>
      <nav aria-label="Pagination">
        <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
      </nav>
    </main>
  )
}
