import { Icons } from '@/components/icons'
import { Pages } from '@/router/pages'
import { Layouts } from '@/router/layouts'

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

export interface Project {
  _id: number
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
}

export interface Task {
  htmlUrl: string
  title: string
  assignee?: User
  state: string
  labels: string[]
  createdAt: string
  updatedAt: string
  body: string
  assignees: User[]
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

export interface Tutorial {
  _id: number
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
}

export interface TutorialCategory {
  id: string
  name: string
}
