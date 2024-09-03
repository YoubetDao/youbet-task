import { IResultPaginationData, Project } from '@/types'
import http from '@/service/instance'

export async function getLoadMoreProjectList(params: {
  offset: number | undefined
  limit: number
  filterTags: string[]
}) {
  const res = await http.get<IResultPaginationData<Project>>(`/projects`, {
    params: {
      tags: params.filterTags,
      offset: params.offset,
      limit: params.limit,
    },
  })
  return { list: res.data.data, pagination: res.data.pagination }
}
