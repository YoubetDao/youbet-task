import { taskApi } from '@/service'
import { useQuery } from '@tanstack/react-query'
function useMyApplies(githubId: number) {
  return useQuery({
    queryKey: ['myApplies', githubId],
    queryFn: () => taskApi.taskControllerMyTaskApply(githubId).then((res) => res.data),
    enabled: !!githubId,
  })
}
function useTask(githubId?: string) {
  return useQuery({
    queryKey: ['task', githubId],
    queryFn: () => taskApi.taskControllerGetTask(Number(githubId)).then((res) => res.data),
    enabled: !!githubId,
  })
}

export { useTask, useMyApplies }
