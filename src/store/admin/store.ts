import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const pendingGrantTasksAtom = atomWithStorage<string[]>('PENDING_GRANT_TASKS', [])
const pendingGrantPeriodsAtom = atomWithStorage<string[]>('PENDING_GRANT_PERIODS', [])

const pendingClaimTasksAtom = atomWithStorage<string[]>('PENDING_CLAIM_TASKS', [])
const pendingClaimPeriodsAtom = atomWithStorage<string[]>('PENDING_CLAIM_PERIODS', [])

export const usePendingGrantTasks = () => useAtom(pendingGrantTasksAtom)
export const usePendingGrantPeriods = () => useAtom(pendingGrantPeriodsAtom)
export const usePendingClaimTasks = () => useAtom(pendingClaimTasksAtom)
export const usePendingClaimPeriods = () => useAtom(pendingClaimPeriodsAtom)
