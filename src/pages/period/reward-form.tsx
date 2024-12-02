import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useConfig, useSendTransaction, useSwitchChain, useWriteContract } from 'wagmi'
import { Chain } from 'viem'
import { useToast } from '@/components/ui/use-toast'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Dialog } from '@radix-ui/react-dialog'
import { postGrantAggregationRewards } from '@/service'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { PAYMENT_USDT_ADDRESS, USDT_ABI, USDT_DECIMAL, USDT_SYMBOL } from '@/constants/contracts/usdt'
import { paymentChain } from '@/constants/data'
import { User } from '@/types'

import _ from 'lodash'

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
  addressFrom: `0x${string}`
  users: User[]
  chain: Chain
}

export const RewardDialogForm = ({ trigger, id, users, addressFrom, chain }: IRewardForm) => {
  const { toast } = useToast()
  const { sendTransactionAsync } = useSendTransaction()
  const [loading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const { switchChain } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()
  const { chains } = useConfig()
  const [amounts, setAmounts] = useState<number[]>(Array(users.length).fill(0.0))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coin: USDT_SYMBOL,
    },
  })

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      switchChain({ chainId: paymentChain.id })
    }

    setOpen(isOpen)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      let transactions: `0x${string}`[] = []
      if (values.coin !== USDT_SYMBOL) {
        transactions = await Promise.all(
          users.map(
            async (user, index) =>
              await sendTransactionAsync({
                to: user.wallet?.address as `0x${string}`,
                value: BigInt(amounts[index]),
              }),
          ),
        )
      } else {
        transactions = await Promise.all(
          users.map(
            async (user, index) =>
              await writeContractAsync({
                abi: USDT_ABI,
                address: PAYMENT_USDT_ADDRESS,
                functionName: 'transfer',
                args: [user.wallet?.address, amounts[index] * Math.pow(10, USDT_DECIMAL)],
              }),
          ),
        )
      }

      await postGrantAggregationRewards({ id })

      setOpen(false)

      toast({
        variant: 'default',
        title: 'Success',
        description: 'Success reward',
      })
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.name,
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
                          <Select onValueChange={field.onChange} value={field.value || USDT_SYMBOL}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a verified email to display" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={chain.nativeCurrency.symbol}>{chain.nativeCurrency.symbol}</SelectItem>
                              <SelectItem value={USDT_SYMBOL}>{USDT_SYMBOL}</SelectItem>
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
                        <div key={user._id} className="flex flex-row items-center gap-2">
                          <img
                            key={user._id}
                            className="h-6 w-6 rounded-full border-2 border-white"
                            src={user.avatarUrl}
                            alt={user._id}
                          />
                          <span className="text-sm text-muted-foreground">{user?.wallet?.address}</span>
                          <span className="text-sm text-muted-foreground">{amounts[index]}</span>
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
                        form.setValue('coin', USDT_SYMBOL)
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
                  <Button variant="secondary" type="submit">
                    Submit
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="m-28 h-48 w-48 animate-spin rounded-full border-8 border-solid border-slate-500 border-t-transparent" />
            </div>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}
