import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { GithubUser, TaskDto, TaskPriorityEnum } from '@/openapi/client'
import PaginationFast from '@/components/pagination-fast'
import { Link } from 'react-router-dom'
import { cn, formatDateToDay } from '@/lib/utils'
import { compareAsc, formatDistance, formatISO } from 'date-fns'
import { Dispatch, SetStateAction, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent } from '@/components/ui/popover'
import { PopoverTrigger } from '@radix-ui/react-popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi } from '@/service'
import TableSortHeader, { ISort } from './TableSortHeader'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Checkbox } from '@/components/ui/checkbox'

export default function TaskMgtTable({
  tasks,
  page,
  totalPages,
  setPage,
  sort,
  setSort,
  allAssignees,
}: {
  tasks: TaskDto[]
  page: number
  totalPages: number
  setPage: Dispatch<SetStateAction<number>>
  sort: ISort[]
  setSort: Dispatch<SetStateAction<ISort[]>>
  allAssignees: GithubUser[]
}) {
  const [isEdit, setIsEdit] = useState({
    field: '',
    value: false,
    githubId: 0,
  })
  const [title, setTitle] = useState({ githubId: 0, value: '' })
  const [sp, setSp] = useState({ githubId: 0, value: 0 })
  const [assignees, setAssignees] = useState({
    githubId: 0,
    value: [] as GithubUser[],
  })
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({
      githubId,
      field,
      value,
    }: {
      githubId: number
      field: string
      value: number | string | GithubUser[]
    }) => taskApi.taskControllerUpdateTask(githubId, { [field]: value }),
  })

  const handleClicktoEditState = (e: { currentTarget: HTMLDivElement }) => {
    const field = (e.currentTarget as HTMLDivElement).dataset.field as string
    const githubId = Number(e.currentTarget.dataset.githubid as string)
    const value = (e.currentTarget.dataset.value as string) || ''
    setIsEdit({
      field,
      value: true,
      githubId,
    })
    if (field === 'assignees' && value) {
      setAssignees({ githubId, value: JSON.parse(value) })
    }
  }

  const updateTaskDetail = async ({ value }: { value: string | number | GithubUser[] }) => {
    const { field, githubId } = isEdit
    if (value) {
      await mutation.mutateAsync({ githubId, value, field })
      setIsEdit({ field, value: false, githubId })
      queryClient.invalidateQueries({ queryKey: ['tasks', '', page] })
    }
  }

  const handleChangetoPatch = async (e: { currentTarget: HTMLInputElement }) => {
    const value = e.currentTarget.value
    updateTaskDetail({ value })
  }
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">Title</TableHead>
            <TableHead className="text-gray-400">
              <TableSortHeader title="Due" sort={sort} onClick={setSort} field="due" />
            </TableHead>
            <TableHead className="text-gray-400">
              <TableSortHeader title="Priority" sort={sort} onClick={setSort} field="priority" />
            </TableHead>
            <TableHead className="text-gray-400">
              <TableSortHeader title="Story Points" sort={sort} onClick={setSort} field="storyPoints" />
            </TableHead>
            <TableHead className="text-gray-400">Project</TableHead>
            <TableHead className="text-gray-400">Assignees</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((x, index) => (
            <TableRow key={x._id}>
              <TableCell>
                <div className="space-y-1">
                  <div data-field="title" data-githubid={x.githubId} onClick={handleClicktoEditState}>
                    {isEdit.field === 'title' && isEdit.value && isEdit.githubId === x.githubId ? (
                      <Input
                        value={title && title.githubId === x.githubId ? title.value ?? '' : x?.title}
                        onChange={(e) => setTitle({ githubId: x.githubId, value: e.currentTarget.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleChangetoPatch(e)
                          }
                        }}
                        onBlur={(e) => handleChangetoPatch(e)}
                        autoFocus
                      />
                    ) : (
                      <>{x?.title}</>
                    )}
                  </div>
                  <a
                    href={x?.htmlUrl}
                    className="text-xs text-gray-500 hover:text-blue-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {x?._id}
                  </a>
                </div>
              </TableCell>
              <TableCell>
                {isEdit.field === 'due' && isEdit.value && isEdit.githubId === x.githubId ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                        {formatDateToDay(x.due)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(x.due || '')}
                        captionLayout="dropdown"
                        data-githubid={x.githubId}
                        onSelect={(value) => {
                          value && updateTaskDetail({ value: formatISO(new Date(value)) })
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div
                    data-field="due"
                    data-githubid={x.githubId}
                    onClick={handleClicktoEditState}
                    className={cn(
                      'space-y-1',
                      {
                        'text-red-500': x.due && compareAsc(x.due, new Date()) < 0,
                      },
                      {
                        'h-8': !x.due,
                      },
                    )}
                  >
                    <p>{formatDateToDay(x.due)}</p>
                    <p>
                      {x.due && compareAsc(x.due, new Date()) < 0
                        ? `(${formatDistance(new Date(x.due), new Date(), { addSuffix: true })})`
                        : null}
                    </p>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {isEdit.field === 'priority' && isEdit.value && isEdit.githubId === x.githubId ? (
                  <Select
                    defaultValue={x.priority}
                    onValueChange={(value) => {
                      updateTaskDetail({ value })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue defaultValue={x.priority} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={TaskPriorityEnum.P0}>P0</SelectItem>
                        <SelectItem value={TaskPriorityEnum.P1}>P1</SelectItem>
                        <SelectItem value={TaskPriorityEnum.P2}>P2</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <div
                    data-field="priority"
                    onClick={handleClicktoEditState}
                    data-githubid={x.githubId}
                    className={cn('w-20 rounded-sm py-1 text-center capitalize text-white', {
                      'bg-red-500': x.priority === TaskPriorityEnum.P0,
                      'bg-orange-500': x.priority === TaskPriorityEnum.P1,
                      'bg-blue-500': x.priority === TaskPriorityEnum.P2,
                    })}
                  >
                    {x.priority}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div data-field="storyPoints" data-githubid={x.githubId} onClick={handleClicktoEditState}>
                  {isEdit.field === 'storyPoints' && isEdit.value && isEdit.githubId === x.githubId ? (
                    <Input
                      value={sp && sp.githubId === x.githubId ? sp.value ?? 0 : x?.storyPoints}
                      onChange={(e) => setSp({ githubId: x.githubId, value: Number(e.currentTarget.value) })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleChangetoPatch(e)
                        }
                      }}
                      onBlur={(e) => handleChangetoPatch(e)}
                    />
                  ) : (
                    <p
                      className={cn({
                        'h-8': !x.storyPoints,
                      })}
                    >
                      {x.storyPoints}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Link to={`/projects/${x.project._id}?projectName=${x.project.name}`}>{x.project.name}</Link>
              </TableCell>
              <TableCell>
                {isEdit.field === 'assignees' && isEdit.value && isEdit.githubId === x.githubId ? (
                  <Popover
                    onOpenChange={(open) => {
                      if (!open) {
                        updateTaskDetail({ value: assignees.value as GithubUser[] })
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button id="assignees" variant="outline" role="combobox" className="justify-start px-3">
                        {assignees.value.length ? (
                          <div className="flex -space-x-3">
                            {assignees.value.map((assign) => (
                              <img
                                key={assign.login}
                                className="h-6 w-6 rounded-full border-2 border-white"
                                src={assign.avatarUrl}
                                alt={assign.login}
                              />
                            ))}
                          </div>
                        ) : (
                          'Select Assignees'
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start">
                      <Command>
                        <CommandInput placeholder="Search assignees..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          {allAssignees.map((item) => {
                            return (
                              <CommandItem
                                key={item.login}
                                value={item.login}
                                onSelect={(select) => {
                                  const value = assignees.value.filter((assign) => assign.login === select).length
                                    ? assignees.value.filter((assign) => assign.login !== select)
                                    : [
                                        ...assignees.value,
                                        {
                                          login: select,
                                          avatarUrl: item.avatarUrl,
                                          htmlUrl: item.htmlUrl,
                                        } as GithubUser,
                                      ]
                                  setAssignees({ githubId: x.githubId, value })
                                }}
                              >
                                <Checkbox
                                  value={item.login}
                                  checked={assignees.value.some((x) => x.login === item.login)}
                                />
                                <label className="flex text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  <img
                                    key={item.login}
                                    className="mr-2 h-6 w-6 rounded-full border-2 border-white"
                                    src={item.avatarUrl}
                                    alt={item.login}
                                  />
                                  <div className="pt-1">{item.login}</div>
                                </label>
                              </CommandItem>
                            )
                          })}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div
                    className={cn('flex -space-x-3', { 'h-8': !x.assignees.length })}
                    data-field="assignees"
                    data-githubid={x.githubId}
                    onClick={handleClicktoEditState}
                    data-value={JSON.stringify(x.assignees)}
                  >
                    {x.assignees.map((assign) => (
                      <img
                        key={assign.login}
                        className="h-6 w-6 rounded-full border-2 border-white"
                        src={assign.avatarUrl}
                        alt={assign.login}
                      />
                    ))}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  )
}
