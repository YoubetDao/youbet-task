import { Link, useParams } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Input } from '@/components/ui/input'
import { LucideSearch } from 'lucide-react'
import { TaskCatalog } from '@/components/task'
import { CategoryGroup } from '@/components/category-group'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTasks } from '@/service'

const ASSIGNMENT_STATUS = ['all', 'unassigned', 'assigned']

export default function TaskPage() {
  const { project } = useParams<{ project: string }>()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [page, setPage] = useState(1)
  const pageSize = 9

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', project, page, pageSize, selectedCategory],
    queryFn: () =>
      fetchTasks({
        project: project || '',
        offset: (page - 1) * pageSize,
        limit: pageSize,
        assignmentStatus: selectedCategory !== 'all' ? selectedCategory : undefined,
      }),
  })

  const onCategoryChange = (value: string) => {
    setSelectedCategory(value)
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
        <main className="flex flex-col gap-5">
          <header className="flex flex-col space-y-2" aria-label="Filter Controls">
            <div className="flex space-x-2">
              <CategoryGroup
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                categories={ASSIGNMENT_STATUS}
              />
            </div>
          </header>
          <TaskCatalog
            page={page}
            pageSize={pageSize}
            totalPages={Math.ceil((data?.pagination.totalCount || 0) / pageSize)}
            setPage={setPage}
            isLoading={isLoading}
            tasks={data?.data}
          />
        </main>
      </div>
    </>
  )
}
