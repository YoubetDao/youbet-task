import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import api from '@/service'
import { TaskCompletionLeaderboard } from '@/components/task-completion-leaderboard'
import { Profile, Project } from '@/types'
import { LucideUsers, LucidePackage, LucideListChecks, LucideCircleCheck, LucideStar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

function StatsCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium text-sm">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-bold text-2xl">{value}</div>
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
            <Link key={index} to={`/projects/${project.name}/tasks`}>
              <div className="mb-4 pb-4 border-b">
                <Button
                  asChild
                  variant="link"
                  className="z-10 px-0 font-semibold !text-lg"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(project.htmlUrl, '_blank', 'noopener,noreferrer')
                  }}
                >
                  <p>{project.name}</p>
                </Button>
                <p className="text-gray-400 text-sm">{project.description}</p>
              </div>
            </Link>
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
    <div className="mx-auto px-4 lg:px-12 py-4 max-w-7xl">
      <div className="flex flex-col gap-4 w-full overflow-hidden">
        <div className="space-y-4">
          <h2 className="font-bold text-3xl tracking-tight">Hi, Welcome to YouBet Task 👋</h2>
          <div className="justify-between items-center gap-4 grid grid-cols-2 lg:grid-cols-4">
            <StatsCard title="Total Users" value={userCount} icon={<LucideUsers className="w-4 h-4" />} />
            <StatsCard title="Total Projects" value={projects.length} icon={<LucidePackage className="w-4 h-4" />} />
            <StatsCard title="Total Tasks" value={totalCount} icon={<LucideListChecks className="w-4 h-4" />} />
            <StatsCard title="Opened Tasks" value={openedCount} icon={<LucideCircleCheck className="w-4 h-4" />} />
          </div>
        </div>

        <div className="gap-4 grid grid-cols-4 w-full">
          <div className="col-span-4 xl:col-span-1">
            <TaskCompletionLeaderboard leaderboard={leaderboard.slice(0, 5)} />
          </div>
          <div className="col-span-4 xl:col-span-3">
            <ProjectRecommendations projects={projects.slice(0, 5)} />
          </div>
        </div>
      </div>
    </div>
  )
}
