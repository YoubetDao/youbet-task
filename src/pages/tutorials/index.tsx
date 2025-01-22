import { LucideClock8, LucideEye, Heart } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useState } from 'react'
import { Project } from '@/types'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LoadingCards } from '@/components/loading-cards'
import { sdk } from '@/constants/data'
import { fetchTutorials, getTutorialToC } from '@/service'
import { tutorialToCAtom } from '@/store'
import { useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import PaginationFast from '@/components/pagination-fast'
import { SearchInput } from '@/components/common'

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
      className="group relative z-[1] h-full w-full cursor-pointer overflow-hidden rounded-2xl border transition-all duration-200 ease-in hover:scale-[0.998] hover:border hover:border-opacity-80 hover:bg-white/10"
      onClick={handleNavigation}
    >
      <div className="relative flex flex-col">
        <div className="absolute left-2 top-2 flex items-center justify-center rounded-full bg-muted p-1">
          <Heart
            className="h-4 w-4"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              sdk.contract.donateToProject(String(item.githubId), '0.01')
            }}
          />
        </div>
        {/* box */}
        <div className="h-48">
          <img src={item.owner.avatarUrl} alt={item.owner.login} className="h-full w-full object-cover" />
        </div>
        <div className="p-4 lg:p-6">
          {/* name */}
          <div className="flex text-left">
            <a
              className="overflow-hidden text-ellipsis whitespace-nowrap px-0 text-xl font-bold underline-offset-4 hover:underline"
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
          <div className="mt-2 !line-clamp-3 break-all text-sm text-muted-foreground">
            {item.description || 'No description...'}
          </div>
          {/* tags */}
          <div className="mt-5 flex gap-4 text-xs">
            {/* 简单/中等/困难 */}
            <div className="flex items-center gap-1 px-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: DEFAULT_HARDNESS[item.tutorial?.level as keyof typeof DEFAULT_HARDNESS].color,
                }}
              ></div>
              <span>{DEFAULT_HARDNESS[item.tutorial?.level as keyof typeof DEFAULT_HARDNESS].name}</span>
            </div>
            {/* TODO: add watching number */}
            <div className="flex items-center gap-1 px-2">
              <LucideEye className="h-4 w-4" />
              <span>{0}</span>
            </div>
            {/* 时间 */}
            <div className="flex items-center gap-1 px-2">
              <LucideClock8 className="h-3 w-3" />
              <span>{item.tutorial?.time}</span>
            </div>
          </div>
          {/* categories */}
          <div className="mt-3 flex gap-2 border-t border-[#555]/20 pt-3 text-xs">
            {item.tutorial?.categories.map(
              (category) =>
                category && (
                  <div key={category} className="flex h-7 items-center justify-center rounded-lg border px-2">
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

export default function Tutorials() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [urlParam, setUrlParam] = useSearchParams('')
  const [all, setAll] = useState<string>('All')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const { data, isLoading } = useQuery({
    queryKey: ['tutorials', selectedCategories, page, urlParam.toString()],
    queryFn: async () => {
      const tutorials = await fetchTutorials({
        categories: selectedCategories.includes('All') ? [] : selectedCategories,
        offset: (page - 1) * pageSize,
        limit: pageSize,
        sort: decodeURIComponent(urlParam.get('sort') || ''),
        search: decodeURIComponent(urlParam.get('search') || ''),
      })
      return tutorials
    },
  })

  const totalPages = Math.ceil((data?.pagination.totalCount || 0) / pageSize)
  const tutorials = data?.data || []

  const handleSubmit = (searchValue: string, sortValue: string) => {
    setUrlParam(`search=${searchValue}&sort=${sortValue}`)
  }

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
    <div className="flex w-full flex-col gap-2">
      <div className="space-y-5">
        <SearchInput
          searchInitialValue={urlParam.get('search') || ''}
          sortInitialValue={urlParam.get('sort') || ''}
          placeholder="Filter task applies..."
          handleSubmit={handleSubmit}
        />

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
      {!isLoading ? (
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="flex w-full flex-col gap-4 overflow-hidden pt-4">
            <div>Tutorials({tutorials.length})</div>
            <div className="grid w-full grid-cols-1 flex-col gap-4 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3">
              {tutorials.map((item) => (
                <TutorialItem key={item.githubId} item={item} />
              ))}
            </div>
            <PaginationFast page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      ) : (
        <LoadingCards />
      )}
    </div>
  )
}
