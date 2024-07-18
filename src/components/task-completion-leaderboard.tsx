import LeaderboardRow from './leaderboard-row'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
interface AssigneeStats {
  [key: string]: {
    avatarSrc: string
    name: string
    html: string
    completedTasks: number
  }
}

// 定义 IssueCompletionLeaderboardProps 接口
interface TaskCompletionLeaderboardProps {
  assigneeStats: AssigneeStats
}

export function TaskCompletionLeaderboard({ assigneeStats }: TaskCompletionLeaderboardProps) {
  return (
    <Card className="w-[85%] min-h-screen">
      <CardHeader>
        <CardTitle>Task Completion Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-12">
          {Object.values(assigneeStats).map((assignee, index) => (
            <LeaderboardRow
              key={index}
              avatarSrc={assignee.avatarSrc}
              name={assignee.name}
              html={assignee.html}
              completedTasks={assignee.completedTasks}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
