import { UserPermission } from '@/types'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { Chapter } from './type'
import { store } from '..'

const tokenAtom = atomWithStorage<string | null>('APP_TOKEN', null)
const usernameAtom = atomWithStorage<string | null>('APP_USERNAME', null)
const userPermissionAtom = atomWithStorage<UserPermission | null>('APP_IS_ADMIN', null)
const tutorialToCAtom = atomWithStorage<Chapter[] | null>('TutorialToC', null)

export const useToken = () => useAtom(tokenAtom)
export const useUsername = () => useAtom(usernameAtom)
export const useUserPermission = () => useAtom(userPermissionAtom)
export const useTutorialToC = () => useAtom(tutorialToCAtom)

export const updateToken = (token: string | null) => {
  store.set(tokenAtom, token)
}
export const getToken = () => store.get(tokenAtom)

export const updateUsername = (username: string | null) => {
  store.set(usernameAtom, username)
}
export const getUsername = () => store.get(usernameAtom)
