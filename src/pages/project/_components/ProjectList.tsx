import { LoadingCards } from '@/components/loading-cards'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Project } from '@/openapi/client'
import { LucideUser } from 'lucide-react'
import { Link } from 'react-router-dom'
import ImportProjectDialog from '@/components/import-project'
import { IResultPagination } from '@/types'
import { getAppearances } from '@/lib/appearances'
import { Icons } from '@/components/icons'
import RenderTags from './RenderTags'

interface ProjectListProps {
  loading: boolean
  loadingMore: boolean
  data: IResultPagination<Project> | undefined
  appearances: ReturnType<typeof getAppearances>
}
function ProjectItem({ item }: { item: Project }) {
  return (
    <Link key={item._id} to={`/projects/${item._id}?projectName=${item.name}`}>
      <article className="group relative z-[1] w-full cursor-pointer rounded-2xl border p-4 !pr-0 !pt-0 transition-all duration-200 ease-in hover:scale-[0.998] hover:border hover:border-opacity-80 hover:bg-white/10 lg:p-6">
        <div className="flex gap-5">
          <div className="pt-4">
            <Avatar>
              <AvatarImage src={item.owner.avatarUrl} />
              <AvatarFallback>{item.owner.login}</AvatarFallback>
            </Avatar>
          </div>
          <div className="overflow-hidden pr-4 pt-4">
            <div className="flex w-full items-center gap-2">
              <div className="flex flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold">
                <span className="pr-1">{item.name}</span>
                <Icons.github
                  className="relative top-2 h-4 w-4"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(item.htmlUrl, '_blank')
                  }}
                />
              </div>
              <div className="hidden gap-2 md:flex">
                <RenderTags tags={item.youbetExtra?.tags || []} />
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{item.description || 'No description...'}</div>
            <div className="mt-5 flex flex-col gap-4 text-xs md:flex-row">
              <div className="flex gap-1 md:items-center md:justify-center">
                <Avatar className="h-4 w-4">
                  <AvatarImage src={item.owner.avatarUrl} />
                  <AvatarFallback>{item.owner.login}</AvatarFallback>
                </Avatar>
                <span>project owner</span>
              </div>
              <div className="flex gap-1 md:items-center md:justify-center">
                <LucideUser className="h-4 w-4" />
                {item.contributorsCount} contributors
              </div>
              <div>Languages</div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function ProjectList({ loading, loadingMore, data, appearances }: ProjectListProps) {
  if (loading) return <LoadingCards />
  if (!data) return null

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="z-15 sticky top-20 flex items-center justify-between bg-background/75 pb-2">
        {appearances.showImportProject && <ImportProjectDialog />}
        <div className="text-sm text-muted-foreground">{data.pagination?.totalCount} Projects</div>
      </div>
      <div className="flex w-full flex-col gap-4">
        {data.list?.map((item) => (
          <ProjectItem key={item._id} item={item} />
        ))}
        {loadingMore && <LoadingCards count={2} />}
      </div>
    </div>
  )
}
