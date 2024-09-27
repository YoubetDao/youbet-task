import { useMd } from '@/components/md-renderer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { CircleDollarSign, FilePenLine, Loader2 } from 'lucide-react'
import UtterancesComments from './utterances-comments'
import { Task, TaskApply, User } from '@/types'
import { useParams } from 'react-router-dom'
import { applyTask, fetchTask as getTaskDetail, myAppliesForTask, withdrawApply } from '@/service'
import { SkeletonCard } from '@/components/skeleton-card'
import ErrorPage from '../error'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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

function QuestLog() {
  const { githubId = '' } = useParams()
  const { data: task } = useTask(githubId)
  const { data: myApplies = [], isLoading: isMyAppliesLoading } = useMyApplies(githubId)
  const queryClient = useQueryClient()
  const { mutateAsync: applyTaskAsync, isLoading: _isClaiming } = useMutation({
    mutationFn: applyTask,
  })
  const isClaiming = _isClaiming || isMyAppliesLoading
  const { mutateAsync: withdrawApplyAsync, isLoading: _isWithdrawing } = useMutation({
    mutationFn: withdrawApply,
  })
  const isWithdrawing = _isWithdrawing || isMyAppliesLoading

  const handleClaim = async () => {
    try {
      await applyTaskAsync({
        taskGithubId: githubId,
        comment: 'I would like to claim this issue.',
      })
    } catch (error) {
      console.error('Error claiming task:', error)
    }
    queryClient.invalidateQueries({ queryKey: ['myApplies', githubId] })
  }

  const handleDisclaim = async () => {
    if (myApplies.length > 0) {
      await withdrawApplyAsync({
        id: myApplies[0]._id,
      })
      queryClient.invalidateQueries({ queryKey: ['myApplies', githubId] })
    }
  }

  if (task == null) {
    return null
  }

  return (
    <div className="flex flex-col flex-shrink-0 basis-96">
      <div className="items-center mt-2">
        {task.state === 'closed' ? (
          <Button disabled className="border-muted hover:bg-white/10 border hover:border-opacity-80 text-white">
            Closed
          </Button>
        ) : task.assignee && task.assignee.login ? (
          <Button disabled className="border-muted hover:bg-white/10 border hover:border-opacity-80 text-white">
            Assigned
          </Button>
        ) : myApplies.length == 0 ? (
          <Button
            disabled={isClaiming}
            onClick={handleClaim}
            variant="emphasis"
            className="border-muted hover:bg-white/10 border hover:border-opacity-80 text-white"
          >
            Apply
            {isClaiming && <Loader2 className="ml-2 w-4 h-4 animate-spin" />}
          </Button>
        ) : (
          <Button
            disabled={isWithdrawing}
            onClick={handleDisclaim}
            variant="emphasis"
            className="border-muted bg-gray-8/50 hover:bg-white/10 border hover:border-opacity-80 text-l text-white"
          >
            Withdraw
            {isWithdrawing && <Loader2 className="ml-2 w-4 h-4 animate-spin" />}
          </Button>
        )}
      </div>
      <Card className="top-0 left-0 sticky bg-transparent mt-4">
        <CardHeader className="flex flex-row justify-between items-center border-muted py-4 border-b">
          <CardTitle className="relative justify-center text-2xl">Quest Log</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4 mt-2 font-serif">
          <div className="flex flex-row justify-start items-center pt-2">
            <Label className="w-40">Assignee</Label>
            {task.assignee && Object.keys(task.assignee).length > 0 && (
              <div className="flex flex-row justify-between items-center gap-2">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={task.assignee.avatarUrl} alt="Avatar" />
                  <AvatarFallback>{task.assignee.login.charAt(0)}</AvatarFallback>
                </Avatar>
                {task.assignee.login}
              </div>
            )}
          </div>
          <div className="flex flex-row justify-start items-center pt-2">
            <Label className="w-40">Rewards</Label>
            <span className="flex flex-row items-center gap-1">
              <CircleDollarSign /> {10}
            </span>
          </div>
          <div className="flex flex-row justify-start items-center pt-2">
            <Label className="w-40">Created At</Label>
            <span className="flex flex-row items-center gap-1">{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-row justify-start items-center pt-2">
            <Label className="w-40">Level</Label>
            {renderLevel('Easy')}
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
          <div className="flex flex-row justify-start items-center pt-2">
            <Label className="w-40">Priority</Label>
            {renderPriority('P0')}
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
          {/* <div className="flex flex-row justify-between items-center pt-2">
            <Label className="w-40">Development</Label>
            <Button asChild variant="link" className="font-bold text-l">
              <a href={taskDetailItem.development}>branch</a>
            </Button>
          </div> */}
          {/* <div className="flex flex-row justify-start items-center pt-2">
            <Label className="w-40">Reporter</Label>
            {task.assignee && (
              <div className="flex flex-row justify-between items-center gap-2">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={task.assignee.avatarUrl} alt="Avatar" />
                  <AvatarFallback>{task.assignee.login.charAt(0)}</AvatarFallback>
                </Avatar>
                {task.assignee.login}
              </div>
            )}
          </div> */}
          <div className="flex flex-row justify-start items-center pt-2">
            <Label className="w-40">assignees</Label>
            <div className="flex flex-row justify-between items-center gap-2">
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

function useTask(githubId?: string) {
  return useQuery<Task>({
    queryKey: ['task', githubId],
    queryFn: () => getTaskDetail(githubId as string),
    enabled: !!githubId,
  })
}

function useMyApplies(githubId?: string) {
  return useQuery<TaskApply[]>({
    queryKey: ['myApplies', githubId],
    queryFn: () => myAppliesForTask(githubId as string),
    enabled: !!githubId,
  })
}

export default function TaskDetailPage() {
  const { githubId } = useParams()
  const { data: task, isInitialLoading: loading } = useTask(githubId)
  const { MdRenderer } = useMd(task?.body || '')

  if (loading) {
    return <Skeleton />
  }

  if (task == null) {
    return <ErrorPage />
  }

  return (
    <div className="mx-auto px-4 lg:px-12 py-4 max-w-7xl">
      <div className="flex xl:flex-row flex-col-reverse gap-5 mt-5 w-full">
        <article className="flex flex-col gap-5 w-full">
          <header>
            <h1 className="font-bold text-4xl">{task.title}</h1>
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
            <div className="flex flex-col flex-1 items-start gap-10 mr-4">
              <MdRenderer />
              <div className="flex flex-row justify-between items-center w-full">
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

        <QuestLog />
      </div>
    </div>
  )
}
