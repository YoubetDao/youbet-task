export interface UserInfo {
  token: string
  username: string
}

export enum UserPermission {
  All = 'all',
  PullRequest = 'pull-request',
  TaskApplies = 'task-applies',
}
