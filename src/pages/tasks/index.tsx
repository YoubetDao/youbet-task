import { useState, useMemo, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { taskApi } from '@/service'
import { useQuery } from '@tanstack/react-query'
import PaginationFast from '@/components/pagination-fast'
import { TaskCard } from '@/components/task/task-card'
import { LoadingCards } from '@/components/loading-cards'
import {
  TaskControllerGetTasksNoGrantNeededEnum,
  TaskControllerGetTasksRewardClaimedEnum,
  TaskControllerGetTasksRewardGrantedEnum,
  TaskDto,
} from '@/openapi/client'
import { SearchInput } from '@/components/search'
import { STALETIME } from '@/constants/contracts/request'
import { useSearchParams } from 'react-router-dom'

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentTab, setCurrentTab] = useState('unassigned')
  const pageSize = 9

  // Get the current page number from the URL to ensure synchronization
  const currentPage = useMemo(() => {
    return Number(searchParams.get('page')) || 1
  }, [searchParams])

  const assignedType = useMemo(() => {
    if (currentTab === 'assigned') return 'assigned'
    if (currentTab === 'unassigned') return 'unassigned'
    return 'all'
  }, [currentTab])

  const updateUrl = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams)
      params.set('page', newPage.toString())
      setSearchParams(params, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const queryKey = ['tasks', '', currentPage, pageSize, assignedType]
  const queryFn = () =>
    taskApi
      .taskControllerGetTasks(
        '',
        '',
        '',
        'open',
        assignedType,
        TaskControllerGetTasksRewardGrantedEnum.All,
        TaskControllerGetTasksRewardClaimedEnum.All,
        TaskControllerGetTasksNoGrantNeededEnum.All,
        (currentPage - 1) * pageSize,
        pageSize,
      )
      .then((res) => res.data)

  const {
    data,
    isLoading: loading,
    isFetching,
  } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    staleTime: STALETIME,
    refetchOnWindowFocus: false,
  })

  const tasks = data?.data || []
  const totalPages = Math.ceil((data?.pagination?.totalCount || 0) / pageSize)

  const handleTabChange = (value: string) => {
    setCurrentTab(value)
    // When switching tabs, reset to the first page
    updateUrl(1)
  }

  const handlePageChange = (newPage: number) => {
    updateUrl(newPage)
  }

  // Show loading state: initial loading or data fetching
  if (loading || (isFetching && !data)) {
    return <LoadingCards count={3} />
  }

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
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <div className="flex w-full items-center justify-between">
            <TabsList className="flex w-auto flex-nowrap">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={currentTab} className="mt-6">
            {/* Display load indicator when data is loading */}
            {isFetching && data ? (
              <div className="relative">
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
                </div>
                {renderTasks(tasks)}
              </div>
            ) : (
              renderTasks(tasks)
            )}
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <nav aria-label="Pagination">
          <PaginationFast page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
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
