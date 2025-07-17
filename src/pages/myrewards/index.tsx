import { useEffect, useState } from 'react'
import { rewardApi } from '@/service'
import { ReceiptStatus } from '@/types'
import { useAccount } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { distributor } from '@/constants/distributor'
import { useToast } from '@/components/ui/use-toast'
import { useUsername } from '@/store'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLocation, useNavigate } from 'react-router-dom'

import { ReceiptDto } from '@/openapi/client'
import { usePendingClaimTasks } from '@/store/admin'
import RewardsTable from './_components/RewardsTable'

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

  const isLogin = !!address && !!github && !!chain

  useEffect(() => {
    if (!new URLSearchParams(location.search).has('type')) {
      const params = new URLSearchParams(location.search)
      params.set('type', type)
      navigate(`?${params.toString()}`, { replace: true })
    }
  }, [location.search, navigate, type])

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
