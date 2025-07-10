import { useAtom } from 'jotai'
import { useAsyncEffect } from 'ahooks'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { useUsername, walletAtom, walletAction } from '@/store'
import { youbetApi } from '@/service'
import { ZERO_ADDRESS } from '@/constants/data'

interface UseLinkWalletOptions {
  // 是否启用自动链接钱包
  enabled?: boolean
  // 额外的条件检查
  additionalConditions?: boolean
}

export const useLinkWallet = (options: UseLinkWalletOptions = {}) => {
  const { enabled = true, additionalConditions = true } = options

  const [walletState] = useAtom(walletAtom)
  const [, setWalletAddress] = useAtom(walletAction.changeLinkedAddress)
  const [username] = useUsername()
  const { address } = useAccount()

  // 使用本地状态管理 isLinkingWallet
  const [isLinkingWallet, setIsLinkingWallet] = useState(false)

  const shouldLinkWallet = () => {
    const { linkedAddress } = walletState

    // 基本条件检查
    if (!enabled || !username || !address || isLinkingWallet || !additionalConditions) {
      return false
    }

    // 检查是否需要链接钱包
    return linkedAddress === '' || linkedAddress === ZERO_ADDRESS
  }

  const linkWallet = async () => {
    if (!shouldLinkWallet() || !address) return

    try {
      setIsLinkingWallet(true)
      await youbetApi.youbetControllerLinkWallet({ address })
      setWalletAddress(address)
    } catch (error) {
      console.error('Link wallet failed:', error)
    } finally {
      setIsLinkingWallet(false)
    }
  }

  useAsyncEffect(async () => {
    if (shouldLinkWallet()) {
      await linkWallet()
    }
  }, [address, username, walletState.linkedAddress, enabled, additionalConditions])

  return {
    isLinkingWallet,
    linkedAddress: walletState.linkedAddress,
    linkWallet: linkWallet,
  }
}
