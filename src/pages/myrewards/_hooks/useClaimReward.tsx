import { useCallback, useState } from 'react'
import { ReceiptDto } from '@/openapi/client'
import { usePendingClaimTasks } from '@/store/admin'
import { rewardApi } from '@/service'
import { distributor } from '@/constants/distributor'
import { toast } from '@/components/ui/use-toast'

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
    [github, pendingClaimTasks, queryClient, setPendingClaimTasks],
  )

  return {
    handleClaim,
    isClaiming: (id: string) => claimingId === id,
  }
}

// 添加领取处理函数
export default useClaimReward
