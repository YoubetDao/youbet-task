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
    <div className="flex flex-col w-full gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

function __randomPickTags(tags: string[]): React.ReactNode[] {
  return tags
    .filter(() => {
      return Math.random() > 0.5
    })
    .map((tag) => {
      return (
        <>
          <div className="relative flex items-center justify-center p-1.5 overflow-hidden transition-all duration-300 ease-in border rounded-full bg-muted border-white/80 bg-greyscale-50/8 border-greyscale-50/12 h-7 w-7">
            {getIconFromKey(tag)}
          </div>
        </>
      )
    })
}

function ProjectItem({ item }: { item: Project }) {
  return (
    <Link to={`/projects/${item.name}/tasks`}>
      <article className="rounded-2xl p-4 lg:p-6 cursor-pointer border group z-[1] duration-200 ease-in hover:border hover:border-opacity-80 hover:bg-white/10 relative w-full !pr-0 !pt-0 transition-all hover:scale-[0.998]">
        <div className="flex gap-5">
          {/* 头像 */}
          <div className="pt-4">
            <Avatar>
              <AvatarImage src={item.owner.avatarUrl} />
              <AvatarFallback>{item.owner.login}</AvatarFallback>
            </Avatar>
          </div>
          <div className="pt-4 pr-4 overflow-hidden">
            <div className="flex items-center w-full gap-2">
              <div className="flex-1 overflow-hidden text-2xl font-bold whitespace-nowrap text-ellipsis">
                {item.name}
              </div>
              <div className="hidden gap-2 md:flex">
                {__randomPickTags([
                  'issues-available',
                  'hot-community',
                  'newbies-welcome',
                  'big-whale',
                  'likely-to-be-reward',
                  'work-in-progress',
                  'fast-and-furious',
                ])}
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {item.description || 'Decentralized social built with Nostr and powered by Starknet account abstraction.'}
            </div>
            <div className="flex flex-col gap-4 mt-5 text-xs md:flex-row">
              <div className="flex gap-1 md:justify-center md:items-center">
                <Avatar className="w-4 h-4">
                  <AvatarImage src={item.owner.avatarUrl} />
                  <AvatarFallback>{item.owner.login}</AvatarFallback>
                </Avatar>
                <span>project owner</span>
              </div>
              <div className="flex gap-1 md:items-center md:justify-center">
                <LucideUser className="w-4 h-4" />
                {Math.floor(Math.random() * 100)} contributors
              </div>
              <div>Ecosystems</div>
              <div>Languages</div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const data = await http
        .get('/projects?org=youbetdao')
        .then((res) => res.data)
        .catch(() => [])
      setProjects(data)
      setLoading(false)
    }
    fetchProjects()
  }, [])

  if (loading) return <SkeletonProjects />

  return (
    <div className="flex flex-col w-full gap-4 pt-4 overflow-hidden md:pl-4">
      <div className="flex items-center justify-between">
        <div>
          <Select defaultValue="treading">
            <SelectTrigger>
              <div>
                <span>Sort by </span>
                <span className="lowercase text-primary">
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
        <div className="text-sm text-muted-foreground">{projects.length} Projects</div>
      </div>
      <div className="flex flex-col w-full gap-4">
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
    'newbies-welcome': <LucideSprout className="w-4 h-4" />,
    'big-whale': <LucideSparkles className="w-4 h-4" />,
    'likely-to-be-reward': <LucideGift className="w-4 h-4" />,
    'work-in-progress': <LucidePickaxe className="w-4 h-4" />,
    'fast-and-furious': <LucideZap className="w-4 h-4" />,
  }[key]
}

function FilterBoard() {
  const tags = [
    {
      label: 'Issues available',
      value: 'issues-available',
      icon: getIconFromKey('issues-available'),
    },
    {
      label: 'Hot Community',
      value: 'hot-community',
      icon: getIconFromKey('hot-community'),
    },
    {
      label: 'Newbies Welcome',
      value: 'newbies-welcome',
      icon: getIconFromKey('newbies-welcome'),
    },
    {
      label: 'Big whale',
      value: 'big-whale',
      icon: getIconFromKey('big-whale'),
    },
    {
      label: 'Likely to be reward',
      value: 'likely-to-be-reward',
      icon: getIconFromKey('likely-to-be-reward'),
    },
    {
      label: 'Work in progress',
      value: 'work-in-progress',
      icon: getIconFromKey('work-in-progress'),
    },
    {
      label: 'Fast and furious',
      value: 'fast-and-furious',
      icon: getIconFromKey('fast-and-furious'),
    },
  ]

  return (
    <div className="flex-shrink-0 pt-4 basis-96">
      <Card className="sticky top-0 left-0 bg-transparent">
        <CardHeader className="py-4">
          <CardTitle className="relative text-lg">
            <span>Filter</span>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 flex items-center gap-1 text-xs -translate-y-1/2 cursor-pointer hover:text-primary text-primary top-1/2"
            >
              <LucideRefreshCcw className="w-3 h-3" />
              Clear all
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          {/* filter */}
          <ToggleGroup type="multiple">
            {tags.map((tag) => (
              <ToggleGroupItem key={tag.value} size="sm" value={tag.value}>
                {tag.icon}
                {tag.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {/* select */}
          <div className="pt-2 space-y-3 border-t border-muted">
            <Label>Ecosystems</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* select */}
          <div className="pt-2 space-y-3 border-t border-muted">
            <Label>Languages</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* select */}
          <div className="pt-2 space-y-3 border-t border-muted">
            <Label>Categories</Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProjectPage() {
  return (
    <div className="px-4 py-4 mx-auto max-w-7xl lg:px-12">
      <div className="flex flex-col w-full gap-2">
        <div className="relative">
          <Input placeholder="Search project title or description" className="pl-8 bg-background/80" />
          <LucideSearch className="absolute w-4 h-4 -translate-y-1/2 top-1/2 left-2" />
        </div>
        <div className="flex flex-col gap-2 lg:flex-row">
          <FilterBoard />
          <ProjectList />
        </div>
      </div>
    </div>
  )
}
