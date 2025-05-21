import { Card, CardContent } from '@/components/ui/card'
import { Task } from '@/openapi/client/models/task'
import { Avatar } from '../ui/avatar'

interface ITaskItemProps {
  item: Task
}

export const TaskItem = ({ item }: ITaskItemProps) => {
  return (
    <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
            <p className="mb-2 line-clamp-4 text-sm text-slate-500 dark:text-slate-400">
              {item.body || 'No description...'}
            </p>

            <div className="mb-2 flex flex-wrap gap-1">
              {/* {item.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="px-1.5 py-0 text-xs">
                  {tech}
                </Badge>
              ))} */}
            </div>
          </div>

          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6"></Avatar>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
