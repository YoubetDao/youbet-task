import { getAppearances } from '@/lib/appearances'
import { NavItem } from '@/types'
import { Connection } from '@solana/web3.js'
import { SdkCtorOptions } from 'youbet-sdk'

export const getNavItems = (): NavItem[] => {
  const appearances = getAppearances()

  const navItems: NavItem[] = [
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
      title: 'Tutorials',
      href: '/tutorials',
      icon: 'tutorial',
      component: 'tutorials',
      layout: 'dashboard',
      hideInMenu: false,
      disabled: !appearances.showTutorials,
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
      title: 'Tutorial',
      href: '/tutorial/:githubId/:owner/:repo/:path',
      icon: 'tutorial',
      component: 'tutorial',
      description: 'tutorial.',
      layout: 'tutorial',
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
    {
      title: 'TaskDetail',
      href: '/task/:githubId',
      component: 'taskDetail',
      description: 'task detail.',
      layout: 'dashboard',
      hideInMenu: true,
    },
    {
      title: 'Admin',
      href: '#',
      icon: 'settings',
      component: 'error',
      layout: 'dashboard',
      children: [
        {
          title: 'Pull Requests',
          href: '/admin/pull-requests',
          icon: 'gitPullRequest',
          component: 'pullRequestAdmin',
          layout: 'dashboard',
        },
        {
          title: 'Task Apply',
          href: '/admin/task-apply',
          icon: 'clipboardList',
          component: 'taskApplyAdmin',
          layout: 'dashboard',
        },
      ],
    },
  ]

  const filteredNavItems = navItems.filter((item) => !item.disabled)

  return filteredNavItems
}

export const DEFAULT_PAGINATION_LIMIT = 4

export const openCampusTestOptions: SdkCtorOptions = {
  chainName: 'solana',
  networkOptions: {
    contractAddress: '',
    rpcUrl: 'https://api.devnet.solana.com',
    chainId: 0,
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  wallet: window.solana,
  connection: new Connection('https://api.devnet.solana.com', {
    commitment: 'confirmed',
  }),
}
