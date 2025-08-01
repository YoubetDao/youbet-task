import React, { useState } from 'react'
import { ReceiptStatus } from '@/types'
import PaginationFast from '@/components/pagination-fast'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { receiptApi } from '@/service'
import { useQuery } from '@tanstack/react-query'
import { PAGESIZE } from '@/constants/contracts/request'

interface DrawerDetailProps {
  selectedPeriodId: string
  isDetailOpen: boolean
  setIsDetailOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DrawerDetail: React.FC<DrawerDetailProps> = ({ selectedPeriodId, isDetailOpen, setIsDetailOpen }) => {
  const [receiptPage, setReceiptPage] = useState(1)
  const receiptPageSize = PAGESIZE
  const { data: periodReceipts, isLoading: isDetailLoading } = useQuery({
    queryKey: ['periodReceipts', selectedPeriodId],
    queryFn: () => {
      return receiptApi.receiptControllerGetReceiptsByPeriodId(selectedPeriodId, 0, 10).then((res) => res.data)
    },
    enabled: !!selectedPeriodId,
  })
  const totalReceiptsPage = Math.ceil((periodReceipts?.pagination?.totalCount || 0) / receiptPageSize)
  return (
    <Drawer open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Period Details</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          {isDetailLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : periodReceipts ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {periodReceipts.data?.map((periodReceipt) => {
                    return (
                      <TableRow key={periodReceipt._id}>
                        <TableCell className="font-medium">{periodReceipt.user}</TableCell>
                        <TableCell>
                          {periodReceipt.status == ReceiptStatus.CLAIMED
                            ? `${periodReceipt.detail.amount} ${periodReceipt.detail.symbol}`
                            : '***'}
                        </TableCell>
                        <TableCell>{periodReceipt.status}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No details available</p>
          )}
          <PaginationFast page={receiptPage} totalPages={totalReceiptsPage} onPageChange={setReceiptPage} />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default DrawerDetail
