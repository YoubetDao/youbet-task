import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Issue } from '@/types'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeleton-card'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import http from '@/service/instance'
import { usernameAtom } from '@/store'
import { useAtom } from 'jotai'

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
              <img className="w-12 h-12 mr-4 rounded-full" src={item.assignee?.avatarUrl} alt="User Avatar" />
              <div className="text-sm">
                <p className="leading-none text-gray-900">{item.assignee?.login}</p>
                <p className="text-gray-600">{item.assignee?.htmlUrl}</p>
              </div>
            </div>
            <div className="mb-4">
              {item.body && (
                <div className="text-base text-gray-700">
                  <ReactMarkdown>{item.body}</ReactMarkdown>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-600">State: {item.state}</p>
              </div>
              <div>
                <p className="text-gray-600">Created At: {new Date(item.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-600">Updated At: {new Date(item.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-8">
            <Button asChild variant="link">
              <a href={item.htmlUrl} target="_blank" rel="noreferrer">
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
  const [username] = useAtom(usernameAtom)

  useEffect(() => {
    const fetchTasks = async () => {
      if (!username) {
        setTasks([])
        return
      }

      setLoading(true)

      try {
        const myTasks = await http
          .get<Issue[]>('/my-tasks')
          .then((res) => res.data)
          .catch(() => [])
        setTasks(myTasks)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        setTasks([])
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [project, username])

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
