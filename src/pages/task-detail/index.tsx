import { useMd } from '@/components/md-renderer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { CircleDollarSign, FilePenLine, Loader2, PencilLine } from 'lucide-react'
import UtterancesComments from './utterances-comments'
import { User } from '@/types'
import { useParams } from 'react-router-dom'
import { taskApplyApi, taskApi } from '@/service'
import { LoadingCards } from '@/components/loading-cards'
import ErrorPage from '../error'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { distributor } from '@/constants/distributor'
import { USDT_DECIMAL, USDT_SYMBOL } from '@/constants/contracts/usdt'
import { ShareButton } from '@/components/share-button'

type TaskDetailItem = {
  id: number
  title: string
  description: string
  createdAt: string
  updatedAt: string
  deadline: string
  assignee: User
  assignees: User[]
  reporter: User
  labels: { name: string; color: string }[]
  comments: number
  priority: 'P0' | 'P1' | 'P2'
  state: string
  level: 'Easy' | 'Medium' | 'Hard' | 'Legendary'
  relative: string[]
  htmlUrl: string
  rewards: number
}

const renderLevel = (level: TaskDetailItem['level']) => {
  switch (level) {
    case 'Easy':
      return (
        <Badge variant="outline" className="bg-green-500">
          Easy
        </Badge>
      )
    case 'Medium':
      return (
        <Badge variant="outline" className="bg-yellow-500">
          Medium
        </Badge>
      )
    case 'Hard':
      return (
        <Badge variant="outline" className="bg-red-500">
          Hard
        </Badge>
      )
    case 'Legendary':
      return (
        <Badge variant="outline" className="bg-purple-500">
          Legendary
        </Badge>
      )
    default:
      return null
  }
}

const renderPriority = (priority: TaskDetailItem['priority']) => {
  switch (priority) {
    case 'P0':
      return (
        <Badge variant="outline" className="bg-red-500">
          P0
        </Badge>
      )
    case 'P1':
      return (
        <Badge variant="outline" className="bg-green-500">
          P1
        </Badge>
      )
    case 'P2':
      return (
        <Badge variant="outline" className="bg-yellow-500">
          P2
        </Badge>
      )
    default:
      return null
  }
}

function QuestLog({ createUser }: { createUser: string }) {
  const { githubId = '' } = useParams()
  const { data: task } = useTask(githubId)
  const { data: myApplies = [], isLoading: isMyAppliesLoading } = useMyApplies(Number(githubId))
  const queryClient = useQueryClient()
  const { mutateAsync: applyTaskAsync, isLoading: _isClaiming } = useMutation({
    mutationFn: (id: number) =>
      taskApplyApi.taskApplyControllerApplyTask({ taskGithubId: id, comment: 'I would like to claim this issue.' }),
  })
  const isClaiming = _isClaiming || isMyAppliesLoading
  const { mutateAsync: withdrawApplyAsync, isLoading: _isWithdrawing } = useMutation({
    mutationFn: (id: string) => taskApplyApi.taskApplyControllerWithdrawApply(id),
  })
  const isWithdrawing = _isWithdrawing || isMyAppliesLoading
  const [isEditing, setIsEditing] = useState(false)
  const [rewardAmount, setRewardAmount] = useState<string>('')
  const [tokenInfo, setTokenInfo] = useState<{
    symbol: string
    decimals: number
    tokenAddress: string
  }>()

  useEffect(() => {
    const getTokenInfo = async () => {
      const [symbol, decimals] = await distributor.getTokenSymbolAndDecimals()
      const tokenAddress = await distributor.getTokenAddress()
      setTokenInfo({
        symbol,
        decimals: Number(decimals),
        tokenAddress,
      })
      console.log('tokenInfo', symbol, decimals, tokenAddress)
    }
    getTokenInfo()
  }, [])

  const formatAmount = (amount: number | undefined, decimals: number) => {
    if (amount === undefined) return 0
    return amount / Math.pow(10, decimals)
  }

  const parseAmount = (amount: string, decimals: number) => {
    return Math.floor(Number(amount) * Math.pow(10, decimals))
  }

  const { mutateAsync: updateReward, isLoading } = useMutation({
    mutationFn: (displayAmount: number) =>
      taskApi.taskControllerUpdateTask(Number(githubId), {
        reward: {
          amount: parseAmount(displayAmount.toString(), tokenInfo?.decimals || USDT_DECIMAL),
          decimals: tokenInfo?.decimals || USDT_DECIMAL,
          symbol: tokenInfo?.symbol || USDT_SYMBOL,
          tokenAddress: tokenInfo?.tokenAddress || '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        },
        // TODO: allow level be empty
        level: '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', githubId] })
      setIsEditing(false)
    },
  })

  const handleClaim = async () => {
    try {
      await applyTaskAsync(Number(githubId))
    } catch (error) {
      console.error('Error claiming task:', error)
    }
    queryClient.invalidateQueries({ queryKey: ['myApplies', githubId] })
  }

  const handleDisclaim = async () => {
    if (myApplies.length > 0) {
      await withdrawApplyAsync(myApplies[0]._id)
      queryClient.invalidateQueries({ queryKey: ['myApplies', githubId] })
    }
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

  if (task == null) {
    return null
  }

  return (
    <div className="flex flex-shrink-0 basis-96 flex-col">
      <div className="mt-2 flex items-center gap-2">
        {task.state === 'closed' ? (
          <Button disabled className="border border-muted text-white hover:border-opacity-80 hover:bg-white/10">
            Closed
          </Button>
        ) : task.assignee && task.assignee.login ? (
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
          iconSize={14}
          variant="default"
          className="flex gap-1 border border-muted text-white hover:border-opacity-80 hover:bg-white/10"
        >
          Share
        </ShareButton>
      </div>
      <Card className="sticky left-0 top-0 mt-4 bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between border-b border-muted py-4">
          <CardTitle className="relative justify-center text-2xl">Quest Log</CardTitle>
        </CardHeader>
        <CardContent className="mt-2 flex flex-col gap-y-4 font-serif">
          <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">Assignee</Label>
            {task.assignee && Object.keys(task.assignee).length > 0 && (
              <div className="flex flex-row items-center justify-between gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={task.assignee.avatarUrl} alt="Avatar" />
                  <AvatarFallback>{task.assignee.login.charAt(0)}</AvatarFallback>
                </Avatar>
                {task.assignee.login}
              </div>
            )}
          </div>
          <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">Rewards</Label>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Input
                    value={rewardAmount}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setRewardAmount(value)
                      }
                    }}
                    className="h-7 w-20"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateReward(Number(rewardAmount))
                      } else if (e.key === 'Escape') {
                        setIsEditing(false)
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 hover:bg-green-500/10"
                    onClick={() => updateReward(Number(rewardAmount))}
                    disabled={isLoading}
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 hover:bg-red-500/10"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex flex-row items-center gap-1">
                    <CircleDollarSign />
                    {formatAmount(task.reward?.amount, task.reward?.decimals || USDT_DECIMAL)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                      setRewardAmount(formatAmount(task.reward?.amount, tokenInfo?.decimals || USDT_DECIMAL).toString())
                      setIsEditing(true)
                    }}
                  >
                    <PencilLine className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">Created At</Label>
            <span className="flex flex-row items-center gap-1">{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">Level</Label>
            {renderLevel('Easy')}
          </div>
          <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">Priority</Label>
            {renderPriority('P0')}
          </div>

          <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">assignees</Label>
            <div className="flex flex-row items-center justify-between gap-2">
              {task.assignees.map((participant, index) => (
                <Avatar key={index} className="h-7 w-7">
                  <AvatarImage src={participant.avatarUrl} alt="Avatar" />
                  <AvatarFallback>{participant.login.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function useTask(githubId?: string) {
  return useQuery({
    queryKey: ['task', githubId],
    queryFn: () => taskApi.taskControllerGetTask(Number(githubId)).then((res) => res.data),
    enabled: !!githubId,
  })
}

function useMyApplies(githubId: number) {
  return useQuery({
    queryKey: ['myApplies', githubId],
    queryFn: () => taskApi.taskControllerMyTaskApply(githubId).then((res) => res.data),
    enabled: !!githubId,
  })
}

export default function TaskDetailPage() {
  const { githubId } = useParams()
  const { data: task, isInitialLoading: loading } = useTask(githubId)
  const { MdRenderer } = useMd(task?.body || '')

  if (loading) {
    return <LoadingCards />
  }

  if (task == null) {
    return <ErrorPage />
  }

  return (
    <div className="mt-5 flex w-full flex-col-reverse gap-5 xl:flex-row">
      <article className="flex w-full flex-col gap-5">
        <header>
          <h1 className="text-4xl font-bold">{task.title}</h1>
        </header>
        <div className="flex flex-row gap-3">
          {task.labelsWithColor &&
            task.labelsWithColor.length > 0 &&
            task.labelsWithColor.map((label, index) => (
              <Badge key={index} variant="outline" style={{ backgroundColor: label.color }}>
                {label.name}
              </Badge>
            ))}
        </div>
        <div className="flex w-full flex-row">
          <div className="mr-4 flex flex-1 flex-col items-start gap-10">
            <MdRenderer />
            <div className="flex w-full flex-row items-center justify-between">
              <Button variant="link" className="gap-3 text-blue-500">
                <FilePenLine className="h-5 w-5" />
                <a href={task.htmlUrl} target="_blank" rel="noopener noreferrer">
                  Edit it in Github
                </a>
              </Button>
              <span className="text-l text-slate-500">Updated At: {task.updatedAt}</span>
            </div>

            <div className="w-full">
              <UtterancesComments task={task} />
            </div>
          </div>
        </div>
      </article>

      <QuestLog createUser={task.user?.login || ''} />
    </div>
  )
}
