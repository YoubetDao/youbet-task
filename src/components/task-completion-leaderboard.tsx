import { Profile } from '@/types'
import LeaderboardRow from './leaderboard-row'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// 定义 IssueCompletionLeaderboardProps 接口
interface TaskCompletionLeaderboardProps {
  leaderboard: Profile[]
}

export function TaskCompletionLeaderboard({ leaderboard }: TaskCompletionLeaderboardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Task Completion Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((user, index) => (
            <LeaderboardRow
              key={index}
              avatarSrc={user.avatarUrl}
              name={user.username}
              bio={user.bio || `https://github.com/${user.username}`}
              completedTasks={user.completedTasks || 0}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
