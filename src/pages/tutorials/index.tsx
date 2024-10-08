import { Input } from '@/components/ui/input'
import { LucideSearch, LucideClock8, LucideEye, Heart } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useState } from 'react'
import { Project } from '@/types'
import { useNavigate } from 'react-router-dom'
import { SkeletonCard } from '@/components/skeleton-card'
import { openCampusTestOptions } from '@/constants/data'
import { SDK } from 'youbet-sdk'
import { fetchTutorials, getTutorialToC } from '@/service'
import { tutorialToCAtom } from '@/store'
import { useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import PaginationFast from '@/components/pagination-fast'
// import ImportTutorialDialog from '@/components/import-project'

const sdk = new SDK(openCampusTestOptions)

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
  const navigate = useNavigate()
  const setTutorialToC = useSetAtom(tutorialToCAtom)

  const handleNavigation = async () => {
    const data = await getTutorialToC(item.owner.login, item.name)
    setTutorialToC(data)
    const computedPath = `/tutorial/${item.githubId}/${item.owner.login}/${item.name}/${encodeURIComponent(
      data[0].path?.match(/^(.*?).md$/)?.[1] ?? '',
    )}`
    navigate(computedPath)
  }

  return (
    <article
      className="relative z-[1] hover:bg-white/10 border hover:border hover:border-opacity-80 rounded-2xl w-full h-full transition-all duration-200 cursor-pointer overflow-hidden ease-in group hover:scale-[0.998]"
      onClick={handleNavigation}
    >
      <div className="relative flex flex-col">
        <div className="top-2 left-2 absolute flex justify-center items-center bg-muted p-1 rounded-full">
          <Heart
            className="w-4 h-4"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              sdk.contract.donateToProject(String(item.githubId), '0.0001')
            }}
          />
        </div>
        {/* box */}
        <div className="h-48">
          <img src={item.owner.avatarUrl} alt={item.owner.login} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 lg:p-6">
          {/* name */}
          <div className="flex text-left">
            <a
              className="px-0 font-bold text-ellipsis text-xl underline-offset-4 hover:underline whitespace-nowrap overflow-hidden"
              href={item.htmlUrl}
              title={item.name}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {item.name}
            </a>
          </div>
          {/* description */}
          <div className="mt-2 !line-clamp-3 text-muted-foreground text-sm break-all">
            {item.description || 'No description...'}
          </div>
          {/* tags */}
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
            {/* TODO: add watching number */}
            <div className="flex items-center gap-1 px-2">
              <LucideEye className="w-4 h-4" />
              <span>{0}</span>
            </div>
            {/* 时间 */}
            <div className="flex items-center gap-1 px-2">
              <LucideClock8 className="w-3 h-3" />
              <span>{item.tutorial?.time}</span>
            </div>
          </div>
          {/* categories */}
          <div className="flex gap-2 border-[#555]/20 mt-3 pt-3 border-t text-xs">
            {item.tutorial?.categories.map(
              (category) =>
                category && (
                  <div key={category} className="flex justify-center items-center px-2 border rounded-lg h-7">
                    {category}
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
    </article>
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
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { data, isLoading: loading } = useQuery({
    queryKey: ['tutorials', categories, page],
    queryFn: () =>
      fetchTutorials({
        categories: categories.includes('All') ? [] : categories,
        offset: (page - 1) * pageSize,
        limit: pageSize,
      }),
  })
  const totalPages = Math.ceil((data?.pagination.totalCount || 0) / pageSize)
  const tutorials = data?.data || []

  if (loading) return <SkeletonList />
  return (
    <div className="flex flex-col gap-4 pt-4 w-full overflow-hidden">
      <div>Tutorials({tutorials.length})</div>
      <div className="flex-col gap-4 lg:gap-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full">
        {tutorials.map((item) => (
          <TutorialItem key={item.githubId} item={item} />
        ))}
      </div>
      <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
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
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input placeholder="Search tutorial title or description" className="bg-background/80 pl-8" />
              <LucideSearch className="top-1/2 left-2 absolute w-4 h-4 -translate-y-1/2" />
            </div>
            {/* <ImportTutorialDialog /> */}
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
