import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPullRequests } from '@/service'
import { PullRequest, IResultPaginationData } from '@/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PaginationFast from '@/components/pagination-fast'
import { Button } from '@/components/ui/button'
import { PencilLine } from 'lucide-react'
import { format } from 'date-fns'
import { LoadingCards } from '@/components/loading-cards'
import { RewardDialogForm } from './reward-form'
import { useAccount } from 'wagmi'
import { useSearchParams } from 'react-router-dom'
import { SearchInput } from '@/components/search'

// TODO: reward feature
function PullRequestsTable(): React.ReactElement {
  const [page, setPage] = useState(1)
  const [urlParam, setUrlParam] = useSearchParams('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { address, chain } = useAccount()
  const pageSize = 10

  const { data, isLoading } = useQuery<IResultPaginationData<PullRequest>>({
    queryKey: ['pullRequests', page, pageSize, urlParam.toString(), statusFilter],
    queryFn: () => {
      return fetchPullRequests({
        state: statusFilter === 'all' ? undefined : statusFilter,
        offset: (page - 1) * pageSize,
        limit: pageSize,
        sort: decodeURIComponent(urlParam.get('sort') || ''),
        search: decodeURIComponent(urlParam.get('search') || ''),
      })
    },
  })

  const handleSubmit = (searchValue: string, sortValue: string) => {
    setUrlParam(`search=${searchValue}&sort=${sortValue}`)
  }

  const totalPages = Math.ceil((data?.pagination.totalCount || 0) / pageSize)

  const filteredData =
    data?.data.filter(
      (pr) =>
        pr.title.toLowerCase().includes((urlParam.get('search') || '').toLowerCase()) &&
        (statusFilter === 'all' || pr.state === statusFilter),
    ) || []

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <SearchInput
          searchInitialValue={urlParam.get('search') || ''}
          sortInitialValue={urlParam.get('sort') || ''}
          placeholder="Filter task applies..."
          handleSubmit={handleSubmit}
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
      {!isLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Project Name</TableHead>
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
                <TableCell className="font-medium">{pr.projectName}</TableCell>
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
      ) : (
        <LoadingCards />
      )}

      <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

export default function PullRequestAdmin() {
  return <PullRequestsTable />
}
