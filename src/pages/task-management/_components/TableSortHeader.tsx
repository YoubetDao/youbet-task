import { Button } from '@/components/ui/button'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import type { MouseEvent } from 'react'

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
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
    const filterSort = sort.filter((item) => item.field !== field)
    filterSort.push({
      field,
      value: selectSort,
    })
    onClick(filterSort)
  }
  console.log('sort:', sort, sort.length)

  const fdSort = sort.find((item) => item.field === field)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="focus:border-1 border-0">
          <div className="flex gap-2">
            {title}
            {sort.length && fdSort ? (
              fdSort.value === SortOrder.ASC ? (
                <ArrowUp className="relative top-0.5 h-4 w-4" />
              ) : (
                <ArrowDown className="relative top-0.5 h-4 w-4" />
              )
            ) : (
              <ChevronsUpDown className="relative left-2 top-0.5 h-4 w-4" />
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default TableSortHeader
