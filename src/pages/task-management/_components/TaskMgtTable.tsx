import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TaskDto, TaskPriorityEnum } from '@/openapi/client'
import PaginationFast from '@/components/pagination-fast'
import { Link } from 'react-router-dom'
import { cn, formatDateToDay } from '@/lib/utils'
import { compareAsc, formatDistance } from 'date-fns'
import { Dispatch, SetStateAction } from 'react'

export default function TaskMgtTable({
  tasks,
  page,
  totalPages,
  setPage,
}: {
  tasks: TaskDto[]
  page: number
  totalPages: number
  setPage: Dispatch<SetStateAction<number>>
}) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-400">Title</TableHead>
            <TableHead className="text-gray-400">Due</TableHead>
            <TableHead className="text-gray-400">Priority</TableHead>
            <TableHead className="text-gray-400">Story Points</TableHead>
            <TableHead className="text-gray-400">Project</TableHead>
            <TableHead className="text-gray-400">Assignees</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((x, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="space-y-1">
                  <div>{x?.title}</div>
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
                <div
                  className={cn('space-y-1', {
                    'text-red-500': x.due && compareAsc(x.due, new Date()) < 0,
                  })}
                >
                  <p>{formatDateToDay(x.due)}</p>
                  <p>
                    {x.due && compareAsc(x.due, new Date()) < 0
                      ? `(${formatDistance(new Date(x.due), new Date(), { addSuffix: true })})`
                      : null}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className={cn('w-10 rounded-sm py-1 text-center capitalize text-white', {
                    'bg-red-500': x.priority === TaskPriorityEnum.P0,
                    'bg-orange-500': x.priority === TaskPriorityEnum.P1,
                    'bg-blue-500': x.priority === TaskPriorityEnum.P2,
                  })}
                >
                  {x.priority}
                </div>
              </TableCell>
              <TableCell>{x.storyPoints}</TableCell>
              <TableCell>
                <Link to={`/projects/${x.project._id}?projectName=${x.project.name}`}>{x.project.name}</Link>
              </TableCell>
              <TableCell>
                {x.assignees.map((assign) => (
                  <img
                    key={assign.login}
                    className="h-6 w-6 rounded-full border-2 border-white"
                    src={assign.avatarUrl}
                    alt={assign.login}
                  />
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  )
}
