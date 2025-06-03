import React, { useEffect, useState } from 'react'
import { fetchReceiptsByPeriod, periodApi, projectApi } from '@/service'
import { IResultPaginationData, PeriodReceipt, ReceiptStatus } from '@/types'
import { LoadingCards } from '@/components/loading-cards'
import { useAccount, useSwitchChain } from 'wagmi'
import { paymentChain } from '@/constants/data'
import PaginationFast from '@/components/pagination-fast'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { capitalizeFirstLetter, RewardButton } from '@/components/reward-button'
import { Period, PeriodControllerGetPeriodsRewardGrantedEnum } from '@/openapi/client'
import { Combobox } from '@/components/combo-box'
import { Checkbox } from '@/components/ui/checkbox'
import { BatchGrantDialog, RewardTask } from '../admin/BatchGrantDialog'
import { useUsername } from '@/store'
import { useAllowanceCheck } from '@/hooks/useAllowanceCheck'
import { TaskRewardCell } from '@/components/task-reward-cell'
import { usePendingGrantList } from '@/store/admin'

const statuses = (
  Object.keys(PeriodControllerGetPeriodsRewardGrantedEnum) as Array<
    keyof typeof PeriodControllerGetPeriodsRewardGrantedEnum
  >
).map((key) => ({
  label: key,
  value: PeriodControllerGetPeriodsRewardGrantedEnum[key],
}))

const valueToLabel = Object.entries(PeriodControllerGetPeriodsRewardGrantedEnum).reduce((acc, [key, value]) => {
  acc[value] = key
  return acc
}, {} as Record<string, string>)

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
  const [batchGrantPeriods, setBatchGrantPeriods] = useState<Array<RewardTask>>([])
  const [userName] = useUsername()
  const [pendingGrantPeriods, setPendingGrantPeriods] = usePendingGrantList()

  const { data: projects, isLoading: projectLoading } = useQuery(['projects', filterTags, urlParam], async () => {
    return projectApi
      .projectControllerGetProjects(
        filterTags.join(','),
        '',
        'true',
        urlParam.get('search') || '',
        urlParam.get('sort') || '',
        0,
        1000,
      )
      .then((res) => res.data)
  })

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

  const { hasAllowance, approveAllowance, tokenError, tokenLoading } = useAllowanceCheck()

  const handleDetailClick = (periodId: string) => {
    setSelectedPeriodId(periodId)
    setIsDetailOpen(true)
  }

  const projectOptions =
    projects?.data?.map((project) => ({
      value: project._id.toString(),
      label: project.name,
    })) ?? []

  const handleSelectTask = (period: Period) => {
    if (batchGrantPeriods.some((t) => t.id === period._id)) {
      setBatchGrantPeriods((prev) => prev.filter((t) => t.id !== period._id))
    } else {
      setBatchGrantPeriods((prev) => [
        ...prev,
        {
          id: period._id,
          taskTitle: 'period reward',
          users: period.contributors[0],
          amount: 0,
          decimals: 18,
          creator: userName!,
        },
      ])
    }
  }
  useEffect(() => {
    const newList = pendingGrantPeriods.filter((periodId) => {
      const period = periods?.data?.find((period) => period._id === periodId)
      return !period?.rewardGranted
    })
    setPendingGrantPeriods(newList)
  }, [periods])

  return (
    <div className="space-y-4">
      <div className="flex justify-between gap-4">
        <Combobox
          options={projectOptions}
          value={projectId ?? ''}
          onSelect={setProjectId}
          placeholder="Select project"
          isLoading={projectLoading}
        />
        <RewardButton
          selected={rewardState}
          pageId="period"
          rewardState={rewardState}
          setRewardState={setRewardState}
          statuses={statuses}
          valueToLabel={valueToLabel}
          title="Reward"
        />
      </div>
      <div className="flex justify-end">
        <BatchGrantDialog
          defaultRewardTasks={batchGrantPeriods}
          rewardType="period"
          trigger={
            <Button
              className="whitespace-nowrap"
              disabled={batchGrantPeriods.length === 0 || !hasAllowance || !address || !chain}
            >
              Grant Selected
            </Button>
          }
        />
      </div>

      {!isPullRequestsLoading && periods ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400"></TableHead>
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
                <TableRow key={period._id}>
                  <TableCell>
                    <Checkbox
                      disabled={period.rewardGranted}
                      checked={batchGrantPeriods.some((t) => t.id === period._id)}
                      onCheckedChange={() => handleSelectTask(period)}
                    />
                  </TableCell>
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
                    <TaskRewardCell
                      id={period._id}
                      isGranted={period.rewardGranted}
                      users={period.contributors}
                      tokenError={tokenError}
                      tokenLoading={tokenLoading}
                      address={address}
                      chain={chain}
                      hasAllowance={hasAllowance}
                      pendingGrantTasks={[]}
                      switchChain={switchChain}
                      approveAllowance={approveAllowance}
                    />
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
