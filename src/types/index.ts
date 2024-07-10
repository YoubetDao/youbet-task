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
