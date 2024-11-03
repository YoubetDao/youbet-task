import { getAppearances } from '@/lib/appearances'
import { NavItem, UserPermission } from '@/types'
import { SdkCtorOptions, SDK } from 'youbet-sdk'
import { polygon } from 'viem/chains'

export const getNavItems = (userPermission?: UserPermission): NavItem[] => {
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
      children: [
        {
          title: 'Tasks',
          href: '/projects/:project/tasks',
          component: 'task',
          layout: 'dashboard',
          hideInMenu: true,
        },
      ],
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
      hideInMenu: !userPermission,
      children: [
        {
          title: 'Pull Requests',
          href: '/admin/pull-requests',
          icon: 'gitPullRequest',
          component: 'pullRequestAdmin',
          layout: 'dashboard',
          hideInMenu: userPermission !== UserPermission.PullRequest && userPermission !== UserPermission.All,
        },
        {
          title: 'Task Apply',
          href: '/admin/task-apply',
          icon: 'clipboardList',
          component: 'taskApplyAdmin',
          layout: 'dashboard',
          hideInMenu: userPermission !== UserPermission.TaskApplies && userPermission !== UserPermission.All,
        },
      ],
    },
  ]

  const filteredNavItems = navItems.filter((item) => !item.disabled)

  return filteredNavItems
}

export const DEFAULT_PAGINATION_LIMIT = 4

// TODO: unify the options with viem chains
const openCampusTestOptions: SdkCtorOptions = {
  networkOptions: {
    rpcUrl: 'https://open-campus-codex-sepolia.drpc.org',
    chainId: 656476,
    contractAddress: '0xd8dcbd828a40f6590a5bee5095c38994dab3bdee',
  },
  chainName: 'EduChain-Testnet',
}

const eduChain = {
  id: 656476,
  name: 'EduChain',
  nativeCurrency: {
    name: 'EDU',
    symbol: 'EDU',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://open-campus-codex-sepolia.drpc.org'],
      webSocket: ['wss://open-campus-codex-sepolia.drpc.org'],
    },
  },
}

// TODO: should support multiple chains and configured by the user
export const currentChain = eduChain
// TODO: for openbuild payment - currently only polygon is supported
export const paymentChain = polygon
export const currentChainOptions = openCampusTestOptions
// TODO: move to other file
export const sdk = new SDK(currentChainOptions)
