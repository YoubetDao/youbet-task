import FilterButton, { IConfigs, IData } from '@/components/filter-button'
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
  selectCreated: IData[]
  setSelectCreated: React.Dispatch<React.SetStateAction<IData[]>>
  selectDue: IData[]
  setSelectDue: React.Dispatch<React.SetStateAction<IData[]>>
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
  selectCreated,
  setSelectCreated,
  selectDue,
  setSelectDue,
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
    {
      title: 'Created Between',
      data: [],
      type: 'date',
      get: selectCreated,
      set: setSelectCreated,
      search: null,
    },
    {
      title: 'Due Between',
      data: [],
      type: 'date',
      get: selectDue,
      set: setSelectDue,
      search: null,
    },
  ] satisfies IConfigs[]
  return <FilterButton configs={configs} />
}
