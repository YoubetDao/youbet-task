import { Input } from '@/components/ui/input'
import { LucideSearch, LucideBookText, LucideClock8, LucideEye, Heart } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useState, useEffect } from 'react'
import { Project } from '@/types'
import { Link } from 'react-router-dom'
import { SkeletonCard } from '@/components/skeleton-card'
import http from '@/service/instance'
import { Button } from '@/components/ui/button'

function SkeletonList() {
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

// TODO: move color to some global config
const DEFAULT_HARDNESS = {
  easy: {
    name: 'Easy',
    color: '#00C48C',
  },
  medium: {
    name: 'Medium',
    color: '#FFB000',
  },
  hard: {
    name: 'Hard',
    color: '#FF4D4F',
  },
}

function TutorialItem({ item }: { item: Project }) {
  if (!item.tutorial) return
  const { githubId } = item
  return (
    <Link to={`/tutorial/${githubId}`}>
      <article className="relative z-[1] hover:bg-white/10 border hover:border hover:border-opacity-80 rounded-2xl w-full transition-all duration-200 cursor-pointer overflow-hidden ease-in group hover:scale-[0.998]">
        <div className="relative flex flex-col">
          <div className="top-2 left-2 absolute flex justify-center items-center bg-muted p-1 rounded-full">
            <LucideBookText className="w-4 h-4" />
          </div>
          {/* box */}
          <div className="h-48 overflow-hidden">
            <img src={item.owner.avatarUrl} alt={item.owner.login} className="w-full h-full object-cover" />
          </div>
          <div className="p-4 lg:p-6 h-60">
            {/* name */}
            <Button
              asChild
              variant="link"
              className="px-0 !line-clamp-2 h-16 font-bold text-xl break-all"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(item.htmlUrl, '_blank')
              }}
            >
              <p>{item.name}</p>
            </Button>
            {/* description */}
            <p className="mt-1 line-clamp-2 h-10 text-muted-foreground text-sm break-all">
              {item.description || 'No description...'}
            </p>
            <div className="flex gap-4 mt-5 text-xs">
              {/* 简单/中等/困难 */}
              <div className="flex items-center gap-1 px-2">
                <div
                  className="rounded-full w-2 h-2"
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
            <div className="flex flex-row justify-between border-muted mt-3 pt-3 border-t h-12">
              <div className="flex gap-2 text-xs">
                {item.tutorial.categories.map(
                  (category) =>
                    category && (
                      <div key={category} className="flex justify-center items-center px-2 border rounded-lg h-7">
                        {category}
                      </div>
                    ),
                )}
              </div>
              <Button variant="secondary" className="border-muted bg-black border h-7">
                <Heart color="pink" />
              </Button>
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
    <div className="flex flex-col gap-4 pt-4 w-full overflow-hidden">
      <div>Tutorials({tutorials.length})</div>
      <div className="flex-col gap-4 lg:gap-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full">
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
    <div className="mx-auto px-4 lg:px-12 py-4 max-w-7xl">
      <div className="flex flex-col gap-2 w-full">
        <div className="space-y-5">
          <div className="relative">
            <Input placeholder="Search tutorial title or description" className="bg-background/80 pl-8" />
            <LucideSearch className="top-1/2 left-2 absolute w-4 h-4 -translate-y-1/2" />
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
        </div>
        <div className="flex lg:flex-row flex-col gap-2">
          <TutorialList categories={all ? selectedCategories.concat([all]) : selectedCategories} />
        </div>
      </div>
    </div>
  )
}
