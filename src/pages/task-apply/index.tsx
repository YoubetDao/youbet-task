import React, { useState } from 'react'
import { useQuery, QueryClient, QueryClientProvider, useMutation, useQueryClient } from '@tanstack/react-query'
import { PopulatedTaskApply, IResultPaginationData } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { SkeletonCard } from '@/components/skeleton-card'
import { fetchTaskApplies, approveTaskApply, rejectTaskApply } from '@/service'
import PaginationFast from '@/components/pagination-fast'

function LoadingPage(): React.ReactElement {
  return (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  )
}

function TaskAppliesTable(): React.ReactElement {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const pageSize = 10

  const { data, isLoading } = useQuery<IResultPaginationData<PopulatedTaskApply>>(
    ['taskApplies', page, pageSize, searchTerm, statusFilter],
    () =>
      fetchTaskApplies({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        search: searchTerm,
      }),
    {
      keepPreviousData: true,
    },
  )

  const totalPages = Math.ceil((data?.pagination.totalCount || 0) / pageSize)

  const filteredData =
    data?.data.filter((apply) => apply.task.title.toLowerCase().includes(searchTerm.toLowerCase())) || []

  const queryClient = useQueryClient()

  const approveMutation = useMutation(approveTaskApply, {
    onMutate: (applyId) => {
      setLoadingStates((prev) => ({ ...prev, [applyId]: true }))
    },
    onSettled: (_, __, applyId) => {
      setLoadingStates((prev) => ({ ...prev, [applyId]: false }))
      queryClient.invalidateQueries(['taskApplies'])
    },
  })

  const rejectMutation = useMutation(rejectTaskApply, {
    onMutate: (applyId) => {
      setLoadingStates((prev) => ({ ...prev, [applyId]: true }))
    },
    onSettled: (_, __, applyId) => {
      setLoadingStates((prev) => ({ ...prev, [applyId]: false }))
      queryClient.invalidateQueries(['taskApplies'])
    },
  })

  if (isLoading) return <LoadingPage />

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Input
          placeholder="Filter task applies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm border-gray-700 bg-transparent"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] border-gray-700 bg-transparent">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">Task Title</TableHead>
            <TableHead className="text-gray-400">User</TableHead>
            <TableHead className="text-gray-400">Applied At</TableHead>
            <TableHead className="text-gray-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((apply) => (
            <TableRow key={apply._id}>
              <TableCell>
                <a href={apply.task.htmlUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {apply.task.title}
                </a>
              </TableCell>
              <TableCell>
                <a href={apply.user.htmlUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
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
      <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

const queryClient = new QueryClient()

export default function TaskApplyAdmin() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 lg:px-12">
      <QueryClientProvider client={queryClient}>
        <TaskAppliesTable />
      </QueryClientProvider>
    </div>
  )
}
