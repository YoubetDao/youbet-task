import { Task } from '@/types'
import { useEffect, useState } from 'react'
import { SkeletonCard } from '@/components/skeleton-card'
import { Link, useParams } from 'react-router-dom'
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
    <div className="px-4 py-4 mx-auto max-w-7xl lg:px-12">
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <SkeletonTasks />
        ) : tasks.length ? (
          // TODO: key should not be htmlUrl; but title is not unique.
          tasks.map((item, id) => (
            <Link key={id} to={`/task/${item.githubId}`}>
              <TaskItem item={item} />
            </Link>
          ))
        ) : (
          <EmptyTasks />
        )}
      </div>
    </div>
  )
}
