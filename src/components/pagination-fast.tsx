import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

export default function PaginationFast({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const minTotalPages = Math.max(totalPages, 1)
  return (
    <div className="flex items-center justify-between text-sm text-gray-400">
      <div>
        Page {page} of {minTotalPages}
      </div>
      <div className="flex space-x-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="border-gray-700 bg-transparent text-gray-400 hover:bg-gray-800"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="border-gray-700 bg-transparent text-gray-400 hover:bg-gray-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(minTotalPages, page + 1))}
          disabled={page === minTotalPages}
          className="border-gray-700 bg-transparent text-gray-400 hover:bg-gray-800"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(minTotalPages)}
          disabled={page === minTotalPages}
          className="border-gray-700 bg-transparent text-gray-400 hover:bg-gray-800"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
