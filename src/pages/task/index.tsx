import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Issue } from '@/types'
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
import ReactMarkdown from 'react-markdown'

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

function TaskItem({ item }: { item: Issue }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col justify-between h-full overflow-hidden rounded">
          <div>
            <div className="flex items-center mb-4">
              <img className="w-12 h-12 mr-4 rounded-full" src={item.user.avatar_url} alt="User Avatar" />
              <div className="text-sm">
                <p className="leading-none text-gray-900">{item.user.login}</p>
                <p className="text-gray-600">{item.user.html_url}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-base text-gray-700">
                <ReactMarkdown>{item.body}</ReactMarkdown>
              </p>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-600">State: {item.state}</p>
                <p className="text-gray-600">Comments: {item.comments}</p>
              </div>
              <div>
                <p className="text-gray-600">Created At: {new Date(item.created_at).toLocaleDateString()}</p>
                <p className="text-gray-600">Updated At: {new Date(item.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <Button asChild variant="link">
              <a href={item.html_url} target="_blank" rel="noreferrer">
                View Issue
              </a>
            </Button>
            <Button>Claim</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyTasks() {
  return (
    <div className="w-full hyphens-none">
      <div className="text-2xl">No Tasks</div>
    </div>
  )
}

export default function Task() {
  const [tasks, setTasks] = useState<Issue[]>([])
  const [loading, setLoading] = useState(false)
  const { project } = useParams<{ project: string }>()

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      const data = await fetch(`/api/tasks?org=youbetdao&project=${project}`)
        .then((res) => res.json())
        .catch(() => [])
      setTasks(data)
      setLoading(false)
    }
    fetchTasks()
  }, [project])

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
          tasks.map((item) => <TaskItem key={item.id} item={item} />)
        ) : (
          <EmptyTasks />
        )}
      </div>
    </div>
  )
}
