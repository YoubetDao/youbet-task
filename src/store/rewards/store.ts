import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

export const rewardAtomFamily = atomFamily((pageId: string) => atom<string[]>(['0', '1']))
