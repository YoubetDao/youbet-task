import FilterButton, { IData } from '@/components/filter-button'
import { GithubUser, Project } from '@/openapi/client'

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
  priorities: IData[]
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
  priorities,
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
      data: priorities,
      type: 'multi',
      get: selectPriority,
      set: setSelectPriority,
      search: null,
    },
    {
      title: 'Assignees',
      data: assignees,
      type: 'multi',
      get: selectAssignees,
      set: setSelectAssignees,
      search: null,
    },
  ]
  return <FilterButton configs={configs} />
}
