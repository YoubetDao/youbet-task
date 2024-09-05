import { useMd } from '@/components/md-renderer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { usernameAtom } from '@/store'
import { useAtom } from 'jotai'
import { CircleDollarSign, FilePenLine } from 'lucide-react'
import UtterancesComments from './utterances-comments'
import { Task, User } from '@/types'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchTask as getTaskDetail } from '@/service'
import { SkeletonCard } from '@/components/skeleton-card'
import ErrorPage from '../error'
import http from '@/service/instance'

function Skeleton() {
  return (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  )
}

type TaskDetailItem = {
  id: number
  title: string
  description: string
  createdAt: string
  updatedAt: string
  deadline: string
  assignee: User
  assignees: User[]
  reporter: User
  labels: { name: string; color: string }[]
  comments: number
  priority: 'P0' | 'P1' | 'P2'
  state: string
  level: 'Easy' | 'Medium' | 'Hard' | 'Legendary'
  relative: string[]
  htmlUrl: string
  rewards: number
}

const taskDetailItem: TaskDetailItem = {
  id: 101,
  title: 'Improve Documentation',
  description: `
  ## Background
This document provides an overview of the efforts required to enhance the current product documentation.
This document provides an overview of the efforts required to enhance the current product documentation.

This document provides an overview of the efforts required to enhance the current product documentation.



  ## Overview
  This document provides an overview of the efforts required to enhance the current product documentation.


  ## References
  - [Markdown Tutorial](https://www.markdownguide.org)
  - [Technical Writing Tips](https://www.techwriting101.org)

  \`Note: Ensure regular updates and version control\`
  `,
  createdAt: '2023-10-01T10:00:00Z',
  deadline: '2023-10-15T17:00:00Z',
  updatedAt: '2023-10-05T17:00:00Z',
  rewards: 10,
  reporter: {
    login: 'Amateur0x1',
    htmlUrl: 'https://github.com/Amateur0x1',
    avatarUrl: 'https://avatars.githubusercontent.com/u/157032610?v=4',
  },
  assignee: {
    login: 'Amateur0x1',
    htmlUrl: 'https://github.com/Amateur0x1',
    avatarUrl: 'https://avatars.githubusercontent.com/u/157032610?v=4',
  },
  assignees: [
    {
      login: 'Amateur0x1',
      htmlUrl: 'https://github.com/Amateur0x1',
      avatarUrl: 'https://avatars.githubusercontent.com/u/157032610?v=4',
    },
  ],
  labels: [
    { name: 'Documentation', color: '#ff5733' },
    { name: 'Urgent', color: '#c70039' },
  ],
  priority: 'P1',
  state: 'Open',
  level: 'Legendary',
  relative: ['https://github.com/YoubetDao/youbet-test-repo/issues/15'],
  comments: 42,
  htmlUrl: 'https://github.com/YoubetDao/youbet-test-repo/issues/15',
}

const renderLevel = (level: TaskDetailItem['level']) => {
  switch (level) {
    case 'Easy':
      return (
        <Badge variant="outline" className="bg-green-500">
          Easy
        </Badge>
      )
    case 'Medium':
      return (
        <Badge variant="outline" className="bg-yellow-500">
          Medium
        </Badge>
      )
    case 'Hard':
      return (
        <Badge variant="outline" className="bg-red-500">
          Hard
        </Badge>
      )
    case 'Legendary':
      return (
        <Badge variant="outline" className="bg-purple-500">
          Legendary
        </Badge>
      )
    default:
      return null
  }
}

const renderPriority = (priority: TaskDetailItem['priority']) => {
  switch (priority) {
    case 'P0':
      return (
        <Badge variant="outline" className="bg-red-500">
          P0
        </Badge>
      )
    case 'P1':
      return (
        <Badge variant="outline" className="bg-green-500">
          P1
        </Badge>
      )
    case 'P2':
      return (
        <Badge variant="outline" className="bg-yellow-500">
          P2
        </Badge>
      )
    default:
      return null
  }
}

export interface QuestLogProps {
  task: Task
  fetchTask: () => void
}

function QuestLog({ task, fetchTask }: QuestLogProps) {
  const [username] = useAtom(usernameAtom)
  const handleClaim = async () => {
    const issueNumber = task.htmlUrl.split('/').pop()
    const org = task.htmlUrl.split('/')[3]
    const project = task.htmlUrl.split('/')[4]
    try {
      // TODO: the claim logic here will cause some exception. I don't know what happened.
      const res = await http.post('/claim-task', {
        org,
        project,
        task: issueNumber,
      })
    } catch (e) {
      console.log(e)
    }
    fetchTask()
  }

  const handleDisclaim = async () => {
    const issueNumber = task.htmlUrl.split('/').pop()
    const org = task.htmlUrl.split('/')[3]
    const project = task.htmlUrl.split('/')[4]
    try {
      // TODO: the claim logic here will cause some exception. I don't know what happened.
      const res = await http.post('/disclaim-task', {
        org,
        project,
        task: issueNumber,
      })
    } catch (e) {
      console.log(e)
    }
    fetchTask()
  }

  return (
    <div className="flex flex-col flex-shrink-0 basis-96">
      <div className="items-center mt-2">
        {task.state === 'Closed' ? (
          <Button disabled className="w-24 text-white border border-muted hover:bg-white/10 hover:border-opacity-80">
            Closed
          </Button>
        ) : !task.assignee || !task.assignee.login ? (
          <Button
            onClick={handleClaim}
            variant="emphasis"
            className="w-24 text-white border border-muted hover:bg-white/10 hover:border-opacity-80"
          >
            Claim
          </Button>
        ) : task.assignee.login === username ? (
          <Button
            onClick={handleDisclaim}
            variant="emphasis"
            className="w-24 text-white border border-muted bg-gray-8/50 hover:bg-white/10 hover:border-opacity-80 text-l"
          >
            Disclaim
          </Button>
        ) : (
          <Button disabled className="w-24 text-white border border-muted hover:bg-white/10 hover:border-opacity-80">
            Claimed
          </Button>
        )}
      </div>
      <Card className="sticky top-0 left-0 mt-4 bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-muted">
          <CardTitle className="relative justify-center text-2xl">Quest Log</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col mt-2 font-serif gap-y-4">
          <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">Assignee</Label>
            {task.assignee && Object.keys(task.assignee).length > 0 && (
              <div className="flex flex-row items-center justify-between gap-2">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={task.assignee.avatarUrl} alt="Avatar" />
                  <AvatarFallback>{task.assignee.login.charAt(0)}</AvatarFallback>
                </Avatar>
                {task.assignee.login}
              </div>
            )}
          </div>
          <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">Rewards</Label>
            <span className="flex flex-row items-center gap-1">
              <CircleDollarSign /> {taskDetailItem.rewards}
            </span>
          </div>
          <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">Created At</Label>
            <span className="flex flex-row items-center gap-1">{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
          {/* <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">Deadline</Label>
            <span className="flex flex-row items-center gap-1">{taskDetailItem.deadline}</span>
          </div> */}
          <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">Level</Label>
            {renderLevel(taskDetailItem.level)}
            {/* <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={taskDetailItem.difficulty} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
                <SelectItem value="legendary">Legendary</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">Priority</Label>
            {renderPriority(taskDetailItem.priority)}
            {/* <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={taskDetailItem.priority} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          {/* <div className="flex flex-row items-center justify-between pt-2">
            <Label className="w-40">Development</Label>
            <Button asChild variant="link" className="font-bold text-l">
              <a href={taskDetailItem.development}>branch</a>
            </Button>
          </div> */}
          {/* <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">Reporter</Label>
            {task.assignee && (
              <div className="flex flex-row items-center justify-between gap-2">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={task.assignee.avatarUrl} alt="Avatar" />
                  <AvatarFallback>{task.assignee.login.charAt(0)}</AvatarFallback>
                </Avatar>
                {task.assignee.login}
              </div>
            )}
          </div> */}
          <div className="flex flex-row items-center justify-start pt-2">
            <Label className="w-40">assignees</Label>
            <div className="flex flex-row items-center justify-between gap-2">
              {task.assignees.map((participant, index) => (
                <Avatar key={index} className="w-7 h-7">
                  <AvatarImage src={participant.avatarUrl} alt="Avatar" />
                  <AvatarFallback>{participant.login.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TaskDetailPage() {
  const { githubId } = useParams()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const { MdRenderer } = useMd(task?.body || '')
  const fetchTask = async () => {
    if (githubId) {
      try {
        setLoading(true)
        const task = await getTaskDetail(githubId)
        setTask(task)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching content:', error)
      }
    }
  }

  useEffect(() => {
    fetchTask()
  }, [githubId])

  if (loading) {
    return <Skeleton />
  }

  if (task == null) {
    return <ErrorPage />
  }

  return (
    <div className="px-4 py-4 mx-auto lg:px-12 max-w-7xl">
      <div className="flex flex-col-reverse w-full gap-5 mt-5 xl:flex-row">
        <article className="flex flex-col w-full gap-5">
          <header>
            <h1 className="text-4xl font-bold">{task.title}</h1>
          </header>
          <div className="flex flex-row gap-3">
            {task.labelsWithColors &&
              task.labelsWithColors.length > 0 &&
              task.labelsWithColors.map((label, index) => (
                <Badge key={index} variant="outline" style={{ backgroundColor: label.color }}>
                  {label.name}
                </Badge>
              ))}
          </div>
          <div className="flex flex-row w-full">
            <div className="flex flex-col items-start flex-1 gap-10 mr-4">
              <MdRenderer />
              <div className="flex flex-row items-center justify-between w-full">
                <Button variant="link" className="gap-3 text-blue-500">
                  <FilePenLine className="w-5 h-5" />
                  <a href={task.htmlUrl}>Edit it in Github</a>
                </Button>
                <span className="text-l text-slate-500">Updated At: {task.updatedAt}</span>
              </div>

              <div className="w-full">
                <UtterancesComments task={task} />
              </div>
            </div>
          </div>
        </article>

        <QuestLog fetchTask={fetchTask} task={task} />
      </div>
    </div>
  )
}
