import { Button } from '@/components/ui/button'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { ArrowDown, ArrowUp, ChevronsUpDown, X } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import type { MouseEvent } from 'react'

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
  CANCEL = 'cancel',
}
export interface ISort {
  field: string
  value: string
}
interface ITableSortHeaderProps {
  title: string
  sort: ISort[]
  onClick: Dispatch<SetStateAction<ISort[]>>
  field: string
}

const TableSortHeader = ({ title, sort, onClick, field }: ITableSortHeaderProps) => {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const selectSort = e.currentTarget.dataset.sort as string
    console.log('selectSort', selectSort)
    const filterSort = sort.filter((item) => item.field !== field)
    if (selectSort !== SortOrder.CANCEL) {
      filterSort.push({
        field,
        value: selectSort,
      })
    }
    onClick(filterSort)
  }

  const fdSort = sort.find((item) => item.field === field)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="focus:border-1 border-0">
          <div className="flex items-center gap-2">
            {title}
            {sort.length && fdSort ? (
              fdSort.value === SortOrder.ASC ? (
                <ArrowUp className="relative top-0.5 h-4 w-4 flex-shrink-0" />
              ) : fdSort.value === SortOrder.DESC ? (
                <ArrowDown className="relative top-0.5 h-4 w-4 flex-shrink-0" />
              ) : fdSort.value === SortOrder.CANCEL ? (
                <X className="relative top-0.5 h-4 w-4 flex-shrink-0" />
              ) : (
                ''
              )
            ) : (
              <ChevronsUpDown className="relative left-2 top-0.5 h-4 w-4 flex-shrink-0" />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-background">
        <DropdownMenuItem onClick={handleClick} data-sort={SortOrder.ASC}>
          <div className="flex gap-2">
            <ArrowUp className="relative top-0.5 h-4 w-4" /> Asc
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClick} data-sort={SortOrder.DESC}>
          <div className="flex gap-2">
            <ArrowDown className="relative top-0.5 h-4 w-4" /> Desc
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClick} data-sort={SortOrder.CANCEL}>
          <div className="flex gap-2">
            <X className="relative top-0.5 h-4 w-4" /> Cancel
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default TableSortHeader
