import FilterButton, { IData } from '@/components/filter-button'
import { GithubUser, Project, TaskPriorityEnum } from '@/openapi/client'

interface ITableFilterProps {
  projects: Project[]
  selectProjects: IData[]
  setSelectProjects: React.Dispatch<React.SetStateAction<IData[]>>
  projectsSearch: string
  selectPriority: IData[]
  setSelectPriority: React.Dispatch<React.SetStateAction<IData[]>>
  selectAssignees: IData[]
  setSelectAssignees: React.Dispatch<React.SetStateAction<IData[]>>
  assignees: GithubUser[]
}

export default function TableFilter({
  projects,
  selectProjects,
  setSelectProjects,
  projectsSearch,
  selectPriority,
  setSelectPriority,
  selectAssignees,
  setSelectAssignees,
  assignees,
}: ITableFilterProps) {
  const configs = [
    {
      title: 'Projects',
      data: projects,
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
      data: assignees,
      type: 'multi',
      get: selectAssignees,
      set: setSelectAssignees,
      search: '',
    },
  ]

  return <FilterButton configs={configs} />
}
