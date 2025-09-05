import { LoadingCards } from '../loading-cards'
import { TaskCard } from './task-card'
import { EmptyTasks } from './empty-tasks'
import PaginationFast from '@/components/pagination-fast'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { capitalize } from 'lodash'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { taskApi } from '@/service'
import { TaskState } from '@/types'
import {
  TaskControllerGetTasksAssignmentStatusEnum,
  TaskControllerGetTasksNoGrantNeededEnum,
  TaskControllerGetTasksRewardClaimedEnum,
  TaskControllerGetTasksRewardGrantedEnum,
} from '@/openapi/client/api'
import { STALETIME } from '@/constants/contracts/request'

// TODO: should separate this in another way since project task and my task have different filter
const DEFAULT_CATEGORIES = ['all', 'open', 'closed']
const ASSIGNMENT_STATUS = ['all', 'unassigned', 'assigned']

interface ITaskCatalog {
  project?: string
}

export const TaskCatalog = ({ project }: ITaskCatalog) => {
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('open')
  const [selectedAssignment, setSelectedAssignment] = useState<string>('unassigned')
  const pageSize = 9
  let queryKey
  let queryFn

  if (!project) {
    queryKey = ['my-tasks', page, selectedCategory]
    queryFn = () =>
      taskApi
        .taskControllerMyTasks(
          selectedCategory !== 'all' ? [selectedCategory as TaskState].join(',') : [].join(','),
          (page - 1) * pageSize,
          pageSize,
        )
        .then((res) => res.data)
  } else {
    queryKey = ['tasks', project, page, pageSize, selectedCategory, selectedAssignment]
    queryFn = () =>
      taskApi
        .taskControllerGetTasks(
          project || '',
          '',
          '',
          selectedCategory !== 'all' ? [selectedCategory as TaskState].join(',') : [].join(','),
          selectedAssignment !== 'all' ? (selectedAssignment as TaskControllerGetTasksAssignmentStatusEnum) : 'all',
          TaskControllerGetTasksRewardGrantedEnum.All,
          TaskControllerGetTasksRewardClaimedEnum.All,
          TaskControllerGetTasksNoGrantNeededEnum.All,
          (page - 1) * pageSize,
          pageSize,
        )
        .then((res) => res.data)
  }

  const { data, isLoading: loading } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    staleTime: STALETIME,
    refetchOnWindowFocus: false,
  })

  const tasks = data?.data || []
  const totalPages = Math.ceil((data?.pagination?.totalCount || 0) / pageSize)

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }

  const handleAssignmentChange = (value: string) => {
    setSelectedAssignment(value)
  }

  const Tasks = () => {
    if (loading) return <LoadingCards count={3} />
    if (tasks.length) {
      return tasks.map((item) => <TaskCard key={item._id} item={item} />)
    }
    return <EmptyTasks />
  }

  return (
    <main className="flex flex-col gap-5">
      <header className="flex flex-col space-y-2" aria-label="Filter Controls">
        <Tabs value={selectedCategory} onValueChange={handleCategoryChange} aria-label="Select Category">
          <div className="flex w-full items-center justify-between">
            <TabsList className="flex w-auto flex-nowrap">
              {DEFAULT_CATEGORIES.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {capitalize(category)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {project && (
          <Tabs value={selectedAssignment} onValueChange={handleAssignmentChange} aria-label="Select Assignment Status">
            <div className="flex w-full items-center justify-between">
              <TabsList className="flex w-auto flex-nowrap">
                {ASSIGNMENT_STATUS.map((status) => (
                  <TabsTrigger key={status} value={status}>
                    {capitalize(status)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        )}
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
