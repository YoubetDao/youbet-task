import { UserPermission } from '@/types'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { store } from '..'

const tokenAtom = atomWithStorage<string | null>('APP_TOKEN', null)
const usernameAtom = atomWithStorage<string | null>('APP_USERNAME', null)
const userPermissionAtom = atomWithStorage<UserPermission | null>('APP_IS_ADMIN', null)
const adminProjects = atomWithStorage<string[] | null>('ADMIN_PROJECTS', null)
const adminNamespace = atomWithStorage<string[] | null>('ADMIN_NAMESPACE', null)

export const useAdminProjects = () => useAtom(adminProjects)
export const useAdminNamespace = () => useAtom(adminNamespace)

export const useToken = () => useAtom(tokenAtom)
export const useUsername = () => useAtom(usernameAtom)
export const useUserPermission = () => useAtom(userPermissionAtom)

export const updateToken = (token: string | null) => {
  store.set(tokenAtom, token)
}
export const getToken = () => store.get(tokenAtom)

export const updateUsername = (username: string | null) => {
  store.set(usernameAtom, username)
}
export const getUsername = () => store.get(usernameAtom)
