import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAccount, useSwitchChain } from 'wagmi'
import { paymentChain } from '@/constants/data'
import { Chain } from 'viem'
import { useDistributorToken } from '@/hooks/useDistributorToken'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GithubUser } from '@/openapi/client/models'
import { distributor } from '@/constants/distributor'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/use-toast'
import { usePendingGrantTasks } from '@/store/admin'

export interface RewardTask {
  users: GithubUser
  id: string
  amount: number
  decimals: number
  taskTitle: string
  creator: string
}

interface Props {
  trigger: React.ReactNode
  defaultRewardTasks: Array<RewardTask>
  rewardType: 'task' | 'period'
}

export const BatchGrantDialog = ({ defaultRewardTasks, rewardType, trigger }: Props) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { switchChain } = useSwitchChain()
  const { chain, address } = useAccount()
  const { symbol, decimals } = useDistributorToken()
  const [rewardTasks, setRewardTasks] = useState<Array<RewardTask>>(defaultRewardTasks)
  const queryClient = useQueryClient()
  const [pendingGrantTasks, setPendingGrantTasks] = usePendingGrantTasks()

  const chains = [paymentChain]

  //Submit batch grant
  const handleSubmit = async () => {
    if (loading) return
    try {
      setLoading(true)
      switchChain({ chainId: paymentChain.id }) //TODO: switch chain

      const totalAmount = rewardTasks.reduce(
        (acc, task) => acc + BigInt(Math.floor(task.amount * 10 ** Number(decimals))),
        0n,
      )

      const currentAllowance = await distributor.getAllowance(address!)
      const [, tokenDecimals] = await distributor.getTokenSymbolAndDecimals()

      const MIN_ALLOWANCE = BigInt(50) * BigInt(10) ** tokenDecimals

      if (currentAllowance < totalAmount) {
        await distributor.approveAllowance(MIN_ALLOWANCE * BigInt(10))
      }

      await distributor.batchCreateRedPacket(
        rewardTasks.map((task) => ({
          amounts: [BigInt(Math.floor(task.amount * 10 ** Number(decimals)))],
          githubIds: [task.users.login],
          uuid: task.id,
          creatorId: task.creator,
          sourceType: rewardType,
        })),
      )

      //update pendingGrantTasks
      setPendingGrantTasks([...pendingGrantTasks, ...rewardTasks.map((task) => task.id)])

      setOpen(false)

      queryClient.invalidateQueries({ queryKey: ['periods'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })

      toast({
        variant: 'default',
        title: 'Success',
        description: 'Reward Granted',
      })
    } catch (error) {
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
          description: 'An unknown error occurred',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setRewardTasks(defaultRewardTasks)
  }, [defaultRewardTasks])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent aria-describedby={undefined}>
        <DialogTitle className="flex gap-5 text-xl">
          <p>Batch Grant </p>
        </DialogTitle>

        <div className="my-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="text-white">Select Payment Chain</div>
            <Select
              defaultValue={`${chain?.id}`}
              onValueChange={(value) => {
                switchChain({ chainId: Number(value) })
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a Chain used for transfer" />
              </SelectTrigger>
              <SelectContent>
                {chains.map((chain: Chain) => {
                  return (
                    <SelectItem key={chain.id} value={`${chain.id}`}>
                      {chain.name}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-white">Select Token</div>
            <Select
              onValueChange={(value) => {
                // setRewardTasks(rewardTasks.map((t) => (t._id === task._id ? { ...t, symbol: value } : t))) TODO: update symbol
              }}
              value={symbol}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a Token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={symbol}>{symbol}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="mb-2 text-white">Reward Task</div>
          <div className="flex max-h-[300px] flex-col gap-4 overflow-y-auto">
            {rewardTasks.map((task) => {
              return (
                <div key={task.id} className="flex h-12 items-center justify-between gap-2 pr-2">
                  <div className="flex items-center gap-2">
                    <img
                      className="h-6 w-6 rounded-full border-2 border-white"
                      src={task.users.avatarUrl}
                      alt={task.users.login}
                    />
                    <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {task.taskTitle}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter Reward Amount"
                      autoComplete="off"
                      className="flex-1"
                      onChange={(e) => {
                        const newValue = e.target.value
                        setRewardTasks(
                          rewardTasks.map((t) => (t.id === task.id ? { ...t, amount: Number(newValue) } : t)),
                        )
                      }}
                      value={task.amount}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <DialogFooter className="flex flex-1 justify-end pt-4">
          <Button
            disabled={loading}
            variant="secondary"
            type="submit"
            onClick={handleSubmit}
            className={loading ? 'cursor-not-allowed opacity-50' : ''}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Processing...</span>
              </div>
            ) : (
              'Submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
