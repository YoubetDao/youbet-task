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
import TableFilter from './_components/TableFilter'

export default function TaskManagement() {
  const [page, setPage] = useState(1)

  const queryKey = ['tasks', '', page]
  const queryFn = () =>
    taskApi
      .taskControllerGetTasks(
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
      <TableFilter />
      <TaskMgtTable tasks={tasks} page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  )
}
