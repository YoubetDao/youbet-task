import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Task } from '@/openapi/client/models/task'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ITaskItemProps {
  item: Task
}

interface GitHubAssignee {
  login: string
  htmlUrl: string
  avatarUrl: string
}

export const TaskCard = ({ item }: ITaskItemProps) => {
  type Difficulty = 'easy' | 'medium' | 'hard'

  const getDifficultyColor = (difficulty: Difficulty) => {
    const colors = {
      easy: {
        bg: 'bg-[#86EFAC]',
        text: 'text-[#166534]',
      },
      medium: {
        bg: 'bg-[#FEF08A]',
        text: 'text-[#854D0E]',
      },
      hard: {
        bg: 'bg-[#FCA5A5]',
        text: 'text-[#7F1D1D]',
      },
    }

    return colors[difficulty]
  }

  // const difficultyColor = getDifficultyColor(item.difficulty as Difficulty)
  const difficultyColor = getDifficultyColor('hard' as Difficulty)

  return (
    <Link to={`/task/${item.githubId}`}>
      <Card className="flex h-[284px] w-[348px] flex-col rounded-3xl bg-[#1E293B] transition-shadow duration-200 hover:shadow-md">
        <div className="ml-7 flex items-start">
          <div
            className={`flex h-[30px] items-center rounded-bl-lg rounded-br-lg rounded-tl-none rounded-tr-none px-2 ${difficultyColor.bg}`}
          >
            <span className={`text-sm font-bold ${difficultyColor.text}`}>Hard</span>
          </div>
        </div>

        <CardContent className="flex-1 pt-4">
          <h4 className="line-clamp-2 h-[56px] text-lg font-semibold">{item.title}</h4>

          <p className="mt-2 line-clamp-3 h-[56px] text-sm text-slate-500 dark:text-slate-400">
            {item.body || 'No description...'}
          </p>

          <div className="mb-4 mt-2 flex h-[52px] gap-2">
            <div className="flex w-[96px] flex-col">
              <span className="text-xs text-[#F0ABFC]">Reward</span>
              <span className="mt-1 text-[18px] font-medium">$199</span>
            </div>
            {item.assignees && item.assignees.length == 0 && (
              <div className="flex w-[96px] flex-col">
                <span className="text-xs text-[#67E8F9]">Created</span>
                <span className="text-[18px]">{timeAgo(item.createdAt)}</span>
              </div>
            )}
            {item.assignees && item.assignees.length > 0 && (
              <div className="flex w-[96px] flex-col">
                <span className="text-xs text-[#67E8F9]">Assignee </span>
                {/* TODO: assignees 定义为字符串数组，与接口返回的不一致 */}
                {renderAssigneeAvatars(item.assignees)}
              </div>
            )}
          </div>
          <Badge className="h-[26px] rounded-lg border border-slate-500 text-xs dark:text-slate-300" variant="outline">
            SQL
          </Badge>
        </CardContent>
      </Card>
    </Link>
  )
}

export function renderAssigneeAvatars(assignees: GitHubAssignee[]): React.ReactNode {
  const defaultColors = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899']

  return (
    <div className="flex w-[96px] flex-col">
      <div className="mt-1 flex -space-x-2">
        {assignees.map((assignee, index) => (
          <div
            key={assignee.login}
            className="relative rounded-full"
            style={{
              zIndex: assignees.length - index,
              boxShadow: `0 0 0 2px ${defaultColors[index % defaultColors.length]}`,
            }}
          >
            <a href={assignee.htmlUrl} target="_blank" rel="noopener noreferrer" title={assignee.login}>
              <Avatar className="h-7 w-7 border-2 border-[#1E293B]">
                <AvatarImage src={assignee.avatarUrl || '/placeholder.svg'} alt={assignee.login} />
                <AvatarFallback className="text-xs">{assignee.login.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

function timeAgo(isoTime: string): string {
  const createdTime = new Date(isoTime).getTime()
  const now = Date.now()
  const diffInSeconds = Math.floor((now - createdTime) / 1000)

  const minutes = Math.floor(diffInSeconds / 60)
  const hours = Math.floor(diffInSeconds / 3600)
  const days = Math.floor(diffInSeconds / 86400)
  const months = Math.floor(diffInSeconds / (86400 * 30))
  const years = Math.floor(diffInSeconds / (86400 * 365))

  if (diffInSeconds < 60) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`
  if (days < 30) return `${days} day${days > 1 ? 's' : ''}`
  if (months < 12) return `${months} month${months > 1 ? 's' : ''}`
  return `${years} year${years > 1 ? 's' : ''}`
}
