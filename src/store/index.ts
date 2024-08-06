import { createStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const store = createStore()
export const tokenAtom = atomWithStorage<string | null>('APP_TOKEN', null)
export const usernameAtom = atomWithStorage<string | null>('APP_USERNAME', null)
