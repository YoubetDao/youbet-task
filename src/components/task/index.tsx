import { LoadingCards } from '../skeleton-card'
import { TaskCard } from './task-card'
import { EmptyTasks } from './empty-tasks'
import PaginationFast from '@/components/pagination-fast'
import { Task } from '@/types'
interface ITaskCatalog {
  page: number
  pageSize: number
  tasks?: Task[]
  totalPages?: number
  isLoading: boolean
  setPage: (page: number) => void
}

export const TaskCatalog = ({ page, tasks, totalPages = 1, isLoading, setPage }: ITaskCatalog) => {
  const Tasks = () => {
    if (tasks && tasks.length) {
      return tasks.map((item) => <TaskCard key={item._id} item={item} />)
    }
    return <EmptyTasks />
  }

  return (
    <>
      <section className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" aria-labelledby="tasks-heading">
        <h2 id="tasks-heading" className="sr-only">
          Tasks
        </h2>
        {isLoading ? <LoadingCards count={3} /> : <Tasks />}
      </section>
      <nav aria-label="Pagination">
        <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
      </nav>
    </>
  )
}
