import React, { useEffect, useState } from 'react'
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
import { useUsername } from '@/store'
import { formatDate } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLocation, useNavigate } from 'react-router-dom'

function RewardsTable({ type }: { type: 'period' | 'task' }): React.ReactElement {
  const [page, setPage] = useState(1)
  const [github] = useUsername()
  const { address, chain } = useAccount()
  const pageSize = 10
  const queryClient = useQueryClient()

  const { data: periods, isLoading: isPullRequestsLoading } = useQuery<IResultPaginationData<Receipt> | undefined>({
    queryKey: ['receipts', type, page],
    queryFn: () => {
      return fetchReceipts({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        type,
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
              {type === 'period' ? (
                <TableHead className="text-gray-400">Period</TableHead>
              ) : (
                <TableHead className="text-gray-400">Task</TableHead>
              )}
              <TableHead className="text-gray-400">Amount</TableHead>
              <TableHead className="text-gray-400">Reward</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods.data.map((receipts) => {
              return (
                <TableRow key={receipts._id}>
                  <TableCell>
                    {type === 'period' ? (
                      <>
                        {formatDate(receipts.source.period?.from)} - {formatDate(receipts.source.period?.to)}
                      </>
                    ) : (
                      <div className="space-y-1">
                        <div>{receipts.source.task?.title}</div>
                        <a
                          href={receipts.source.task?.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-500 hover:text-blue-500"
                        >
                          {receipts.source.task?._id}
                        </a>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {receipts.status == ReceiptStatus.CLAIMED || type !== 'period'
                      ? `${receipts.detail.amount} ${receipts.detail.symbol}`
                      : '***'}
                  </TableCell>
                  <TableCell>
                    {receipts.status === ReceiptStatus.GRANTED ? (
                      address && github && chain ? (
                        <Button
                          variant="link"
                          className="gap-2 p-0 text-blue-500"
                          onClick={async () => {
                            if (!receipts.source.period && !receipts.source.task) return
                            const sourceId = receipts.source.period?._id || receipts.source.task?._id
                            if (!sourceId) return
                            try {
                              const signature = await getRewardSignature(sourceId)
                              await distributor.claimRedPacket(sourceId, github, signature.signature)
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
  const [type, setType] = useState<'period' | 'task'>('period')
  const navigate = useNavigate()
  const location = useLocation()

  const currentTab = new URLSearchParams(location.search).get('type') || type

  useEffect(() => {
    if (!new URLSearchParams(location.search).has('type')) {
      const params = new URLSearchParams(location.search)
      params.set('type', type)
      navigate(`?${params.toString()}`, { replace: true })
    }
  }, [location.search, navigate])

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(location.search)
    params.set('type', tab)
    navigate(`?${params.toString()}`)
    setType(tab as 'period' | 'task')
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="period" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="period">Period Rewards</TabsTrigger>
          <TabsTrigger value="task">Task Rewards</TabsTrigger>
        </TabsList>
      </Tabs>
      <RewardsTable type={type} />
    </div>
  )
}
