import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Filter, LayoutGrid, List, Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Task } from '@/openapi/client/models/task'
import { taskApi } from '@/service'
import { useQuery } from '@tanstack/react-query'
import PaginationFast from '@/components/pagination-fast'
import { TaskCard } from '@/components/task-v2/task-card'
import { TaskItem } from '@/components/task-v2/task-item'
import { LoadingCards } from '@/components/loading-cards'
import { TaskControllerGetTasksRewardGrantedEnum, TaskControllerGetTasksRewardClaimedEnum } from '@/openapi/client'

export default function Tasks() {
  const [page, setPage] = useState(1)
  const [selectedAssignment, setSelectedAssignment] = useState<string>('all')
  const pageSize = 9

  const queryKey = ['tasks', '', page, pageSize, selectedAssignment]
  const queryFn = () =>
    taskApi
      .taskControllerGetTasks(
        '',
        '',
        'open',
        selectedAssignment !== 'all' ? selectedAssignment : '',
        TaskControllerGetTasksRewardGrantedEnum.All,
        TaskControllerGetTasksRewardClaimedEnum.All,
        (page - 1) * pageSize,
        pageSize,
      )
      .then((res) => res.data)

  const { data, isLoading: loading } = useQuery({
    queryKey: queryKey,
    queryFn: queryFn,
  })

  const tasks = data?.data || []
  console.log(tasks)
  const totalPages = Math.ceil((data?.pagination?.totalCount || 0) / pageSize)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const handleCategoryChange = (value: string) => {
    setPage(1)
    if (value == 'open') {
      setSelectedAssignment('all')
      return
    }

    setSelectedAssignment(value)
  }

  if (loading) return <LoadingCards count={3} />

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 lg:px-12">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Main content */}
        <main className="flex-1">
          <div className="mb-4 flex h-[98px] flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="h-[62px]">
                <h1 className="text-5xl font-bold text-[#E2E8F0]">Task Hall</h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400">Discover and claim GitHub issues as tasks</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search tasks..." className="border-0 bg-slate-100 pl-9 dark:bg-slate-800" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="open" className="mb-6" onValueChange={handleCategoryChange}>
            <div className="flex w-full items-center justify-between">
              <TabsList className="flex w-auto flex-nowrap">
                <TabsTrigger value="open">All</TabsTrigger>
                <TabsTrigger value="assigned">Assigned</TabsTrigger>
                <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
              </TabsList>

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
                    <Button variant="outline" size="lg" className="gap-1">
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
            <TabsContent value="all" className="mt-6">
              {renderTasks(tasks, viewMode)}
            </TabsContent>

            <TabsContent value="open" className="mt-6">
              {renderTasks(tasks, viewMode)}
            </TabsContent>

            <TabsContent value="assigned" className="mt-6">
              {renderTasks(tasks, viewMode)}
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-between">
            <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </main>
      </div>
    </div>
  )
}

const renderTasks = (tasks: Task[], viewMode: string) => {
  return viewMode === 'grid' ? (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((item) => (
        <TaskCard key={item._id} item={item} />
      ))}
    </div>
  ) : (
    <div className="space-y-3">
      {tasks.map((item) => (
        <TaskItem key={item._id} item={item} />
      ))}
    </div>
  )
}
