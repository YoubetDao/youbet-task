import { taskApi } from '@/service'
import {
  TaskControllerGetTasksNoGrantNeededEnum,
  TaskControllerGetTasksRewardClaimedEnum,
  TaskControllerGetTasksRewardGrantedEnum,
} from '@/openapi/client'
import { useState } from 'react'
import { PAGESIZE, STALETIME } from '@/constants/contracts/request'
import { useQuery } from '@tanstack/react-query'
import TaskMgtTable from './_components/TaskMgtTable'
import { ISort } from './_components/TableSortHeader'

export default function TaskManagement() {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<ISort[]>([])

  const sortParams = sort.map((item) => `${item.field}:${item.value}`).join(',')

  const queryKey = ['tasks', '', page, sortParams]
  const queryFn = () =>
    taskApi
      .taskControllerGetManagedTasks(
        '',
        '',
        '',
        'open',
        'all',
        TaskControllerGetTasksRewardGrantedEnum.All,
        TaskControllerGetTasksRewardClaimedEnum.All,
        TaskControllerGetTasksNoGrantNeededEnum.All,
        (page - 1) * PAGESIZE,
        PAGESIZE,
        sortParams,
      )
      .then((res) => res.data)

  const { data, isLoading: loading } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
    staleTime: STALETIME,
    refetchOnWindowFocus: false,
  })

  const tasks = data?.data || []
  const totalPages = Math.ceil((data?.pagination?.totalCount || 0) / PAGESIZE)

  return (
    <div className="space-y-4">
      <TaskMgtTable tasks={tasks} page={page} totalPages={totalPages} setPage={setPage} sort={sort} setSort={setSort} />
    </div>
  )
}
