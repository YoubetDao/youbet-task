import React, { useEffect, useState } from 'react'
import { fetchPeriod, getLoadMoreProjectList } from '@/service'
import { IResultPagination, IResultPaginationData, Project, Record } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingCards } from '@/components/loading-cards'
import { useAccount } from 'wagmi'
import { useInfiniteScroll } from 'ahooks'
import { DEFAULT_PAGINATION_LIMIT } from '@/constants/data'
import PaginationFast from '@/components/pagination-fast'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PencilLine } from 'lucide-react'
import { RewardDialogForm } from './reward-form'
import { Button } from '@/components/ui/button'

interface ProjectListProps {
  loading: boolean
  loadingMore: boolean
  data: IResultPagination<Project> | undefined
}

function ProjectList({ loading, loadingMore, data }: ProjectListProps) {
  if (loading) return <LoadingCards />
  if (!data) return null

  return (
    <div className="flex w-full flex-col overflow-hidden p-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{data.pagination.totalCount} Projects</div>
      </div>
      <div className="flex w-full flex-col gap-2">
        {data.list.map((project) => (
          <SelectItem key={project._id} value={project._id.toString()}>
            {project.name}
          </SelectItem>
        ))}
        {data.list.map((project) => (
          <SelectItem key={project._id + 1} value={project._id.toString()}>
            {project.name}
          </SelectItem>
        ))}
        {data.list.map((project) => (
          <SelectItem key={project._id + 2} value={project._id.toString()}>
            {project.name}
          </SelectItem>
        ))}
        {data.list.map((project) => (
          <SelectItem key={project._id + 3} value={project._id.toString()}>
            {project.name}
          </SelectItem>
        ))}
        {data.list.map((project) => (
          <SelectItem key={project._id + 4} value={project._id.toString()}>
            {project.name}
          </SelectItem>
        ))}
        {data.list.map((project) => (
          <SelectItem key={project._id + 5} value={project._id.toString()}>
            {project.name}
          </SelectItem>
        ))}
        {data.list.map((project) => (
          <SelectItem key={project._id + 6} value={project._id.toString()}>
            {project.name}
          </SelectItem>
        ))}
        {data.list.map((project) => (
          <SelectItem key={project._id + 7} value={project._id.toString()}>
            {project.name}
          </SelectItem>
        ))}
        {data.list.map((project) => (
          <SelectItem key={project._id + 8} value={project._id.toString()}>
            {project.name}
          </SelectItem>
        ))}
        {data.list.map((project) => (
          <SelectItem key={project._id + 9} value={project._id.toString()}>
            {project.name}
          </SelectItem>
        ))}
        {data.list.map((project) => (
          <SelectItem key={project._id + 10} value={project._id.toString()}>
            {project.name}
          </SelectItem>
        ))}
        {data.list.map((project) => (
          <SelectItem key={project._id + 11} value={project._id.toString()}>
            {project.name}
          </SelectItem>
        ))}
        {loadingMore && <LoadingCards count={1} />}
      </div>
    </div>
  )
}

function PeriodTable(): React.ReactElement {
  const [page, setPage] = useState(1)
  const [urlParam, setUrlParam] = useSearchParams('')
  const [projectId, setProjectId] = useState<string | undefined>(undefined)
  const [filterTags, setFilterTags] = useState<string[]>([])
  const { address, chain } = useAccount()
  const pageSize = 10

  const {
    data: projects,
    loading: projectLoading,
    loadingMore: projectLoadingMore,
    reload,
  } = useInfiniteScroll<IResultPagination<Project>>(
    async (d) => {
      const res = await getLoadMoreProjectList({
        offset: d ? d.pagination.currentPage * DEFAULT_PAGINATION_LIMIT : 0,
        limit: DEFAULT_PAGINATION_LIMIT,
        filterTags,
        search: decodeURIComponent(urlParam.get('search') || ''),
        sort: decodeURIComponent(urlParam.get('sort') || ''),
        onlyPeriodicReward: true,
      })
      if (!projectId) setProjectId(res.list[0]._id.toString())
      return res
    },
    {
      manual: true,
      target: document.querySelector('#scrollRef'),
      isNoMore: (data) => {
        return data ? !data.pagination.hasNextPage : false
      },
    },
  )

  const { data: aggregations, isLoading: isPullRequestsLoading } = useQuery<IResultPaginationData<Record> | undefined>({
    queryKey: ['aggregations', projectId ?? ''],
    queryFn: () => {
      return fetchPeriod({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        projectId: projectId ?? '',
      })
    },
  })

  const totalPages = Math.ceil((aggregations?.pagination.totalCount || 0) / pageSize)

  useEffect(() => {
    reload()
  }, [filterTags, reload, urlParam])

  return (
    <div className="space-y-4">
      <Select value={projectId} onValueChange={setProjectId}>
        <SelectTrigger className="w-[180px] border-gray-700 bg-transparent">
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          {!projectLoading && projects ? (
            <ProjectList loading={projectLoading} loadingMore={projectLoadingMore} data={projects} />
          ) : (
            <LoadingCards count={1} />
          )}
        </SelectContent>
      </Select>

      {!isPullRequestsLoading && aggregations ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">From</TableHead>
              <TableHead className="text-gray-400">To</TableHead>
              <TableHead className="text-gray-400">Users</TableHead>
              <TableHead className="text-gray-400">Pr count</TableHead>
              <TableHead className="text-gray-400">Reward</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aggregations.data.map((periodPrs) => {
              return (
                <TableRow key={periodPrs._id}>
                  <TableCell className="font-medium">{periodPrs.from}</TableCell>
                  <TableCell>{periodPrs.to}</TableCell>
                  <TableCell>
                    <div className="flex -space-x-3">
                      {periodPrs.users.map((user) => {
                        return (
                          <img
                            key={user._id}
                            className="h-6 w-6 rounded-full border-2 border-white"
                            src={user.avatarUrl}
                            alt={user._id}
                          />
                        )
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{periodPrs.pullRequests.length}</TableCell>
                  <TableCell>
                    {!periodPrs.rewardGranted ? (
                      address &&
                      chain && (
                        <RewardDialogForm
                          trigger={
                            <Button variant="link" className="gap-2 p-0 text-blue-500">
                              <PencilLine size={15} />
                              Reward
                            </Button>
                          }
                          id={periodPrs._id}
                          users={periodPrs.users}
                          addressFrom={address}
                          chain={chain}
                        />
                      )
                    ) : (
                      <p>Rewarded</p>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <LoadingCards />
      )}

      <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

export default function PeriodAdmin() {
  return <PeriodTable />
}
