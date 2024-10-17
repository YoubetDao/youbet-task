import { Task, TaskState } from '@/types'
import { useState } from 'react'
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
import { SDK } from 'youbet-sdk'
import { TaskItem } from './task-item'
import { EmptyTasks } from './empty-task'
import { Input } from '@/components/ui/input'
import { LucideSearch } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { claimTask, disclaimTask, fetchTasks } from '@/service'
import { openCampusTestOptions } from '@/constants/data'
import { useQuery } from '@tanstack/react-query'
import PaginationFast from '@/components/pagination-fast'

const sdk = new SDK(openCampusTestOptions)

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

const DEFAULT_CATEGORIES = ['open', 'closed']

export default function TaskPage() {
  const { project } = useParams<{ project: string }>()
  const [selectedCategories, setSelectedCategories] = useState<TaskState[]>([])
  const [all, setAll] = useState<string>('All')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { data, isLoading: loading } = useQuery({
    queryKey: ['tasks', project, page, selectedCategories],
    queryFn: () =>
      fetchTasks({
        project: project || '',
        offset: (page - 1) * pageSize,
        limit: pageSize,
        states: selectedCategories,
      }),
  })
  const tasks = data?.data || []
  const totalPages = Math.ceil((data?.pagination.totalCount || 0) / pageSize)

  const handleCategoryChange = (value: TaskState[]) => {
    if (value.length) {
      setAll('')
    } else {
      setAll('All')
    }
    setSelectedCategories(value)
  }

  const handleSelectAll = (value: string) => {
    if (value) {
      setSelectedCategories([])
      setAll(value)
    } else {
      setAll('')
    }
  }

  const handleClaim = async (item: Task) => {
    const issueNumber = item.htmlUrl.split('/').pop()
    try {
      // TODO: the claim logic here will cause some exception. I don't know what happened.
      const res = claimTask({
        org: 'youbetdao',
        project,
        task: issueNumber,
      })
      // setTasks(tasks.map((task) => (task._id === item._id ? { ...task, state: 'open' } : task)))
    } catch (e) {
      console.log(e)
    }
  }

  const handleDisclaim = async (item: Task) => {
    const issueNumber = item.htmlUrl.split('/').pop()
    try {
      const res = await disclaimTask({
        org: 'youbetdao',
        project,
        task: issueNumber,
      })
      // setTasks(tasks.map((task) => (task._id === item._id ? { ...task, state: 'closed' } : task)))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
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
      <div className="flex flex-col gap-5">
        <div className="relative">
          <Input placeholder="Search tutorial title or description" className="bg-background/80 pl-8" />
          <LucideSearch className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
        </div>
        <div className="flex space-x-2">
          <ToggleGroup size="sm" type="single" value={all} onValueChange={handleSelectAll} className="items-start">
            <ToggleGroupItem value="All">All</ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup size="sm" type="multiple" value={selectedCategories} onValueChange={handleCategoryChange}>
            {DEFAULT_CATEGORIES.map((category) => (
              <ToggleGroupItem key={category} value={category}>
                {category}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <SkeletonTasks />
          ) : tasks.length ? (
            tasks.map((item) => (
              <TaskItem key={item._id} item={item} onClaim={handleClaim} onDisclaim={handleDisclaim} />
            ))
          ) : (
            <EmptyTasks />
          )}
        </div>
        {!loading && tasks.length && <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>
    </>
  )
}
