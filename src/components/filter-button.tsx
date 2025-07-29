import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Project } from '@/openapi/client'
import { CircleX, ListFilter } from 'lucide-react'

export interface IData {
  name: string
  value: string
}
type OptionList = IData[] | Project[]

interface IConfigs {
  title: string
  data: OptionList
  get: IData[]
  set: React.Dispatch<React.SetStateAction<IData[]>>
}

const CommandListComponent = ({ title, data, get, set }: IConfigs) => {
  return (
    <Command className="max-h-48 overflow-y-auto">
      {data.length > 5 ? <CommandInput placeholder={`Search ${title}...`} /> : null}
      <CommandList>
        {data.map((x) => (
          <CommandItem
            key={x.name}
            value={x.name}
            onSelect={(value) => {
              set((prev) =>
                prev.map((p) => p.value).includes('_id' in x ? x._id : x.value)
                  ? prev.filter((item) => item.value !== ('_id' in x ? x._id : x.value))
                  : [...prev, { name: x.name, value: '_id' in x ? x._id : x.value }],
              )
            }}
          >
            <Checkbox
              value={'_id' in x ? x._id : x.value}
              checked={get.map((x) => x.value).includes('_id' in x ? x._id : x.value)}
              id={'_id' in x ? x._id : x.value}
              onChange={(e: React.FormEvent<HTMLButtonElement>) => {
                const value = (e.target as HTMLInputElement).value
                set((prev) =>
                  prev.map((p) => p.value).includes(value)
                    ? prev.filter((item) => item.value !== value)
                    : [...prev, { name: x.name, value: value }],
                )
              }}
            />
            <label
              htmlFor={x.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {x.name}
            </label>
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  )
}
const MutiDropdownMenuSub = ({ title, data, get, set }: IConfigs) => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{title}</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <CommandListComponent title={title} data={data} get={get} set={set} />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

const DisplayButton = ({ title, data, get, set }: IConfigs) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="group mr-4 max-w-[300px] justify-start space-x-2">
          {title}
          {get.length > 0 && <Separator orientation="vertical" className="mx-2" />}
          {get.length > 0 && `${get.length} ${title}`}
          <CircleX className="h-3" onClick={() => set([])} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" side="bottom" align="start">
        <CommandListComponent title={title} data={data} get={get} set={set} />
      </PopoverContent>
    </Popover>
  )
}

const options = {
  multi: MutiDropdownMenuSub,
}

export default function FilterButton({ configs }: { configs: IConfigs[] }) {
  return (
    <div className="flex">
      {configs.map((config, index) => {
        return config.get.length ? (
          <DisplayButton
            key={config.title}
            title={config.title}
            data={config.data ?? []}
            get={config.get}
            set={config.set}
          />
        ) : null
      })}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="group max-w-[300px] cursor-pointer justify-start space-x-2">
            <ListFilter className="h-4 w-4 text-gray-500 group-hover:text-white group-focus:text-white" />
            <span>Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" sideOffset={4}>
          {configs.map((config, index) => (
            <options.multi
              key={config.title}
              title={config.title}
              data={config.data ?? []}
              get={config.get}
              set={config.set}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
