import api from '@/service'
import { Issue } from '@/types'
import { useEffect, useState } from 'react'
import LeaderboardRow from './leaderboard-row'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
export function IssueCompletionLeaderboard() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [assigneeStats, setAssigneeStats] = useState<{
    [key: string]: { avatarSrc: string; name: string; html: string; completedTasks: number }
  }>({})
  const [openedCount, setOpenedCount] = useState<number>(0)
  const [closedCount, setClosedCount] = useState<number>(0)

  useEffect(() => {
    api.fetchIssues('YoubetDao', 'youbet-test-repo').then((data) => {
      if (data) {
        setIssues(data)

        const stats: { [key: string]: { avatarSrc: string; name: string; html: string; completedTasks: number } } = {}
        let opened = 0
        let closed = 0

        data.forEach((issue) => {
          issue.assignees.forEach((assignee) => {
            if (!stats[assignee.login]) {
              stats[assignee.login] = {
                avatarSrc: assignee.avatar_url,
                name: assignee.login,
                html: assignee.html_url, // 将 email 改为 html 字段
                completedTasks: 0,
              }
            }
            if (issue.state === 'closed') {
              stats[assignee.login].completedTasks += 1
            }
          })
          if (issue.state === 'closed') {
            closed++
          } else {
            opened++
          }
        })

        setAssigneeStats(stats)
        setOpenedCount(opened)
        setClosedCount(closed)
      }
    })
  }, [])

  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>Issue Completion Leaderboard</CardTitle>
        <CardDescription>
          Opened: {openedCount} Closed: {closedCount}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
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
