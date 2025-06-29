import { youbetApi } from '@/service'
import { useUsername, walletAction, walletAtom } from '@/store'
import { useAsyncEffect } from 'ahooks'
import { useAtom } from 'jotai'

export const useInitState = () => {
  const [walletState] = useAtom(walletAtom)
  const [, setWalletAddress] = useAtom(walletAction.changeLinkedAddress)
  const [github] = useUsername()

  useAsyncEffect(async () => {
    if (walletState.linkedAddress === '' && github) {
      const linkedAddress = await youbetApi.youbetControllerGetLinkedWallet(github).then((res) => res.data)
      setWalletAddress(linkedAddress)
    }
  }, [walletState.linkedAddress, github])
}
