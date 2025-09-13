import { Button } from '@/components/ui/button'
import { ChevronsDown, ChevronsUp, ChevronsUpDown } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

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
  const handleClick = () => {
    const fdSort = sort.find((item) => item.field === field)

    let nextSortOrder: string

    if (!fdSort) {
      nextSortOrder = SortOrder.ASC
    } else if (fdSort.value === SortOrder.ASC) {
      nextSortOrder = SortOrder.DESC
    } else {
      nextSortOrder = SortOrder.CANCEL
    }

    if (nextSortOrder === SortOrder.CANCEL) {
      onClick([])
    } else {
      onClick([
        {
          field,
          value: nextSortOrder,
        },
      ])
    }
  }

  const fdSort = sort.find((item) => item.field === field)

  return (
    <Button className="focus:border-1 border-0" onClick={handleClick}>
      <div className="flex items-center gap-2">
        {title}
        {fdSort ? (
          fdSort.value === SortOrder.ASC ? (
            <ChevronsUp className="relative top-0.5 h-4 w-4 flex-shrink-0" />
          ) : (
            <ChevronsDown className="relative top-0.5 h-4 w-4 flex-shrink-0" />
          )
        ) : (
          <ChevronsUpDown className="relative left-2 top-0.5 h-4 w-4 flex-shrink-0" />
        )}
      </div>
    </Button>
  )
}
export default TableSortHeader
