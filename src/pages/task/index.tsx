import { Task } from '@/types'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeleton-card'
import { Link, useParams } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import http from '@/service/instance'
import { NetworkType, SDK } from 'youbet-sdk'
import { TaskItem } from './task-item'
import { EmptyTasks } from './empty-task'

const sdk = new SDK({
  networkType: NetworkType.Testnet, // or NetworkType.Testnet
})

function SkeletonTasks() {
  return (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  )
}

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const { project } = useParams<{ project: string }>()

  const fetchTasks = async () => {
    setLoading(true)
    const data = await http
      .get(`/tasks?project=${project}`)
      .then((res) => res.data)
      .catch(() => [])
    setTasks(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [project])

  const handleClaim = async (item: Task) => {
    const issueNumber = item.htmlUrl.split('/').pop()
    try {
      // TODO: the claim logic here will cause some exception. I don't know what happened.
      const res = await http.post('/claim-task', {
        org: 'youbetdao',
        project,
        task: issueNumber,
      })
      console.log(res)
    } catch (e) {
      console.log(e)
    }
    fetchTasks()
  }

  const handleDisclaim = async (item: Task) => {
    const issueNumber = item.htmlUrl.split('/').pop()
    try {
      const res = await http.post('/disclaim-task', {
        org: 'youbetdao',
        project,
        task: issueNumber,
      })
      console.log(res)
    } catch (e) {
      console.log(e)
    }
    fetchTasks()
  }

  return (
    <div className="space-y-4">
      <Breadcrumb className="py-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/projects">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{project}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tasks</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <SkeletonTasks />
        ) : tasks.length ? (
          tasks.map((item) => (
            <TaskItem key={item.title} item={item} onClaim={handleClaim} onDisclaim={handleDisclaim} />
          ))
        ) : (
          <EmptyTasks />
        )}
      </div>
    </div>
  )
}
