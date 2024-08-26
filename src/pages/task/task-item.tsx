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
    <article className="relative z-[1] hover:bg-white/10 p-4 border hover:border hover:border-opacity-80 rounded-2xl w-full transition-all duration-200 ease-in group hover:scale-[0.998]">
      <Link to={`/task/${item.githubId}`}>
        <div className="flex justify-between items-center gap-4 h-12">
          <div className="flex flex-row justify-center items-start gap-2 w-full">
            <div className="mt-1 h-8">
              {item.state === 'open' ? (
                <CircleDot className="w-6 text-green-600" />
              ) : (
                <CircleCheck className="w-6 text-purple-600" />
              )}
            </div>
            <Button asChild variant="link" className="px-0 !line-clamp-2 !p-0 w-full h-16 font-bold text-2xl break-all">
              <a href={item.htmlUrl} target="_blank" rel="noreferrer">
                {item.title}
              </a>
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col justify-between gap-2 rounded h-full overflow-hidden">
            <div className="flex flex-col gap-4">
              <div className="mt-2 !line-clamp-2 h-10 text-muted-foreground text-sm break-all">
                {item.body || 'No description...'}
              </div>
            </div>
            <div className="flex justify-between items-center h-9">
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
                <div className="flex flex-row gap-2 pr-4">
                  {item.labels.length > 0 && (
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 border rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2 font-semibold text-xs transition-colors focus:outline-none"
                      style={{ backgroundColor: getRandomColor() }}
                    >
                      {item.labels[0]}
                    </span>
                  )}
                </div>
              </div>

              <div>
                {item.state === 'closed' ? (
                  <Button
                    disabled
                    className="border-white/80 bg-greyscale-50/8 hover:bg-white/10 border hover:border-opacity-80 w-24 text-white"
                  >
                    Closed
                  </Button>
                ) : !item.assignees.length ? (
                  <></>
                ) : // <Button
                //   onClick={handleClaim}
                //   className="border-white/80 bg-greyscale-50/8 hover:bg-white/10 border hover:border-opacity-80 w-24 text-white"
                // >
                //   Claim
                // </Button>
                item.assignees.some((assignee) => assignee.login === username) ? (
                  <></>
                ) : (
                  // <Button
                  //   onClick={handleDisclaim}
                  //   className="border-white/80 bg-greyscale-50/8 hover:bg-white/10 border hover:border-opacity-80 w-24 text-white"
                  // >
                  //   Disclaim
                  // </Button>
                  <Button
                    disabled
                    className="border-white/80 bg-greyscale-50/8 hover:bg-white/10 border hover:border-opacity-80 w-24 text-white"
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
        </div>
      </Link>
    </article>
  )
}
