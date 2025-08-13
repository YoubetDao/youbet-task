import { projectApi, taskApi } from '@/service'
import {
  TaskControllerGetTasksNoGrantNeededEnum,
  TaskControllerGetTasksRewardClaimedEnum,
  TaskControllerGetTasksRewardGrantedEnum,
} from '@/openapi/client'
import { useState } from 'react'
import { PAGESIZE, STALETIME } from '@/constants/contracts/request'
import { useQuery } from '@tanstack/react-query'
import TaskMgtTable from './_components/TaskMgtTable'
import TableFilter from './_components/TableFilter'
import { IData } from '@/components/filter-button'
import { useSearchParams } from 'react-router-dom'

export default function TaskManagement() {
  const [page, setPage] = useState(1)
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
  const searchAssigneesInProjects = selectProjects.map((item) => item.value).join(',')

  const { data: assignees } = useQuery({
    queryKey: ['assignees', searchAssigneesInProjects],
    queryFn: async () => {
      const res = await projectApi.projectControllerGetProjectInvolvedAssignees(searchAssigneesInProjects)
      return res.data
    },
  })

  const { data, isLoading: loading } = useQuery({
    queryKey: ['tasks', '', page],
    queryFn: () =>
      taskApi
        .taskControllerGetTasks(
          '',
          '',
          '',
          'open',
          'all',
          TaskControllerGetTasksRewardGrantedEnum.All,
          TaskControllerGetTasksRewardClaimedEnum.All,
          TaskControllerGetTasksNoGrantNeededEnum.All,
          (page - 1) * PAGESIZE,
          PAGESIZE,
        )
        .then((res) => res.data),
    staleTime: STALETIME,
    refetchOnWindowFocus: false,
  })

  const tasks = data?.data || []
  const totalPages = Math.ceil((data?.pagination?.totalCount || 0) / PAGESIZE)

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
        assignees={Array.isArray(assignees) ? assignees : assignees?.data || []}
      />
      <TaskMgtTable tasks={tasks} page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  )
}
