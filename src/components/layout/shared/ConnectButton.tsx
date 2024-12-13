import { ConnectButton } from '@rainbow-me/rainbowkit'
import { usernameAtom } from '@/store'
import { useAtom } from 'jotai'
import { useAccount, useSwitchChain } from 'wagmi'
import { useEffect, useState } from 'react'
import { getLinkedWallet, linkWallet } from '@/service'
import { currentChain, paymentChain } from '@/constants/data'

export const CustomConnectButton = () => {
  const [github] = useAtom(usernameAtom)
  const { address } = useAccount()
  const { switchChain } = useSwitchChain()
  const [isAdmin, setIsAdmin] = useState(false)

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

  useEffect(() => {
    const checkAndLinkWallet = async () => {
      if (!github) return
      const linkedAddress = await getLinkedWallet(github)
      if (linkedAddress == '0x0000000000000000000000000000000000000000') {
        if (!address) return
        await linkWallet({
          github,
          address,
        })
      }
    }
    checkAndLinkWallet()
  }, [address, github])

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
