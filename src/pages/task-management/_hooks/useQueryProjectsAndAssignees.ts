import { projectApi } from '@/service'
import { useQueries } from '@tanstack/react-query'

const useQueryProjectsAndAssignees = ({
  projectsSearch,
  searchAssigneesInProjects,
}: {
  projectsSearch: string
  searchAssigneesInProjects: string
}) => {
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
  return {
    projects: getProjects.data,
    assignees: getAssignees.data,
  }
}

export default useQueryProjectsAndAssignees
