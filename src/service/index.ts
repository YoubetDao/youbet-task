import { GithubOrganization, GithubRepo } from '@/types'
import http from './instance'
import {
  TaskApi,
  Configuration,
  ReportApi,
  PeriodApi,
  TaskApplyApi,
  UserApi,
  AuthApi,
  ProjectApi,
  ReceiptApi,
  RewardApi,
  GithubApi,
  OrgApi,
} from '@/openapi/client'

// ===== 合约 (Youbet) =====
export async function getLinkedWallet(github: string) {
  const response = await http.get<string>(`/youbet/wallet?github=${github}`)
  return response.data
}

export async function linkWallet(params: { github: string; address: string }) {
  const response = await http.post('/youbet/wallet', params)
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

function createApi<T>(ApiClass: new (...args: any[]) => T): T {
  return new ApiClass(new Configuration({ basePath: import.meta.env.VITE_BASE_URL }), '', http)
}
export const taskApi = createApi(TaskApi)
export const reportApi = createApi(ReportApi)
export const periodApi = createApi(PeriodApi)
export const taskApplyApi = createApi(TaskApplyApi)
export const userApi = createApi(UserApi)
export const authApi = createApi(AuthApi)
export const projectApi = createApi(ProjectApi)
export const receiptApi = createApi(ReceiptApi)
export const rewardApi = createApi(RewardApi)
export const githubApi = createApi(GithubApi)
export const orgApi = createApi(OrgApi)
