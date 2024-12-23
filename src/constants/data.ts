import { getAppearances } from '@/lib/appearances'
import { NavItem, UserPermission } from '@/types'
import { SdkCtorOptions, SDK } from 'youbet-sdk'
import { polygon, moonbaseAlpha, Chain, optimismSepolia, optimism, mantleSepoliaTestnet } from 'viem/chains'

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
      title: 'MyRewards',
      href: '/myrewards',
      icon: 'listChecks',
      component: 'myrewards',
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
          title: 'Period',
          href: '/admin/period',
          icon: 'period',
          component: 'periodAdmin',
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
        {
          title: 'Completed Task',
          href: '/admin/completed-task',
          icon: 'listChecks',
          component: 'completedTaskAdmin',
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
const moonbaseAlphaOptions: SdkCtorOptions = {
  networkOptions: {
    rpcUrl: moonbaseAlpha.rpcUrls.default.http[0],
    chainId: moonbaseAlpha.id,
    contractAddress: '0x977BCA065Cb342c568A33EA0A12e9cB27645BD1d',
  },
  chainName: 'Moonbase Alpha',
}

const openCampusTestOptions: SdkCtorOptions = {
  networkOptions: {
    rpcUrl: 'https://open-campus-codex-sepolia.drpc.org',
    chainId: 656476,
    contractAddress: '0xd8dcbd828a40f6590a5bee5095c38994dab3bdee',
  },
  chainName: 'EduChain-Testnet',
}

const mantleSepoliaOptions: SdkCtorOptions = {
  networkOptions: {
    rpcUrl: 'https://rpc.sepolia.mantle.xyz',
    chainId: 5003,
    contractAddress: '0x0C60F52ADe19c488485f1CA41669e057Aba762c3',
  },
  chainName: 'Mantle Sepolia',
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

// define supported chains
const SUPPORTED_CHAINS: Record<string, Chain> = {
  educhain: eduChain,
  moonbase: moonbaseAlpha,
  polygon: polygon,
  opSepolia: optimismSepolia,
  opMainnet: optimism,
  mantleSepolia: mantleSepoliaTestnet,
}

// TODO: move this chain options to a separated chain config file
// define chain options
const CHAIN_OPTIONS: Record<string, SdkCtorOptions> = {
  educhain: openCampusTestOptions,
  moonbase: moonbaseAlphaOptions,
  mantleSepolia: mantleSepoliaOptions,
}

const getCurrentChain = (): Chain => {
  const chainName = import.meta.env.VITE_CURRENT_CHAIN || 'educhain'
  const chain = SUPPORTED_CHAINS[chainName]
  if (!chain) {
    console.warn(`Chain ${chainName} not found, falling back to eduChain`)
    return eduChain
  }
  return chain
}

const getPaymentChain = (): Chain => {
  const chainName = import.meta.env.VITE_PAYMENT_CHAIN || 'opSepolia'
  const chain = SUPPORTED_CHAINS[chainName]
  if (!chain) {
    console.warn(`Payment chain ${chainName} not found, falling back to opSepolia`)
    return optimismSepolia
  }
  return chain
}

const getChainOptions = (): SdkCtorOptions => {
  const chainName = import.meta.env.VITE_CURRENT_CHAIN || 'educhain'
  const options = CHAIN_OPTIONS[chainName]
  if (!options) {
    console.warn(`Chain options for ${chainName} not found, falling back to openCampusTestOptions`)
    return openCampusTestOptions
  }
  return options
}

// TODO: should support multiple chains and configured by the user
export const currentChain = getCurrentChain()
// TODO: for openbuild payment - currently only polygon is supported
export const paymentChain = getPaymentChain()
export const currentChainOptions = getChainOptions()
// TODO: move to other file
export const sdk = new SDK(currentChainOptions)
