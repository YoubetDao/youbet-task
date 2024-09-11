import { Project, Task, FetchIssuesParams, Profile } from '@/types'
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
