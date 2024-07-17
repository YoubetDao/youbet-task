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
  node_id: string
  name: string
  full_name: string
  private: boolean
  owner: {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
  }
  html_url: string
  description: string | null
  fork: boolean
  url: string
  forks_url: string
  keys_url: string
  collaborators_url: string
  teams_url: string
  hooks_url: string
  issue_events_url: string
  events_url: string
  assignees_url: string
  branches_url: string
  tags_url: string
  blobs_url: string
  git_tags_url: string
  git_refs_url: string
  trees_url: string
  statuses_url: string
  languages_url: string
  stargazers_url: string
  contributors_url: string
  subscribers_url: string
  subscription_url: string
  commits_url: string
  git_commits_url: string
  comments_url: string
  issue_comment_url: string
  contents_url: string
  compare_url: string
  merges_url: string
  archive_url: string
  downloads_url: string
  issues_url: string
  pulls_url: string
  milestones_url: string
  notifications_url: string
  labels_url: string
  releases_url: string
  deployments_url: string
  created_at: string
  updated_at: string
  pushed_at: string
  git_url: string
  ssh_url: string
  clone_url: string
  svn_url: string
  homepage: string | null
  size: number
  stargazers_count: number
  watchers_count: number
  language: string
  has_issues: boolean
  has_projects: boolean
  has_downloads: boolean
  has_wiki: boolean
  has_pages: boolean
  has_discussions: boolean
  forks_count: number
  mirror_url: string | null
  archived: boolean
  disabled: boolean
  open_issues_count: number
  license: string | null
  allow_forking: boolean
  is_template: boolean
  web_commit_signoff_required: boolean
  topics: string[]
  visibility: string
  forks: number
  open_issues: number
  watchers: number
  default_branch: string
  permissions: {
    admin: boolean
    maintain: boolean
    push: boolean
    triage: boolean
    pull: boolean
  }
  security_and_analysis: {
    secret_scanning: {
      status: string
    }
    secret_scanning_push_protection: {
      status: string
    }
    dependabot_security_updates: {
      status: string
    }
    secret_scanning_non_provider_patterns: {
      status: string
    }
    secret_scanning_validity_checks: {
      status: string
    }
  }
}

interface User {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
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

export interface Issue {
  url: string
  repository_url: string
  labels_url: string
  comments_url: string
  events_url: string
  html_url: string
  id: number
  node_id: string
  number: number
  title: string
  user: User
  labels: any[]
  state: string
  locked: boolean
  assignee: any
  assignees: any[]
  milestone: any
  comments: number
  created_at: string
  updated_at: string
  closed_at: string
  author_association: string
  active_lock_reason: any
  draft: boolean
  pull_request: PullRequest
  body: any
  reactions: Reactions
  timeline_url: string
  performed_via_github_app: any
  state_reason: any
}
