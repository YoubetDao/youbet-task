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
import { Input } from '@/components/ui/input'
import { LucideSearch } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [all, setAll] = useState<string>('All')

  const fetchTasks = async () => {
    setLoading(true)
    const data = await http
      .get(`/tasks?project=${project}&limit=100`)
      .then((res) => res.data.data)
      .catch(() => [])
    setTasks(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [project])

  const handleCategoryChange = (value: string[]) => {
    if (value.length) {
      setAll('')
    } else {
      setAll('All')
    }
    setSelectedCategories(value)
  }

  const handleSelectAll = (value: string) => {
    if (value) {
      setSelectedCategories([])
      setAll(value)
    } else {
      setAll('')
    }
  }

  const handleClaim = async (item: Task) => {
    const issueNumber = item.htmlUrl.split('/').pop()
    try {
      // TODO: the claim logic here will cause some exception. I don't know what happened.
      await http.post('/claim-task', {
        org: 'youbetdao',
        project,
        task: issueNumber,
      })
    } catch (e) {
      console.log(e)
    }
    setTasks(tasks.map((task) => (task._id === item._id ? { ...task, state: 'open' } : task)))
    // fetchTasks()
  }

  const handleDisclaim = async (item: Task) => {
    const issueNumber = item.htmlUrl.split('/').pop()
    try {
      const res = await http.post('/disclaim-task', {
        org: 'youbetdao',
        project,
        task: issueNumber,
      })
    } catch (e) {
      console.log(e)
    }
    fetchTasks()
  }

  return (
    <div className="px-4 py-4 mx-auto lg:px-12 max-w-7xl">
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
      <div className="flex flex-col gap-5">
        <div className="relative">
          <Input placeholder="Search tutorial title or description" className="pl-8 bg-background/80" />
          <LucideSearch className="absolute w-4 h-4 -translate-y-1/2 top-1/2 left-2" />
        </div>
        <div className="flex space-x-2">
          <ToggleGroup size="sm" type="single" value={all} onValueChange={handleSelectAll}>
            <ToggleGroupItem value="All">All</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <SkeletonTasks />
          ) : tasks.length ? (
            tasks.map((item) => (
              // TODO: item.title will be duplicated
              <TaskItem key={item.htmlUrl} item={item} onClaim={handleClaim} onDisclaim={handleDisclaim} />
            ))
          ) : (
            <EmptyTasks />
          )}
        </div>
      </div>
    </div>
  )
}
