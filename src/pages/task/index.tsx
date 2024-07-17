import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Issue } from '@/types'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeleton-card'

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
    <Card>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 overflow-hidden rounded">
          <div className="flex items-center mb-4">
            <img className="w-12 h-12 mr-4 rounded-full" src={item.user.avatar_url} alt="User Avatar" />
            <div className="text-sm">
              <p className="leading-none text-gray-900">{item.user.login}</p>
              <p className="text-gray-600">{item.user.html_url}</p>
            </div>
          </div>
          <div className="mb-4">
            <h2 className="mb-2 text-xl font-bold">{item.title}</h2>
            <p className="text-base text-gray-700">{item.body}</p>
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
          <div className="flex gap-3 mt-4">
            <Button asChild variant="link">
              <a href={item.html_url} target="_blank" rel="noreferrer">
                View Issue
              </a>
            </Button>
            {item.pull_request && (
              <Button asChild variant="link">
                <a href={item.pull_request.html_url} target="_blank" rel="noreferrer">
                  View Pull Request
                </a>
              </Button>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button>Claim</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Task() {
  const [tasks, setTasks] = useState<Issue[]>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      const data = await fetch('/api/tasks?org=youbetdao&project=youbet-sdk')
        .then((res) => res.json())
        .catch(() => [])
      setTasks(data)
      setLoading(false)
    }
    fetchTasks()
  }, [])
  return (
    <div className="space-y-4">
      <h1>Tasks</h1>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {loading ? <SkeletonTasks /> : tasks.map((item) => <TaskItem key={item.id} item={item} />)}
      </div>
    </div>
  )
}
