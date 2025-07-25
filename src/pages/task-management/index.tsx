import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { taskApi } from '@/service'
import { TaskControllerGetTasksRewardClaimedEnum, TaskControllerGetTasksRewardGrantedEnum } from '@/openapi/client'
import { useState } from 'react'
import { PAGESIZE, STALETIME } from '@/constants/contracts/request'
import { useQuery } from '@tanstack/react-query'
import PaginationFast from '@/components/pagination-fast'

export default function TaskManagement() {
  const [page, setPage] = useState(1)

  const queryKey = ['tasks', '', page]
  const queryFn = () =>
    taskApi
      .taskControllerGetTasks(
        '',
        '',
        'open',
        'all',
        TaskControllerGetTasksRewardGrantedEnum.All,
        TaskControllerGetTasksRewardClaimedEnum.All,
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

  console.log('table:', tasks)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">Title</TableHead>
            <TableHead className="text-gray-400">Due</TableHead>
            <TableHead className="text-gray-400">Priority</TableHead>
            <TableHead className="text-gray-400">Story Points</TableHead>
            <TableHead className="text-gray-400">Projects</TableHead>
            <TableHead className="text-gray-400">Assignees</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((x, index) => (
            <TableRow key={index}>
              <TableCell>{x.title}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  )
}
