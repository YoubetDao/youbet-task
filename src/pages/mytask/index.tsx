import { Task } from '@/types'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeleton-card'
import { useParams } from 'react-router-dom'
import http from '@/service/instance'
import { usernameAtom } from '@/store'
import { useAtom } from 'jotai'
import { TaskItem } from './task-item'
import { EmptyTasks } from './empty-task'

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

export default function MyTask() {
  const org = 'youbetdao'

  const [tasks, setTasks] = useState<Task[]>([])
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
          .get<Task[]>('/my-tasks')
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
