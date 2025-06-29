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
  YoubetApi,
} from '@/openapi/client'

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
export const youbetApi = createApi(YoubetApi)
