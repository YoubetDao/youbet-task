import { Profile } from '@/types'
import LeaderboardRow from './leaderboard-row'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideCrown } from 'lucide-react'

// 定义 IssueCompletionLeaderboardProps 接口
interface TaskCompletionLeaderboardProps {
  leaderboard: Profile[]
}

export function TaskCompletionLeaderboard({ leaderboard }: TaskCompletionLeaderboardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="relative">
          <LucideCrown className="absolute w-6 h-6 -top-5 -left-5 -rotate-12" />
          Task Completion Leaderboard
        </CardTitle>
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
