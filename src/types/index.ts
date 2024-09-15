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

export interface IResultPagination<T> {
  list: T[]
  pagination: IPagination
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
}

interface PullRequest {
  url: string
  html_url: string
  diff_url: string
  patch_url: string
  merged_at: string
}

interface Reactions {
  url: string
  total_count: number
  '+1': number
  '-1': number
  laugh: number
  hooray: number
  confused: number
  heart: number
  rocket: number
  eyes: number
}

export interface User {
  login: string
  htmlUrl: string
  avatarUrl: string
}

export interface FetchIssuesParams {
  org?: string
  project?: string
  offset?: number
  limit?: number
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
}

export interface Profile {
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
}

export interface Chapter {
  title: string
  path: string
  children: Chapter[] | null
  level: number
}
