import { CategoryGroup } from '@/components/category-group'
import { TaskCatalog } from '@/components/task'
import { fetchMyTasks } from '@/service'
import { MyTaskState } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

const DEFAULT_CATEGORIES = ['all', 'open', 'closed']

export default function MyTask() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [page, setPage] = useState(1)
  const pageSize = 9

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', page, pageSize, selectedCategory],
    queryFn: () =>
      fetchMyTasks({
        offset: (page - 1) * pageSize,
        limit: pageSize,
        states: selectedCategory !== 'all' ? [selectedCategory as MyTaskState] : [],
      }),
  })

  const onCategoryChange = (value: string) => {
    setSelectedCategory(value)
  }

  return (
    <main className="flex flex-col gap-5">
      <header className="flex flex-col space-y-2" aria-label="Filter Controls">
        <div className="flex space-x-2">
          <CategoryGroup
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            categories={DEFAULT_CATEGORIES}
          />
        </div>
      </header>
      <TaskCatalog
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        totalPages={Math.ceil((data?.pagination.totalCount || 0) / pageSize)}
        tasks={data?.data}
        setPage={setPage}
      />
    </main>
  )
}
