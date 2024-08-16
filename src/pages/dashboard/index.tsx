import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import api from '@/service'
import { TaskCompletionLeaderboard } from '@/components/task-completion-leaderboard'
import { Profile, Project } from '@/types'
import { LucideUsers, LucidePackage, LucideListChecks, LucideCircleCheck, LucideStar } from 'lucide-react'

function StatsCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {title}
        </CardTitle>
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
        <CardTitle className="flex items-center gap-2">
          <LucideStar className="w-6 h-6" />
          Recommended Projects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <a key={index} href={project.htmlUrl} target="_blank" rel="noopener noreferrer">
              <div key={index} className="pb-4 mb-4 border-b">
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
      <div className="flex flex-col w-full gap-4 overflow-hidden">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Hi, Welcome to YouBet Task 👋</h2>
          <div className="grid items-center justify-between grid-cols-2 gap-4 lg:grid-cols-4">
            <StatsCard title="Total Users" value={userCount} icon={<LucideUsers className="w-4 h-4" />} />
            <StatsCard title="Total Projects" value={projects.length} icon={<LucidePackage className="w-4 h-4" />} />
            <StatsCard title="Total Tasks" value={totalCount} icon={<LucideListChecks className="w-4 h-4" />} />
            <StatsCard title="Opened Tasks" value={openedCount} icon={<LucideCircleCheck className="w-4 h-4" />} />
          </div>
        </div>

        <div className="grid w-full grid-cols-4 gap-4">
          <div className="col-span-4 xl:col-span-1">
            <TaskCompletionLeaderboard leaderboard={leaderboard} />
          </div>
          <div className="col-span-4 xl:col-span-3">
            <ProjectRecommendations projects={projects.slice(0, 5)} />
          </div>
        </div>
      </div>
    </div>
  )
}
