import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useUsername, walletAtom } from '@/store'
import { useAccount, useSwitchChain } from 'wagmi'
import { useEffect, useState } from 'react'
import { youbetApi } from '@/service'
import { currentChain, paymentChain, ZERO_ADDRESS } from '@/constants/data'
import { useAtom } from 'jotai'
import { useAsyncEffect } from 'ahooks'

interface Props {
  className?: string
}

export const CustomConnectButton = ({ className }: Props) => {
  const [github] = useUsername()
  const { address } = useAccount()
  const { switchChain } = useSwitchChain()
  const [isAdmin, setIsAdmin] = useState(false)
  const [walletState] = useAtom(walletAtom)

  useEffect(() => {
    const currentPath = window.location.pathname

    if (currentPath.includes('admin')) {
      setIsAdmin(true)
      switchChain({ chainId: paymentChain.id })
    } else if (currentPath.includes('myrewards')) {
      switchChain({ chainId: paymentChain.id })
      setIsAdmin(false)
    } else {
      switchChain({ chainId: currentChain.id })
      setIsAdmin(false)
    }
  }, [switchChain])

  useAsyncEffect(async () => {
    const linkedAddress = walletState.linkedAddress
    if (!github || isAdmin || linkedAddress === '') return
    if (linkedAddress == ZERO_ADDRESS) {
      if (!address) return
      await youbetApi.youbetControllerLinkWallet({ address })
    }
  }, [address, github, walletState.linkedAddress])

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
            // className={className}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                )
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>{chain.name}</div>

                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
