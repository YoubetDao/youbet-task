import {
  Project,
  Task,
  FetchIssuesParams,
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
} from '@/types'
// import { Project, Task, FetchIssuesParams, Profile, GithubOrganization, GithubRepo, Tutorial } from '@/types'
import http from './instance'

export async function fetchUserInfo(code: string) {
  const response = await http.get('/auth/github/callback', { params: { code } })
  console.log('User info:', response.data)
  return response.data.data
}

export async function fetchTask(githubId: string) {
  const response = await http.get(`/task/${githubId}`)
  return response.data as Task
}

export async function fetchTasks(params: FetchIssuesParams) {
  const response = await http.get('/tasks', { params })
  return response.data.data as Task[]
}

export async function fetchProjects() {
  const response = await http.get('/projects?limit=1000')
  return response.data.data as Project[]
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
  // TODO: const response = await http.get<Chapter[]>(`/tutorial-chapters?owner=${owner}&repo=${repo}`)
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
