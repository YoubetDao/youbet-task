import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSwitchChain } from 'wagmi'
import { Chain } from 'viem'
import { useToast } from '@/components/ui/use-toast'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Dialog } from '@radix-ui/react-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { paymentChain } from '@/constants/data'
import { distributor } from '@/constants/distributor'

import _ from 'lodash'
import { useDistributorToken } from '@/hooks/useDistributorToken'
import { useQueryClient } from '@tanstack/react-query'
import { GithubUser } from '@/openapi/client'
import { usePendingGrantTasks, usePendingGrantPeriods } from '@/store/admin'

function randomDistribute(amount: number, people: number): number[] {
  const points = _.sortBy(_.times(people - 1, () => Math.random()))
  points.push(1)
  points.unshift(0)

  const amounts = points
    .slice(1)
    .map((point, index) => point - points[index])
    .map((fraction) => _.round(amount * fraction, 2))

  const diff = _.round(amount - _.sum(amounts), 2)
  amounts[amounts.length - 1] += diff

  return amounts
}

const formSchema = z.object({
  amount: z.string().regex(/^(0|[1-9]\d*)(\.\d+)?$/, {
    message: 'Amount must be a positive number',
  }),
  coin: z.string().min(1, { message: 'Coin is required' }),
})

interface IRewardForm {
  trigger: React.ReactNode
  id: string
  creatorId: string
  addressFrom: `0x${string}`
  users: GithubUser[]
  chain: Chain
  onRewardDistributed?: (data: {
    id: string
    amounts: number[]
    users: GithubUser[]
    symbol: string
    decimals: number
  }) => Promise<void>
  defaultAmount?: number
  sourceType: string
}

export const RewardDialogForm = ({
  trigger,
  id,
  creatorId,
  users,
  addressFrom,
  chain,
  defaultAmount,
  sourceType,
}: IRewardForm) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const { switchChain } = useSwitchChain()
  const chains = [paymentChain]
  const [amounts, setAmounts] = useState<number[]>(Array(users.length).fill(0.0))
  const { symbol, decimals } = useDistributorToken()
  const queryClient = useQueryClient()
  const [pendingGrantTasks, setPendingGrantTasks] = usePendingGrantTasks()
  const [pendingGrantPeriods, setPendingGrantPeriods] = usePendingGrantPeriods()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coin: symbol,
      amount: defaultAmount ? defaultAmount?.toString() : '',
    },
  })

  React.useEffect(() => {
    if (defaultAmount) {
      setAmounts(randomDistribute(defaultAmount, users.length))
    }
  }, [defaultAmount, users.length])

  const onOpenChange = async (isOpen: boolean) => {
    if (!isOpen) {
      switchChain({ chainId: paymentChain.id })
    }

    setOpen(isOpen)
  }

  const onSubmit = async () => {
    setLoading(true)
    try {
      // TODO: some github name is login, some is username in backend
      const githubIds = users.map((user) => user.login)
      const amountsInWei = amounts.map((amount) => BigInt(Math.floor(amount * 10 ** Number(decimals))))

      const totalAmount = amountsInWei.reduce((a, b) => a + b, 0n)
      const currentAllowance = await distributor.getAllowance(addressFrom)
      const [symbol, tokenDecimals] = await distributor.getTokenSymbolAndDecimals()
      const MIN_ALLOWANCE = BigInt(50) * BigInt(10) ** tokenDecimals
      if (currentAllowance < totalAmount) {
        await distributor.approveAllowance(MIN_ALLOWANCE * BigInt(10))
      }

      await distributor.createRedPacket(id, githubIds, amountsInWei, creatorId, sourceType)

      //update pendingGrantTasks
      if (sourceType === 'task') {
        setPendingGrantTasks([...pendingGrantTasks, id])
      } else if (sourceType === 'period') {
        setPendingGrantPeriods([...pendingGrantPeriods, id])
      }

      setOpen(false)

      if (sourceType === 'task') {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
      } else if (sourceType === 'period') {
        queryClient.invalidateQueries({ queryKey: ['periods'] })
      }

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent aria-describedby={undefined}>
        <Form {...form}>
          {!loading ? (
            <>
              <DialogTitle className="flex gap-5 text-xl">
                <p>Reward</p>
              </DialogTitle>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-8">
                  <section className="flex items-start gap-2">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <section className="flex items-center">
                            <FormLabel className="w-20 flex-shrink-0 text-white">Amount</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter reward amount"
                                autoComplete="off"
                                {...field}
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  field.onChange(newValue)
                                  setAmounts(randomDistribute(Number(newValue), users.length))
                                }}
                                value={field.value || ''}
                              />
                            </FormControl>
                          </section>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="coin"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value || symbol}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a verified email to display" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={symbol}>{symbol}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>
                  <section className="flex flex-col">
                    {users.map((user, index) => {
                      return (
                        <div key={user.login} className="flex flex-row items-center gap-2">
                          <img
                            key={user.login}
                            className="h-6 w-6 rounded-full border-2 border-white"
                            src={user.avatarUrl}
                            alt={user.login}
                          />
                          <span className="text-sm text-muted-foreground">{user?.login}</span>
                        </div>
                      )
                    })}
                  </section>

                  <FormDescription className="flex items-center">
                    <Label className="w-20 flex-shrink-0 text-white">Chain</Label>
                    <Select
                      defaultValue={`${chain.id}`}
                      onValueChange={(value) => {
                        switchChain({ chainId: Number(value) })
                        form.setValue('coin', symbol)
                      }}
                    >
                      <SelectTrigger>
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
                  </FormDescription>
                </div>
                <DialogFooter className="flex flex-1 justify-end pt-4">
                  <Button
                    variant="secondary"
                    type="submit"
                    disabled={loading}
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
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
              <div className="relative">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-background" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Processing Transaction</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please wait while we process your reward distribution...
                </p>
              </div>
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}
