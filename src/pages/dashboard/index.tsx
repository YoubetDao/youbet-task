import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import api from '@/service'
import { TaskCompletionLeaderboard } from '@/components/task-completion-leaderboard'
import { Profile, Project } from '@/types'

function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="w-1/4">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function ProjectRecommendations({ projects }: { projects: any[] }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recommended Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <a key={index} href={project.htmlUrl} target="_blank" rel="noopener noreferrer">
              <div key={index} className="border-b pb-4 mb-4">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-400">{project.description}</p>
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [leaderboard, setLeaderboard] = useState<Profile[]>([])
  const [openedCount, setOpenedCount] = useState<number>(0)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [userCount, setUserCount] = useState<number>(0)

  useEffect(() => {
    api.fetchLeaderboard().then((leaderboardData) => {
      setLeaderboard(leaderboardData || [])
      setUserCount(leaderboardData?.length || 0)
    })
    api.fetchTasks({}).then((tasks) => {
      setOpenedCount((tasks || []).filter((task) => task.state === 'open').length)
      setTotalCount((tasks || []).length)
    })
    api.fetchProjects().then((projects) => {
      setProjects(projects || [])
    })
  }, [])

  return (
    <div className="px-4 py-4 mx-auto max-w-7xl lg:px-12">
      <div className="flex flex-col w-full gap-4 pt-4 pl-4 overflow-hidden">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Hi, Welcome to YouBet Task 👋</h2>
          <div className="flex justify-between space-x-4">
            <StatsCard title="Total Users" value={userCount} />
            <StatsCard title="Total Projects" value={projects.length} />
            <StatsCard title="Total Tasks" value={totalCount} />
            <StatsCard title="Opened Tasks" value={openedCount} />
          </div>
        </div>

        <div className="flex space-x-6 w-full">
          <div className="w-1/4">
            <TaskCompletionLeaderboard leaderboard={leaderboard} />
          </div>
          <div className="w-3/4">
            <ProjectRecommendations projects={projects.slice(0, 5)} />
          </div>
        </div>
      </div>
    </div>
  )
}
