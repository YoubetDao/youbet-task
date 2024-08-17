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
    <article className="relative z-[1] hover:bg-white/10 p-4 border hover:border hover:border-opacity-80 rounded-2xl w-full transition-all duration-200 ease-in group hover:scale-[0.998]">
      <div className="flex justify-between items-center gap-4">
        <div className="flex flex-row items-center gap-3 w-full">
          {item.state === 'open' ? (
            <CircleDot className="w-6 h-6 text-green-600" />
          ) : (
            <CircleCheck className="w-6 h-6 text-purple-600" />
          )}
          <Button
            asChild
            variant="link"
            className="block !p-0 w-full font-bold text-2xl text-ellipsis text-gray-50 whitespace-nowrap overflow-hidden"
          >
            <span
              className="z-10"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(item.htmlUrl, '_blank')
              }}
            >
              {`${item.title}dadsdasdsadsa`}
            </span>
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col justify-between gap-2 rounded h-full overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="mt-4 text-ellipsis text-muted-foreground text-sm whitespace-nowrap overflow-hidden">
              {item.body || 'No description...'}
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
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
          </div>
        </div>
      </div>
    </article>
  )
}
