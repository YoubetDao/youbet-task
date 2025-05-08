import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, Filter, LayoutGrid, List, Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
// Add the import for Task and Activity types at the top of the file
import type { TaskV2, Activity } from '@/types'

export default function Tasks() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 lg:px-12">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Main content */}
        <main className="flex-1">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold">Task Hall</h1>
              <p className="text-slate-500 dark:text-slate-400">Discover and claim GitHub issues as tasks</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-md border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <p className="mb-2 text-xs font-medium">By Technology</p>
                    <div className="mb-3 flex flex-wrap gap-1">
                      <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                        TypeScript
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                        React
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                        PostgreSQL
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                        Cassandra
                      </Badge>
                    </div>

                    <p className="mb-2 text-xs font-medium">By Difficulty</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                        Easy
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                        Medium
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                        Hard
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Select defaultValue="newest">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="reward">Highest Reward</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search tasks..." className="border-0 bg-slate-100 pl-9 dark:bg-slate-800" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="claimed">Claimed</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <TaskListItem key={task.id} task={task} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="open" className="mt-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tasks
                    .filter((task) => task.status === 'open')
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks
                    .filter((task) => task.status === 'open')
                    .map((task) => (
                      <TaskListItem key={task.id} task={task} />
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="trending" className="mt-6">
              <div className="flex items-center justify-center p-12">
                <p className="text-slate-500">Trending tasks will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="claimed" className="mt-6">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tasks
                    .filter((task) => task.status === 'assigned')
                    .map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks
                    .filter((task) => task.status === 'assigned')
                    .map((task) => (
                      <TaskListItem key={task.id} task={task} />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing 1-9 of 57 tasks</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 bg-purple-50 text-purple-600 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
              >
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </main>

        {/* Right sidebar - Stats and activity */}
        <aside className="shrink-0 lg:w-72">
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold">Your Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                    <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Tasks Completed</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Rewards Earned</p>
                    <p className="text-2xl font-bold">$240</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Current Streak</p>
                    <p className="text-2xl font-bold">3 days</p>
                  </div>
                  <div className="rounded-lg bg-sky-50 p-3 dark:bg-sky-900/20">
                    <p className="text-xs font-medium text-sky-600 dark:text-sky-400">Rank</p>
                    <p className="text-2xl font-bold">#42</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold">Recent Activity</h3>
                <ScrollArea className="h-[280px] pr-4">
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.avatar || '/placeholder.svg'} />
                          <AvatarFallback>{activity.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-slate-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Trending Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold">Trending Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'React',
                    'TypeScript',
                    'PostgreSQL',
                    'API',
                    'Frontend',
                    'Backend',
                    'Database',
                    'UI/UX',
                    'Performance',
                  ].map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}

// Update the TaskCard component to display the reward correctly
function TaskCard({ task }: { task: TaskV2 }) {
  const getTechBadgeColor = (tech: string): string => {
    const colors: Record<string, string> = {
      TypeScript:
        'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      PostgreSQL:
        'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      Cassandra:
        'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      CUDA: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800',
      SQL: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      default:
        'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    }

    return colors[tech] || colors.default
  }

  const getDifficultyColor = (difficulty: string): string => {
    const colors: Record<string, string> = {
      easy: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800',
      medium:
        'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      hard: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800',
    }

    return colors[difficulty] || colors.medium
  }

  const getStatusColor = (status: string): string => {
    return status === 'open'
      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
      : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800'
  }

  // Add a function to format the reward display
  const formatReward = (reward?: { amount: number; symbol: string }): string => {
    if (!reward) return 'N/A'
    return `${reward.amount} ${reward.symbol}`
  }

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <CardContent className="flex-1 p-5">
        <div className="mb-3 flex items-start justify-between">
          <Badge className={getStatusColor(task.status)} variant="outline">
            {task.status === 'open' ? 'Open' : 'Assigned'}
          </Badge>
          <Badge className={getDifficultyColor(task.difficulty)} variant="outline">
            {task.difficulty}
          </Badge>
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{task.title}</h3>
        <p className="mb-4 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">
          {task.description || 'No description...'}
        </p>

        <div className="mb-4 flex flex-wrap gap-1">
          {task.technologies.map((tech) => (
            <Badge key={tech} variant="outline" className={getTechBadgeColor(tech)}>
              {tech}
            </Badge>
          ))}
        </div>

        {task.reference && (
          <div className="mb-4 truncate text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Reference:</span> {task.reference}
          </div>
        )}

        {task.reward && (
          <div className="mb-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            Reward: {formatReward(task.reward)}
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto p-5 pt-0">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.avatar || '/placeholder.svg'} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex items-center text-xs text-slate-500">
              <Clock className="mr-1 h-3 w-3" />
              <span>{task.time}</span>
            </div>
          </div>

          <Button size="sm" variant={task.status === 'open' ? 'default' : 'secondary'}>
            {task.status === 'open' ? 'Claim Task' : 'View Details'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Update the TaskListItem component definition
function TaskListItem({ task }: { task: TaskV2 }) {
  const getStatusColor = (status: 'open' | 'assigned'): string => {
    return status === 'open'
      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
      : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800'
  }

  return (
    <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge className={getStatusColor(task.status)} variant="outline">
                {task.status === 'open' ? 'Open' : 'Assigned'}
              </Badge>
              <Badge
                variant="outline"
                className={
                  task.difficulty === 'easy'
                    ? 'border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : task.difficulty === 'hard'
                    ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
                    : 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400'
                }
              >
                {task.difficulty}
              </Badge>
            </div>

            <h3 className="mb-1 text-lg font-semibold">{task.title}</h3>
            <p className="mb-2 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
              {task.description || 'No description...'}
            </p>

            <div className="mb-2 flex flex-wrap gap-1">
              {task.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="px-1.5 py-0 text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 sm:flex-col sm:items-end">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.avatar || '/placeholder.svg'} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex items-center text-xs text-slate-500">
                <Clock className="mr-1 h-3 w-3" />
                <span>{task.time}</span>
              </div>
            </div>

            <Button size="sm" variant={task.status === 'open' ? 'default' : 'secondary'}>
              {task.status === 'open' ? 'Claim Task' : 'View Details'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Update the tasks array type
const tasks: TaskV2[] = [
  {
    id: 1,
    title: 'Enhance Sink to Support Retrieving Data',
    description:
      'Background Currently, the sink already supports the get_data function. However, in order to support retrieving data from the sink, we need to enhance it.',
    time: '2 days ago',
    status: 'assigned',
    avatar: '/placeholder.svg',
    technologies: ['TypeScript', 'API'],
    difficulty: 'medium',
    reference: '',
    reward: {
      amount: 50,
      decimals: 0,
      symbol: 'USD',
      tokenAddress: '0x123',
    },
  },
  {
    id: 2,
    title: 'Ecosystem Page Redesign',
    description:
      'Redesign the ecosystem page to improve user experience and visual appeal. Focus on responsive design and accessibility.',
    time: '2 days ago',
    status: 'assigned',
    avatar: '/placeholder.svg',
    technologies: ['React', 'UI/UX'],
    difficulty: 'medium',
    reference: '',
    reward: {
      amount: 75,
      decimals: 0,
      symbol: 'USD',
      tokenAddress: '0x123',
    },
  },
  {
    id: 3,
    title: 'Achieve Support for PostgreSQL Database Integration',
    description:
      'Implement full support for PostgreSQL database integration including connection pooling, migrations, and query optimization.',
    time: '2 days ago',
    status: 'open',
    avatar: '/placeholder.svg',
    technologies: ['PostgreSQL', 'TypeScript'],
    difficulty: 'hard',
    reference: '',
    reward: {
      amount: 120,
      decimals: 0,
      symbol: 'USD',
      tokenAddress: '0x123',
    },
  },
  {
    id: 4,
    title: 'Achieve Support for Cassandra Database',
    description: 'Add support for Cassandra database with proper data modeling and query optimization.',
    reference: 'https://docs.rs/scylla/latest/scylla/',
    time: '2 days ago',
    status: 'open',
    avatar: '/placeholder.svg',
    technologies: ['Cassandra', 'TypeScript'],
    difficulty: 'hard',
    reward: {
      amount: 150,
      decimals: 0,
      symbol: 'USD',
      tokenAddress: '0x123',
    },
  },
  {
    id: 5,
    title: 'Enable Support for Data Storage in Distributed Systems',
    description:
      'Implement a robust solution for data storage in distributed systems with focus on consistency and availability.',
    reference: 'https://docs.rs/scylla/latest/scylla/',
    time: '2 days ago',
    status: 'open',
    avatar: '/placeholder.svg',
    technologies: ['Cassandra', 'Distributed Systems'],
    difficulty: 'hard',
    reward: {
      amount: 200,
      decimals: 0,
      symbol: 'USD',
      tokenAddress: '0x123',
    },
  },
  {
    id: 6,
    title: 'Support SQL Query Builder',
    description: 'Create a type-safe SQL query builder that works with multiple database backends.',
    time: '2 days ago',
    status: 'open',
    avatar: '/placeholder.svg',
    technologies: ['SQL', 'TypeScript'],
    difficulty: 'medium',
    reference: '',
    reward: {
      amount: 80,
      decimals: 0,
      symbol: 'USD',
      tokenAddress: '0x123',
    },
  },
]

// Update the activities array type
const activities: Activity[] = [
  {
    user: 'alex_dev',
    action: "claimed the task 'Implement OAuth Authentication'",
    time: '10 minutes ago',
    avatar: '/placeholder.svg',
  },
  {
    user: 'sarah_coder',
    action: "completed the task 'Fix CSS Layout Issues'",
    time: '25 minutes ago',
    avatar: '/placeholder.svg',
  },
  {
    user: 'mike_js',
    action: "submitted a PR for 'Add Dark Mode Support'",
    time: '1 hour ago',
    avatar: '/placeholder.svg',
  },
  {
    user: 'lisa_frontend',
    action: "earned 120 points for completing 'API Integration'",
    time: '2 hours ago',
    avatar: '/placeholder.svg',
  },
  {
    user: 'david_backend',
    action: "claimed the task 'Database Optimization'",
    time: '3 hours ago',
    avatar: '/placeholder.svg',
  },
  {
    user: 'emma_ux',
    action: "completed the task 'Redesign User Dashboard'",
    time: '5 hours ago',
    avatar: '/placeholder.svg',
  },
  {
    user: 'james_devops',
    action: "earned 200 points for 'CI/CD Pipeline Setup'",
    time: '8 hours ago',
    avatar: '/placeholder.svg',
  },
]
