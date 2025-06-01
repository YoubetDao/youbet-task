import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const pendingGrantListAtom = atomWithStorage<string[]>('PENDING_GRANT_LIST', [])
const pendingClaimListAtom = atomWithStorage<string[]>('PENDING_CLAIM_LIST', [])

export const usePendingGrantList = () => useAtom(pendingGrantListAtom)
export const usePendingClaimTasks = () => useAtom(pendingClaimListAtom)
