export interface UserInfo {
  token: string
  username: string
}

export enum UserPermission {
  All = 'all',
  PullRequest = 'pull-request',
  TaskApplies = 'task-applies',
}

export interface Chapter {
  title: string
  path: string
  children: Chapter[] | null
  level: number
}
