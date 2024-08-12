import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import api from '@/service'
import { TaskCompletionLeaderboard } from '@/components/task-completion-leaderboard'

export default function Dashboard() {
  const [assigneeStats, setAssigneeStats] = useState<{
    [key: string]: { avatarSrc: string; name: string; html: string; completedTasks: number }
  }>({})
  const [openedCount, setOpenedCount] = useState<number>(0)
  const [closedCount, setClosedCount] = useState<number>(0)

  useEffect(() => {
    api.fetchIssues('YoubetDao', 'youbet-test-repo').then((data) => {
      if (data) {
        const stats: { [key: string]: { avatarSrc: string; name: string; html: string; completedTasks: number } } = {}
        let opened = 0
        let closed = 0
        console.log(data)

        data.forEach((issue) => {
          issue.assignees.forEach((assignee) => {
            if (!stats[assignee.login]) {
              stats[assignee.login] = {
                avatarSrc: assignee.avatarUrl,
                name: assignee.login,
                html: assignee.htmlUrl, // 将 email 改为 html 字段
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
    <>
      <ScrollArea className="h-full">
        <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
          <div className="flex items-center justify-between space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Hi, Welcome to YouBet Task 👋</h2>
          </div>
          <Tabs defaultValue="overview" className="">
            <TabsContent value="overview" className="flex-row flex justify-start">
              <div className="gap-4 w-64 max-h-screen flex flex-col">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Opened Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{openedCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{closedCount}</div>
                  </CardContent>
                </Card>
              </div>
              <div className="items-start justify-center flex flex-grow">
                <TaskCompletionLeaderboard assigneeStats={assigneeStats} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </>
  )
}
