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
  let renderedTasks

  if (isLoading) {
    renderedTasks = <LoadingCards count={3} />
  } else if (tasks && tasks.length) {
    renderedTasks = tasks.map((item) => <TaskCard key={item._id} item={item} />)
  } else {
    renderedTasks = <EmptyTasks />
  }

  return (
    <>
      <section className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" aria-labelledby="tasks-heading">
        <h2 id="tasks-heading" className="sr-only">
          Tasks
        </h2>
        {renderedTasks}
      </section>
      <nav aria-label="Pagination">
        <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
      </nav>
    </>
  )
}
