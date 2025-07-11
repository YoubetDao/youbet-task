import { useEffect, useState } from 'react'
import { periodApi } from '@/service'
import { LoadingCards } from '@/components/loading-cards'
import { Config, useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { capitalizeFirstLetter } from '@/components/reward-button'
import { Period, PeriodControllerGetPeriodsRewardGrantedEnum } from '@/openapi/client'
import { Checkbox } from '@/components/ui/checkbox'
import { useUsername } from '@/store'
import { TaskRewardCell } from '@/components/task-reward-cell'
import { usePendingGrantList } from '@/store/admin'
import { formatDate } from '../_constants'
import PaginationFast from '@/components/pagination-fast'
import { RewardTask } from '@/pages/admin/BatchGrantDialog'
import { SwitchChainMutate } from 'wagmi/query'

interface PeriodTableProps {
  handleDetailClick: (periodId: string) => void
  switchChain: SwitchChainMutate<Config, unknown>
  projectId: string | undefined
  rewardState: string
  hasAllowance: boolean | null
  approveAllowance: () => Promise<void>
  tokenError: Error | null
  tokenLoading: boolean
}

const PeriodTable: React.FC<PeriodTableProps> = ({
  handleDetailClick,
  switchChain,
  projectId,
  rewardState,
  hasAllowance,
  approveAllowance,
  tokenError,
  tokenLoading,
}) => {
  const [page, setPage] = useState(1)
  const { address, chain } = useAccount()
  const pageSize = 10
  const [batchGrantPeriods, setBatchGrantPeriods] = useState<Array<RewardTask>>([])
  const [userName] = useUsername()
  const [pendingGrantPeriods, setPendingGrantPeriods] = usePendingGrantList()

  const key = capitalizeFirstLetter(rewardState)
  const { data: periods, isLoading: isPullRequestsLoading } = useQuery(
    ['periods', page, pageSize, projectId ?? '', rewardState],
    () =>
      periodApi
        .periodControllerGetPeriods(
          projectId ?? '',
          'desc',
          PeriodControllerGetPeriodsRewardGrantedEnum[key as keyof typeof PeriodControllerGetPeriodsRewardGrantedEnum],
          (page - 1) * pageSize,
          pageSize,
        )
        .then((res) => res.data),
  )

  const totalPages = Math.ceil((periods?.pagination?.totalCount || 0) / pageSize)

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
  }, [pendingGrantPeriods, periods, setPendingGrantPeriods])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAllSelectTask = (checked: boolean) => {
    if (checked) {
      const periodUngranted = (periods?.data || [])
        .filter((x) => !x.rewardGranted)
        .map((x) => {
          return {
            id: x._id,
            taskTitle: 'period reward',
            users: x.contributors[0],
            amount: 0,
            decimals: 18,
            creator: userName!,
          }
        })
      setBatchGrantPeriods(periodUngranted)
    } else {
      setBatchGrantPeriods([])
    }
  }
  return (
    <>
      {!isPullRequestsLoading && periods ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">
                <Checkbox onCheckedChange={handleAllSelectTask} />
              </TableHead>
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
                  <TableCell className="font-medium">{formatDate(period.from)}</TableCell>
                  <TableCell>{formatDate(period.to)}</TableCell>
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
                      userName={userName || undefined}
                      tokenError={tokenError}
                      tokenLoading={tokenLoading}
                      address={address}
                      chain={chain}
                      hasAllowance={hasAllowance}
                      pendingGrantTasks={pendingGrantPeriods}
                      switchChain={switchChain}
                      approveAllowance={approveAllowance}
                      sourceType="period"
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
    </>
  )
}

export default PeriodTable
