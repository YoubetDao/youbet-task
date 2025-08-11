import { Project } from '@/openapi/client'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteScroll } from 'ahooks' // TODO: api schema conflict with ahooks api design
import { projectApi } from '@/service'
import { DEFAULT_PAGINATION_LIMIT } from '@/constants/data'
import { getAppearances } from '@/lib/appearances'
import { SearchInput } from '@/components/search'
import { IPagination, IResultPagination } from '@/types'
import ProjectList from './_components/ProjectList'

export default function ProjectPage() {
  const [urlParam, setUrlParam] = useSearchParams('')
  const appearances = getAppearances()

  const { data, loading, loadingMore, reload } = useInfiniteScroll<IResultPagination<Project>>(
    (d) =>
      projectApi
        .projectControllerGetProjects(
          '',
          '',
          'false',
          urlParam.get('search') || '',
          urlParam.get('sort') || '',
          d ? d.pagination?.currentPage * DEFAULT_PAGINATION_LIMIT : 0,
          DEFAULT_PAGINATION_LIMIT,
        )
        .then((res) => ({
          list: res.data.data || [],
          pagination: res.data.pagination as IPagination,
        })),
    {
      manual: true,
      target: document.querySelector('#scrollRef'),
      isNoMore: (data) => {
        return data ? !data.pagination?.hasNextPage : false
      },
    },
  )

  const handleSubmit = (searchValue: string, sortValue: string) => {
    setUrlParam(`search=${searchValue}&sort=${sortValue}`)
  }

  useEffect(() => {
    reload()
  }, [reload, urlParam])

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="sticky top-4 flex items-center justify-between gap-2">
        <SearchInput
          searchInitialValue={urlParam.get('search') || ''}
          sortInitialValue={urlParam.get('sort') || ''}
          placeholder="Filter projects..."
          handleSubmit={handleSubmit}
        />
      </div>
      <ProjectList loading={loading} loadingMore={loadingMore} data={data} appearances={appearances} />
    </div>
  )
}
