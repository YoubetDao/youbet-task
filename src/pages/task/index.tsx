import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { taskItems } from '@/constants/data'
import { TaskItem as TaskItemType } from '@/types'

function TaskItem({ item }: { item: TaskItemType }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{item.description}</p>
      </CardContent>
    </Card>
  )
}

export default function Task() {
  return (
    <div className="space-y-4">
      <h1>Task</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {taskItems.map((item) => (
          <TaskItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
