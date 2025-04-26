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
  FetchPeriodsParams,
  GrantPeriodRewardsParams,
  Period,
  Receipt,
  PeriodReceipt,
  TaskRewardParams,
  FetchReceiptsParams,
  PeriodReport,
} from '@/types'
import http from './instance'
import { TaskApi, Configuration } from '@/openapi/client'

// ===== 认证 (Auth) =====
export async function fetchUserInfo(code: string): Promise<UserInfo> {
  const response = await http.get('/auth/github/callback', { params: { code } })
  return response.data.data
}

// ===== 用户 (Users) =====
export async function getMyInfo() {
  const response = await http.get<Profile>(`/users/me`)
  return response.data
}

export async function fetchLeaderboard(): Promise<{ data: Profile[]; totalCount: number }> {
  const response = await http.get('/users/leaderboard?limit=5')
  return {
    data: response.data.data,
    totalCount: response.data.pagination.totalCount,
  }
}

// ===== 合约 (Youbet) =====
export async function getLinkedWallet(github: string) {
  const response = await http.get<string>(`/youbet/wallet?github=${github}`)
  return response.data
}

export async function linkWallet(params: { github: string; address: string }) {
  const response = await http.post('/youbet/wallet', params)
  return response.data
}

// ===== 项目 (Projects) =====
export async function fetchProjects(): Promise<Project[]> {
  const response = await http.get('/projects?limit=1000')
  return response.data.data
}

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

export async function fetchProjectReports(projectId: string) {
  const response = await http.get<PeriodReport[]>(`/projects/${projectId}/reports`)
  return Array.isArray(response.data) ? response.data : []
}

export async function importProjectForUser(params: { org: string; project: string; tutorial?: Tutorial }) {
  const response = await http.post('/projects/import', params)
  return response.data
}

// ===== 任务 (Tasks) =====
export async function fetchTask(issueGithubId: string) {
  const response = await http.get(`/tasks/${issueGithubId}`)
  return response.data as Task
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
  const response = await http.get<IResultPaginationData<Task>>('/tasks/mine', { params })
  return response.data
}

export async function myAppliesForTask(taskGithubId: string) {
  const response = await http.get(`/tasks/${taskGithubId}/my-applies`)
  return response.data
}

export async function updateTaskInfo(taskId: string, data: { reward: any }) {
  return await http.patch(`/tasks/${taskId}`, data)
}

export async function claimTask(params: { org: string; project?: string; task?: string }) {
  const response = await http.patch('/tasks/claim', params)
  return response.data
}

export async function disclaimTask(params: { org: string; project?: string; task?: string }) {
  const response = await http.patch('/tasks/disclaim', params)
  return response.data
}

export async function grantTaskRewards(taskId: string, params: TaskRewardParams) {
  const response = await http.post(`/tasks/${taskId}/rewards`, {
    contributors: params.contributors,
  })
  return response.data
}

// ===== 任务申请 (Task Applies) =====
export async function fetchTaskApplies(params: FetchTaskAppliesParams) {
  const response = await http.get<IResultPaginationData<PopulatedTaskApply>>('/task-applies', { params })
  return response.data
}

export async function applyTask(params: { taskGithubId: string; comment: string }) {
  const response = await http.post('/task-applies', params)
  return response.data
}

export async function approveTaskApply(id: string) {
  const response = await http.patch(`/task-applies/${id}/approve`, {})
  return response.data
}

export async function rejectTaskApply(id: string) {
  const response = await http.patch(`/task-applies/${id}/reject`, {})
  return response.data
}

export async function withdrawApply(params: { id: string }) {
  const response = await http.patch(`/task-applies/${params.id}/withdraw`, {})
  return response.data
}

// ===== 教程 (Tutorials) =====
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

export async function fetchTutorialContent(githubId: string) {
  const response = await http.get(`/tutorials/${githubId}`)
  return response.data
}

export async function getTutorialToC(owner: string, repo: string) {
  const response = await http.get<Chapter[]>(`/tutorials/${owner}/${repo}/chapters`)
  return response.data
}

export async function getMdBookContent(owner: string, repo: string, path: string) {
  const response = await http.get<string>(`/tutorials/${owner}/${repo}/content?path=${path}.md`)
  return response.data
}

// ===== Pull Requests =====
export async function fetchPullRequests(params: FetchPullRequestParams) {
  const response = await http.get<IResultPaginationData<PullRequest>>('/pull-requests', { params })
  return response.data
}

// ===== 周期 (Periods) =====
export async function fetchPeriods(params: FetchPeriodsParams) {
  const response = await http.get<IResultPaginationData<Period>>('/periods', { params })
  return response.data
}

export async function postGrantPeriodRewards(params: GrantPeriodRewardsParams) {
  const response = await http.post(`/periods/${params.id}/grant-rewards`, {
    contributors: params.contributors,
  })
  return response.data
}

// ===== 收据 (Receipts) =====
export async function fetchReceipts(params: FetchReceiptsParams) {
  const response = await http.get<IResultPaginationData<Receipt>>('/receipts/mine', { params })
  return response.data
}

export async function fetchReceiptsByPeriod(id: string) {
  const response = await http.get<IResultPaginationData<PeriodReceipt>>(`/receipts`, {
    params: { periodId: id },
  })
  return response.data
}

export async function claimReceipt(id: string) {
  const response = await http.patch(`/receipts/${id}/claim`, {})
  return response.data
}

// ===== 奖励 (Rewards) =====
export async function postPrRewardInfo(params: PrRewardInfo) {
  const response = await http.post('/rewards', params)
  return response.data
}

export async function getRewardSignature(uuid: string) {
  const response = await http.get<{ signature: string }>(`/rewards/${uuid}/signature`)
  return response.data
}

// ===== GitHub 相关 (Orgs, Repos) =====
export async function getUserOrgs() {
  const response = await http.get<GithubOrganization[]>('/github/orgs')
  return response.data
}

export async function getRepos(org: string) {
  const response = await http.get<GithubRepo[]>(`/github/orgs/${org}/repos`)
  return response.data
}

// ===== 测试 (Test) =====
export const taskApi = new TaskApi(
  new Configuration({
    basePath: import.meta.env.VITE_BASE_URL,
  }),
  '',
  http,
)
