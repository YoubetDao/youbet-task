import { bsc, bscTestnet, optimism, optimismSepolia } from 'viem/chains'
import { Chain } from 'viem'

export const SUPPORTED_CHAINS: readonly [Chain, ...Chain[]] = import.meta.env.DEV
  ? [optimismSepolia, bscTestnet]
  : [optimism, bsc]

export const DEFAULT_CHAIN = import.meta.env.DEV ? optimismSepolia : optimism

export const CONTRACT_ADDRESSES = {
  op: import.meta.env.VITE_OP_CONTRACT_ADDRESS,
  bsc: import.meta.env.VITE_BSC_CONTRACT_ADDRESS,
}

export const RPC_URL = {
  op: import.meta.env.VITE_OP_RPC_URL,
  bsc: import.meta.env.VITE_BSC_RPC_URL,
}
