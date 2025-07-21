import { Button } from '@/components/ui/button'
import { ReceiptDto, ReceiptDtoStatusEnum } from '@/openapi/client'
import { usePendingClaimTasks } from '@/store/admin'
import { ReceiptStatus } from '@/types'

export const RewardStatus = ({
  status,
  isLogin,
  onClaim,
  isLoading,
  receipt,
}: {
  status: ReceiptDtoStatusEnum
  isLogin: boolean
  onClaim: () => void
  isLoading?: boolean
  receipt: ReceiptDto
}) => {
  const [pendingClaimTasks] = usePendingClaimTasks()
  const isPending = pendingClaimTasks.includes(receipt.source.period?._id || receipt.source.task?._id || '')

  if (!isLogin) {
    return <p>Please connect wallet</p>
  }

  if (isPending) {
    return <p className="text-orange-500">Pending</p>
  }

  if (status !== ReceiptStatus.GRANTED) {
    return <p>Claimed</p>
  }

  return (
    <Button
      variant="link"
      className={`gap-2 p-0 ${isLoading ? 'cursor-not-allowed text-gray-400' : 'text-blue-500 hover:text-blue-600'}`}
      disabled={isLoading}
      onClick={onClaim}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          Claiming...
        </span>
      ) : (
        'Claim'
      )}
    </Button>
  )
}
