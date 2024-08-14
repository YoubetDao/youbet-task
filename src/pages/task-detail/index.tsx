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
interface User {
  login: string
  htmlUrl: string
  avatarUrl: string
}

type TaskDetailItem = {
  id: number
  title: string
  description: string
  initiatedAt: string
  updatedAt: string
  deadline: string
  assignee: User
  participants: User[]
  reporter: User
  labels: { name: string; color: string }[]
  comments: number
  priority: 'P0' | 'P1' | 'P2'
  state: 'Open' | 'In Progress' | 'Closed'
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
  initiatedAt: '2023-10-01T10:00:00Z',
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
  participants: [
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
      return null // 或者返回一个默认的组件
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
      return null // 可选：处理未知优先级
  }
}

function QuestLog() {
  const [username] = useAtom(usernameAtom)
  const handleClaim = () => {
    // Todo
  }

  const handleDisclaim = () => {
    // Todo
  }
  return (
    <div className="flex-shrink-0 basis-96 flex flex-col">
      <div className="items-center mt-2">
        {taskDetailItem.state === 'Closed' ? (
          <Button disabled className="w-24 border border-muted text-white hover:border-opacity-80 hover:bg-white/10">
            Closed
          </Button>
        ) : !taskDetailItem.assignee ? (
          <Button
            onClick={handleClaim}
            variant="emphasis"
            className="w-24 border border-muted text-white hover:border-opacity-80 hover:bg-white/10"
          >
            Claim
          </Button>
        ) : taskDetailItem.assignee.login === username ? (
          <Button
            onClick={handleDisclaim}
            variant="emphasis"
            className="w-24 text-l border bg-gray-8/50 border-muted text-white hover:border-opacity-80 hover:bg-white/10"
          >
            Disclaim
          </Button>
        ) : (
          <Button disabled className="w-24 border border-muted text-white hover:border-opacity-80 hover:bg-white/10">
            Claimed
          </Button>
        )}
      </div>
      <Card className="sticky top-0 left-0 bg-transparent mt-4">
        <CardHeader className="py-4 flex flex-row justify-between items-center border-b border-muted">
          <CardTitle className="relative text-2xl justify-center">Quest Log</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4 font-serif mt-2">
          <div className="flex flex-row items-center justify-start pt-2 ">
            <Label className="w-40">Assignee</Label>
            <div className="flex flex-row items-center justify-between gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={taskDetailItem.assignee.avatarUrl} alt="Avatar" />
                <AvatarFallback>{taskDetailItem.assignee.login.charAt(0)}</AvatarFallback>
              </Avatar>
              {taskDetailItem.assignee.login}
            </div>
          </div>
          {/* <div className="flex flex-row items-center justify-between pt-2 ">
            <Label className="w-40">Candidates</Label>
            <div className="flex flex-row items-center justify-between gap-2">
              {taskDetailItem.candidates.map((candidate, index) => (
                <Avatar key={index} className="h-7 w-7">
                  <AvatarImage src={candidate.avatarUrl} alt="Avatar" />
                  <AvatarFallback>{candidate.login.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div> */}
          <div className="flex flex-row items-center justify-start pt-2 ">
            <Label className="w-40">Rewards</Label>
            <span className="flex flex-row items-center gap-1">
              <CircleDollarSign /> {taskDetailItem.rewards}
            </span>
          </div>
          <div className="flex flex-row items-center justify-start pt-2 ">
            <Label className="w-40">Initiated At</Label>
            <span className="flex flex-row items-center gap-1">{taskDetailItem.initiatedAt}</span>
          </div>
          <div className="flex flex-row items-center justify-start pt-2 ">
            <Label className="w-40">Deadline</Label>
            <span className="flex flex-row items-center gap-1">{taskDetailItem.deadline}</span>
          </div>
          <div className="flex flex-row items-center justify-start pt-2 ">
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
          <div className="flex flex-row items-center justify-start pt-2 ">
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
          {/* <div className="flex flex-row items-center justify-between pt-2 ">
            <Label className="w-40">Development</Label>
            <Button asChild variant="link" className="text-l font-bold">
              <a href={taskDetailItem.development}>branch</a>
            </Button>
          </div> */}
          <div className="flex flex-row items-center justify-start pt-2 ">
            <Label className="w-40">Reporter</Label>
            <div className="flex flex-row items-center justify-between gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={taskDetailItem.assignee.avatarUrl} alt="Avatar" />
                <AvatarFallback>{taskDetailItem.assignee.login.charAt(0)}</AvatarFallback>
              </Avatar>
              {taskDetailItem.assignee.login}
            </div>
          </div>
          <div className="flex flex-row items-center justify-start pt-2 ">
            <Label className="w-40">Participants</Label>
            <div className="flex flex-row items-center justify-between gap-2">
              {taskDetailItem.participants.map((participant, index) => (
                <Avatar key={index} className="h-7 w-7">
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
  const { MdRenderer } = useMd(taskDetailItem.description)

  return (
    <div className="px-4 py-4 mx-auto max-w-7xl lg:px-12">
      <div className="flex flex-row w-full gap-5 mt-5">
        <article className="flex flex-col w-full gap-5">
          <header>
            <h1 className="text-4xl font-bold">{taskDetailItem.title}</h1>
          </header>
          <div className="flex flex-row gap-3">
            {taskDetailItem.labels.length > 0 &&
              taskDetailItem.labels.map((label, index) => (
                <Badge key={index} variant="outline" style={{ backgroundColor: label.color }}>
                  {label.name}
                </Badge>
              ))}
          </div>
          <div className="flex flex-row w-full">
            <div className="flex flex-col flex-1 items-start mr-4 gap-10">
              <MdRenderer />
              <div className="flex flex-row w-full justify-between items-center">
                <Button variant="link" className="gap-3 text-blue-500">
                  <FilePenLine className="w-5 h-5" />
                  <a href={taskDetailItem.htmlUrl}>Edit it in Github</a>
                </Button>
                <span className="text-l text-slate-500">Updated At: {taskDetailItem.updatedAt}</span>
              </div>

              <div className="w-full">
                <UtterancesComments />
              </div>
            </div>
          </div>
        </article>

        <QuestLog />
      </div>
    </div>
  )
}

// <Button variant="emphasis">
//                 {taskDetailItem.isPinned ? (
//                   <div className="flex flex-row gap-3 items-center text-l">
//                     <Pin />
//                     <Label className="w-40">Pin</Label>
//                   </div>
//                 ) : (
//                   <div className="flex flex-row gap-3 items-center text-xl">
//                     <PinOff />
//                     <Label className="w-40">Unpin</Label>
//                   </div>
//                 )}
//               </Button>
//               <Button variant="emphasis" className="gap-3">
//                 <Eye />
//                 Watching
//                 <span className="bg-slate-600 rounded-full p-1">{taskDetailItem.watchers}</span>
//               </Button>
//               <Button variant="emphasis" className="gap-3">
//                 <ThumbsUp />
//                 Supporters
//                 <span className="bg-slate-600 rounded-full p-1">{taskDetailItem.supporters}</span>
//               </Button>
//               <div></div>
