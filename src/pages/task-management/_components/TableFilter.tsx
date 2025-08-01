import FilterButton, { IData } from '@/components/filter-button'
import { TaskPriorityEnum } from '@/openapi/client'
import { projectApi } from '@/service'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function TableFilter() {
  const [selectProjects, setSelectProjects] = useState<IData[]>([])
  const [selectAssignees, setSelectAssignees] = useState<IData[]>([])
  const [selectPriority, setSelectPriority] = useState<IData[]>([])
  const [searchParams] = useSearchParams()
  const projectsSearch = searchParams.get('ProjectsSearch') || ''

  const { data: projects } = useQuery({
    queryKey: ['projects', projectsSearch],
    queryFn: async () => {
      const res = await projectApi.projectControllerGetProjects('', '', 'false', projectsSearch, '', 0, 20)
      return res.data
    },
  })

  const configs = [
    {
      title: 'Projects',
      data: projects?.data ?? [],
      type: 'multi',
      get: selectProjects,
      set: setSelectProjects,
      search: projectsSearch,
    },
    {
      title: 'Priority',
      data: [
        {
          name: 'P0',
          value: TaskPriorityEnum.P0,
        },
        {
          name: 'P1',
          value: TaskPriorityEnum.P1,
        },
        {
          name: 'P2',
          value: TaskPriorityEnum.P2,
        },
      ],
      type: 'multi',
      get: selectPriority,
      set: setSelectPriority,
      search: '',
    },
    {
      title: 'Assignees',
      data: [],
      type: 'multi',
      get: selectAssignees,
      set: setSelectAssignees,
      search: '',
    },
  ]

  return <FilterButton configs={configs} />
}
