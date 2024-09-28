import React, { useState } from 'react'
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fetchTaskApplies } from '@/service'
import { PopulatedTaskApply, IResultPaginationData } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { format } from 'date-fns'
import { SkeletonCard } from '@/components/skeleton-card'

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

  if (isLoading) return <LoadingPage />

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Input
          placeholder="Filter task applies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-gray-700 bg-transparent max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="border-gray-700 bg-transparent w-[180px]">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center text-gray-400 text-sm">
        <div>
          Page {page} of {totalPages}
        </div>
        <div className="flex space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="border-gray-700 bg-transparent hover:bg-gray-800 text-gray-400"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="border-gray-700 bg-transparent hover:bg-gray-800 text-gray-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border-gray-700 bg-transparent hover:bg-gray-800 text-gray-400"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="border-gray-700 bg-transparent hover:bg-gray-800 text-gray-400"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const queryClient = new QueryClient()

export default function taskApplyAdmin() {
  return (
    <div className="mx-auto px-4 lg:px-12 py-4 max-w-7xl">
      <QueryClientProvider client={queryClient}>
        <TaskAppliesTable />
      </QueryClientProvider>
    </div>
  )
}
