import { youbetApi } from '@/service'
import { useUsername, walletAction, walletAtom } from '@/store'
import { useAsyncEffect } from 'ahooks'
import { useAtom, useSetAtom } from 'jotai'

export const useInitState = () => {
  const [walletState] = useAtom(walletAtom)
  const setWalletAddress = useSetAtom(walletAction.changeLinkedAddress)
  const [github] = useUsername()

  useAsyncEffect(async () => {
    if (!github || walletState.linkedAddress) return

    const linkedAddress = await youbetApi.youbetControllerGetLinkedWallet(github).then((res) => res.data)

    if (linkedAddress) {
      setWalletAddress(linkedAddress)
    }
  }, [walletState.linkedAddress, github])
}
