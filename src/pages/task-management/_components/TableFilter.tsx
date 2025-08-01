import FilterButton, { IData } from '@/components/filter-button'
import { TaskPriorityEnum } from '@/openapi/client'
import { projectApi } from '@/service'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export default function TableFilter() {
  const [selectProjects, setSelectProjects] = useState<IData[]>([])
  const [selectAssignees, setSelectAssignees] = useState<IData[]>([])
  const [selectPriority, setSelectPriority] = useState<IData[]>([])

  // paging request project list
  const { data: projects, isLoading: projectLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      return projectApi.projectControllerGetProjects('', '', 'false', '', '', 0, 1000).then((res) => res.data)
    },
  })
  const configs = [
    {
      title: 'Projects',
      data: projects?.data ?? [],
      type: 'multi',
      get: selectProjects,
      set: setSelectProjects,
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
    },
    {
      title: 'Assignees',
      data: [],
      type: 'multi',
      get: selectAssignees,
      set: setSelectAssignees,
    },
  ]

  return <FilterButton configs={configs} />
}
