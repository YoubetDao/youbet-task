import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { MarkdownProcessor } from '@/lib/md-processor'
import { Card, CardDescription, CardFooter, CardTitle } from '../ui/card'
import { Icons } from '../icons'
import { TaskDto } from '@/openapi/client'

interface ITaskItemProps {
  item: TaskDto
}

type TaskState = 'open' | 'closed' | 'assigned'

const TaskStateBadge = ({ state }: { state: 'assigned' | 'open' | 'closed' }) => {
  switch (state) {
    case 'open':
      return (
        <Badge variant="default" className="bg-green-500">
          Open
        </Badge>
      )
    case 'closed':
      return <Badge variant="default">Closed</Badge>
    case 'assigned':
      return (
        <Badge variant="default" className="bg-blue-500">
          Assigned
        </Badge>
      )
    default:
      return null
  }
}

export const TaskCard = ({ item }: { item: TaskDto }) => {
  let state: TaskState

  if (item.state === 'open') {
    state = item.assignee ? 'assigned' : 'open'
  } else {
    state = 'closed'
  }

  return (
    <Link to={`/task/${item.githubId}`}>
      <Card className="flex h-full w-full flex-col gap-2 rounded-2xl border p-4 transition-all duration-200 ease-in hover:scale-[0.998] hover:border hover:border-opacity-80 hover:bg-white/10">
        <CardTitle
          className="flex px-0 text-left text-xl font-bold underline-offset-4 hover:underline"
          title={item.title}
        >
          <span className="lg:max-w-3xs pr-1 lg:truncate">{item.title}</span>
          <Icons.github
            className="relative top-1.5 h-4 w-4 flex-shrink-0"
            onClick={(event) => {
              event.preventDefault()
              window.open(item.htmlUrl, '_blank', 'noopener, noreferrer')
            }}
          />
        </CardTitle>
        <CardDescription className="line-clamp-2 h-10 break-words text-sm text-muted-foreground">
          {MarkdownProcessor.getPlainText(item.body) || 'No description...'}
        </CardDescription>
        <CardFooter className="flex h-6 w-full items-center justify-between p-0 pt-2">
          <figure className="flex flex-row items-center justify-between gap-4">
            <Avatar className="h-4 w-4">
              <AvatarImage src={item.assignee?.avatarUrl || item.user?.avatarUrl} />
            </Avatar>
            <time className="flex flex-row items-center gap-2 text-xs">
              <Clock className="h-4 w-4" />
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </time>
          </figure>
          <TaskStateBadge state={state} />
        </CardFooter>
      </Card>
    </Link>
  )
}
