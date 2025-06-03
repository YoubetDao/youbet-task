import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { LoadingCards } from '@/components/loading-cards'
import { taskApplyApi } from '@/service'
import PaginationFast from '@/components/pagination-fast'
import { SearchInput } from '@/components/search'
import { useSearchParams } from 'react-router-dom'

const TaskAppliesTable = () => {
  const [page, setPage] = useState(1)
  const [urlParam, setUrlParam] = useSearchParams('')
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['taskApplies', page, pageSize, urlParam.toString()],
    queryFn: () => {
      return taskApplyApi.taskApplyControllerGetTaskApplies('', page, pageSize).then((res) => res.data)
    },
  })

  const handleSubmit = (searchValue: string, sortValue: string) => {
    setUrlParam(`search=${searchValue}&sort=${sortValue}`)
  }

  const totalPages = Math.ceil((data?.pagination?.totalCount || 0) / pageSize)

  const queryClient = useQueryClient()

  const approveMutation = useMutation({
    mutationFn: (applyId: string) => taskApplyApi.taskApplyControllerApproveTaskApply(applyId),
    onMutate: (applyId) => {
      setLoadingStates((prev) => ({ ...prev, [applyId]: true }))
    },
    onSettled: (_, __, applyId) => {
      setLoadingStates((prev) => ({ ...prev, [applyId]: false }))
      queryClient.invalidateQueries(['taskApplies'])
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (applyId: string) => taskApplyApi.taskApplyControllerRejectTaskApply(applyId),
    onMutate: (applyId) => {
      setLoadingStates((prev) => ({ ...prev, [applyId]: true }))
    },
    onSettled: (_, __, applyId) => {
      setLoadingStates((prev) => ({ ...prev, [applyId]: false }))
      queryClient.invalidateQueries(['taskApplies'])
    },
  })

  return (
    <div className="space-y-4">
      <SearchInput
        searchInitialValue={urlParam.get('search') || ''}
        sortInitialValue={urlParam.get('sort') || ''}
        placeholder="Filter task applies..."
        handleSubmit={handleSubmit}
      />
      {!isLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Project Name</TableHead>
              <TableHead className="text-gray-400">Task Title</TableHead>
              <TableHead className="text-gray-400">User</TableHead>
              <TableHead className="text-gray-400">Applied At</TableHead>
              <TableHead className="text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((apply) => (
              <TableRow key={apply._id}>
                <TableCell>{apply.projectName}</TableCell>
                <TableCell>
                  <a href={apply.task.htmlUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {apply.task.title}
                  </a>
                </TableCell>
                <TableCell>
                  <a href={apply.user.login} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {apply.user.login}
                  </a>
                </TableCell>
                <TableCell>{format(new Date(apply.createdAt), 'MMMM do, yyyy')}</TableCell>
                <TableCell>
                  {!apply.canceledAt && !apply.approvedAt ? (
                    <div className="flex space-x-2">
                      <Button onClick={() => approveMutation.mutate(apply._id)} disabled={loadingStates[apply._id]}>
                        Approve
                      </Button>
                      <Button onClick={() => rejectMutation.mutate(apply._id)} disabled={loadingStates[apply._id]}>
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-400">
                      {apply.approvedAt ? 'Approved' : apply.canceledAt ? 'Canceled' : 'Rejected'}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <LoadingCards />
      )}
      <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

export default function TaskApplyAdmin() {
  return <TaskAppliesTable />
}
