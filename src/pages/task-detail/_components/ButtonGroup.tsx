import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ShareButton } from '@/components/share-button'
import { useMyApplies, useTask } from '../_hooks'
import { taskApplyApi } from '@/service'

export default function ButtonGroup({ createUser, rewardAmount }: { createUser: string; rewardAmount: string }) {
  const { githubId = '' } = useParams()
  const { data: task } = useTask(githubId)
  const { data: myApplies = [], isLoading: isMyAppliesLoading } = useMyApplies(Number(githubId))
  const queryClient = useQueryClient()
  const { mutateAsync: applyTaskAsync, isPending: _isClaiming } = useMutation({
    mutationFn: (id: number) =>
      taskApplyApi.taskApplyControllerApplyTask({ taskGithubId: id, comment: 'I would like to claim this issue.' }),
  })
  const isClaiming = _isClaiming || isMyAppliesLoading
  const { mutateAsync: withdrawApplyAsync, isPending: _isWithdrawing } = useMutation({
    mutationFn: (id: string) => taskApplyApi.taskApplyControllerWithdrawApply(id),
  })
  const isWithdrawing = _isWithdrawing || isMyAppliesLoading

  const handleClaim = async () => {
    try {
      await applyTaskAsync(Number(githubId))
    } catch (error) {
      console.error('Error claiming task:', error)
    }
    queryClient.invalidateQueries({ queryKey: ['myApplies', githubId] })
  }

  const handleShare = () => {
    const url = encodeURIComponent(window.location.href) // 获取当前网页URL并编码
    const text = encodeURIComponent(
      rewardAmount
        ? `${createUser} shared an issue via According.Work!\nSolve this issue and earn ${rewardAmount} $ !\nJoin us, create value with your code, and get rewarded!\n`
        : `${createUser} shared an issue via According.Work!\nSolve this issue and earn EDU Yuzu Points!\nJoin us, create value with your code, and get rewarded!\n`,
    ) // 自定义分享文本
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`

    window.open(twitterShareUrl, '_blank') // 在新窗口中打开分享链接
  }
  const handleDisclaim = async () => {
    if (myApplies.length > 0) {
      await withdrawApplyAsync(myApplies[0]._id)
      queryClient.invalidateQueries({ queryKey: ['myApplies', githubId] })
    }
  }
  return (
    <div className="mt-2 flex items-center gap-2">
      {task?.state === 'closed' ? (
        <Button disabled className="border border-muted text-white hover:border-opacity-80 hover:bg-white/10">
          Closed
        </Button>
      ) : task?.assignee && task?.assignee?.login ? (
        <Button disabled className="border border-muted text-white hover:border-opacity-80 hover:bg-white/10">
          Assigned
        </Button>
      ) : myApplies.length == 0 ? (
        <Button
          disabled={isClaiming}
          onClick={handleClaim}
          variant="default"
          className="border border-muted text-white hover:border-opacity-80 hover:bg-white/10"
        >
          Apply
          {isClaiming && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      ) : (
        <Button
          disabled={isWithdrawing}
          onClick={handleDisclaim}
          variant="default"
          className="bg-gray-8/50 text-l border border-muted text-white hover:border-opacity-80 hover:bg-white/10"
        >
          Withdraw
          {isWithdrawing && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      )}
      <ShareButton
        onClick={handleShare}
        iconSize={14}
        variant="default"
        className="flex gap-1 border border-muted text-white hover:border-opacity-80 hover:bg-white/10"
      >
        Share
      </ShareButton>
    </div>
  )
}
