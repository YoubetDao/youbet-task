import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPullRequests } from '@/service'
import { PullRequest, IResultPaginationData } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PaginationFast from '@/components/pagination-fast'
import { Button } from '@/components/ui/button'
import { PencilLine } from 'lucide-react'
import { format } from 'date-fns'
import { SkeletonCard } from '@/components/skeleton-card'
import { RewardDialogForm } from './reward-form'
import { useAccount } from 'wagmi'

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

// TODO: reward feature
function PullRequestsTable(): React.ReactElement {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { address, chain } = useAccount()
  const pageSize = 10

  const { data, isLoading } = useQuery<IResultPaginationData<PullRequest>>({
    queryKey: ['pullRequests', page, pageSize, searchTerm, statusFilter],
    queryFn: () => {
      return fetchPullRequests({
        state: statusFilter === 'all' ? undefined : statusFilter,
        offset: (page - 1) * pageSize,
        limit: pageSize,
        search: searchTerm,
      })
    },
    keepPreviousData: true,
  })

  const totalPages = Math.ceil((data?.pagination.totalCount || 0) / pageSize)

  const filteredData =
    data?.data.filter(
      (pr) =>
        pr.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === 'all' || pr.state === statusFilter),
    ) || []

  if (isLoading) return <LoadingPage />

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Input
          placeholder="Filter pull requests..."
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
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-gray-400">Number</TableHead>
            <TableHead className="text-gray-400">Title</TableHead>
            <TableHead className="text-gray-400">Created At</TableHead>
            <TableHead className="text-gray-400">State</TableHead>
            <TableHead className="text-gray-400">User</TableHead>
            <TableHead className="text-gray-400">Reward</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((pr) => (
            <TableRow key={pr.githubId}>
              <TableCell className="font-medium">{pr.githubId}</TableCell>
              <TableCell>
                <a
                  href={pr.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {pr.title}
                </a>
              </TableCell>
              <TableCell>{format(new Date(pr.createdAt), 'MMMM do, yyyy')}</TableCell>
              <TableCell>{pr.state}</TableCell>
              <TableCell>
                <a
                  href={pr.user.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:underline"
                >
                  {pr.user.login}
                </a>
              </TableCell>
              <TableCell>
                {!pr.rewardGranted ? (
                  address &&
                  chain && (
                    <RewardDialogForm
                      trigger={
                        <Button variant="link" className="gap-2 p-0 text-blue-500">
                          <PencilLine size={15} />
                          Reward
                        </Button>
                      }
                      prGithubId={pr.githubId}
                      addressFrom={address}
                      chain={chain}
                    />
                  )
                ) : (
                  <p>Rewarded</p>
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

export default function PullRequestAdmin() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 lg:px-12">
      <PullRequestsTable />
    </div>
  )
}
