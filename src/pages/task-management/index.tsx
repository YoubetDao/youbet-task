import { projectApi, taskApi } from '@/service'
import {
  TaskControllerGetTasksNoGrantNeededEnum,
  TaskControllerGetTasksRewardClaimedEnum,
  TaskControllerGetTasksRewardGrantedEnum,
} from '@/openapi/client'
import { useEffect, useState } from 'react'
import { PAGESIZE, STALETIME } from '@/constants/contracts/request'
import { useQueries, useQuery } from '@tanstack/react-query'
import TaskMgtTable from './_components/TaskMgtTable'
import { ISort } from './_components/TableSortHeader'
import TableFilter from './_components/TableFilter'
import { IData } from '@/components/filter-button'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { filterFromDate, filterFromEntity, priorities, selectedFn } from './_constants'

export default function TaskManagement() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<ISort[]>([])

  const projectsFromUrl = searchParams.get('Projects')
  const assigneesFromUrl = searchParams.get('Assignees')
  const priorityFromUrl = searchParams.get('Priority')
  const projectsSearch = searchParams.get('ProjectsSearch') || ''
  const createdFromUrl = searchParams.get('Created Between')
  const dueFromUrl = searchParams.get('Due Between')

  const [selectProjects, setSelectProjects] = useState<IData[]>([])
  const [selectAssignees, setSelectAssignees] = useState<IData[]>([])
  const [selectPriority, setSelectPriority] = useState<IData[]>([])
  const searchAssigneesInProjects = selectedFn(selectProjects)

  const [selectCreated, setSelectCreated] = useState<IData[]>([])
  const [selectDue, setSelectDue] = useState<IData[]>([])

  const [getProjects, getAssignees] = useQueries({
    queries: [
      {
        queryKey: ['projects', projectsSearch],
        queryFn: async () => {
          const res = await projectApi.projectControllerGetProjects('', '', 'false', projectsSearch, '', 0, 20)
          return res.data
        },
      },
      {
        queryKey: ['assignees', searchAssigneesInProjects],
        queryFn: async () => {
          const res = await projectApi.projectControllerGetProjectInvolvedAssignees(searchAssigneesInProjects)
          return res.data
        },
      },
    ],
  })
  const projects = getProjects.data
  const assignees = getAssignees.data

  const prioritySelected = selectedFn(selectPriority)
  const assigneesSelected = selectedFn(selectAssignees)
  const sortParams = sort.map((item) => `${item.field}:${item.value}`).join(',')

  const { data, isLoading: loading } = useQuery({
    queryKey: ['tasks', '', page, sortParams, searchAssigneesInProjects, prioritySelected, assigneesSelected],
    queryFn: () =>
      taskApi
        .taskControllerGetManagedTasks(
          searchAssigneesInProjects,
          assigneesSelected,
          prioritySelected,
          'open',
          'all',
          TaskControllerGetTasksRewardGrantedEnum.All,
          TaskControllerGetTasksRewardClaimedEnum.All,
          TaskControllerGetTasksNoGrantNeededEnum.All,
          (page - 1) * PAGESIZE,
          PAGESIZE,
          '',
          sortParams,
        )
        .then((res) => res.data),
    staleTime: STALETIME,
    refetchOnWindowFocus: false,
  })

  const tasks = data?.data || []
  const totalPages = Math.ceil((data?.pagination?.totalCount || 0) / PAGESIZE)

  useEffect(() => {
    if (!selectProjects.length) {
      setSelectProjects(projectsFromUrl ? filterFromEntity(projectsFromUrl, projects?.data || []) : [])
    }
    if (!selectAssignees.length) {
      setSelectAssignees(assigneesFromUrl ? filterFromEntity(assigneesFromUrl, assignees?.data || []) : [])
    }
    if (!selectPriority.length) {
      setSelectPriority(priorityFromUrl ? filterFromEntity(priorityFromUrl, priorities) : [])
    }
    if (createdFromUrl) {
      setSelectCreated(filterFromDate(createdFromUrl))
    }
    if (dueFromUrl) {
      setSelectDue(filterFromDate(dueFromUrl))
    }
  }, [
    projectsFromUrl,
    assigneesFromUrl,
    priorityFromUrl,
    selectProjects.length,
    selectAssignees.length,
    selectPriority.length,
    projects?.data,
    assignees?.data,
    createdFromUrl,
    dueFromUrl,
  ])

  return (
    <div className="space-y-4">
      <TableFilter
        projects={projects?.data || []}
        selectProjects={selectProjects}
        selectAssignees={selectAssignees}
        selectPriority={selectPriority}
        setSelectProjects={setSelectProjects}
        setSelectAssignees={setSelectAssignees}
        setSelectPriority={setSelectPriority}
        projectsSearch={projectsSearch}
        assignees={assignees?.data || []}
        priorities={priorities}
        selectCreated={selectCreated}
        setSelectCreated={setSelectCreated}
        selectDue={selectDue}
        setSelectDue={setSelectDue}
      />
      <TaskMgtTable tasks={tasks} page={page} totalPages={totalPages} setPage={setPage} sort={sort} setSort={setSort} />
    </div>
  )
}
