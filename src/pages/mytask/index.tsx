import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Issue, Repository } from '@/types'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeleton-card'
import { useParams } from 'react-router-dom'
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
        <div className="flex h-full flex-col justify-between overflow-hidden rounded">
          <div>
            <div className="mb-4 flex items-center">
              <img className="mr-4 h-12 w-12 rounded-full" src={item.user.avatar_url} alt="User Avatar" />
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
              </div>
              <div>
                <p className="text-gray-600">Created At: {new Date(item.created_at).toLocaleDateString()}</p>
                <p className="text-gray-600">Updated At: {new Date(item.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-2">
            <Button asChild variant="link">
              <a href={item.url} target="_blank" rel="noreferrer">
                View Issue
              </a>
            </Button>
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

export default function MyTask() {
  const org = 'youbetdao'

  const [tasks, setTasks] = useState<Issue[]>([])
  const [loading, setLoading] = useState(false)
  const { project } = useParams<{ project: string }>()

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)

      try {
        // const projectsData = await fetch(`/api/projects?org=${org}`).then((res) => res.json())
        const projects = await fetch('/api/projects?org=youbetdao')
          .then((res) => res.json())
          .catch(() => [])

        let allTasks: Issue[] = []

        const tasksPromises = projects.map(async (project: Repository) => {
          const projectTasks = await fetch(`/api/tasks?org=${org}&project=${project.name}&assignee=${'wfnuser'}`)
            .then((res) => res.json())
            .catch(() => [])
          return projectTasks
        })

        const tasks = await Promise.all(tasksPromises)

        tasks.forEach((task) => {
          allTasks = allTasks.concat(task)
        })

        setTasks(allTasks)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        setTasks([])
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [project])

  return (
    <div className="space-y-4">
      <h1>My Task</h1>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <SkeletonTasks />
        ) : tasks.length ? (
          tasks.map((item) => <TaskItem key={item.title} item={item} />)
        ) : (
          <EmptyTasks />
        )}
      </div>
    </div>
  )
}
