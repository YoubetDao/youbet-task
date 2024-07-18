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

export interface Repository {
  id: number
  name: string
  html_url: string
  description: string | null
  created_at: string
  updated_at: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
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
  html_url: string
  avatar_url: string
}

export interface Issue {
  url: string
  title: string
  user: User
  state: string
  created_at: string
  updated_at: string
  body: string
  assignees: User[]
}
