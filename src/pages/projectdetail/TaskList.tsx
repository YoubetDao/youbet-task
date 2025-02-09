import { Input } from '@/components/ui/input'
import { LucideSearch } from 'lucide-react'
import { TaskCatalog } from '@/components/task'

export default function TaskList({ project }: { project: string }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="relative">
        <Input placeholder="Search tutorial title or description" className="bg-background/80 pl-8" />
        <LucideSearch className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
      </div>
      <TaskCatalog project={project} />
    </div>
  )
}
