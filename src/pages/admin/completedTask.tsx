import React, { useCallback, useEffect, useState } from 'react'
import { getLoadMoreProjectList, grantTaskRewards, taskApi } from '@/service'
import { IResultPagination, Project } from '@/types'
import { SelectItem } from '@/components/ui/select'
import { LoadingCards } from '@/components/loading-cards'
import { useAccount, useSwitchChain } from 'wagmi'
import { useInfiniteScroll } from 'ahooks'
import { paymentChain } from '@/constants/data'
import PaginationFast from '@/components/pagination-fast'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PencilLine } from 'lucide-react'
import { RewardDialogForm } from '../period/reward-form'
import { Button } from '@/components/ui/button'
import { distributor } from '@/constants/distributor'
import { Combobox } from '@/components/import-project'

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

function CompletedTaskTable(): React.ReactElement {
  const [page, setPage] = useState(1)
  const { switchChain } = useSwitchChain()
  const [urlParam] = useSearchParams('')
  const [projectId, setProjectId] = useState<string | undefined>('')
  const [filterTags] = useState<string[]>([])
  const { address, chain } = useAccount()
  const pageSize = 10

  const {
    data: projects,
    loading: projectLoading,
    loadingMore: projectLoadingMore,
    reload,
  } = useInfiniteScroll<IResultPagination<Project>>(
    async () => {
      // TODO: deal with pagination
      const res = await getLoadMoreProjectList({
        offset: 0,
        limit: 100,
        filterTags,
        search: decodeURIComponent(urlParam.get('search') || ''),
        sort: decodeURIComponent(urlParam.get('sort') || ''),
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

  const { data: tasks, isLoading: isTasksLoading } = useQuery(['tasks', page, pageSize, projectId ?? ''], () => {
    return taskApi
      .taskControllerGetTasks(projectId ?? '', '', 'closed', '', (page - 1) * pageSize, pageSize)
      .then((res) => res.data)
  })

  useEffect(() => {
    switchChain({ chainId: paymentChain.id })
  }, [switchChain])

  const totalPages = Math.ceil((tasks?.pagination?.totalCount || 0) / pageSize)

  const [hasAllowance, setHasAllowance] = useState(false)
  const [tokenDecimals, setTokenDecimals] = useState<bigint>(BigInt(18))

  const getTokenInfo = useCallback(async () => {
    const [, decimals] = await distributor.getTokenSymbolAndDecimals()
    setTokenDecimals(decimals)
  }, [])

  useEffect(() => {
    getTokenInfo()
  }, [getTokenInfo])

  const MIN_ALLOWANCE = BigInt(50) * BigInt(10) ** tokenDecimals

  const checkAllowance = useCallback(async () => {
    if (address) {
      const allowance = await distributor.getAllowance(address)
      setHasAllowance(allowance >= MIN_ALLOWANCE)
    }
  }, [address, MIN_ALLOWANCE])

  useEffect(() => {
    checkAllowance()
  }, [checkAllowance])

  useEffect(() => {
    reload()
  }, [filterTags, reload, urlParam])

  // Prepare options for searchable dropdown
  const projectOptions =
    projects?.list.map((project) => ({
      value: project._id.toString(),
      label: project.name,
    })) ?? []
  console.log('Dropdown options:', projectOptions)

  return (
    <div className="space-y-4">
      <Combobox
        options={projectOptions}
        value={projectId ?? ''}
        onSelect={setProjectId}
        placeholder="Select project"
        isLoading={projectLoading}
      />

      {!isTasksLoading && tasks ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Title</TableHead>
              <TableHead className="text-gray-400">Created At</TableHead>
              <TableHead className="text-gray-400">Completed At</TableHead>
              <TableHead className="text-gray-400">Assignee</TableHead>
              <TableHead className="text-gray-400">Reward</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.data?.map((task) => (
              <TableRow key={task._id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  {task.closedAt &&
                    new Date(task.closedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                </TableCell>
                <TableCell>
                  {task.assignee && (
                    <img
                      className="h-6 w-6 rounded-full border-2 border-white"
                      src={task.assignee.avatarUrl}
                      alt={task.assignee.login}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {!task.rewardGranted ? (
                    address &&
                    chain &&
                    (hasAllowance ? (
                      <RewardDialogForm
                        trigger={
                          <Button variant="link" className="gap-2 p-0 text-blue-500">
                            <PencilLine size={15} />
                            Grant
                          </Button>
                        }
                        id={task._id}
                        users={task.assignee ? [task.assignee] : []}
                        addressFrom={address}
                        chain={chain}
                        onRewardDistributed={async (data) => {
                          await grantTaskRewards(task._id, {
                            contributors: data.users.map((user) => ({
                              contributor: user.login,
                              amount: data.amounts[data.users.indexOf(user)],
                              symbol: data.symbol,
                              decimals: data.decimals,
                            })),
                          })
                        }}
                        defaultAmount={Number(task.reward?.amount) / 10 ** Number(task.reward?.decimals)}
                      />
                    ) : (
                      <Button
                        variant="link"
                        className="gap-2 p-0 text-blue-500"
                        onClick={async () => {
                          await switchChain({ chainId: paymentChain.id })
                          await distributor.approveAllowance(MIN_ALLOWANCE * BigInt(10))
                          await checkAllowance()
                        }}
                      >
                        Approve Contract
                      </Button>
                    ))
                  ) : task.rewardClaimed ? (
                    <p>Claimed</p>
                  ) : (
                    <p>Granted</p>
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

export default function CompletedTaskAdmin() {
  return <CompletedTaskTable />
}
