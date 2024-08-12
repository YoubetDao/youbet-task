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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ReactMarkdown from 'react-markdown'
import http from '@/service/instance'
import { NetworkType, SDK } from 'youbet-sdk'
import { usernameAtom } from '@/store'
import { useAtom } from 'jotai'

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

function TaskItem({
  item,
  onClaim,
  onDisclaim,
}: {
  item: Issue
  onClaim: (item: Issue) => void
  onDisclaim: (item: Issue) => void
}) {
  const [username] = useAtom(usernameAtom)
  const handleClaim = () => {
    onClaim(item)
  }

  const handleDisclaim = () => {
    onDisclaim(item)
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col justify-between h-full overflow-hidden rounded">
          <div>
            <div className="flex items-center mb-4">
              {/* <img className="w-12 h-12 mr-4 rounded-full" src={item.user.avatarUrl} alt="User Avatar" />
              <div className="text-sm">
                <p className="leading-none text-gray-900">{item.user.login}</p>
                <p className="text-gray-600">{item.user.htmlUrl}</p>
              </div> */}
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
            {item.body && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="link">Description</Button>
                </PopoverTrigger>
                <PopoverContent side="right" className="w-[500px] h-[250px] overflow-y-auto">
                  <ReactMarkdown className="prose">{item.body}</ReactMarkdown>
                </PopoverContent>
              </Popover>
            )}
            <Button asChild variant="link">
              <a href={item.htmlUrl} target="_blank" rel="noreferrer">
                View Issue
              </a>
            </Button>
            {item.state === 'closed' ? (
              <Button disabled>Closed</Button>
            ) : !item.assignees.length ? (
              <Button onClick={handleClaim}>Claim</Button>
            ) : item.assignees.some((assignee) => assignee.login === username) ? (
              <Button onClick={handleDisclaim}>Disclaim</Button>
            ) : (
              <Button disabled>Claimed</Button>
            )}
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

  const handleClaim = async (item: Issue) => {
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

  const handleDisclaim = async (item: Issue) => {
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
