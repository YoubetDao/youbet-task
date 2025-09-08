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
import { cn, formatDateToDay } from '@/lib/utils'
import { GithubUser, Project } from '@/openapi/client'
import { subDays, subMonths, subYears } from 'date-fns'
import { CircleX, ListFilter } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { Calendar } from './ui/calendar'

export interface IData {
  name: string
  value: string
}

type OptionList = IData[] | Project[] | GithubUser[]

const options = {
  multi: MultiCommandListComponent,
  date: DateRangeDropdownMenuSub,
}
type OptionType = 'multi' | 'date'

export interface IConfigs {
  type: OptionType
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

const changeURLParams = (navigate: NavigateFunction, key: string, value: string) => {
  const searchParams = new URLSearchParams(location.search)
  searchParams.set(key, value)
  navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true })
}

function MultiCommandListComponent({ title, data, get, set, search }: IConfigs) {
  const [inputValue, setInputValue] = useState<string>(search || '')
  const navigate = useNavigate()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current =
      search !== null
        ? setTimeout(() => {
            changeURLParams(navigate, `${title}Search`, inputValue)
          }, 500)
        : null

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
                const val = get.map((p) => p.value).includes(setKey)
                  ? get.filter((item) => item.value !== setKey)
                  : [...get, { name: getKey, value: setKey }]

                changeURLParams(navigate, `${title}`, val.map((v) => v.value).join(','))
                set(val)
              }}
            >
              <Checkbox value={setKey} checked={get.map((getItem) => getItem.value).includes(setKey)} id={setKey} />
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
const DropdownMenuSubComponent = ({ type, title, data, get, set, search }: IConfigs) => {
  const Component = options[type]
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{title}</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <Component title={title} data={data} get={get} set={set} search={search} type={type} />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

export const dateOptions = [
  { name: '1 day ago', value: [subDays(new Date(), 1), new Date()] },
  {
    name: '3 days ago',
    value: [subDays(new Date(), 3), new Date()],
  },
  {
    name: '1 week ago',
    value: [subDays(new Date(), 7), new Date()],
  },
  {
    name: '1 month ago',
    value: [subMonths(new Date(), 1), new Date()],
  },
  {
    name: '3 months ago',
    value: [subMonths(new Date(), 3), new Date()],
  },
  {
    name: '6 months ago',
    value: [subMonths(new Date(), 6), new Date()],
  },
  {
    name: '1 year ago',
    value: [subYears(new Date(), 1), new Date()],
  },
  {
    name: 'custom date',
    value: [],
  },
]

function DateRangeDropdownMenuSub({ title, data, get, set, search }: IConfigs) {
  const navigate = useNavigate()
  return (
    <Command className="max-h-48 overflow-y-auto">
      <CommandInput placeholder={`Search ${title}...`} />
      <CommandList>
        {dateOptions.map((x, index) => (
          <CommandItem
            key={x.name}
            data-name={x.name}
            value={x.name}
            onSelect={(v) => {
              if (x.name !== 'custom date') {
                if (get.length && get[0].value === v) {
                  changeURLParams(navigate, title, '')
                  set([])
                } else {
                  changeURLParams(navigate, title, x.name)
                  set([
                    {
                      name: x.name,
                      value: x.value.join(','),
                    },
                  ])
                }
              }
            }}
          >
            <Checkbox
              value={x.value.join(',')}
              checked={(get as IData[]).length ? (get as IData[])[0].name === x.name : false}
              id={x.name}
            />
            {x.name !== 'custom date' ? (
              <label>{x.name}</label>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <label>custom date</label>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: get.length ? new Date(get[0].value.split(',')[0]) : new Date(),
                      to: get.length ? new Date(get[0].value.split(',')[1]) : new Date(),
                    }}
                    onSelect={(v) => {
                      changeURLParams(navigate, title, v?.from + ',' + v?.to)
                      set([
                        {
                          name: 'custom date',
                          value: (v?.from || '') + ',' + (v?.to || ''),
                        },
                      ])
                    }}
                    numberOfMonths={2}
                    className="rounded-lg border shadow-sm"
                  />
                </PopoverContent>
              </Popover>
            )}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  )
}

const DisplayButton = ({ type, title, data, get, set, search }: IConfigs) => {
  const navigate = useNavigate()
  const Component = options[type]

  const isValidDate = (str: string) => {
    return str && str !== 'undefined' && str !== 'Invalid Date'
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="group max-w-[450px] justify-start space-x-2 truncate">
          {title}
          {get.length > 0 && <Separator orientation="vertical" className="mx-2" />}
          {get.length > 0 &&
            (type === 'multi'
              ? `${get.length} ${title}`
              : `${
                  get[0].name === 'custom date'
                    ? (isValidDate(get[0].value.split(',')[0])
                        ? formatDateToDay(get[0].value.split(',')[0])
                        : 'Please Select') +
                      ' - ' +
                      (isValidDate(get[0].value.split(',')[1])
                        ? formatDateToDay(get[0].value.split(',')[1])
                        : 'Please Select')
                    : get[0].name
                }`)}
          <CircleX
            className="h-3 flex-shrink-0"
            onClick={() => {
              changeURLParams(navigate, title, '')
              set([])
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" side="bottom" align="start">
        <Component title={title} data={data} get={get} set={set} search={search} type={type} />
      </PopoverContent>
    </Popover>
  )
}

export default function FilterButton({ configs }: { configs: IConfigs[] }) {
  return (
    <>
      {configs.map((config, index) => {
        return config.get.length ? (
          <DisplayButton
            key={config.title}
            title={config.title}
            data={config.data ?? []}
            get={config.get}
            set={config.set}
            search={config.search}
            type={config.type}
          />
        ) : null
      })}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="group mt-0 flex max-w-[300px] items-center justify-start space-x-2">
            <ListFilter className="h-4 w-4 text-gray-500 group-hover:text-white group-focus:text-white" />
            <span>Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" sideOffset={4}>
          {configs.map((config, index) => {
            return (
              <DropdownMenuSubComponent
                key={config.title}
                title={config.title}
                data={config.data ?? []}
                get={config.get}
                set={config.set}
                search={config.search}
                type={config.type}
              />
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
