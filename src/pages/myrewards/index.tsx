import React, { useEffect, useState } from 'react'
import { fetchPeriod, getLoadMoreProjectList } from '@/service'
import { IResultPagination, IResultPaginationData, Period, Project } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingCards } from '@/components/loading-cards'
import { useAccount } from 'wagmi'
import { useInfiniteScroll } from 'ahooks'
import { DEFAULT_PAGINATION_LIMIT } from '@/constants/data'
import PaginationFast from '@/components/pagination-fast'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { distributor } from '@/constants/distributor'
import { toast } from '@/components/ui/use-toast'
import { useAtom } from 'jotai'
import { usernameAtom } from '@/store'

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
        {loadingMore && <LoadingCards count={1} />}
      </div>
    </div>
  )
}

function RewardsTable(): React.ReactElement {
  const [page, setPage] = useState(1)
  const [github] = useAtom(usernameAtom)
  const [urlParam] = useSearchParams('')
  const [projectId, setProjectId] = useState<string | undefined>(undefined)
  const [filterTags] = useState<string[]>([])
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

  const { data: periods, isLoading: isPullRequestsLoading } = useQuery<IResultPaginationData<Period> | undefined>({
    queryKey: ['periods', projectId ?? ''],
    queryFn: () => {
      return fetchPeriod({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        projectId: projectId ?? '',
      })
    },
  })

  const totalPages = Math.ceil((periods?.pagination.totalCount || 0) / pageSize)

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

      {!isPullRequestsLoading && periods ? (
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
            {periods.data.map((periodPrs) => {
              return (
                <TableRow key={periodPrs._id}>
                  <TableCell className="font-medium">
                    {new Date(periodPrs.from).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(periodPrs.to).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-3">
                      {periodPrs.contributors.map((user) => {
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
                      github &&
                      chain && (
                        <Button
                          variant="link"
                          className="gap-2 p-0 text-blue-500"
                          onClick={async () => {
                            try {
                              //  TODO: fetch signature from backend
                              const signature =
                                '0x931d5b9cbc5d00d5dd42352827fa5423ec932ef45eb3afad3f2f8173fabe588451e97cdd849f76d728047a48e4f0a1064287584f155569b2339bc9e16ce6acfb1c'

                              await distributor.claimRedPacket(periodPrs._id, github, signature)

                              toast({
                                title: 'Success',
                                description: 'Reward claimed successfully',
                              })
                            } catch (error) {
                              toast({
                                variant: 'destructive',
                                title: 'Error',
                                description: error instanceof Error ? error.message : 'Failed to claim reward',
                              })
                            }
                          }}
                        >
                          Claim
                        </Button>
                      )
                    ) : (
                      <p>Granted</p>
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

export default function MyRewards() {
  return <RewardsTable />
}
