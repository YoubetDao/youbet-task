import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { CircleDollarSign, PencilLine } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { taskApi } from '@/service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { distributor } from '@/constants/distributor'
import { USDT_DECIMAL, USDT_SYMBOL } from '@/constants/contracts/usdt'
import { useTask } from '../_hooks'
import { formatAmount, parseAmount, renderLevel, renderPriority } from '../_constants'
import ButtonGroup from './ButtonGroup'
export default function QuestLog({ createUser }: { createUser: string }) {
  const { githubId = '' } = useParams()
  const { data: task } = useTask(githubId)
  const queryClient = useQueryClient()
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

  if (task == null) {
    return null
  }

  return (
    <div className="flex flex-shrink-0 basis-96 flex-col">
      <ButtonGroup createUser={createUser} rewardAmount={rewardAmount} />
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
