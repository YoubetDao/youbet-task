import { Button } from '@/components/ui/button'
import { Task } from '@/types'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { CircleCheck, CircleDot, Clock } from 'lucide-react'
import _ from 'lodash'

const darkModeColors = [
  '#FF6F61', // 亮橙色
  '#6EC1E4', // 亮蓝色
  '#F09232', // 亮粉色
]

const getRandomColor = () => _.sample(darkModeColors)

export const TaskItem = ({ item }: { item: Task }) => {
  console.log(item)
  return (
    <article className="rounded-2xl border group z-[1] duration-200 ease-in hover:border hover:border-opacity-80 hover:bg-white/10 relative w-full p-4 transition-all hover:scale-[0.998]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-3">
          {item.state === 'open' ? (
            <CircleDot className="w-6 h-6 text-green-600" />
          ) : (
            <CircleCheck className="w-6 h-6 text-purple-600" />
          )}
          <Button
            asChild
            variant="link"
            className="text-gray-50 !p-0 overflow-hidden text-2xl font-bold whitespace-nowrap text-ellipsis"
          >
            <a href={item.htmlUrl} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col justify-between h-full overflow-hidden rounded gap-2">
          <div className="flex gap-4 flex-col">
            <div className="mt-4 text-sm text-muted-foreground whitespace-nowrap text-ellipsis overflow-hidden">
              {item.body || 'Decentralized social built with Nostr and powered by Starknet account abstraction.'}
            </div>
          </div>
          <div className="flex justify-between mt-2 items-center">
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
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    style={{ backgroundColor: getRandomColor() }}
                  >
                    {item.labels[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
