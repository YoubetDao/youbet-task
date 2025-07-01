import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { userApi, taskApi, projectApi } from '@/service'
import { TaskCompletionLeaderboard } from '@/components/task-completion-leaderboard'
import { LucideUsers, LucidePackage, LucideListChecks, LucideCircleCheck, LucideStar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link, useSearchParams } from 'react-router-dom'
import { BRAND_NAME } from '@/lib/config'
import { useUsername } from '@/store'
import { Project, UserTaskCompletionDto } from '@/openapi/client'
import BindModal from './BindModal'
import { useAccount } from 'wagmi'
import { useMount } from 'ahooks'

function StatsCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="relative bg-transparent">
      <div className="absolute inset-0 bg-white/10 opacity-70" />
      <div className="relative">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </div>
    </Card>
  )
}

function ProjectRecommendations({ projects }: { projects: Project[] }) {
  return (
    <Card className="w-full bg-transparent bg-gradient-to-r from-white/10 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LucideStar className="h-6 w-6" />
          <span className="font-american-captain translate-y-[3px]">Recommended Projects</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <Link key={index} to={project.htmlUrl}>
              <div className="mb-4 border-b pb-4">
                <Button
                  asChild
                  variant="link"
                  className="z-10 px-0 !text-lg font-semibold"
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
  const [leaderboard, setLeaderboard] = useState<UserTaskCompletionDto[]>([])
  const [openedCount, setOpenedCount] = useState<number>(0)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [userCount, setUserCount] = useState<number>(0)
  const [username] = useUsername()
  const { isConnected } = useAccount()
  const [showModal, setShowModal] = useState<boolean>(false)

  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    userApi
      .userControllerLeaderboard()
      .then((res) => res.data)
      .then((data) => {
        setLeaderboard(data.data || [])
        setUserCount(data.pagination?.totalCount || 0)
      })
    taskApi
      .taskControllerGetTasks('', '', 'closed', 'all', undefined, undefined, 0, 1000)
      .then((res) => res.data)
      .then((tasks) => {
        const openedTasks = (tasks?.data || []).filter((task) => task.state === 'open')
        setOpenedCount(openedTasks.length)
        setTotalCount(tasks?.pagination?.totalCount || 0)
      })
    projectApi.projectControllerGetProjects('', '', 'false', '', '', 0, 1000).then((res) => {
      setProjects(res.data.data || [])
    })
  }, [])

  useEffect(() => {
    const isSuperfluid = sessionStorage.getItem('IS_SUPERFLUID')

    console.log('isSuperfluid', isSuperfluid)

    if (isSuperfluid && (!isConnected || !username)) {
      setShowModal(true)
    }
  }, [isConnected, searchParams, username])

  useMount(() => {
    const isSuperfluid = searchParams.get('superfluid')

    if (isSuperfluid) {
      sessionStorage.setItem('IS_SUPERFLUID', 'true')

      // 删除URL中的superfluid参数
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete('superfluid')
      setSearchParams(newSearchParams, { replace: true })
    }
  })

  return (
    <div className="flex w-full flex-col gap-4 overflow-hidden">
      <div className="space-y-4">
        <h2 className="font-american-captain text-3xl font-bold tracking-tight">
          Hi, Welcome {username ? `${username}` : `to ${BRAND_NAME}`} 👋
        </h2>
        <div className="grid grid-cols-2 items-center justify-between gap-4 lg:grid-cols-4">
          <StatsCard title="Total Users" value={userCount} icon={<LucideUsers className="h-4 w-4" />} />
          <StatsCard title="Total Projects" value={projects.length} icon={<LucidePackage className="h-4 w-4" />} />
          <StatsCard title="Total Tasks" value={totalCount} icon={<LucideListChecks className="h-4 w-4" />} />
          <StatsCard title="Opened Tasks" value={openedCount} icon={<LucideCircleCheck className="h-4 w-4" />} />
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

      <BindModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
