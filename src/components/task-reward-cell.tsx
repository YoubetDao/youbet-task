import React from 'react'
import { GithubUser } from '@/openapi/client'
import { Button } from '@/components/ui/button'
import { PencilLine } from 'lucide-react'
import { RewardDialogForm } from '@/pages/period/reward-form'
import { paymentChain } from '@/constants/data'
import type { Chain } from 'viem'

interface TaskRewardCellProps {
  id: string
  isGranted: boolean
  isClaimed?: boolean
  users: GithubUser[]
  defaultAmount?: number
  address?: `0x${string}`
  chain?: Chain
  tokenError: Error | null
  tokenLoading: boolean
  hasAllowance: boolean | null
  userName?: string
  pendingGrantTasks: string[]
  switchChain: (params: { chainId: number }) => void
  approveAllowance: () => Promise<void>
}

export function TaskRewardCell({
  id,
  isGranted,
  isClaimed,
  users,
  defaultAmount,
  address,
  chain,
  tokenError,
  tokenLoading,
  hasAllowance,
  userName,
  pendingGrantTasks,
  switchChain,
  approveAllowance,
}: TaskRewardCellProps) {
  // 如果奖励已经被认领
  if (isClaimed) {
    return <p>Claimed</p>
  }

  if (isGranted) {
    return <p>Granted</p>
  }

  if (pendingGrantTasks.includes(id)) {
    return <p>Pending</p>
  }

  // 检查是否满足授予奖励的条件
  if (address && chain && !tokenError && !tokenLoading && hasAllowance !== null) {
    // 如果有允许额度，显示授予奖励的对话框
    if (hasAllowance) {
      return (
        <RewardDialogForm
          trigger={
            <Button variant="link" className="gap-2 p-0 text-blue-500">
              <PencilLine size={15} />
              Grant
            </Button>
          }
          id={id}
          creatorId={userName!}
          users={users}
          addressFrom={address}
          chain={chain}
          defaultAmount={defaultAmount}
          sourceType="task"
        />
      )
    } else {
      // 没有允许额度，显示批准合约按钮
      return (
        <Button
          variant="link"
          className="gap-2 p-0 text-blue-500"
          onClick={async () => {
            switchChain({ chainId: paymentChain.id })
            await approveAllowance()
          }}
        >
          Approve Contract
        </Button>
      )
    }
  }
  // 条件不满足时返回空
  return null
}
