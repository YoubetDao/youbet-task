import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/skeleton-card'
import { Repository } from '@/types'
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
} from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

function SkeletonProjects() {
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

function ProjectItem({ item }: { item: Repository }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col justify-between h-full overflow-hidden rounded">
          <div>
            <div className="flex items-center mb-4">
              <img className="w-12 h-12 mr-4 rounded-full" src={item.owner.avatarUrl} alt="Owner Avatar" />
              <div className="text-sm">
                <p className="leading-none text-gray-900">{item.owner.login}</p>
                <p>{item.owner.htmlUrl}</p>
              </div>
            </div>
            <div className="mb-4">
              {/* <h2 className="mb-2 text-xl font-bold">{item.full_name}</h2> */}
              <p className="text-base text-gray-700">{item.description}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <p>Stars: {item.stargazersCount}</p>
                <p>Forks: {item.forksCount}</p>
              </div>
              <div>
                <p>Issues: {item.openIssuesCount}</p>
                <p>Language: {item.language}</p>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-end gap-2 mt-8">
            <Button variant="link" asChild>
              <a target="_blank" href={item.htmlUrl} rel="noreferrer">
                View Repository
              </a>
            </Button>
            <Button asChild>
              <Link to={`/projects/${item.name}/tasks`}>View Tasks</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectList() {
  const [projects, setProjects] = useState<Repository[]>([])
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
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between">
        <div></div>
        <div className="text-muted-foreground">{projects.length} PROJECTS</div>
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
    'issues-available': LucideThumbsUp,
    'hot-community': LucideFlame,
    'newbies-welcome': LucideSprout,
    'big-whale': LucideSparkles,
    'likely-to-be-reward': LucideGift,
    'work-in-progress': LucidePickaxe,
    'fast-and-furious': LucideZap,
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
    <div className="flex-shrink-0 basis-96">
      <Card className="sticky top-0 left-0">
        <CardHeader className="py-4">
          <CardTitle className="text-lg">Filter</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          {/* filter */}
          <ToggleGroup type="multiple">
            {tags.map((tag) => (
              <ToggleGroupItem key={tag.value} size="sm" value={tag.value}>
                {tag.icon && <tag.icon className="w-4 h-4" />}
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

export default function Project() {
  return (
    <div className="px-4 py-4 mx-auto max-w-7xl lg:px-12">
      <div className="flex flex-col w-full gap-6">
        <div className="relative">
          <Input placeholder="Search project title or description" className="pl-12 bg-background/80" />
          <LucideSearch className="absolute -translate-y-1/2 top-1/2 left-2" />
        </div>
        <div className="flex flex-col gap-6 lg:flex-row">
          <FilterBoard />
          <ProjectList />
        </div>
      </div>
    </div>
  )
}
