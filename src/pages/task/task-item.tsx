import { Button } from '@/components/ui/button'
import { Task } from '@/types'
import { usernameAtom } from '@/store'
import { useAtom } from 'jotai'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { CircleCheck, CircleDot, Clock } from 'lucide-react'
import _ from 'lodash'
import { Link } from 'react-router-dom'

const darkModeColors = [
  '#FF6F61', // 亮橙色
  '#6EC1E4', // 亮蓝色
  '#F09232', // 亮粉色
]

const getRandomColor = () => _.sample(darkModeColors)

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
    <article className="rounded-2xl border group z-[1] duration-200 ease-in hover:border hover:border-opacity-80 hover:bg-white/10 relative w-full p-4 transition-all hover:scale-[0.998]">
      <Link to={`/task/${item.githubId}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-row items-center justify-start w-full gap-3">
            {item.state === 'open' ? (
              <CircleDot className="w-6 h-6 text-green-600" />
            ) : (
              <CircleCheck className="w-6 h-6 text-purple-600" />
            )}
            <Button
              asChild
              variant="link"
              className="w-full !p-0 block text-gray-50 text-2xl font-bold whitespace-nowrap text-ellipsis overflow-hidden"
            >
              <span
                className="z-10"
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
          <div className="flex flex-col justify-between h-full gap-2 overflow-hidden rounded">
            <div className="flex flex-col gap-4">
              <div className="mt-4 overflow-hidden text-sm text-muted-foreground whitespace-nowrap text-ellipsis">
                {item.body || 'No description...'}
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex flex-row items-center gap-4">
                <Avatar className="w-4 h-4">
                  <AvatarImage
                    src={item.assignees[0]?.avatarUrl || 'https://avatars.githubusercontent.com/u/8191686?v=4'}
                  />
                </Avatar>
                <div className="flex flex-row items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                </div>
                {/* <div className="flex flex-row gap-2 pr-4">
                {item.labels.length > 0 && (
                  <span
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    {item.labels[0]}
                  </span>
                )}
              </div> */}
              </div>

              <div>
                {item.state === 'closed' ? (
                  <Button
                    disabled
                    className="w-24 text-white border border-white/80 bg-greyscale-50/8 hover:border-opacity-80 hover:bg-white/10"
                  >
                    Closed
                  </Button>
                ) : !item.assignees.length ? (
                  <></>
                ) : // <Button
                //   onClick={handleClaim}
                //   className="w-24 text-white border border-white/80 bg-greyscale-50/8 hover:border-opacity-80 hover:bg-white/10"
                // >
                //   Claim
                // </Button>
                item.assignees.some((assignee) => assignee.login === username) ? (
                  <></>
                ) : (
                  // <Button
                  //   onClick={handleDisclaim}
                  //   className="w-24 text-white border border-white/80 bg-greyscale-50/8 hover:border-opacity-80 hover:bg-white/10"
                  // >
                  //   Disclaim
                  // </Button>
                  <Button
                    disabled
                    className="w-24 text-white border border-white/80 bg-greyscale-50/8 hover:border-opacity-80 hover:bg-white/10"
                  >
                    Claimed
                  </Button>
                )}
              </div>
            </div>
            {item.labels.length > 0 && (
              <div className="flex flex-row gap-2 pr-4">
                <span
                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  style={{ backgroundColor: getRandomColor() }}
                >
                  {item.labels[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
