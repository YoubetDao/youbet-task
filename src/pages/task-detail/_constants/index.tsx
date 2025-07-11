import { Badge } from '@/components/ui/badge'
import { User } from '@/types'

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
const formatAmount = (amount: number | undefined, decimals: number) => {
  if (amount === undefined) return 0
  return amount / Math.pow(10, decimals)
}

const parseAmount = (amount: string, decimals: number) => {
  return Math.floor(Number(amount) * Math.pow(10, decimals))
}

export { TaskDetailItem, renderLevel, renderPriority, formatAmount, parseAmount }
