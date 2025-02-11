import { atom } from 'jotai'
import { WalletState } from './type'

export const walletAtom = atom<WalletState>({
  linkedAddress: '',
})

export const walletAction = {
  changeLinkedAddress: atom(null, (get, set, address: string) => {
    set(walletAtom, (prev) => ({ ...prev, linkedAddress: address }))
  }),
}
