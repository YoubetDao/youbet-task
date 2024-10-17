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

export default function TaskPage() {
  const { project } = useParams<{ project: string }>()

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
        {/* // TODO: add search logic */}
        <div className="relative">
          <Input placeholder="Search tutorial title or description" className="bg-background/80 pl-8" />
          <LucideSearch className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
        </div>
        <TaskCatalog project={project} />
      </div>
    </>
  )
}
