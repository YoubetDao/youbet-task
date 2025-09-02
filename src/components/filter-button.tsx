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
import { cn } from '@/lib/utils'
import { GithubUser, Project } from '@/openapi/client'
import { CircleX, ListFilter } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export interface IData {
  name: string
  value: string
}
type OptionList = IData[] | Project[] | GithubUser[]

interface IConfigs {
  title: string
  data: OptionList
  get: IData[]
  set: React.Dispatch<React.SetStateAction<IData[]>>
  search: string | null
}

function isGithubUser(item: any): item is GithubUser {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.login === 'string' &&
    typeof item.avatarUrl === 'string' &&
    typeof item.htmlUrl === 'string'
  )
}
function isIData(item: any): item is IData {
  return typeof item === 'object' && item !== null && typeof item.name === 'string' && typeof item.value === 'string'
}

const CommandListComponent = ({ title, data, get, set, search }: IConfigs) => {
  const [inputValue, setInputValue] = useState<string>(search || '')
  const navigate = useNavigate()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      const searchParams = new URLSearchParams(location.search)
      searchParams.set(`${title}Search`, inputValue)
      navigate(`${location.pathname}?${searchParams.toString()}`)
    }, 500)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [inputValue, title, navigate])

  return (
    <Command className="max-h-48 overflow-y-auto">
      <CommandInput placeholder={`Search ${title}...`} value={inputValue} onValueChange={setInputValue} />
      <CommandList>
        {data.map((item) => {
          const isAssignees = isGithubUser(item)
          const isData = isIData(item)
          const getKey = isAssignees ? item.login : item.name
          const setKey = isAssignees ? item.login : isData ? item.value : item._id

          return (
            <CommandItem
              key={getKey}
              value={getKey}
              onSelect={() => {
                set((prev) =>
                  prev.map((p) => p.value).includes(setKey)
                    ? prev.filter((item) => item.value !== setKey)
                    : [...prev, { name: getKey, value: setKey }],
                )
              }}
            >
              <Checkbox
                value={setKey}
                checked={get.map((getItem) => getItem.value).includes(setKey)}
                id={setKey}
                onChange={(e: React.FormEvent<HTMLButtonElement>) => {
                  const value = (e.target as HTMLInputElement).value
                  set((prev) =>
                    prev.map((p) => p.value).includes(value)
                      ? prev.filter((item) => item.value !== value)
                      : [...prev, { name: getKey, value: value }],
                  )
                }}
              />
              <label
                htmlFor={getKey}
                className="flex text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {isAssignees ? (
                  <img
                    key={item.login}
                    className="mr-2 h-6 w-6 rounded-full border-2 border-white"
                    src={item.avatarUrl}
                    alt={item.login}
                  />
                ) : null}
                <div
                  className={cn({
                    'pt-1': isAssignees,
                  })}
                >
                  {getKey}
                </div>
              </label>
            </CommandItem>
          )
        })}
      </CommandList>
    </Command>
  )
}
const MutiDropdownMenuSub = ({ title, data, get, set, search }: IConfigs) => {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{title}</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <CommandListComponent title={title} data={data} get={get} set={set} search={search} />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

const DisplayButton = ({ title, data, get, set, search }: IConfigs) => {
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
        <CommandListComponent title={title} data={data} get={get} set={set} search={search} />
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
            search={config.search}
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
              search={config.search}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
