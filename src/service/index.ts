import {
  IResultPaginationData,
  GithubOrganization,
  GithubRepo,
  Receipt,
  PeriodReceipt,
  FetchReceiptsParams,
} from '@/types'
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
