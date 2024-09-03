import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/skeleton-card'
import { Project } from '@/types'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import http from '@/service/instance'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  LucideSearch,
  LucideFlame,
  LucideThumbsUp,
  LucideSprout,
  LucideSparkles,
  LucideGift,
  LucidePickaxe,
  LucideZap,
  LucideRefreshCcw,
  LucideUser,
} from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function SkeletonProjects() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

function renderTags(tags: string[]): React.ReactNode[] {
  return tags.map((tag) => {
    return (
      <div
        key={tag}
        className="relative flex justify-center items-center border-greyscale-50/12 border-white/80 bg-greyscale-50/8 bg-muted p-1.5 border rounded-full w-7 h-7 transition-all duration-300 overflow-hidden ease-in"
      >
        {getIconFromKey(tag)}
      </div>
    )
  })
}

function ProjectItem({ item }: { item: Project }) {
  return (
    <Link key={item._id} to={`/projects/${item.name}/tasks`}>
      <article className="relative z-[1] hover:bg-white/10 p-4 lg:p-6 !pt-0 !pr-0 border hover:border hover:border-opacity-80 rounded-2xl w-full transition-all duration-200 cursor-pointer ease-in group hover:scale-[0.998]">
        <div className="flex gap-5">
          {/* 头像 */}
          <div className="pt-4">
            <Avatar>
              <AvatarImage src={item.owner.avatarUrl} />
              <AvatarFallback>{item.owner.login}</AvatarFallback>
            </Avatar>
          </div>
          <div className="pt-4 pr-4 overflow-hidden">
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 font-bold text-2xl text-ellipsis whitespace-nowrap overflow-hidden">
                <Button
                  asChild
                  variant="link"
                  className="!p-0 font-bold text-2xl text-ellipsis text-gray-50 whitespace-nowrap overflow-hidden"
                >
                  <span
                    className="z-10"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      window.open(item.htmlUrl, '_blank')
                    }}
                  >
                    {item.name}
                  </span>
                </Button>
              </div>
              <div className="md:flex gap-2 hidden">{renderTags(item.youbetExtra?.tags || [])}</div>
            </div>
            <div className="mt-2 text-muted-foreground text-sm">{item.description || 'No description...'}</div>
            <div className="flex md:flex-row flex-col gap-4 mt-5 text-xs">
              <div className="flex md:justify-center md:items-center gap-1">
                <Avatar className="w-4 h-4">
                  <AvatarImage src={item.owner.avatarUrl} />
                  <AvatarFallback>{item.owner.login}</AvatarFallback>
                </Avatar>
                <span>project owner</span>
              </div>
              <div className="flex md:justify-center md:items-center gap-1">
                <LucideUser className="w-4 h-4" />
                {Math.floor(Math.random() * 10)} contributors
              </div>
              {/* <div>Ecosystems</div> */}
              <div>Languages</div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

interface ProjectListProps {
  filterTags: string[]
}

function ProjectList({ filterTags }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const data = await http
        .get(`/projects?tags=${filterTags.join(',')}`)
        .then((res) => res.data.data)
        .catch(() => [])
      setProjects(data)
      setLoading(false)
    }
    fetchProjects()
  }, [filterTags])

  if (loading) return <SkeletonProjects />

  return (
    <div className="flex flex-col gap-4 pt-4 lg:pl-4 w-full overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <Select defaultValue="treading">
            <SelectTrigger>
              <div>
                <span>Sort by </span>
                <span className="text-primary lowercase">
                  <SelectValue />
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="treading">Treading projects</SelectItem>
              <SelectItem value="project">Project name</SelectItem>
              <SelectItem value="contributors">Number of contributors</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-muted-foreground text-sm">{projects.length} Projects</div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {projects.map((item) => (
          <ProjectItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  )
}

function getIconFromKey(key: string) {
  return {
    'issues-available': <LucideThumbsUp className="w-4 h-4" />,
    'hot-community': <LucideFlame className="w-4 h-4" />,
    'good-first-issues': <LucideSprout className="w-4 h-4" />,
    'big-whale': <LucideSparkles className="w-4 h-4" />,
    'potential-reward': <LucideGift className="w-4 h-4" />,
    'work-in-progress': <LucidePickaxe className="w-4 h-4" />,
    'fast-and-furious': <LucideZap className="w-4 h-4" />,
  }[key]
}

interface FilterBoardProps {
  filterTags: string[]
  setFilterTags: (tags: string[]) => void
}

function FilterBoard({ filterTags, setFilterTags }: FilterBoardProps) {
  const tags = [
    // {
    //   label: 'Issues available',
    //   value: 'issues-available',
    //   icon: getIconFromKey('issues-available'),
    // },
    {
      label: 'Hot Community',
      value: 'hot-community',
      icon: getIconFromKey('hot-community'),
    },
    {
      label: 'Good First Issues',
      value: 'good-first-issues',
      icon: getIconFromKey('good-first-issues'),
    },
    {
      label: 'Potential Reward',
      value: 'potential-reward',
      icon: getIconFromKey('potential-reward'),
    },
  ]

  return (
    <div className="flex-shrink-0 pt-4 w-full lg:w-48 xl:w-96">
      <Card className="top-0 left-0 sticky bg-transparent">
        <CardHeader className="py-4">
          <CardTitle className="relative text-lg">
            <span>Filter</span>
            <Button
              variant="ghost"
              size="sm"
              className="top-1/2 right-0 absolute flex items-center gap-1 text-primary text-xs hover:text-primary -translate-y-1/2 cursor-pointer"
              onClick={() => setFilterTags([])}
            >
              <LucideRefreshCcw className="w-3 h-3" />
              Clear all
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          {/* filter */}
          <ToggleGroup type="multiple" value={filterTags} onValueChange={setFilterTags}>
            {tags.map((tag) => (
              <ToggleGroupItem key={tag.value} size="sm" value={tag.value}>
                {tag.icon}
                {tag.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {/* select */}
          {/* <div className="space-y-3 border-muted pt-2 border-t">
            <Label>Ecosystems</Label>
            <Select>
              <SelectTrigger className="w-full max-w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          {/* select */}
          <div className="space-y-3 border-muted pt-2 border-t">
            <Label>Languages</Label>
            <Select>
              <SelectTrigger className="w-full max-w-[180px]">
                <SelectValue placeholder="Select Languages..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solidity">Solidity</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
                <SelectItem value="move">Move</SelectItem>
                <SelectItem value="typescript">Typescript</SelectItem>
                <SelectItem value="javascript">javascript</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* select */}
          {/* <div className="space-y-3 border-muted pt-2 border-t">
            <Label>Categories</Label>
            <Select>
              <SelectTrigger className="w-full max-w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProjectPage() {
  const [filterTags, setFilterTags] = useState<string[]>([])

  return (
    <div className="mx-auto px-4 lg:px-12 py-4 max-w-7xl">
      <div className="flex flex-col gap-2 w-full">
        <div className="relative">
          <Input placeholder="Search project title or description" className="bg-background/80 pl-8" />
          <LucideSearch className="top-1/2 left-2 absolute w-4 h-4 -translate-y-1/2" />
        </div>
        <div className="flex lg:flex-row flex-col gap-2">
          <FilterBoard filterTags={filterTags} setFilterTags={setFilterTags} />
          <ProjectList filterTags={filterTags} />
        </div>
      </div>
    </div>
  )
}
