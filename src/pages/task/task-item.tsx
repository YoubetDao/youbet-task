import { Button } from '@/components/ui/button'
import { Task } from '@/types'
import { usernameAtom } from '@/store'
import { useAtom } from 'jotai'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { CircleCheck, CircleDot, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const darkModeColors = [
  '#FF6F61', // 亮橙色
  '#6EC1E4', // 亮蓝色
  '#F09232', // 亮粉色
]

const getRandomColor = (label: string) => {
  const index = label.charCodeAt(0) % darkModeColors.length
  return darkModeColors[index]
}

export const TaskItem = ({
  item,
  onClaim,
  onDisclaim,
}: {
  item: Task
  onClaim: (item: Task) => void
  onDisclaim: (item: Task) => void
}) => {
  const [username] = useAtom(usernameAtom)
  const handleClaim = () => {
    onClaim(item)
  }

  const handleDisclaim = () => {
    onDisclaim(item)
  }

  return (
    <article className="group relative z-[1] w-full rounded-2xl border p-4 transition-all duration-200 ease-in hover:scale-[0.998] hover:border hover:border-opacity-80 hover:bg-white/10">
      <Link to={`/task/${item.githubId}`}>
        <div className="flex h-12 items-center justify-between gap-4">
          <div className="flex w-full flex-row items-start justify-center gap-2">
            <div className="mt-1 h-8">
              {item.state === 'open' ? (
                <CircleDot className="w-6 text-green-600" />
              ) : (
                <CircleCheck className="w-6 text-purple-600" />
              )}
            </div>
            <Button asChild variant="link" className="!line-clamp-2 h-16 w-full break-all !p-0 px-0 text-2xl font-bold">
              <span
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(item.htmlUrl, '_blank')
                }}
              >
                {item.title}
              </span>
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex h-full flex-col justify-between gap-2 overflow-hidden rounded">
            <div className="flex flex-col gap-4">
              <div className="mt-2 !line-clamp-2 h-10 break-all text-sm text-muted-foreground">
                {item.body || 'No description...'}
              </div>
            </div>
            <div className="flex h-9 items-center justify-between">
              <div className="flex flex-row items-center gap-4">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={item.assignees[0]?.avatarUrl || item.user?.avatarUrl} />
                </Avatar>
                <div className="flex flex-row items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              <div>
                {item.state === 'closed' ? (
                  <Button
                    disabled
                    className="bg-greyscale-50/8 w-24 border border-white/80 text-white hover:border-opacity-80 hover:bg-white/10"
                  >
                    Closed
                  </Button>
                ) : !item.assignees.length ? (
                  <></>
                ) : // <Button
                //   onClick={handleClaim}
                //   className="w-24 text-white border border-white/80 bg-greyscale-50/8 hover:bg-white/10 hover:border-opacity-80"
                // >
                //   Claim
                // </Button>
                item.assignees.some((assignee) => assignee.login === username) ? (
                  <></>
                ) : (
                  // <Button
                  //   onClick={handleDisclaim}
                  //   className="w-24 text-white border border-white/80 bg-greyscale-50/8 hover:bg-white/10 hover:border-opacity-80"
                  // >
                  //   Disclaim
                  // </Button>
                  <Button
                    disabled
                    className="bg-greyscale-50/8 w-24 border border-white/80 text-white hover:border-opacity-80 hover:bg-white/10"
                  >
                    Claimed
                  </Button>
                )}
              </div>
            </div>
            {/* {item.labels.length > 0 && (
              <div className="flex flex-row gap-2 pr-4">
                <span
                  className="inline-flex items-center px-2.5 py-0.5 border rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2 font-semibold text-xs transition-colors focus:outline-none"
                  style={{ backgroundColor: getRandomColor() }}
                >
                  {item.labels[0]}
                </span>
              </div>
            )} */}
          </div>
          <div className="mt-2 flex flex-row gap-2 border-t pr-4 pt-2">
            {item.labels.length > 0 && (
              <span
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                style={{ backgroundColor: getRandomColor(item.labels[0]) }}
              >
                {item.labels[0]}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
