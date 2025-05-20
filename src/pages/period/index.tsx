import React, { useCallback, useEffect, useState } from 'react'
import { getLoadMoreProjectList, fetchReceiptsByPeriod, periodApi } from '@/service'
import { IResultPagination, IResultPaginationData, Project, PeriodReceipt, ReceiptStatus } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingCards } from '@/components/loading-cards'
import { useAccount, useSwitchChain } from 'wagmi'
import { useInfiniteScroll } from 'ahooks'
import { DEFAULT_PAGINATION_LIMIT, paymentChain } from '@/constants/data'
import PaginationFast from '@/components/pagination-fast'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PencilLine, Info } from 'lucide-react'
import { RewardDialogForm } from './reward-form'
import { Button } from '@/components/ui/button'
import { distributor } from '@/constants/distributor'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { capitalizeFirstLetter, RewardButton } from '@/components/reward-button'
import { PeriodControllerGetPeriodsRewardGrantedEnum } from '@/openapi/client'

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

function PeriodTable(): React.ReactElement {
  const [page, setPage] = useState(1)
  const { switchChain } = useSwitchChain()
  const [urlParam] = useSearchParams('')
  const [projectId, setProjectId] = useState<string | undefined>('')
  const [filterTags] = useState<string[]>([])
  const { address, chain } = useAccount()
  const pageSize = 10
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | null>(null)
  const [rewardState, setRewardState] = useState<string>(PeriodControllerGetPeriodsRewardGrantedEnum.All)
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

  const key = capitalizeFirstLetter(rewardState)
  const { data: periods, isLoading: isPullRequestsLoading } = useQuery(
    ['periods', page, pageSize, projectId ?? '', rewardState],
    () =>
      periodApi
        .periodControllerGetPeriods(
          projectId ?? '',
          '',
          PeriodControllerGetPeriodsRewardGrantedEnum[key as keyof typeof PeriodControllerGetPeriodsRewardGrantedEnum],
          (page - 1) * pageSize,
          pageSize,
        )
        .then((res) => res.data),
  )

  const [receiptPage, setReceiptPage] = useState(1)
  const receiptPageSize = 10
  const { data: periodReceipts, isLoading: isDetailLoading } = useQuery<
    IResultPaginationData<PeriodReceipt> | undefined
  >({
    queryKey: ['periodReceipts', selectedPeriodId],
    queryFn: () => {
      return fetchReceiptsByPeriod(selectedPeriodId ?? '')
    },
    enabled: !!selectedPeriodId,
    onError: (error) => {
      console.error('Error fetching period details:', error)
    },
  })

  const totalReceiptsPage = Math.ceil((periodReceipts?.pagination.totalCount || 0) / receiptPageSize)

  useEffect(() => {
    switchChain({ chainId: paymentChain.id })
  }, [switchChain])

  const totalPages = Math.ceil((periods?.pagination?.totalCount || 0) / pageSize)

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

  // remove filterTags in deps
  useEffect(() => {
    reload()
  }, [reload, urlParam])

  const handleDetailClick = (periodId: string) => {
    setSelectedPeriodId(periodId)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
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
        <RewardButton
          selected={rewardState}
          pageId="period"
          rewardState={rewardState}
          setRewardState={setRewardState}
        />
      </div>

      {!isPullRequestsLoading && periods ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">From</TableHead>
              <TableHead className="text-gray-400">To</TableHead>
              <TableHead className="text-gray-400">Users</TableHead>
              <TableHead className="text-gray-400">Pr count</TableHead>
              <TableHead className="text-gray-400">Reward</TableHead>
              <TableHead className="text-gray-400">Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(periods?.data || [])?.map((period, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {new Date(period.from).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(period.to).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-3">
                      {period.contributors.map((user, index) => {
                        return (
                          <img
                            key={index}
                            className="h-6 w-6 rounded-full border-2 border-white"
                            src={user.avatarUrl}
                            alt={user.login}
                          />
                        )
                      })}
                    </div>
                  </TableCell>
                  <TableCell>{period.pullRequests.length}</TableCell>
                  <TableCell>
                    {!period.rewardGranted ? (
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
                          id={period._id}
                          users={period.contributors}
                          addressFrom={address}
                          chain={chain}
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
                    ) : (
                      <p>Granted</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="gap-2 p-0 text-blue-500"
                      onClick={() => handleDetailClick(period._id)}
                    >
                      <Info size={15} />
                      Detail
                    </Button>
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
      <Drawer open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Period Details</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            {isDetailLoading ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : periodReceipts ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periodReceipts.data.map((periodReceipt) => {
                      return (
                        <TableRow key={periodReceipt._id}>
                          <TableCell className="font-medium">{periodReceipt.user}</TableCell>
                          <TableCell>
                            {periodReceipt.status == ReceiptStatus.CLAIMED
                              ? `${periodReceipt.detail.amount} ${periodReceipt.detail.symbol}`
                              : '***'}
                          </TableCell>
                          <TableCell>{periodReceipt.status}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-gray-500">No details available</p>
            )}
            <PaginationFast page={receiptPage} totalPages={totalReceiptsPage} onPageChange={setReceiptPage} />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default function PeriodAdmin() {
  return <PeriodTable />
}
