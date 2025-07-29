import React, { useEffect, useState } from 'react'
import { erc20TransfersApi } from '@/service'

// Define the ERC20Transfer interface based on the backend schema
interface ERC20Transfer {
  hash?: string
  blockNumber?: number
  timestamp?: string | Date
  blockHash?: string
  from?: string
  to?: string
  contractAddress?: string
  value?: string
  tokenName?: string
  tokenSymbol?: string
  tokenDecimal?: number
  transactionIndex?: number
  gas?: string
  gasPrice?: string
  gasUsed?: string
  cumulativeGasUsed?: string
  input?: string
  nonce?: number
  confirmations?: number
  syncStatus?: string
}
import { LoadingCards } from '@/components/loading-cards'
import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, CoinsIcon, ReceiptIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import PaginationFast from '@/components/pagination-fast'

const DEFAULT_PAGE_SIZE = 20

function ExpenseManagement(): React.ReactElement {
  const { address } = useAccount()
  const [page, setPage] = useState(1)
  const [fromAddress, setFromAddress] = useState<string>('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const pageSize = DEFAULT_PAGE_SIZE

  // Set current wallet address as default and update when wallet changes
  useEffect(() => {
    if (address) {
      setFromAddress(address)
    }
  }, [address])

  // Query for statistics
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ['erc20-stats', fromAddress, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      if (!fromAddress) return null

      const response = await erc20TransfersApi.eRC20TransferControllerGetStats(
        fromAddress,
        undefined,
        dateRange?.from?.toISOString(),
        dateRange?.to?.toISOString(),
      )
      return response.data
    },
    enabled: !!fromAddress,
    staleTime: 30000, // 30 seconds
  })

  // Query for transfer list
  const {
    data: transfersData,
    isLoading: transfersLoading,
    error: transfersError,
  } = useQuery({
    queryKey: [
      'erc20-transfers',
      fromAddress,
      dateRange?.from?.toISOString(),
      dateRange?.to?.toISOString(),
      page,
      pageSize,
    ],
    queryFn: async () => {
      if (!fromAddress) return null

      // For transfers endpoint, we'll filter by getting all transfers first
      // and implement our own date filtering since the endpoint doesn't support time filters
      const response = await erc20TransfersApi.eRC20TransferControllerGetTransfers(
        fromAddress,
        undefined,
        (page - 1) * pageSize,
        pageSize,
      )
      return response.data
    },
    enabled: !!fromAddress,
    staleTime: 30000,
  })

  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const renderStatsCards = () => {
    if (statsLoading && fromAddress) {
      return <LoadingCards count={4} />
    }

    // Always show the first card, even when no data
    const topTokens = statsData?.sentTokenValues?.slice(0, 3) || []
    const sentCount = statsData?.sentCount || 0

    // Calculate number of cards to show (1 for total + actual top tokens)
    const cardsToShow = 1 + topTokens.length

    return (
      <div
        className={`grid gap-4 ${
          cardsToShow === 2 ? 'md:grid-cols-2' : cardsToShow === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {/* Total Transactions Card - Always show */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentCount}</div>
            <p className="text-xs text-muted-foreground">Total payments made</p>
          </CardContent>
        </Card>

        {/* Top Token Cards - only render if they exist */}
        {topTokens.map((token, index) => (
          <Card key={token.contractAddress}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                #{index + 1} {token.tokenSymbol}
              </CardTitle>
              <CoinsIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parseFloat(token.formattedValue).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{token.transferCount} transactions</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderTransfersTable = () => {
    if (transfersLoading && fromAddress) {
      return <LoadingCards count={1} />
    }

    const transfers = (transfersData?.data || []) as ERC20Transfer[]

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Transaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transfers.map((transfer) => (
                <TableRow key={transfer.hash || Math.random()}>
                  <TableCell>
                    {transfer.timestamp
                      ? new Date(transfer.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{formatAddress(transfer.to || '')}</code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{transfer.tokenSymbol || '-'}</span>
                      <span className="text-xs text-muted-foreground">{transfer.tokenName || ''}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {transfer.value && transfer.tokenDecimal
                      ? parseFloat(
                          (BigInt(transfer.value) / BigInt(10 ** transfer.tokenDecimal)).toString(),
                        ).toLocaleString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://etherscan.io/tx/${transfer.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-blue-600 hover:text-blue-800"
                    >
                      {formatAddress(transfer.hash || '')}
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex justify-items-start space-x-4">
        <Input
          placeholder="From Wallet Address (0x...)"
          value={fromAddress}
          onChange={(e) => setFromAddress(e.target.value)}
          className="max-w-sm"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn('justify-start text-left font-normal', !dateRange && 'text-muted-foreground')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        {dateRange && (
          <Button variant="outline" size="sm" onClick={() => setDateRange(undefined)}>
            Clear Date Range
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      {renderStatsCards()}

      {/* Transfers Table */}
      {renderTransfersTable()}

      {/* Pagination */}
      <PaginationFast page={page} totalPages={transfersData?.pagination?.totalPages || 0} onPageChange={setPage} />
    </div>
  )
}

export default ExpenseManagement
