import { useEffect, useState } from 'react'
import { ReceiptDto } from '@/openapi/client'
import { useUsername } from '@/store'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useClaimReward from '../_hooks/useClaimReward'
import { usePendingClaimTasks } from '@/store/admin'
import { STALETIME } from '@/constants/contracts/request'
import { receiptApi } from '@/service'
import { ReceiptStatus } from '@/types'
import { getChainNameByChainId } from '@/constants/data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { formatDate } from '@/lib/utils'
import { RewardStatus } from './RewardStatus'
import { LoadingCards } from '@/components/loading-cards'
import PaginationFast from '@/components/pagination-fast'
import empty_cart from '@/assets/images/empty-cart.png'

function RewardsTable({
  type,
  isLogin,
  selectedRewards,
  handleSelectReward,
  handleAllSelectTask,
}: {
  type: 'period' | 'task'
  selectedRewards: string[]
  isLogin: boolean
  handleSelectReward: (resourceId: string) => void
  handleAllSelectTask: (periods: ReceiptDto[], checked: boolean) => void
}): React.ReactElement {
  const [page, setPage] = useState(1)
  const [github] = useUsername()
  const pageSize = 10
  const queryClient = useQueryClient()
  const { handleClaim, isClaiming } = useClaimReward(github, queryClient)
  const [pendingClaimTasks, setPendingClaimTasks] = usePendingClaimTasks()

  const { data: periods, isLoading: isPullRequestsLoading } = useQuery({
    queryKey: ['receipts', type, page],
    queryFn: () => {
      return receiptApi.receiptControllerMyReceipts(type, (page - 1) * pageSize, pageSize).then((res) => res.data)
    },
    staleTime: STALETIME,
  })

  const totalPages = Math.ceil((periods?.pagination?.totalCount || 0) / pageSize)

  useEffect(() => {
    //update pendingReceipts
    const newList = pendingClaimTasks.filter((pendingId: string) => {
      const receipt = periods?.data?.find(
        (receipt) => receipt.source.period?._id === pendingId || receipt.source.task?._id === pendingId,
      )
      return receipt?.status !== ReceiptStatus.CLAIMED
    })
    setPendingClaimTasks(newList)
  }, [periods])

  return (
    <div className="space-y-4">
      {!isPullRequestsLoading && periods ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">
                <Checkbox onCheckedChange={(checked: boolean) => handleAllSelectTask(periods.data || [], checked)} />
              </TableHead>
              {type === 'period' ? (
                <TableHead className="text-gray-400">Period</TableHead>
              ) : (
                <TableHead className="text-gray-400">Task</TableHead>
              )}
              <TableHead className="text-gray-400">Amount</TableHead>
              <TableHead className="text-gray-400">Chain</TableHead>
              <TableHead className="text-gray-400">Reward</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(periods?.data || []).length ? (
              periods?.data?.map((receipts) => {
                return (
                  <TableRow key={receipts._id}>
                    <TableCell>
                      <Checkbox
                        disabled={receipts.status !== ReceiptStatus.GRANTED}
                        checked={selectedRewards.includes(
                          receipts.source.period?._id ?? receipts.source.task?._id ?? '',
                        )}
                        onCheckedChange={() => {
                          handleSelectReward(receipts.source.period?._id ?? receipts.source.task?._id ?? '')
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {type === 'period' ? (
                        <>
                          {formatDate(receipts.source.period?.from)} - {formatDate(receipts.source.period?.to)}
                        </>
                      ) : (
                        <div className="space-y-1">
                          <div>{receipts.source.task?.title}</div>
                          <a
                            href={receipts.source.task?.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-500 hover:text-blue-500"
                          >
                            {receipts.source.task?._id}
                          </a>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {receipts.status == ReceiptStatus.CLAIMED || type !== 'period'
                        ? `${receipts.detail.amount} ${receipts.detail.symbol}`
                        : '***'}
                    </TableCell>
                    <TableCell>{getChainNameByChainId(receipts?.detail?.chainId)}</TableCell>
                    <TableCell>
                      <RewardStatus
                        status={receipts.status}
                        isLogin={isLogin}
                        onClaim={() => handleClaim(receipts)}
                        isLoading={isClaiming(receipts._id)}
                        receipt={receipts}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow key="NO_DATA">
                <TableCell colSpan={4}>
                  <img
                    src={empty_cart}
                    alt="No Data."
                    className="relative z-10 m-auto h-[95px] w-[100px] object-contain opacity-60"
                    style={{ filter: 'grayscale(1) brightness(0.8) drop-shadow(0 2px 8px rgba(0,0,0,0.10))' }}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      ) : (
        <LoadingCards />
      )}

      <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}
export default RewardsTable
