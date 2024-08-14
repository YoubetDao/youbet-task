import { Input } from '@/components/ui/input'
import { LucideSearch, LucideBookText, LucideGraduationCap, LucideClock8 } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useState, useEffect } from 'react'
import { TutorialCategory, Tutorial } from '@/types'
import { Link } from 'react-router-dom'
import { SkeletonCard } from '@/components/skeleton-card'
import http from '@/service/instance'

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

const DEFAULT_HARDNESS = [
  {
    id: 'easy',
    name: '简单',
    color: '#00C48C',
  },
  {
    id: 'medium',
    name: '中等',
    color: '#FFB000',
  },
  {
    id: 'hard',
    name: '困难',
    color: '#FF4D4F',
  },
]

function TutorialItem({ item }: { item: Tutorial }) {
  const hardness = DEFAULT_HARDNESS[Math.floor(Math.random() * DEFAULT_HARDNESS.length)]
  return (
    <Link to={`/tutorial/${item.name}`}>
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
              <div className="flex-1 overflow-hidden text-xl font-bold whitespace-nowrap text-ellipsis">
                {item.name}
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
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hardness.color }}></div>
                <span>{hardness.name}</span>
              </div>
              <div className="flex items-center gap-1 px-2">
                <LucideGraduationCap className="w-4 h-4" />
              </div>
              {/* 时间 */}
              <div className="flex items-center gap-1 px-2">
                <LucideClock8 className="w-3 h-3" />
                <span>1h 0m</span>
              </div>
            </div>
            {/* categories */}
            <div className="flex gap-2 pt-3 mt-3 text-xs border-t border-[#555]/20">
              {__randomPickCategories(DEFAULT_CATEGORIES)}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

const DEFAULT_CATEGORIES = [
  {
    id: 'all',
    name: 'All',
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
  },
  {
    id: 'solana',
    name: 'Solana',
  },
  {
    id: 'blockchain',
    name: 'Blockchain',
  },
  {
    id: 'solidity',
    name: 'Solidity',
  },
  {
    id: 'move',
    name: 'Move',
  },
  {
    id: 'go',
    name: 'Go',
  },
  {
    id: 'sui',
    name: 'Sui',
  },
  {
    id: 'data-analytics',
    name: 'Data Analytics',
  },
  {
    id: 'layer2',
    name: 'Layer 2',
  },
  {
    id: 'dapp',
    name: 'DApp',
  },
  {
    id: 'zero-knowledge',
    name: 'Zero Knowledge',
  },
]

async function getTutorialCategories(): Promise<TutorialCategory[]> {
  return DEFAULT_CATEGORIES
}

function __randomPickCategories(categories: TutorialCategory[]): React.ReactNode[] {
  return categories
    .slice(1)
    .filter(() => {
      return Math.random() > 0.5
    })
    .map((item) => {
      return (
        <>
          <div className="flex items-center justify-center px-2 border rounded-lg h-7">{item.name}</div>
        </>
      )
    })
    .slice(0, 3)
}

function TutorialList() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const data = await http
        .get('/projects?org=youbetdao')
        .then((res) => res.data)
        .catch(() => [])
      setTutorials(data)
      setLoading(false)
    }
    fetchProjects()
  }, [])

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
  const [categories, setCategories] = useState<TutorialCategory[]>([])

  useEffect(() => {
    getTutorialCategories().then((categories) => setCategories(categories))
  }, [])

  return (
    <div className="px-4 py-4 mx-auto max-w-7xl lg:px-12">
      <div className="flex flex-col w-full gap-2">
        <div className="space-y-5">
          <div className="relative">
            <Input placeholder="Search tutorial title or description" className="pl-8 bg-background/80" />
            <LucideSearch className="absolute w-4 h-4 -translate-y-1/2 top-1/2 left-2" />
          </div>
          <div>
            <ToggleGroup size="sm" type="single" defaultValue={'all'}>
              {categories.map((category) => (
                <ToggleGroupItem key={category.id} value={category.id}>
                  {category.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:flex-row">
          <TutorialList />
        </div>
      </div>
    </div>
  )
}
