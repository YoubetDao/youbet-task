import { useState, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { taskApi } from '@/service'
import { useQuery } from '@tanstack/react-query'
import PaginationFast from '@/components/pagination-fast'
import { TaskCard } from '@/components/task/task-card'
import { LoadingCards } from '@/components/loading-cards'
import {
  TaskControllerGetTasksRewardClaimedEnum,
  TaskControllerGetTasksRewardGrantedEnum,
  TaskDto,
} from '@/openapi/client'
import { SearchInput } from '@/components/search'
import { STALETIME } from '@/constants/contracts/request'

export default function Tasks() {
  const [page, setPage] = useState(1)
  const pageSize = 9

  const [currentTab, setCurrentTab] = useState('unassigned')

  const assignedType = useMemo(() => {
    if (currentTab === 'assigned') return 'assigned'
    if (currentTab === 'unassigned') return 'unassigned'
    return 'all'
  }, [currentTab])

  const queryKey = ['tasks', '', page, pageSize, assignedType]
  const queryFn = () =>
    taskApi
      .taskControllerGetTasks(
        '',
        '',
        'open',
        assignedType,
        TaskControllerGetTasksRewardGrantedEnum.All,
        TaskControllerGetTasksRewardClaimedEnum.All,
        (page - 1) * pageSize,
        pageSize,
      )
      .then((res) => res.data)

  const { data, isLoading: loading } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    staleTime: STALETIME,
    refetchOnWindowFocus: false,
  })

  const tasks = data?.data || []
  const totalPages = Math.ceil((data?.pagination?.totalCount || 0) / pageSize)

  if (loading) return <LoadingCards count={3} />

  return (
    <main>
      {/* Search */}
      <div className="relative mb-6">
        <SearchInput
          searchInitialValue=""
          sortInitialValue=""
          placeholder="Search tasks..."
          handleSubmit={() => {
            /* TODO */
          }}
        />
      </div>

      <div className="flex flex-col gap-5">
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <div className="flex w-full items-center justify-between">
            <TabsList className="flex w-auto flex-nowrap">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={currentTab} className="mt-6">
            {renderTasks(tasks)}
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <nav aria-label="Pagination">
          <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
        </nav>
      </div>
    </main>
  )
}

const renderTasks = (tasks: TaskDto[]) => {
  return (
    <section className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" aria-labelledby="tasks-heading">
      {tasks.map((item) => (
        <TaskCard key={item._id} item={item} />
      ))}
    </section>
  )
}
