import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useConfig, useSendTransaction, useSwitchChain, useWriteContract } from 'wagmi'
import { Chain, parseEther } from 'viem'
import { useToast } from '@/components/ui/use-toast'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Dialog } from '@radix-ui/react-dialog'
import { postPrRewardInfo } from '@/service'
import { polygon } from 'viem/chains'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { POLYGON_USDT_ADDRESS, USDT_ABI, USDT_DECIMAL, USDT_SYMBOL } from '@/constants/contracts/usdt'

const formSchema = z.object({
  amount: z.string().regex(/^(0|[1-9]\d*)(\.\d+)?$/, {
    message: 'Amount must be a positive number',
  }),
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid Ethereum address' }),
  githubId: z.string().min(1, { message: 'GitHub ID is required' }),
  coin: z.string().min(1, { message: 'Coin is required' }),
})

interface IRewardForm {
  trigger: React.ReactNode
  prGithubId: number
  addressFrom: `0x${string}`
  chain: Chain
}

export const RewardDialogForm = ({ trigger, prGithubId, addressFrom, chain }: IRewardForm) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { sendTransactionAsync } = useSendTransaction()
  const [loading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const { switchChain } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()
  const { chains } = useConfig()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coin: USDT_SYMBOL,
    },
  })

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      switchChain({ chainId: polygon.id })
    }

    setOpen(isOpen)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      let transaction: `0x${string}` = '0x'

      if (values.coin !== USDT_SYMBOL) {
        transaction = await sendTransactionAsync({
          to: values.address as `0x${string}`,
          value: parseEther(values.amount),
        })
      } else {
        transaction = await writeContractAsync({
          abi: USDT_ABI,
          address: POLYGON_USDT_ADDRESS, // USDT contract address on Polygon
          functionName: 'transfer',
          args: [values.address, parseFloat(values.amount) * Math.pow(10, USDT_DECIMAL)],
        })
      }

      await postPrRewardInfo({
        recipientName: values.githubId,
        source: {
          pullRequestGithubId: prGithubId,
        },
        status: 'received',
        transactionInfo: {
          amount: parseFloat(values.amount),
          decimals: chain.nativeCurrency.decimals,
          from: addressFrom,
          network: chain.name,
          symbol: chain.nativeCurrency.symbol,
          to: values.address,
          transactionId: transaction,
        },
        type: 'Crypto',
      })

      setOpen(false)
      await queryClient.invalidateQueries(['pullRequests'])

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
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <section className="flex items-center">
                          <FormLabel className="w-20 flex-shrink-0 text-white">Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter wallet address"
                              autoComplete="off"
                              {...field}
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
                    name="githubId"
                    render={({ field }) => (
                      <FormItem>
                        <section className="flex items-center">
                          <FormLabel className="w-20 flex-shrink-0 text-white">GitHub ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter GitHub ID"
                              autoComplete="off"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                        </section>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
