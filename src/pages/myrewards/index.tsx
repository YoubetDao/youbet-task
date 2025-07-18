import React, { useEffect, useState, useCallback } from 'react'
import { receiptApi, rewardApi } from '@/service'
import { ReceiptStatus } from '@/types'
import { LoadingCards } from '@/components/loading-cards'
import { useAccount } from 'wagmi'
import PaginationFast from '@/components/pagination-fast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { distributor } from '@/constants/distributor'
import { toast, useToast } from '@/components/ui/use-toast'
import { useUsername } from '@/store'
import { formatDate } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLocation, useNavigate } from 'react-router-dom'
import { Checkbox } from '@/components/ui/checkbox'
import { RewardStatus } from './RewardStatus'
import { usePendingClaimTasks } from '@/store/admin'
import { STALETIME } from '@/constants/contracts/request'
import { ReceiptDto } from '@/openapi/client'
import empty_cart from '@/assets/images/empty-cart.png'

// 添加领取处理函数
const useClaimReward = (github: string | null, queryClient: any) => {
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [pendingClaimTasks, setPendingClaimTasks] = usePendingClaimTasks()

  const handleClaim = useCallback(
    async (receipt: ReceiptDto) => {
      if ((!receipt.source.period && !receipt.source.task) || !github) return
      const sourceId = receipt.source.period?._id || receipt.source.task?._id
      if (!sourceId) return

      setClaimingId(receipt._id)
      try {
        const signature = await rewardApi.rewardControllerGetRewardSignature(sourceId)
        await distributor.claimRedPacket(sourceId, github, signature.data.signature)
        await queryClient.invalidateQueries({ queryKey: ['receipts'] })

        //update pendingReceipts
        setPendingClaimTasks([...pendingClaimTasks, sourceId])

        toast({
          title: 'Claimed',
          description: 'Reward claimed successfully',
        })
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to claim reward',
        })
      } finally {
        setClaimingId(null)
      }
    },
    [github, queryClient],
  )

  return {
    handleClaim,
    isClaiming: (id: string) => claimingId === id,
  }
}

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

export default function MyRewards() {
  const [type, setType] = useState<'period' | 'task'>('period')
  const [selectedRewards, setSelectedRewards] = useState<string[]>([])
  const { address, chain } = useAccount()
  const [github] = useUsername()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const navigate = useNavigate()
  const location = useLocation()
  const [pendingClaimTasks, setPendingClaimTasks] = usePendingClaimTasks()

  const currentTab = new URLSearchParams(location.search).get('type') || type

  const isLogin = !!address && !!github && !!chain

  useEffect(() => {
    if (!new URLSearchParams(location.search).has('type')) {
      const params = new URLSearchParams(location.search)
      params.set('type', type)
      navigate(`?${params.toString()}`, { replace: true })
    }
  }, [location.search, navigate])

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(location.search)
    params.set('type', tab)
    navigate(`?${params.toString()}`)
    setType(tab as 'period' | 'task')
  }

  const handleClaimSelected = async () => {
    if (!address || selectedRewards.length === 0 || !github) return
    setLoading(true)
    try {
      // Get signatures for all selected rewards
      const batch = await Promise.all(
        selectedRewards.map(async (receiptId) => {
          // Get signature for each reward
          const signature = await rewardApi.rewardControllerGetRewardSignature(receiptId)
          return {
            uuid: receiptId,
            githubId: github,
            signature: signature.data.signature,
          }
        }),
      )

      // Call batch claim contract
      await distributor.batchClaimRedPacket(batch)

      //update pendingReceipts
      setPendingClaimTasks([...pendingClaimTasks, ...selectedRewards])

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['receipts'] })

      // Clear selection
      setSelectedRewards([])

      // Show success message
      toast({
        variant: 'default',
        title: 'Success',
        description: 'Rewards claimed successfully',
      })
    } catch (error) {
      console.error('Claim error:', error)
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: (
            <div className="max-h-60 overflow-y-auto whitespace-pre-wrap break-all">
              {error.message || JSON.stringify(error)}
            </div>
          ),
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to claim rewards',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSelectReward = (resourceId: string) => {
    setSelectedRewards((prev) => {
      if (prev.includes(resourceId)) {
        return prev.filter((id) => id !== resourceId)
      }
      return [...prev, resourceId]
    })
  }
  const handleAllSelectTask = (periods: ReceiptDto[], checked: boolean) => {
    if (checked) {
      const taskUngrantedOrUnclaimed = (periods || [])
        .filter((receipts) => receipts.status === ReceiptStatus.GRANTED)
        .map((receipts) => {
          return receipts.source.period?._id ?? receipts.source.task?._id ?? ''
        })
      setSelectedRewards(taskUngrantedOrUnclaimed)
    } else {
      setSelectedRewards([])
    }
  }

  return (
    <div className="space-y-4">
      <Tabs className="flex justify-between" defaultValue="period" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="period">Period Rewards</TabsTrigger>
          <TabsTrigger value="task">Task Rewards</TabsTrigger>
        </TabsList>
        <Button
          onClick={handleClaimSelected}
          disabled={loading || selectedRewards.length === 0}
          className={loading ? 'cursor-not-allowed opacity-50' : ''}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Processing...</span>
            </div>
          ) : (
            'Claim Selected'
          )}
        </Button>
      </Tabs>
      <RewardsTable
        type={type}
        isLogin={isLogin}
        selectedRewards={selectedRewards}
        handleSelectReward={handleSelectReward}
        handleAllSelectTask={handleAllSelectTask}
      />
    </div>
  )
}
