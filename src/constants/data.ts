import { NavItem } from '@/types'

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: 'home',
    component: 'dashboard',
    layout: 'dashboard',
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: 'package',
    component: 'project',
    layout: 'dashboard',
  },
  {
    title: 'Tasks',
    href: '/projects/:project/tasks',
    icon: 'listChecks',
    component: 'task',
    layout: 'dashboard',
    hideInMenu: true,
  },
  {
    title: 'MyTasks',
    href: '/mytasks',
    icon: 'listChecks',
    component: 'mytask',
    layout: 'dashboard',
  },
  {
    title: 'Login',
    href: '/login',
    component: 'login',
    description: 'Authentication forms built using the components.',
    hideInMenu: true,
  },
  {
    title: 'callback',
    href: '/auth/github/callback',
    component: 'callback',
    description: 'Redirect route.',
    hideInMenu: true,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: 'profile',
    component: 'profile',
    description: 'My Profile.',
    layout: 'dashboard',
  },
]
