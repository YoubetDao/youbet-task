import { Icons } from '@/components/icons'
import { Pages } from '@/router/pages'
import { Layouts } from '@/router/layouts'

export interface IPagination {
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface IResultPaginationData<T> {
  data: T[]
  pagination: IPagination
}

export interface Wallet {
  address: string
  chain: string
}

export interface ReceiptDetail {
  amount: number
  decimals: number
  symbol: string
}

export interface PeriodReceipt {
  _id: string
  user: string
  detail: ReceiptDetail
  status: ReceiptStatus
}

export interface Period {
  _id: string
  projectId: string
  from: string
  to: string
  pullRequests: string[]
  contributors: User[]
  rewardGranted: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export enum ReceiptStatus {
  GRANTED = 'granted',
  CLAIMED = 'claimed',
}

export interface Receipt {
  _id: string
  user: User
  source: {
    period?: Period
    task?: Task
  }
  detail: ReceiptDetail
  transactionInfo?: {
    network: string
    from: string
    to: string
    amount: number
    decimals: number
    symbol: string
    transactionId: string
  }
  status: ReceiptStatus
  createdAt: string
  updatedAt: string
}

export interface IResultPagination<T> {
  list: T[]
  pagination: IPagination
}

export interface PaginationParams {
  offset?: number
  limit?: number
}

interface BaseItem {
  id: string
  createAt: string
  updateAt: string
}

export interface NavItem {
  title: string
  href: string
  icon?: keyof typeof Icons
  component: keyof typeof Pages
  layout?: keyof typeof Layouts
  description?: string
  hideInMenu?: boolean
  children?: NavItem[]
  disabled?: boolean
}

export interface ProjectItem extends BaseItem {
  title: string
  description: string
  link: string
}

export interface TaskItem extends BaseItem {
  title: string
  description: string
  priority: 0 | 1 | 2 | 3
  projectId: string
  link: string
  status: 'todo' | 'in-progress' | 'done'
}

export interface Tutorial {
  level: string
  time: string
  categories: string[]
}

export interface YoubetExtra {
  tags?: string[]
}

export interface Project {
  _id: number
  githubId: number
  name: string
  htmlUrl: string
  description: string | null
  createdAt: string
  updatedAt: string
  stargazersCount: number
  forksCount: number
  openIssuesCount: number
  language: string | null
  owner: User
  tutorial?: Tutorial
  youbetExtra?: YoubetExtra
  contributors: number
}

export interface PeriodReport {
  _id: string
  from: string
  to: string
  issueCount: number
  title: string
  summary: string
}

export enum UserPermission {
  All = 'all',
  PullRequest = 'pull-request',
  TaskApplies = 'task-applies',
}

export interface User {
  login: string
  username?: string
  htmlUrl: string
  avatarUrl: string
  rewards?: number
  ethMainWallet: `0x${string}`
  _id: string
}

export interface FetchIssuesParams {
  org?: string
  project?: string
  offset?: number
  limit?: number
}
export interface FetchPullRequestParams extends PaginationParams {
  state?: string
  search?: string
  sort?: string
}

export interface FetchPeriodsParams extends PaginationParams {
  projectId: string
  sortDirection?: 'asc' | 'desc'
  rewardGranted?: boolean
}

export interface FetchReceiptsParams extends PaginationParams {
  type?: 'period' | 'task'
}

export interface GrantPeriodRewardsParams {
  id: string
  contributors: Array<{
    contributor: string
    amount: number
    symbol: string
    decimals: number
  }>
}

export interface TaskRewardParams {
  contributors: Array<{
    contributor: string
    amount: number
    symbol: string
    decimals: number
  }>
}

export interface PullRequest {
  _id: string
  githubId: number
  title: string
  projectName: string
  body: string
  state: string
  createdAt: string
  updatedAt: string
  closedAt: string | null
  mergedAt: string | null
  htmlUrl: string
  project: string
  user: User
  assignees: User[]
  labels: string[]
  namespace: string
  rewardGranted: boolean
}

export interface FetchTaskAppliesParams extends PaginationParams {
  search?: string
  sort?: string
}

export interface PopulatedTaskApply extends Omit<TaskApply, 'task' | 'user'> {
  task: Task
  user: User
}

export interface TaskApply {
  _id: string
  githubId: string
  project: string
  task: string
  projectName: string
  user: {
    login: string
  }
  comment?: string
  htmlUrl?: string
  createdAt: Date
  updatedAt: Date
  canceledAt?: Date
  approvedAt?: Date
}

export interface Task {
  htmlUrl: string
  githubId: string
  title: string
  assignee?: User
  state: string
  labels: string[]
  labelsWithColors?: { name: string; color: string }[]
  createdAt: string
  updatedAt: string
  body: string
  assignees: User[]
  _id: string
  user?: User
  closedAt?: string
  rewardGranted?: boolean
  reward?: {
    amount: number
    decimals: number
    symbol: string
    tokenAddress: string
  }
}

export interface Profile {
  _id: string
  username: string
  email?: string
  avatarUrl: string
  displayName?: string
  location?: string
  bio?: string
  followers?: number
  following?: number
  twitterUsername?: string
  completedTasks?: number
  githubAccessToken?: string
  adminNamespaces: string[]
  adminProjects?: string[]
}

export interface UserInfo {
  id: string
  username: string
  displayName: string
  photos: Photo[]
  emails: Email[]
  jwt: string
  location: string | null
  bio: string | null
  followers: number
  following: number
  twitterUsername: string | null
  githubAccessToken: string
  adminNamespaces: string[]
  adminProjects: string[]
}

export interface Photo {
  value: string
}

export interface Email {
  value: string
}

export interface Chapter {
  title: string
  path: string
  children: Chapter[] | null
  level: number
}

export interface GithubOrganization {
  login: string
  id?: number
  node_id?: string
  url?: string
  repos_url?: string
  events_url?: string
  hooks_url?: string
  issues_url?: string
  members_url?: string
  public_members_url?: string
  avatar_url: string
  description?: string
}

export interface GithubRepo {
  id: number
  name: string
  full_name: string
  private: boolean
  owner: User
  html_url: string
  description: string
  created_at: string
}

export interface PrRewardInfo {
  recipientName: string
  source: Source
  /**
   * pending, received, done
   */
  status: string
  transactionInfo: TransactionInfo
  /**
   * Crypto, NFT, Alipay…
   */
  type: string
}

export interface Source {
  projectGithubId?: number
  pullRequestGithubId?: number
  pullRequestGitHubId?: number
  taskGithubId?: number
}

export interface TransactionInfo {
  amount: number
  decimals: number
  from: string
  network: string
  symbol: string
  to: string
  transactionId: string
}

export type TaskState = '' | 'open' | 'closed'
