import React, { useState } from 'react'
import { claimReceipt, fetchReceipts, getRewardSignature } from '@/service'
import { IResultPaginationData, Receipt, ReceiptStatus } from '@/types'
import { LoadingCards } from '@/components/loading-cards'
import { useAccount } from 'wagmi'
import PaginationFast from '@/components/pagination-fast'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { distributor } from '@/constants/distributor'
import { toast } from '@/components/ui/use-toast'
import { useAtom } from 'jotai'
import { usernameAtom } from '@/store'
import { formatDate } from '@/lib/utils'

function RewardsTable(): React.ReactElement {
  const [page, setPage] = useState(1)
  const [github] = useAtom(usernameAtom)
  const { address, chain } = useAccount()
  const pageSize = 10
  const queryClient = useQueryClient()

  const { data: periods, isLoading: isPullRequestsLoading } = useQuery<IResultPaginationData<Receipt> | undefined>({
    queryKey: ['receipts'],
    queryFn: () => {
      return fetchReceipts({
        offset: (page - 1) * pageSize,
        limit: pageSize,
      })
    },
  })

  const totalPages = Math.ceil((periods?.pagination.totalCount || 0) / pageSize)

  return (
    <div className="space-y-4">
      {!isPullRequestsLoading && periods ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">Period</TableHead>
              <TableHead className="text-gray-400">Amount</TableHead>
              <TableHead className="text-gray-400">Reward</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods.data.map((receipts) => {
              return (
                <TableRow key={receipts._id}>
                  <TableCell>
                    {formatDate(receipts.source.period?.from)} - {formatDate(receipts.source.period?.to)}
                  </TableCell>
                  <TableCell>
                    {receipts.status == ReceiptStatus.CLAIMED
                      ? `${receipts.detail.amount} ${receipts.detail.symbol}`
                      : '***'}
                  </TableCell>
                  <TableCell>
                    {receipts.source.period ? (
                      receipts.status === ReceiptStatus.GRANTED ? (
                        address && github && chain ? (
                          <Button
                            variant="link"
                            className="gap-2 p-0 text-blue-500"
                            onClick={async () => {
                              if (!receipts.source.period) return
                              try {
                                const signature = await getRewardSignature(receipts.source.period._id)
                                await distributor.claimRedPacket(
                                  receipts.source.period._id,
                                  github,
                                  signature.signature,
                                )
                                await claimReceipt(receipts._id)
                                queryClient.invalidateQueries({ queryKey: ['receipts'] })
                                toast({
                                  title: 'Success',
                                  description: 'Reward claimed successfully',
                                })
                              } catch (error) {
                                toast({
                                  variant: 'destructive',
                                  title: 'Error',
                                  description: error instanceof Error ? error.message : 'Failed to claim reward',
                                })
                              }
                            }}
                          >
                            Claim
                          </Button>
                        ) : (
                          <p>Please connect wallet</p>
                        )
                      ) : (
                        <p>Claimed</p>
                      )
                    ) : (
                      <p>Not Supported</p>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <LoadingCards />
      )}

      <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

export default function MyRewards() {
  return <RewardsTable />
}
