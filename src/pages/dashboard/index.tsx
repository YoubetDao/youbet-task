import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { fetchTasks, fetchLeaderboard, fetchProjects } from '@/service'
import { TaskCompletionLeaderboard } from '@/components/task-completion-leaderboard'
import { Profile, Project } from '@/types'
import { LucideUsers, LucidePackage, LucideListChecks, LucideCircleCheck, LucideStar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { BRAND_NAME } from '@/lib/config'
import Footer from '@/components/footer'

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
            <Link key={index} to={`/projects/${project.name}/tasks`}>
              <div className="pb-4 mb-4 border-b">
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
                <p className="text-sm text-gray-400">{project.description}</p>
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
    fetchLeaderboard().then(({ data, totalCount }) => {
      setLeaderboard(data)
      setUserCount(totalCount || 0)
    })
    fetchTasks({ project: '', offset: 0, limit: 1000 }).then((tasks) => {
      const openedTasks = (tasks?.data || []).filter((task) => task.state === 'open')
      setOpenedCount(openedTasks.length)
      setTotalCount(tasks?.pagination.totalCount || 0)
    })
    fetchProjects().then((projects) => {
      setProjects(projects || [])
    })
  }, [])

  return (
    <div className="px-4 py-4 mx-auto lg:px-12 max-w-7xl">
      <div className="flex flex-col w-full gap-4 overflow-hidden">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Hi, Welcome to {BRAND_NAME} 👋</h2>
          <div className="grid items-center justify-between grid-cols-2 gap-4 lg:grid-cols-4">
            <StatsCard title="Total Users" value={userCount} icon={<LucideUsers className="w-4 h-4" />} />
            <StatsCard title="Total Projects" value={projects.length} icon={<LucidePackage className="w-4 h-4" />} />
            <StatsCard title="Total Tasks" value={totalCount} icon={<LucideListChecks className="w-4 h-4" />} />
            <StatsCard title="Opened Tasks" value={openedCount} icon={<LucideCircleCheck className="w-4 h-4" />} />
          </div>
        </div>

        <div className="grid w-full grid-cols-4 gap-4">
          <div className="col-span-4 xl:col-span-1">
            <TaskCompletionLeaderboard leaderboard={leaderboard.slice(0, 5)} />
          </div>
          <div className="col-span-4 xl:col-span-3">
            <ProjectRecommendations projects={projects.slice(0, 5)} />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
