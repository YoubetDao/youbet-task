import {
  Project,
  Task,
  Profile,
  Chapter,
  FetchPullRequestParams,
  IResultPaginationData,
  PullRequest,
  FetchTaskAppliesParams,
  PopulatedTaskApply,
  GithubOrganization,
  GithubRepo,
  Tutorial,
  PrRewardInfo,
  TaskState,
  UserInfo,
  FetchPullRequestAggregationsParams,
  Record,
  FetchGrantAggregationRewardsParams,
} from '@/types'
import http from './instance'

export async function getLoadMoreProjectList(params: {
  offset: number | undefined
  limit: number
  filterTags?: string[]
  sort?: string
  search?: string
  onlyPeriodicReward?: boolean
}) {
  const res = await http.get<IResultPaginationData<Project>>(`/projects`, {
    params: {
      tags: params.filterTags ?? '',
      offset: params.offset,
      limit: params.limit,
      sort: params.sort ?? '',
      search: params.search ?? '',
      onlyPeriodicReward: params.onlyPeriodicReward,
    },
  })
  return { list: res.data.data, pagination: res.data.pagination }
}

export async function fetchUserInfo(code: string): Promise<UserInfo> {
  const response = await http.get('/auth/github/callback', { params: { code } })
  return response.data.data
}

export async function fetchTask(githubId: string) {
  const response = await http.get(`/task/${githubId}`)
  return response.data as Task
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await http.get('/projects?limit=1000')
  return response.data.data
}

export async function fetchLeaderboard(): Promise<{ data: Profile[]; totalCount: number }> {
  const response = await http.get('/leaderboard?limit=5')
  return {
    data: response.data.data,
    totalCount: response.data.pagination.totalCount,
  }
}

export async function fetchTutorialContent(githubId: string) {
  const response = await http.get('/tutorial/' + githubId)
  return response.data
}

export async function disclaimTask(params: { org: string; project?: string; task?: string }) {
  const response = await http.post('/disclaim-task', params)
  return response.data
}

export async function claimTask(params: { org: string; project?: string; task?: string }) {
  const response = await http.post('/claim-task', params)
  return response.data
}

export async function applyTask(params: { taskGithubId: string; comment: string }) {
  const response = await http.post('/apply-task', params)
  return response.data
}

export async function withdrawApply(params: { id: string }) {
  const response = await http.post('/cancel-task-apply', params)
  return response.data
}

export async function myAppliesForTask(taskGithubId: string) {
  const response = await http.get(`/task/${taskGithubId}/my-applies`)
  return response.data
}

export async function getLinkedWallet(github: string) {
  const response = await http.get<string>(`/get-linked-wallet?github=${github}`)
  return response.data
}

export async function linkWallet(params: { github: string; address: string }) {
  const response = await http.post('/link-wallet', params)
  return response.data
}

export async function getMyInfo() {
  const response = await http.get<Profile>(`/my-info`)
  return response.data
}

export async function getTutorialToC(owner: string, repo: string) {
  const response = await http.get<Chapter[]>(`/tutorial-chapters?owner=${owner}&repo=${repo}`)
  return response.data
}

export async function getOwnerAndRepo(githubId: string) {
  const response = await http.get<Project>(`/project/${githubId}/detail`)
  return response.data
}

export async function getMdBookContent(owner: string, repo: string, path: string) {
  const response = await http.get<string>(`/fetch-markdown?owner=${owner}&repo=${repo}&path=${path}.md`)
  return response.data
}

export async function fetchPullRequests(params: FetchPullRequestParams) {
  const response = await http.get<IResultPaginationData<PullRequest>>('/pull-requests', { params })
  return response.data
}

export async function fetchPeriod(params: FetchPullRequestAggregationsParams) {
  const response = await http.get<IResultPaginationData<Record>>('/aggregations', { params })
  return response.data
}

export async function postGrantAggregationRewards(params: FetchGrantAggregationRewardsParams) {
  const response = await http.post<string>(`/aggregations/${params.id}/grant-rewards`)
  return response.data
}

export async function fetchTaskApplies(params: FetchTaskAppliesParams) {
  const response = await http.get<IResultPaginationData<PopulatedTaskApply>>('/task-applies', { params })
  return response.data
}

export async function getUserOrgs() {
  const response = await http.get<GithubOrganization[]>('/user-orgs')
  return response.data
}

export async function getRepos(org: string) {
  const response = await http.get<GithubRepo[]>(`/org-repos?org=${org}`)
  return response.data
}

export async function importProjectForUser(params: { org: string; project: string; tutorial?: Tutorial }) {
  const response = await http.post('/import-project-for-user', params)
  return response.data
}

export async function approveTaskApply(id: string) {
  const response = await http.post(`/approve-task-apply/${id}`)
  return response.data
}

export async function rejectTaskApply(id: string) {
  const response = await http.post(`/reject-task-apply/${id}`)
  return response.data
}

export async function fetchTutorials(params: {
  categories: string[]
  offset: number
  limit: number
  sort: string
  search: string
}) {
  const response = await http.get<IResultPaginationData<Project>>('/tutorials', { params })
  return response.data
}

export async function fetchTasks(params: {
  project: string
  offset: number
  limit: number
  states: TaskState[]
  assignmentStatus?: string
}) {
  const response = await http.get<IResultPaginationData<Task>>('/tasks', { params })
  return response.data
}

export async function fetchMyTasks(params: { offset: number; limit: number; states: TaskState[] }) {
  const response = await http.get<IResultPaginationData<Task>>('/my-tasks', { params })
  return response.data
}

export async function postPrRewardInfo(params: PrRewardInfo) {
  const response = await http.post('/rewards', params)
  return response.data
}
