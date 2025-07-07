import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { WalletState } from './type'

export const walletAtom = atomWithStorage<WalletState>('WALLET_STATE', {
  linkedAddress: '',
})

export const walletAction = {
  changeLinkedAddress: atom(null, (get, set, address: string) => {
    set(walletAtom, (prev) => ({ ...prev, linkedAddress: address }))
  }),
}
