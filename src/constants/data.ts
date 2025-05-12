import { getAppearances } from '@/lib/appearances'
import { NavItem } from '@/types'
import { SdkCtorOptions, SDK } from 'youbet-sdk'
import {
  polygon,
  moonbaseAlpha,
  Chain,
  optimismSepolia,
  optimism,
  mantleSepoliaTestnet,
  baseSepolia,
} from 'viem/chains'
import { UserPermission } from '@/store'

export const getNavItems = (userPermission?: UserPermission): NavItem[] => {
  const appearances = getAppearances()

  const navItems: NavItem[] = [
    {
      title: 'Landing',
      href: '/',
      icon: 'home',
      component: 'landing',
      layout: 'landing',
      hideInMenu: true,
    },
    {
      title: 'Dashboard',
      href: '/dashboard',
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
          title: 'Project Detail',
          href: '/projects/:project',
          component: 'projectDetail',
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
      title: 'Tasks',
      href: '/tasks',
      icon: 'listChecks',
      component: 'tasks',
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

export const getSafeHrefByTitle = (title: string): string => {
  const item = getNavItems().find((item) => item.title === title)
  return item?.href as string
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

const eduChainOptions: SdkCtorOptions = {
  networkOptions: {
    rpcUrl: 'https://rpc.edu-chain.raas.gelato.cloud',
    chainId: 41923,
    contractAddress: '0xc81b9A16f093aA7A266ADa39D81EBdE1A5C8a2FA',
  },
  chainName: 'EduChain-Testnet',
}

const eduSepoliaChainOptions: SdkCtorOptions = {
  networkOptions: {
    rpcUrl: 'https://open-campus-codex-sepolia.drpc.org',
    chainId: 656476,
    contractAddress: '0xd8dcbd828a40f6590a5bee5095c38994dab3bdee',
  },
  chainName: 'EduChain-Testnet',
}

const opSepoliaOptions: SdkCtorOptions = {
  networkOptions: {
    rpcUrl: 'https://sepolia.optimism.io',
    chainId: 11155420,
    contractAddress: '0x411d99703453e5A49a2E57d5b7B97Dc1f8E3715b',
  },
  chainName: 'Optimism Sepolia',
}

const mantleSepoliaOptions: SdkCtorOptions = {
  networkOptions: {
    rpcUrl: 'https://rpc.sepolia.mantle.xyz',
    chainId: 5003,
    contractAddress: '0x0C60F52ADe19c488485f1CA41669e057Aba762c3',
  },
  chainName: 'Mantle Sepolia',
}

export const neoTestOptions: SdkCtorOptions = {
  networkOptions: {
    rpcUrl: 'https://neoxt4seed1.ngd.network',
    chainId: 12227332,
    contractAddress: '0x98D8D5e44eC86b1F20Bab29955498562B949EC3e',
  },
  chainName: 'NeoX T4',
}

export const monadDevOptions: SdkCtorOptions = {
  networkOptions: {
    rpcUrl: 'https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a',
    chainId: 20143,
    contractAddress: '0x009B2B2509d08f4Ed860b2f528ef2166bBE33D00',
  },
  chainName: 'Monad Devnet',
}

export const baseSepoliaOptions: SdkCtorOptions = {
  networkOptions: {
    rpcUrl: 'https://sepolia.base.org',
    chainId: 84532,
    contractAddress: '0x009B2B2509d08f4Ed860b2f528ef2166bBE33D00',
  },
  chainName: 'Base Sepolia',
}

export const juChainTestnetOptions: SdkCtorOptions = {
  networkOptions: {
    rpcUrl: 'https://testnet-rpc.juchain.org',
    chainId: 202599,
    contractAddress: '0x009B2B2509d08f4Ed860b2f528ef2166bBE33D00',
  },
  chainName: 'JuChain Testnet',
}

const eduChain = {
  id: 41923,
  name: 'Edu Chain',
  nativeCurrency: {
    name: 'EDU',
    symbol: 'EDU',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.edu-chain.raas.gelato.cloud'],
    },
  },
}

const eduSepoliaChain = {
  id: 656476,
  name: 'EduChain-Testnet',
  nativeCurrency: {
    name: 'EDU',
    symbol: 'EDU',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://open-campus-codex-sepolia.drpc.org'],
    },
  },
}

const neoTest = {
  id: 12227332,
  name: 'NeoX T4',
  nativeCurrency: {
    name: 'GAS',
    symbol: 'GAS',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://neoxt4seed1.ngd.network'],
    },
  },
}

const monadDevnet = {
  id: 20143,
  name: 'Monad Devnet',
  nativeCurrency: {
    name: 'DMON',
    symbol: 'DMON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-devnet.monadinfra.com/rpc/3fe540e310bbb6ef0b9f16cd23073b0a'],
    },
  },
}

const juChainTestnet = {
  id: 202599,
  name: 'JuChain Testnet',
  nativeCurrency: {
    name: 'JU',
    symbol: 'JU',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.juchain.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://testnet.juscan.io',
      apiUrl: 'https://testnet.juscan.io/api',
    },
  },
}

// define supported chains
const SUPPORTED_CHAINS: Record<string, Chain> = {
  educhain: eduChain,
  educhainSepolia: eduSepoliaChain,
  moonbase: moonbaseAlpha,
  polygon: polygon,
  opSepolia: optimismSepolia,
  opMainnet: optimism,
  mantleSepolia: mantleSepoliaTestnet,
  neoTest: neoTest,
  monadDevnet: monadDevnet,
  baseSepolia: baseSepolia,
  juChainTestnet: juChainTestnet,
}

// TODO: move this chain options to a separated chain config file
// define chain options
const CHAIN_OPTIONS: Record<string, SdkCtorOptions> = {
  educhain: eduChainOptions,
  educhainSepolia: eduSepoliaChainOptions,
  moonbase: moonbaseAlphaOptions,
  mantleSepolia: mantleSepoliaOptions,
  neoTest: neoTestOptions,
  monadDevnet: monadDevOptions,
  opSepolia: opSepoliaOptions,
  baseSepolia: baseSepoliaOptions,
  juChainTestnet: juChainTestnetOptions,
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
    console.warn(`Chain options for ${chainName} not found, falling back to eduChainOptions`)
    return eduChainOptions
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

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
