import { Input } from '@/components/ui/input'
import { LucideSearch, LucideBookText, LucideClock8, LucideEye } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useState, useEffect } from 'react'
import { Project } from '@/types'
import { Link } from 'react-router-dom'
import { SkeletonCard } from '@/components/skeleton-card'
import http from '@/service/instance'
import { Button } from '@/components/ui/button'

function SkeletonList() {
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

// TODO: move color to some global config
const DEFAULT_HARDNESS = {
  easy: {
    name: '简单',
    color: '#00C48C',
  },
  medium: {
    name: '中等',
    color: '#FFB000',
  },
  hard: {
    name: '困难',
    color: '#FF4D4F',
  },
}

function TutorialItem({ item }: { item: Project }) {
  if (!item.tutorial) return
  const { githubId } = item
  return (
    <Link to={`/tutorial/${githubId}`}>
      <article className="rounded-2xl overflow-hidden cursor-pointer border group z-[1] duration-200 ease-in hover:border hover:border-opacity-80 hover:bg-white/10 relative w-full transition-all hover:scale-[0.998]">
        <div className="relative flex flex-col">
          <div className="absolute flex items-center justify-center p-1 rounded-full top-2 left-2 bg-muted">
            <LucideBookText className="w-4 h-4" />
          </div>
          {/* box */}
          <div className="h-48 overflow-hidden">
            <img src={item.owner.avatarUrl} alt={item.owner.login} className="object-cover w-full h-full" />
          </div>
          <div className="p-4 overflow-hidden lg:p-6 ">
            {/* name */}
            <div className="flex items-center w-full gap-2">
              <div>
                <Button
                  variant="link"
                  className="flex-1 overflow-hidden text-xl font-bold whitespace-nowrap text-ellipsis px-0"
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
            </div>
            {/* description */}
            <div className="mt-2 text-sm text-muted-foreground">
              {item.description || 'Decentralized social built with Nostr and powered by Starknet account abstraction.'}
            </div>
            {/* tags */}
            <div className="flex gap-4 mt-5 text-xs ">
              {/* 简单/中等/困难 */}
              <div className="flex items-center gap-1 px-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: DEFAULT_HARDNESS[item.tutorial?.level as keyof typeof DEFAULT_HARDNESS].color,
                  }}
                ></div>
                <span>{DEFAULT_HARDNESS[item.tutorial?.level as keyof typeof DEFAULT_HARDNESS].name}</span>
              </div>
              <div className="flex items-center gap-1 px-2">
                <LucideEye className="w-4 h-4" />
                <span>{0}</span>
              </div>
              {/* 时间 */}
              <div className="flex items-center gap-1 px-2">
                <LucideClock8 className="w-3 h-3" />
                <span>{item.tutorial.time}</span>
              </div>
            </div>
            {/* categories */}
            <div className="flex gap-2 pt-3 mt-3 text-xs border-t border-[#555]/20">
              {item.tutorial.categories.map(
                (category) =>
                  category && (
                    <div key={category} className="flex items-center justify-center px-2 border rounded-lg h-7">
                      {category}
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

const DEFAULT_CATEGORIES = [
  'Bitcoin',
  'Ethereum',
  'Solana',
  'Sui',
  'Solidity',
  'Move',
  'Go',
  'Layer 2',
  'DApp',
  'Zero Knowledge',
]

function TutorialList({ categories }: { categories: string[] }) {
  const [tutorials, setTutorials] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const categoryParam = categories.includes('All') ? '' : `?categories=${categories.join(',')}`
      const data = await http
        .get(`/tutorials${categoryParam}`)
        .then((res) => res.data)
        .catch(() => [])
      setTutorials(data)
      setLoading(false)
    }
    fetchProjects()
  }, [categories])

  if (loading) return <SkeletonList />
  return (
    <div className="flex flex-col w-full gap-4 pt-4 overflow-hidden">
      <div>Tutorials({tutorials.length})</div>
      <div className="grid flex-col w-full grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {tutorials.map((item) => (
          <TutorialItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function Tutorials() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [all, setAll] = useState<string>('All')

  const handleCategoryChange = (value: string[]) => {
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

  return (
    <div className="px-4 py-4 mx-auto max-w-7xl lg:px-12">
      <div className="flex flex-col w-full gap-2">
        <div className="space-y-5">
          <div className="relative">
            <Input placeholder="Search tutorial title or description" className="pl-8 bg-background/80" />
            <LucideSearch className="absolute w-4 h-4 -translate-y-1/2 top-1/2 left-2" />
          </div>
          <div className="flex space-x-2">
            <ToggleGroup size="sm" type="single" value={all} onValueChange={handleSelectAll}>
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
        </div>
        <div className="flex flex-col gap-2 lg:flex-row">
          <TutorialList categories={all ? selectedCategories.concat([all]) : selectedCategories} />
        </div>
      </div>
    </div>
  )
}
